"""Calendly webhook receiver - keeps local `appointments` rows in sync with
what actually happened on Calendly (the only place a booking is really
created/cancelled/rescheduled). See calendly_service.py's module docstring
for the overall two-phase design.

IMPORTANT: the exact shape of Calendly's webhook payload (nesting of
`payload.scheduled_event`, `payload.tracking`, etc.) is implemented from
Calendly's documented schema and has not been exercised against a live
delivery. Log the raw payload in staging against a real Calendly webhook
subscription and adjust the field paths below if anything doesn't line up
before relying on this in production.

Setup (one-time, done by whoever administers the Calendly account - not
exposed as an app endpoint since it only needs to run once):
    1. POST https://api.calendly.com/webhook_subscriptions with
       {"url": "<FRONTEND-facing HTTPS URL>/api/appointments/webhooks/calendly",
        "events": ["invitee.created", "invitee.canceled"],
        "organization": CALENDLY_ORGANIZATION_URI, "scope": "organization"}
       using the same CALENDLY_ACCESS_TOKEN as a Bearer token.
    2. Calendly returns a `signing_key` in that response - put it in
       CALENDLY_WEBHOOK_SIGNING_KEY. It is never re-shown, so save it then.
"""
import logging

from flask import current_app, jsonify, request

from app.blueprints.appointments import appointments_bp
from app.extensions import db
from app.models import Appointment, WebhookEvent
from app.services.calendly_service import verify_webhook_signature

logger = logging.getLogger(__name__)


def _find_appointment(payload):
    """utm_content carries our own appointment_id through Calendly and back
    (see appointment_service._build_prefilled_scheduling_url) - that's the
    reliable match. Falls back to matching on the invitee's email against a
    still-pending request as a last resort, since a client could in theory
    reach Calendly's page without the tracking param surviving (e.g. a
    stripped query string)."""
    utm_content = (payload.get("tracking") or {}).get("utm_content")
    if utm_content:
        appointment = Appointment.query.filter_by(appointment_id=utm_content).first()
        if appointment:
            return appointment

    email = payload.get("email")
    if email:
        return (
            Appointment.query.filter_by(email=email, status="pending_confirmation")
            .order_by(Appointment.created_at.desc())
            .first()
        )
    return None


def _handle_invitee_created(payload):
    appointment = _find_appointment(payload)
    if appointment is None:
        logger.warning("invitee.created webhook did not match any pending appointment: %s", payload.get("uri"))
        return

    scheduled_event = payload.get("scheduled_event") or {}
    location = scheduled_event.get("location") or {}

    appointment.calendly_event_uri = scheduled_event.get("uri") or payload.get("event")
    appointment.calendly_invitee_uri = payload.get("uri")
    appointment.meeting_link = location.get("join_url") or location.get("location")
    appointment.cancel_url = payload.get("cancel_url")
    appointment.reschedule_url = payload.get("reschedule_url")
    appointment.status = "confirmed"
    db.session.commit()


def _handle_invitee_canceled(payload):
    invitee_uri = payload.get("uri")
    appointment = Appointment.query.filter_by(calendly_invitee_uri=invitee_uri).first()
    if appointment is None:
        appointment = _find_appointment(payload)
    if appointment is None:
        logger.warning("invitee.canceled webhook did not match any appointment: %s", invitee_uri)
        return

    appointment.status = "cancelled"
    db.session.commit()


HANDLERS = {
    "invitee.created": _handle_invitee_created,
    "invitee.canceled": _handle_invitee_canceled,
}


@appointments_bp.post("/webhooks/calendly")
def calendly_webhook():
    raw_body = request.get_data()
    signature_header = request.headers.get("Calendly-Webhook-Signature")
    signing_key = current_app.config.get("CALENDLY_WEBHOOK_SIGNING_KEY")

    if not verify_webhook_signature(raw_body, signature_header, signing_key):
        logger.warning("Rejected Calendly webhook with invalid/missing signature.")
        return jsonify({"error": "Invalid signature."}), 401

    data = request.get_json(silent=True) or {}
    event_type = data.get("event")
    payload = data.get("payload") or {}
    external_id = payload.get("uri") or payload.get("event")

    if not external_id:
        return jsonify({"error": "Malformed webhook payload."}), 400

    # Idempotency: a webhook Calendly retries (or that's replayed) is a
    # 200 no-op the second time, keyed on the invitee/event URI Calendly
    # itself assigns - never processed twice.
    if WebhookEvent.query.filter_by(external_id=external_id).first():
        return jsonify({"status": "already_processed"}), 200

    db.session.add(
        WebhookEvent(provider="calendly", external_id=external_id, event_type=event_type or "unknown", payload=data)
    )

    handler = HANDLERS.get(event_type)
    if handler:
        handler(payload)
    else:
        db.session.commit()
        logger.info("Ignored unhandled Calendly webhook event type: %s", event_type)

    return jsonify({"status": "ok"}), 200
