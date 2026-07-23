"""Server-side validation for POST /api/careers/applications.

Expects multipart/form-data matching frontend/src/api/careers.js:
name, email, phone, position, experience (optional), message (optional
cover letter), resume (file). `experience`/`message` have no corresponding
input in ApplyNow.jsx today, so they will simply arrive empty until/unless
that form is extended - they're validated as optional either way.
"""
from app.utils.file_utils import has_allowed_extension, is_allowed_mime_type, sniff_mime_type
from app.utils.sanitize import clean_optional, clean_str
from app.validators.common import validate_email_address, validate_name, validate_phone

MAX_RESUME_SIZE_LABEL = "5MB"  # kept in sync with UPLOAD_MAX_MB via career_controller


def validate_career_payload(form, files):
    name = clean_str(form.get("name"), max_length=120)
    email = clean_str(form.get("email"), max_length=190)
    phone = clean_str(form.get("phone"), max_length=10)
    position = clean_optional(form.get("position"), max_length=160)
    experience = clean_optional(form.get("experience"), max_length=60)
    message = clean_optional(form.get("message"))

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

    resume = files.get("resume")
    if resume is None or resume.filename == "":
        errors["resume"] = "Please upload your resume."
    elif not has_allowed_extension(resume.filename):
        errors["resume"] = "Resume must be a PDF or Word document (.pdf, .doc, .docx)."

    cleaned = {
        "name": name,
        "email": email,
        "phone": phone,
        "position": position,
        "experience": experience,
        "message": message,
        "resume": resume,
    }
    return cleaned, errors


def validate_resume_content(resume):
    """Second pass, run only once the basic form fields already passed:
    sniffs the actual file bytes rather than trusting the extension, since
    a hostile client can rename any file to end in ".pdf"."""
    mime_type = sniff_mime_type(resume)
    if not is_allowed_mime_type(mime_type):
        return None, "Resume file content did not match an allowed document type."
    return mime_type, None
