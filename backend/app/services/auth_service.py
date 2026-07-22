"""Authentication business logic: password verification, JWT issuance, and
refresh-token rotation backed by the `refresh_tokens` allowlist table.

Rotation + reuse detection: every successful /auth/refresh call issues a
brand new refresh token and immediately marks the old one revoked, linking
the two via `replaced_by_id`. If a refresh token is ever presented *after*
it's already been marked revoked, that can only mean it was copied/stolen
and used a second time after the legitimate client already rotated past
it - so instead of trusting it, every active session for that admin is
killed and re-authentication is forced.
"""
from datetime import datetime, timezone

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from flask import current_app
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token

from app.extensions import db
from app.models import Admin, RefreshToken
from app.utils.audit import record_audit_log

_hasher = PasswordHasher()


def _utcnow():
    return datetime.now(timezone.utc)


def _aware(dt):
    """MySQL/PyMySQL hands back naive datetimes even for DateTime(timezone=True)
    columns (MySQL's DATETIME type has no tz storage) - every value this app
    writes is UTC, so a naive read is re-tagged as UTC before comparing
    against _utcnow(), instead of raising on naive-vs-aware comparison."""
    if dt is not None and dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def authenticate(email, password, request):
    """Returns (admin, error_code). error_code is one of None, "invalid",
    "inactive" - never reveals which of email/password was wrong, to avoid
    leaking which emails have accounts."""
    admin = Admin.query.filter_by(email=email).first()
    if admin is None:
        record_audit_log(None, "login_failed", "admin", details={"email": email}, request=request)
        db.session.commit()
        return None, "invalid"

    try:
        _hasher.verify(admin.password_hash, password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        record_audit_log(admin.id, "login_failed", "admin", admin.id, {"email": email}, request=request)
        db.session.commit()
        return None, "invalid"

    if not admin.is_active:
        return None, "inactive"

    admin.last_login_at = _utcnow()
    record_audit_log(admin.id, "login", "admin", admin.id, request=request)
    db.session.commit()
    return admin, None


def _issue_pair(admin, request):
    additional_claims = {"role": admin.role, "name": admin.name}
    access_token = create_access_token(identity=str(admin.id), additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity=str(admin.id), additional_claims=additional_claims)
    jti = decode_token(refresh_token)["jti"]

    row = RefreshToken(
        admin_id=admin.id,
        token_hash=jti,
        issued_at=_utcnow(),
        expires_at=_utcnow() + current_app.config["JWT_REFRESH_TOKEN_EXPIRES"],
        user_agent=(request.headers.get("User-Agent") or "")[:255] or None if request else None,
        ip_address=request.remote_addr if request else None,
    )
    db.session.add(row)
    return access_token, refresh_token, row


def issue_tokens(admin, request):
    """Used right after a fresh login (not a rotation)."""
    access_token, refresh_token, _row = _issue_pair(admin, request)
    db.session.commit()
    return access_token, refresh_token


def rotate_refresh_token(jti, admin_id, request):
    """Returns (admin, access_token, refresh_token) or None if the presented
    refresh token is unknown, expired, revoked, or belongs to a different
    admin than the JWT claims (defence in depth beyond signature checking)."""
    row = RefreshToken.query.filter_by(token_hash=jti).first()
    if row is None or row.admin_id != admin_id:
        return None

    if row.revoked_at is not None:
        revoke_all_refresh_tokens_for_admin(admin_id)
        db.session.commit()
        return None

    if _aware(row.expires_at) < _utcnow():
        return None

    admin = Admin.query.get(admin_id)
    if admin is None or not admin.is_active:
        return None

    access_token, new_refresh_token, new_row = _issue_pair(admin, request)
    db.session.flush()  # assign new_row.id before we link replaced_by_id
    row.revoked_at = _utcnow()
    row.replaced_by_id = new_row.id
    db.session.commit()
    return admin, access_token, new_refresh_token


def revoke_refresh_token(jti, admin_id, request):
    row = RefreshToken.query.filter_by(token_hash=jti, admin_id=admin_id).first()
    if row is not None and row.revoked_at is None:
        row.revoked_at = _utcnow()
        record_audit_log(admin_id, "logout", "admin", admin_id, request=request)
        db.session.commit()


def revoke_all_refresh_tokens_for_admin(admin_id):
    RefreshToken.query.filter_by(admin_id=admin_id, revoked_at=None).update({"revoked_at": _utcnow()})
