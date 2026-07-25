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
from app.extensions import db
from app.middleware.auth_guard import get_current_admin
from app.services.auth_service import revoke_all_refresh_tokens_for_admin
from app.utils.audit import record_audit_log
from app.utils.sanitize import clean_str
from app.validations.user_validator import validate_change_password

_hasher = PasswordHasher()


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
