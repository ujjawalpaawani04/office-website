"""Orchestrates POST /api/appointments. MIME sniffing happens here (after
basic field/extension validation passes), same split as career's controller."""
from app.services.appointment_service import (
    AppointmentServiceUnavailableError,
    SlotUnavailableError,
    create_appointment,
)
from app.validations.appointment_validator import validate_appointment_payload, validate_document_content


def handle_appointment_submission(form, files, request):
    """Returns (body: dict, status_code: int) - the route just jsonify()s this."""
    cleaned, errors = validate_appointment_payload(form, files)
    if errors:
        return {"error": "Validation failed", "fields": errors}, 422

    mime_type, mime_error = validate_document_content(cleaned["document"])
    if mime_error:
        return {"error": mime_error, "fields": {"document": mime_error}}, 422

    try:
        appointment, scheduling_url = create_appointment(cleaned, mime_type, request)
    except SlotUnavailableError as exc:
        return {"error": str(exc), "code": "slot_unavailable"}, 409
    except AppointmentServiceUnavailableError as exc:
        return {"error": str(exc), "code": "scheduling_unavailable"}, 503

    return {
        "appointmentId": appointment.appointment_id,
        "status": appointment.status,
        "schedulingUrl": scheduling_url,
    }, 201
