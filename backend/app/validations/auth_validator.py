"""Server-side validation for POST /api/auth/login and the password-reset
flow (forgot-password, verify-otp, reset-password).

Mirrors the same "never trust the client" rule the contact/career
validators already follow - a login form's own client-side checks are a UX
courtesy only.
"""
import re

from app.utils.sanitize import clean_str
from app.validations.common import validate_email_address

OTP_PATTERN = re.compile(r"^\d{6}$")

# Deliberately a distinct, stricter-in-a-different-way rule from
# validate_change_password()'s "12+ characters, no complexity requirement" -
# this is the exact policy specified for the password-reset flow, not the
# self-service change-password one.
_UPPER = re.compile(r"[A-Z]")
_LOWER = re.compile(r"[a-z]")
_DIGIT = re.compile(r"\d")
_SPECIAL = re.compile(r"[^A-Za-z0-9]")


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


def validate_forgot_password_payload(data):
    email = clean_str(data.get("email"), max_length=190).lower()

    errors = {}
    email_error = validate_email_address(email)
    if email_error:
        errors["email"] = email_error

    return {"email": email}, errors


def validate_verify_otp_payload(data):
    email = clean_str(data.get("email"), max_length=190).lower()
    otp = (data.get("otp") or "").strip()

    errors = {}
    email_error = validate_email_address(email)
    if email_error:
        errors["email"] = email_error

    if not OTP_PATTERN.match(otp):
        errors["otp"] = "Enter the 6-digit code."

    return {"email": email, "otp": otp}, errors


def validate_password_strength(password):
    if len(password) < 8:
        return "Password must be at least 8 characters."
    if not _UPPER.search(password):
        return "Password must include at least one uppercase letter."
    if not _LOWER.search(password):
        return "Password must include at least one lowercase letter."
    if not _DIGIT.search(password):
        return "Password must include at least one number."
    if not _SPECIAL.search(password):
        return "Password must include at least one special character."
    return None


def validate_reset_password_payload(data):
    email = clean_str(data.get("email"), max_length=190).lower()
    reset_token = (data.get("resetToken") or "").strip()
    new_password = data.get("newPassword") or ""

    errors = {}
    email_error = validate_email_address(email)
    if email_error:
        errors["email"] = email_error

    if not reset_token:
        errors["resetToken"] = "Reset session is missing or invalid."

    password_error = validate_password_strength(new_password)
    if password_error:
        errors["newPassword"] = password_error

    return {"email": email, "reset_token": reset_token, "new_password": new_password}, errors
