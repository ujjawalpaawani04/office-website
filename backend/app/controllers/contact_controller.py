"""Orchestrates the Contact Us submission independent of Flask's request/
response objects (beyond the couple of fields IP/user-agent need) so it can
be tested or reused without spinning up an HTTP request."""
from app.services.contact_service import create_enquiry
from app.validators.contact_validator import validate_contact_payload


def handle_contact_submission(data, request):
    """Returns (body: dict, status_code: int) - the route just jsonify()s this."""
    cleaned, errors = validate_contact_payload(data)
    if errors:
        return {"error": "Validation failed", "fields": errors}, 400

    create_enquiry(cleaned, request)
    return {"message": "Enquiry submitted successfully."}, 201
