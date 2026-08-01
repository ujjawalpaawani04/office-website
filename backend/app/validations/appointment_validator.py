"""Server-side validation for POST /api/appointments/booked - the payload
the frontend sends the instant Calendly's embed fires `calendly.event_scheduled`
(see website/components/CalendlyEmbed). The client-captured name/email/phone
here are unverified against Calendly until the webhook path is active (see
appointment_service.py docstring) - validated the same as every other public
form (Document parity with contact_validator.py), but that's a UX/spam
safeguard, not an authenticity guarantee.
"""
from datetime import datetime
from urllib.parse import urlparse

from app.utils.sanitize import clean_optional, clean_str
from app.validations.common import validate_email_address, validate_name, validate_phone

# Sanity check only - confirms the frontend actually sent a Calendly resource
# URI and not something malformed/unrelated. Not an authenticity guarantee;
# see appointment_service.py docstring for what does (eventually) verify it.
_CALENDLY_HOST_SUFFIX = "calendly.com"


def _parse_iso_datetime(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None


def _looks_like_calendly_uri(value):
    if not value:
        return False
    parsed = urlparse(value)
    return parsed.scheme in ("http", "https") and parsed.netloc.endswith(_CALENDLY_HOST_SUFFIX)


def validate_booking_payload(data):
    """Returns (cleaned_data, errors). errors is an empty dict when valid."""
    name = clean_str(data.get("name"), max_length=120)
    email = clean_str(data.get("email"), max_length=190)
    phone = clean_str(data.get("phone"), max_length=10)
    notes = clean_optional(data.get("notes"), max_length=2000)

    event_name = clean_optional(data.get("eventName"), max_length=200)
    timezone = clean_optional(data.get("timezone"), max_length=60)
    meeting_link = clean_optional(data.get("meetingLink"), max_length=500)
    calendly_event_uri = clean_optional(data.get("calendlyEventUri"), max_length=500)
    calendly_invitee_uri = clean_optional(data.get("calendlyInviteeUri"), max_length=500)

    starts_at = _parse_iso_datetime(data.get("startsAt"))
    ends_at = _parse_iso_datetime(data.get("endsAt"))

    errors = {}

    name_error = validate_name(name)
    if name_error:
        errors["name"] = name_error

    email_error = validate_email_address(email)
    if email_error:
        errors["email"] = email_error

    phone_error = validate_phone(phone)
    if phone_error:
        errors["phone"] = phone_error

    if not calendly_event_uri:
        errors["calendlyEventUri"] = "Missing Calendly event reference."
    elif not _looks_like_calendly_uri(calendly_event_uri):
        errors["calendlyEventUri"] = "Calendly event reference looks invalid."
    if not calendly_invitee_uri:
        errors["calendlyInviteeUri"] = "Missing Calendly invitee reference."
    elif not _looks_like_calendly_uri(calendly_invitee_uri):
        errors["calendlyInviteeUri"] = "Calendly invitee reference looks invalid."
    # startsAt is intentionally NOT required: Calendly's postMessage payload
    # on `calendly.event_scheduled` only guarantees event/invitee URIs, not
    # the picked date/time (see appointment_service.py). When present we
    # store it; when absent the row is created with starts_at=None and is
    # backfilled later (webhook, or an admin "sync from Calendly" action).
    if data.get("startsAt") and not starts_at:
        errors["startsAt"] = "Invalid appointment start time."
    if data.get("endsAt") and not ends_at:
        errors["endsAt"] = "Invalid appointment end time."
    if starts_at and ends_at and ends_at <= starts_at:
        errors["endsAt"] = "Appointment end time must be after the start time."

    cleaned = {
        "name": name,
        "email": email,
        "phone": phone,
        "notes": notes,
        "event_name": event_name,
        "timezone": timezone,
        "meeting_link": meeting_link,
        "calendly_event_uri": calendly_event_uri,
        "calendly_invitee_uri": calendly_invitee_uri,
        "starts_at": starts_at,
        "ends_at": ends_at,
    }
    return cleaned, errors
