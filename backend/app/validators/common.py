"""Validation rules shared by contact_validator and career_validator.

The frontend already enforces these same rules (see ContactForm.jsx /
ApplyNow.jsx) for instant feedback, but a client-side check is only a UX
courtesy - it's trivial to bypass with a raw HTTP request, so every rule
here runs again, unconditionally, on the server.
"""
import re

from email_validator import EmailNotValidError, validate_email

# Matches the exact pattern the frontend forms already use for Indian mobile
# numbers, so the two layers never disagree about what's "valid".
PHONE_PATTERN = re.compile(r"^[6-9]\d{9}$")


def validate_name(value, field="name", min_length=3):
    if not value:
        return f"{field.capitalize()} is required."
    if len(value) < min_length:
        return f"{field.capitalize()} must be at least {min_length} characters."
    return None


def validate_email_address(value):
    if not value:
        return "Email is required."
    try:
        validate_email(value, check_deliverability=False)
    except EmailNotValidError:
        return "Please enter a valid email address."
    return None


def validate_phone(value):
    if not value:
        return "Phone number is required."
    if not PHONE_PATTERN.match(value):
        return "Enter a valid 10-digit Indian mobile number."
    return None
