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
from app.services import password_reset_service
from app.services.auth_service import authenticate, issue_tokens, revoke_refresh_token, rotate_refresh_token
from app.utils.dates import isoformat_utc
from app.validations.auth_validator import (
    validate_forgot_password_payload,
    validate_login_payload,
    validate_reset_password_payload,
    validate_verify_otp_payload,
)

# Generic responses used by verify/reset below so a caller can never
# distinguish "wrong code" from "expired" - same enumeration-safety
# convention authenticate() already uses for login. request/resend now
# report unregistered emails explicitly (product decision: admin list is
# small and fixed, so email enumeration risk is accepted in exchange for
# telling the admin their email is wrong).
GENERIC_OTP_SENT_MESSAGE = "Verification code sent to your email."
EMAIL_NOT_REGISTERED_MESSAGE = "This email is not registered as an admin."
GENERIC_OTP_INVALID_MESSAGE = "Invalid or expired code."
GENERIC_RESET_INVALID_MESSAGE = "Invalid or expired reset session."


def _login_rate_limit_key():
    email = ""
    if request.is_json:
        email = (request.get_json(silent=True) or {}).get("email", "")
    return f"{get_remote_address()}:{(email or '').strip().lower()}"


def _email_only_rate_limit_key():
    """Keyed on email alone (no IP) - catches a distributed/rotating-IP
    attacker mail-bombing one admin's inbox with OTPs, which an IP+email key
    can't since the attacker never needs to share an IP across attempts."""
    email = ""
    if request.is_json:
        email = (request.get_json(silent=True) or {}).get("email", "")
    return (email or "").strip().lower()


def _refresh_cookie_name():
    return current_app.config.get("JWT_REFRESH_COOKIE_NAME", "refresh_token_cookie")


@auth_bp.post("/login")
@limiter.limit("5 per 15 minutes", key_func=_login_rate_limit_key)
def login():
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_login_payload(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    admin, error = authenticate(cleaned["email"], cleaned["password"], request)
    if error == "invalid":
        return jsonify({"error": "Invalid email or password."}), 401
    if error == "inactive":
        return jsonify({"error": "This account has been deactivated."}), 403

    access_token, refresh_token = issue_tokens(admin, request)
    response = jsonify(
        {
            "accessToken": access_token,
            "admin": {
                "id": admin.id,
                "name": admin.name,
                "email": admin.email,
                "role": admin.role,
                "photoUrl": admin.photo_url,
                "photoMediaId": admin.photo_media_id,
            },
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
            "photoUrl": admin.photo_url,
            "photoMediaId": admin.photo_media_id,
            "lastLoginAt": isoformat_utc(admin.last_login_at),
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


@auth_bp.post("/forgot-password")
@limiter.limit("5 per 15 minutes", key_func=_login_rate_limit_key)
@limiter.limit("3 per hour", key_func=_email_only_rate_limit_key)
def forgot_password():
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_forgot_password_payload(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    found = password_reset_service.request_password_reset(cleaned["email"], request)
    if not found:
        return jsonify({"error": EMAIL_NOT_REGISTERED_MESSAGE}), 404

    return jsonify({"message": GENERIC_OTP_SENT_MESSAGE}), 200


@auth_bp.post("/resend-otp")
@limiter.limit("5 per 15 minutes", key_func=_login_rate_limit_key)
@limiter.limit("3 per hour", key_func=_email_only_rate_limit_key)
def resend_otp():
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_forgot_password_payload(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    status, retry_after = password_reset_service.resend_otp(cleaned["email"], request)
    if status == "not_found":
        return jsonify({"error": EMAIL_NOT_REGISTERED_MESSAGE}), 404
    if status == "cooldown":
        return jsonify({"error": "Please wait before requesting another code.", "retryAfterSeconds": retry_after}), 429

    return jsonify({"message": GENERIC_OTP_SENT_MESSAGE}), 200


@auth_bp.post("/verify-otp")
@limiter.limit("10 per 15 minutes", key_func=_login_rate_limit_key)
def verify_otp():
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_verify_otp_payload(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    reset_token, error = password_reset_service.verify_otp(cleaned["email"], cleaned["otp"], request)
    if error:
        return jsonify({"error": GENERIC_OTP_INVALID_MESSAGE}), 400

    return jsonify({"resetToken": reset_token, "message": "OTP verified."}), 200


@auth_bp.post("/reset-password")
@limiter.limit("10 per 15 minutes", key_func=_login_rate_limit_key)
def reset_password():
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_reset_password_payload(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    success = password_reset_service.reset_password(
        cleaned["email"], cleaned["reset_token"], cleaned["new_password"], request
    )
    if not success:
        return jsonify({"error": GENERIC_RESET_INVALID_MESSAGE}), 400

    return jsonify({"message": "Password reset successful."}), 200
