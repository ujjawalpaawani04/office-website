"""Self-service Profile (Document 2 §3) - every authenticated admin
manages their own name/password here. Role and is_active are deliberately
never editable through this surface (only via Users, §4, and only by an
`admin`) - prevents privilege self-escalation.
"""
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from flask import jsonify, request
from flask_jwt_extended import jwt_required

from app.blueprints.admin import admin_bp
from app.extensions import db, limiter
from app.middleware.auth_guard import get_current_admin
from app.services import email_change_service
from app.services.auth_service import revoke_all_refresh_tokens_for_admin
from app.utils.audit import record_audit_log
from app.utils.sanitize import clean_str
from app.validations.user_validator import (
    validate_change_password,
    validate_email_change_otp,
    validate_email_change_request,
)

_hasher = PasswordHasher()

# Generic error text for both endpoints below - the caller never learns
# whether a code was wrong, expired, or no request was ever made, matching
# the same enumeration-safety convention password_reset_service.py uses.
GENERIC_OTP_INVALID_MESSAGE = "Invalid or expired code."


@admin_bp.patch("/profile")
@jwt_required()
def update_profile():
    admin = get_current_admin()
    data = request.get_json(silent=True) or {}
    name = clean_str(data.get("name"), max_length=120)
    if not name:
        return jsonify({"error": "Validation failed", "fields": {"name": "Name is required."}}), 422

    admin.name = name
    record_audit_log(admin.id, "update_profile", "admin", admin.id, request=request)
    db.session.commit()
    return jsonify({"id": admin.id, "name": admin.name, "email": admin.email, "role": admin.role})


@admin_bp.post("/profile/change-password")
@jwt_required()
def change_password():
    admin = get_current_admin()
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_change_password(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    try:
        _hasher.verify(admin.password_hash, cleaned["current_password"])
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return jsonify({"error": "Validation failed", "fields": {"currentPassword": "Current password is incorrect."}}), 422

    admin.password_hash = _hasher.hash(cleaned["new_password"])
    revoke_all_refresh_tokens_for_admin(admin.id)
    record_audit_log(admin.id, "change_password", "admin", admin.id, request=request)
    db.session.commit()
    return jsonify({"message": "Password updated. You've been logged out of other devices."})


@admin_bp.post("/profile/email/request-otp")
@jwt_required()
@limiter.limit("10 per 15 minutes")
def request_email_change():
    admin = get_current_admin()
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_email_change_request(data, admin)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    status, retry_after = email_change_service.request_email_change(admin, cleaned["new_email"], request)
    if status == "cooldown":
        return jsonify({"error": "Please wait before requesting another code.", "retryAfterSeconds": retry_after}), 429

    return jsonify({"message": f"A verification code has been sent to {cleaned['new_email']}."})


@admin_bp.post("/profile/email/verify-otp")
@jwt_required()
@limiter.limit("10 per 15 minutes")
def verify_email_change():
    admin = get_current_admin()
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_email_change_otp(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    new_email, error = email_change_service.verify_and_complete_email_change(admin, cleaned["otp"], request)
    if error == "taken":
        return jsonify({"error": "That email is no longer available. Please request a new code."}), 422
    if error:
        return jsonify({"error": GENERIC_OTP_INVALID_MESSAGE}), 400

    return jsonify(
        {
            "message": "Email updated. You've been logged out of other devices.",
            "admin": {"id": admin.id, "name": admin.name, "email": new_email, "role": admin.role},
        }
    )
