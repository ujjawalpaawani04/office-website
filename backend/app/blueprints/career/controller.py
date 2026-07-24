"""Orchestrates the Career application submission. MIME sniffing is run
here (after the basic field/extension validation already passed) since it
needs to read the actual uploaded file, which only the controller has."""
from app.services.career_service import create_application
from app.validations.career_validator import validate_career_payload, validate_resume_content


def handle_career_submission(form, files, request):
    """Returns (body: dict, status_code: int) - the route just jsonify()s this."""
    cleaned, errors = validate_career_payload(form, files)
    if errors:
        return {"error": "Validation failed", "fields": errors}, 400

    mime_type, mime_error = validate_resume_content(cleaned["resume"])
    if mime_error:
        return {"error": mime_error}, 400

    create_application(cleaned, mime_type, request)
    return {"message": "Application submitted successfully."}, 201
