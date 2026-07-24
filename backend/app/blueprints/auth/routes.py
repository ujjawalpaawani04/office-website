"""Auth endpoints: login, refresh, me, logout.

Access tokens travel as a normal Authorization: Bearer header in the JSON
response body - never as a cookie - so the Admin Panel frontend holds them
in memory only (never localStorage), per the Security Requirements in the
SRS. The refresh token is the one credential that lives in a cookie
(httpOnly, Secure in prod, SameSite=Strict, scoped to /api/auth/refresh via
JWT_REFRESH_COOKIE_PATH), and Flask-JWT-Extended's own CSRF-cookie pattern
(JWT_COOKIE_CSRF_PROTECT=True in config) protects it - the frontend must
read the non-httpOnly `csrf_refresh_token` cookie and send it back as an
X-CSRF-TOKEN header on the /refresh call, or the request is rejected.
"""
from flask import current_app, jsonify, request
from flask_jwt_extended import (
    decode_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    set_refresh_cookies,
    unset_jwt_cookies,
)
from flask_limiter.util import get_remote_address

from app.blueprints.auth import auth_bp
from app.extensions import limiter
from app.middleware.auth_guard import get_current_admin
from app.services.auth_service import authenticate, issue_tokens, revoke_refresh_token, rotate_refresh_token
from app.validations.auth_validator import validate_login_payload


def _login_rate_limit_key():
    email = ""
    if request.is_json:
        email = (request.get_json(silent=True) or {}).get("email", "")
    return f"{get_remote_address()}:{(email or '').strip().lower()}"


def _refresh_cookie_name():
    return current_app.config.get("JWT_REFRESH_COOKIE_NAME", "refresh_token_cookie")


@auth_bp.post("/login")
@limiter.limit("5 per 15 minutes", key_func=_login_rate_limit_key)
def login():
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_login_payload(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 400

    admin, error = authenticate(cleaned["email"], cleaned["password"], request)
    if error == "invalid":
        return jsonify({"error": "Invalid email or password."}), 401
    if error == "inactive":
        return jsonify({"error": "This account has been deactivated."}), 403

    access_token, refresh_token = issue_tokens(admin, request)
    response = jsonify(
        {
            "accessToken": access_token,
            "admin": {"id": admin.id, "name": admin.name, "email": admin.email, "role": admin.role},
        }
    )
    set_refresh_cookies(response, refresh_token)
    return response, 200


@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    claims = get_jwt()
    admin_id = int(get_jwt_identity())

    result = rotate_refresh_token(jti=claims["jti"], admin_id=admin_id, request=request)
    if result is None:
        response = jsonify({"error": "Session expired. Please log in again."})
        unset_jwt_cookies(response)
        return response, 401

    _admin, access_token, new_refresh_token = result
    response = jsonify({"accessToken": access_token})
    set_refresh_cookies(response, new_refresh_token)
    return response, 200


@auth_bp.get("/me")
@jwt_required()
def me():
    admin = get_current_admin()
    if admin is None or not admin.is_active:
        return jsonify({"error": "Account not found."}), 401
    return jsonify(
        {
            "id": admin.id,
            "name": admin.name,
            "email": admin.email,
            "role": admin.role,
            "lastLoginAt": admin.last_login_at.isoformat() if admin.last_login_at else None,
        }
    )


@auth_bp.post("/logout")
@jwt_required()
def logout():
    admin_id = int(get_jwt_identity())

    raw_refresh = request.cookies.get(_refresh_cookie_name())
    if raw_refresh:
        try:
            decoded = decode_token(raw_refresh)
            revoke_refresh_token(jti=decoded["jti"], admin_id=admin_id, request=request)
        except Exception:
            pass  # cookie already invalid/expired - nothing left to revoke

    response = jsonify({"message": "Logged out."})
    unset_jwt_cookies(response)
    return response, 200
