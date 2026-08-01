"""Business logic for the Book Appointment feature.

Flow (see also calendly_service.py's module docstring for why this is a
two-phase "pending -> confirmed" design rather than a single API call):

1. Client fills out the entire form on our own site and submits.
2. This module re-checks the exact slot is still free (Calendly is the
   only source of truth for availability - never trust what the frontend
   showed the user a minute ago), then writes a `pending_confirmation`
   Appointment row and emails the office a lead notification.
3. The frontend receives Calendly's public `scheduling_url` (not a secret -
   it's the same URL anyone can already find on the firm's Calendly page)
   and opens it, pre-filled with the client's name/email, as the actual
   booking step - see CalendlyHandoff.jsx.
4. Calendly itself creates the event and sends its own confirmation emails.
5. The webhook receiver (webhook_routes.py) flips the row to `confirmed`
   and fills in calendly_event_uri/meeting_link/cancel_url/reschedule_url
   once Calendly notifies us the booking really happened.
"""
import logging
import secrets

from flask import current_app

from app.extensions import db
from app.models import Appointment
from app.services import calendly_service
from app.services.calendly_service import CalendlyApiError
from app.services.email_service import send_email
from app.services.storage_service import save_appointment_document

logger = logging.getLogger(__name__)


class SlotUnavailableError(Exception):
    """The requested slot is no longer free - raised only after re-checking
    with Calendly directly, never trusting an earlier frontend read."""


class AppointmentServiceUnavailableError(Exception):
    """Calendly itself could not be reached / is not configured for this
    service - there is no fallback booking path, so the request fails
    cleanly rather than creating a row nothing can ever confirm."""


def _generate_appointment_id():
    for _ in range(5):
        candidate = f"APT-{secrets.token_hex(4).upper()}"
        if not Appointment.query.filter_by(appointment_id=candidate).first():
            return candidate
    # Astronomically unlikely with a 4-byte suffix, but never loop forever.
    raise AppointmentServiceUnavailableError("Could not generate a unique appointment id.")


def _event_type_uri_for(service):
    return current_app.config["CALENDLY_EVENT_TYPE_URIS"].get(service)


def _build_prefilled_scheduling_url(scheduling_url, name, email, appointment_id):
    """Calendly officially supports prefilling `name`/`email` via query
    params on its own hosted booking page - this is not a workaround, it's
    documented behaviour of the page the client is about to land on.

    `utm_content` is also a standard, Calendly-preserved UTM param - it
    comes back verbatim in the invitee.created webhook payload's
    `tracking.utm_content` field, which is what lets webhook_routes.py
    match an incoming Calendly event back to *this* pending Appointment row
    without guessing from name/email/time alone.
    """
    from urllib.parse import urlencode

    separator = "&" if "?" in scheduling_url else "?"
    return f"{scheduling_url}{separator}{urlencode({'name': name, 'email': email, 'utm_content': appointment_id})}"


def get_service_availability(service, mode, day):
    event_type_uri = _event_type_uri_for(service)
    if not event_type_uri:
        raise AppointmentServiceUnavailableError(
            "Online scheduling for this consultation type isn't set up yet."
        )
    try:
        slots = calendly_service.get_available_times(event_type_uri, day)
    except CalendlyApiError as exc:
        raise AppointmentServiceUnavailableError(str(exc)) from exc
    return slots


def get_service_availability_month(service, mode, start_day, end_day):
    event_type_uri = _event_type_uri_for(service)
    if not event_type_uri:
        raise AppointmentServiceUnavailableError(
            "Online scheduling for this consultation type isn't set up yet."
        )
    try:
        return calendly_service.get_available_days(event_type_uri, start_day, end_day)
    except CalendlyApiError as exc:
        raise AppointmentServiceUnavailableError(str(exc)) from exc


def create_appointment(cleaned, mime_type, request):
    service = cleaned["service"]
    event_type_uri = _event_type_uri_for(service)
    if not event_type_uri:
        raise AppointmentServiceUnavailableError(
            "Online scheduling for this consultation type isn't set up yet."
        )

    iso_start_time = None
    try:
        # The exact slot the client picked must still be free right now -
        # what the frontend fetched moments ago is not trusted (prevents
        # double-booking / stale-availability races, per the brief).
        day = cleaned["appointment_date"]
        slots = calendly_service.get_available_times(event_type_uri, day)
        requested_prefix = f"{day.isoformat()}T{cleaned['appointment_time'].strftime('%H:%M')}"
        matching = next((s for s in slots if s["startTime"].startswith(requested_prefix)), None)
        if matching is None:
            raise SlotUnavailableError("This time slot is no longer available. Please select another available time.")
        iso_start_time = matching["startTime"]

        event_type = calendly_service.get_event_type(event_type_uri)
    except CalendlyApiError as exc:
        raise AppointmentServiceUnavailableError(
            "We couldn't reach the scheduling system. Please try again in a moment."
        ) from exc

    document = cleaned.get("document")
    stored_document = save_appointment_document(document) if document is not None else None

    appointment = Appointment(
        appointment_id=_generate_appointment_id(),
        client_name=cleaned["name"],
        mobile_number=cleaned["phone"],
        email=cleaned["email"],
        business_name=cleaned["business_name"],
        is_existing_client=cleaned["is_existing_client"],
        alternate_contact=cleaned["alternate_contact"],
        service=service,
        meeting_mode=cleaned["meeting_mode"],
        appointment_date=cleaned["appointment_date"],
        appointment_time=cleaned["appointment_time"],
        duration_minutes=event_type.get("duration"),
        requirement_description=cleaned["requirement_description"],
        consent_given=cleaned["consent_given"],
        document_filename=stored_document["filename"] if stored_document else None,
        document_path=stored_document["path"] if stored_document else None,
        document_mime_type=mime_type,
        document_size_bytes=stored_document["size_bytes"] if stored_document else None,
        status="pending_confirmation",
        ip_address=request.remote_addr,
    )
    db.session.add(appointment)
    db.session.commit()

    scheduling_url = _build_prefilled_scheduling_url(
        event_type.get("scheduling_url"), cleaned["name"], cleaned["email"], appointment.appointment_id
    )

    send_email(
        subject=f"New Appointment Request - {appointment.client_name} ({appointment.appointment_id})",
        template_name="emails/appointment_lead_notification.html",
        context={
            "appointment_id": appointment.appointment_id,
            "name": appointment.client_name,
            "email": appointment.email,
            "phone": appointment.mobile_number,
            "business_name": appointment.business_name,
            "service": service,
            "meeting_mode": appointment.meeting_mode,
            "appointment_date": appointment.appointment_date,
            "appointment_time": appointment.appointment_time,
            "requirement_description": appointment.requirement_description,
            "submitted_at": appointment.created_at,
        },
    )

    return appointment, scheduling_url
