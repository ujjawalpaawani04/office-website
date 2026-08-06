"""Orchestrates booking capture independent of Flask's request/response
objects (beyond the couple of fields IP/user-agent need), same shape as
contact/controller.py."""
from app.services.appointment_service import create_from_embed
from app.utils.dates import isoformat_utc
from app.validations.appointment_validator import validate_booking_payload


def _serialize(appointment):
    return {
        "id": appointment.id,
        "status": appointment.status,
        "eventName": appointment.event_name,
        "startsAt": isoformat_utc(appointment.starts_at),
        "timezone": appointment.timezone,
    }


def handle_booking_capture(data, request):
    """Returns (body: dict, status_code: int) - the route just jsonify()s this."""
    cleaned, errors = validate_booking_payload(data)
    if errors:
        return {"error": "Validation failed", "fields": errors}, 422

    appointment, created = create_from_embed(cleaned, request)
    status_code = 201 if created else 200
    return {"message": "Appointment recorded successfully.", "appointment": _serialize(appointment)}, status_code
