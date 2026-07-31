"""Business logic for the Appointment Booking module.

Booking capture (this file's current scope) works without any Calendly
webhook or API access - see CalendlyEmbed/Appointment.jsx on the frontend.
When the embed fires `calendly.event_scheduled`, the frontend has already
had the visitor fill in their details on our own page (used to prefill the
embed) and sends both that data and Calendly's event/invitee URIs here.

Known limitation, by design: until a webhook subscription exists (paid
Calendly plan), the client_name/client_email/client_phone stored here are
client-submitted and unverified against Calendly's own record of the
booking. `calendly_event_id` is still a trustworthy reconciliation key (it
comes from the URI Calendly's own script embeds in the postMessage event),
so once webhooks are active, upsert_from_webhook() can correct/verify these
fields on the same row instead of creating a duplicate.
"""
from app.extensions import db
from app.models import Appointment
from app.utils.audit import record_audit_log


def _extract_id_from_uri(uri):
    """Calendly resource URIs end in the resource's UUID, e.g.
    https://api.calendly.com/scheduled_events/AAAAAAAA-BBBB-.../ -> the UUID."""
    if not uri:
        return None
    return uri.rstrip("/").rsplit("/", 1)[-1] or None


def create_from_embed(cleaned_data, request):
    """Returns (appointment, created: bool). Idempotent on calendly_event_id -
    a duplicate postMessage fire (double-invoked effects, a resubmitted
    request) returns the existing row rather than creating a second one,
    satisfying the "prevent duplicate appointments" requirement without
    needing the webhook path.
    """
    calendly_event_id = _extract_id_from_uri(cleaned_data["calendly_event_uri"])
    calendly_invitee_id = _extract_id_from_uri(cleaned_data["calendly_invitee_uri"])

    existing = None
    if calendly_event_id:
        existing = Appointment.query.filter_by(calendly_event_id=calendly_event_id).first()
    if existing:
        return existing, False

    starts_at = cleaned_data["starts_at"]
    appointment = Appointment(
        calendly_event_id=calendly_event_id,
        calendly_event_uri=cleaned_data["calendly_event_uri"],
        calendly_invitee_uri=cleaned_data["calendly_invitee_uri"],
        calendly_invitee_id=calendly_invitee_id,
        client_name=cleaned_data["name"],
        client_email=cleaned_data["email"],
        client_phone=cleaned_data["phone"],
        event_name=cleaned_data["event_name"],
        starts_at=starts_at,
        ends_at=cleaned_data["ends_at"],
        meeting_date=starts_at.date() if starts_at else None,
        meeting_time=starts_at.time() if starts_at else None,
        timezone=cleaned_data["timezone"],
        meeting_link=cleaned_data["meeting_link"],
        notes=cleaned_data["notes"],
        # `calendly.event_scheduled` only fires once Calendly has already
        # confirmed the booking on its end (unless the event type requires
        # host approval, not distinguishable from this payload alone) - so
        # "confirmed" reflects reality better than "pending" here. Admin
        # actions (cancel/reschedule/complete) move it on from there.
        status="confirmed",
        source="embed",
    )
    db.session.add(appointment)
    db.session.flush()  # assigns appointment.id for the audit log row below

    record_audit_log(
        admin_id=None,
        action="created",
        entity_type="appointment",
        entity_id=appointment.id,
        details={"source": "embed", "clientEmail": appointment.client_email},
        request=request,
    )
    db.session.commit()
    return appointment, True
