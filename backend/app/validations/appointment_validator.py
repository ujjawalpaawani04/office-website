"""Server-side validation for POST /api/appointments.

Expects multipart/form-data matching frontend/src/website/api/appointments.js:
name, email, phone, businessName (optional), isExistingClient (optional),
alternateContact (optional), service, meetingMode, appointmentDate,
appointmentTime, requirementDescription, consentGiven, document (optional
file). The frontend enforces the same rules first for instant feedback, but
every rule here runs again unconditionally - see validations/common.py's
docstring for why.
"""
from datetime import date, datetime

from flask import current_app

from app.utils.file_utils import has_allowed_document_extension, is_allowed_document_mime_type, sniff_mime_type
from app.utils.sanitize import clean_optional, clean_str
from app.validations.common import validate_email_address, validate_name, validate_phone

MEETING_MODES = {"office", "phone", "video"}


def _parse_bool(value):
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


def _validate_date(value):
    if not value:
        return None, "Please select an appointment date."
    try:
        parsed = datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return None, "Appointment date is invalid."
    if parsed < date.today():
        return None, "Appointment date cannot be in the past."
    return parsed, None


def _validate_time(value):
    if not value:
        return None, "Please select an appointment time."
    try:
        parsed = datetime.strptime(value.strip(), "%H:%M").time()
    except ValueError:
        return None, "Appointment time is invalid."
    return parsed, None


def validate_appointment_payload(form, files):
    name = clean_str(form.get("name"), max_length=120)
    email = clean_str(form.get("email"), max_length=190)
    phone = clean_str(form.get("phone"), max_length=10)
    business_name = clean_optional(form.get("businessName"), max_length=160)
    is_existing_client = _parse_bool(form.get("isExistingClient"))
    alternate_contact = clean_optional(form.get("alternateContact"), max_length=10)
    service = clean_str(form.get("service"), max_length=40)
    meeting_mode = clean_str(form.get("meetingMode"), max_length=10)
    requirement_description = clean_str(form.get("requirementDescription"))
    consent_given = _parse_bool(form.get("consentGiven"))

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

    if alternate_contact:
        alt_error = validate_phone(alternate_contact)
        if alt_error:
            errors["alternateContact"] = alt_error

    valid_services = set(current_app.config["CALENDLY_EVENT_TYPE_URIS"].keys())
    if service not in valid_services:
        errors["service"] = "Please select a valid consultation service."

    if meeting_mode not in MEETING_MODES:
        errors["meetingMode"] = "Please select how you'd like to meet."

    appointment_date, date_error = _validate_date(form.get("appointmentDate"))
    if date_error:
        errors["appointmentDate"] = date_error

    appointment_time, time_error = _validate_time(form.get("appointmentTime"))
    if time_error:
        errors["appointmentTime"] = time_error

    if not requirement_description or len(requirement_description) < 10:
        errors["requirementDescription"] = "Please briefly describe your requirement (at least 10 characters)."

    if not consent_given:
        errors["consentGiven"] = "Please confirm you agree to be contacted about this request."

    document = files.get("document") if files else None
    if document is not None and document.filename:
        if not has_allowed_document_extension(document.filename):
            errors["document"] = "Document must be a PDF, Word file, or image (.pdf, .doc, .docx, .jpg, .png)."
    else:
        document = None

    cleaned = {
        "name": name,
        "email": email,
        "phone": phone,
        "business_name": business_name,
        "is_existing_client": is_existing_client,
        "alternate_contact": alternate_contact,
        "service": service,
        "meeting_mode": meeting_mode,
        "appointment_date": appointment_date,
        "appointment_time": appointment_time,
        "requirement_description": requirement_description,
        "consent_given": consent_given,
        "document": document,
    }
    return cleaned, errors


def validate_document_content(document):
    """Second pass, mirrors career_validator.validate_resume_content - only
    run once the basic field/extension checks already passed."""
    if document is None:
        return None, None
    mime_type = sniff_mime_type(document)
    if not is_allowed_document_mime_type(mime_type):
        return None, "Document content did not match an allowed file type."
    return mime_type, None
