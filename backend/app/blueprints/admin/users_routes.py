"""Admin User Management (Document 5 §4.9) - admin-role only. Covers
Document 1 Business Rule #6 (an admin can never remove their own account)
and revokes all of a target admin's sessions on password reset/role
demotion isn't required by the spec, but reset-password revoking their
sessions is (a leaked old password should stop working immediately once
a new one is issued).
"""
from flask import jsonify, request

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import Admin
from app.services.admin_user_service import generate_temporary_password, hash_password, send_new_account_email, send_password_reset_email
from app.services.auth_service import revoke_all_refresh_tokens_for_admin
from app.utils.audit import record_audit_log
from app.utils.pagination import paginate_query
from app.validations.user_validator import validate_create_user, validate_update_user


def _serialize_admin(item):
    return {
        "id": item.id,
        "name": item.name,
        "email": item.email,
        "role": item.role,
        "isActive": item.is_active,
        "lastLoginAt": item.last_login_at.isoformat() if item.last_login_at else None,
        "createdAt": item.created_at.isoformat(),
    }


@admin_bp.get("/users")
@require_role("admin")
def list_users():
    query = Admin.query.order_by(Admin.created_at.desc())
    q = (request.args.get("q") or "").strip()
    if q:
        like = f"%{q}%"
        query = query.filter(db.or_(Admin.name.ilike(like), Admin.email.ilike(like)))
    result = paginate_query(query, request.args)
    return jsonify({**result, "items": [_serialize_admin(a) for a in result["items"]]})


@admin_bp.post("/users")
@require_role("admin")
def create_user():
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_create_user(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    temporary_password = generate_temporary_password()
    admin = Admin(
        name=cleaned["name"],
        email=cleaned["email"],
        role=cleaned["role"],
        password_hash=hash_password(temporary_password),
        is_active=True,
    )
    db.session.add(admin)
    db.session.flush()
    record_audit_log(get_current_admin().id, "create", "admin", admin.id, request=request)
    db.session.commit()

    send_new_account_email(admin, temporary_password)
    return jsonify(_serialize_admin(admin)), 201


@admin_bp.patch("/users/<int:user_id>")
@require_role("admin")
def update_user(user_id):
    admin = Admin.query.get(user_id)
    if admin is None:
        return jsonify({"error": "Not found."}), 404

    data = request.get_json(silent=True) or {}

    if "isActive" in data and data.get("isActive") is False and user_id == get_current_admin().id:
        return jsonify({"error": "Validation failed", "fields": {"isActive": "You can't deactivate your own account."}}), 422

    cleaned, errors = validate_update_user(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    for key, value in cleaned.items():
        setattr(admin, key, value)

    record_audit_log(get_current_admin().id, "update", "admin", admin.id, request=request)
    db.session.commit()
    return jsonify(_serialize_admin(admin))


@admin_bp.delete("/users/<int:user_id>")
@require_role("admin")
def delete_user(user_id):
    if user_id == get_current_admin().id:
        return jsonify({"error": "You can't remove your own account."}), 422

    admin = Admin.query.get(user_id)
    if admin is None:
        return jsonify({"error": "Not found."}), 404

    record_audit_log(get_current_admin().id, "delete", "admin", admin.id, request=request)
    db.session.delete(admin)
    db.session.commit()
    return "", 204


@admin_bp.post("/users/<int:user_id>/reset-password")
@require_role("admin")
def reset_user_password(user_id):
    admin = Admin.query.get(user_id)
    if admin is None:
        return jsonify({"error": "Not found."}), 404

    temporary_password = generate_temporary_password()
    admin.password_hash = hash_password(temporary_password)
    revoke_all_refresh_tokens_for_admin(admin.id)
    record_audit_log(get_current_admin().id, "reset_password", "admin", admin.id, request=request)
    db.session.commit()

    send_password_reset_email(admin, temporary_password)
    return jsonify({"message": "Password reset email sent."})
