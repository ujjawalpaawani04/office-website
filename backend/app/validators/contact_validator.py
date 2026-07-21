"""Server-side validation for POST /api/enquiries (the Contact Us form).

Expects the JSON shape already sent by frontend/src/api/enquiries.js:
{name, email, phone, service, message}.
"""
from app.utils.sanitize import clean_optional, clean_str
from app.validators.common import validate_email_address, validate_name, validate_phone

MESSAGE_MIN_LENGTH = 20


def validate_contact_payload(data):
    """Returns (cleaned_data, errors). errors is an empty dict when valid."""
    name = clean_str(data.get("name"), max_length=120)
    email = clean_str(data.get("email"), max_length=190)
    phone = clean_str(data.get("phone"), max_length=10)
    service = clean_optional(data.get("service"), max_length=200)
    message = clean_str(data.get("message"))

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

    if not message:
        errors["message"] = "Message is required."
    elif len(message) < MESSAGE_MIN_LENGTH:
        errors["message"] = f"Message must be at least {MESSAGE_MIN_LENGTH} characters."

    cleaned = {"name": name, "email": email, "phone": phone, "service": service, "message": message}
    return cleaned, errors
