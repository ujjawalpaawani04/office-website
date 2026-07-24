"""Server-side validation for POST /api/auth/login.

Mirrors the same "never trust the client" rule the contact/career
validators already follow - a login form's own client-side checks are a UX
courtesy only.
"""
from app.utils.sanitize import clean_str
from app.validations.common import validate_email_address


def validate_login_payload(data):
    email = clean_str(data.get("email"), max_length=190).lower()
    password = data.get("password") or ""

    errors = {}

    email_error = validate_email_address(email)
    if email_error:
        errors["email"] = email_error

    if not password:
        errors["password"] = "Password is required."

    return {"email": email, "password": password}, errors
