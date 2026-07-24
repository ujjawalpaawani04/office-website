"""Server-side validation for admin user management (Document 5 §4.9) and
self-service profile edits (Document 2 §3)."""
from app.utils.sanitize import clean_str
from app.validations.common import validate_email_address

VALID_ROLES = {"admin", "editor"}


def validate_create_user(data):
    from app.models import Admin

    name = clean_str(data.get("name"), max_length=120)
    email = clean_str(data.get("email"), max_length=190).lower()
    role = data.get("role") or "editor"

    errors = {}
    if not name:
        errors["name"] = "Name is required."
    email_error = validate_email_address(email)
    if email_error:
        errors["email"] = email_error
    elif Admin.query.filter_by(email=email).first() is not None:
        errors["email"] = "This email is already in use."
    if role not in VALID_ROLES:
        errors["role"] = "Role must be admin or editor."

    return {"name": name, "email": email, "role": role}, errors


def validate_update_user(data):
    errors = {}
    role = data.get("role")
    if role is not None and role not in VALID_ROLES:
        errors["role"] = "Role must be admin or editor."

    cleaned = {}
    if "name" in data:
        name = clean_str(data.get("name"), max_length=120)
        if not name:
            errors["name"] = "Name is required."
        cleaned["name"] = name
    if role is not None:
        cleaned["role"] = role
    if "isActive" in data:
        cleaned["is_active"] = bool(data.get("isActive"))

    return cleaned, errors


def validate_change_password(data):
    new_password = data.get("newPassword") or ""
    current_password = data.get("currentPassword") or ""

    errors = {}
    if not current_password:
        errors["currentPassword"] = "Current password is required."
    if len(new_password) < 12:
        errors["newPassword"] = "New password must be at least 12 characters."
    elif new_password == current_password:
        errors["newPassword"] = "New password must be different from your current password."

    return {"current_password": current_password, "new_password": new_password}, errors
