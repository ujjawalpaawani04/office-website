"""Admin self-service password reset: request OTP -> verify OTP -> reset
password.

Deliberately does NOT reuse Flask-JWT-Extended for the "OTP verified, now
let this request set a new password" credential. Every protected admin
route accepts any valid access token for the right admin identity
(app/middleware/auth_guard.py's require_role() is just verify_jwt_in_
request() plus a role check - no claim scoping) - a JWT-shaped reset token
would double as a fully-privileged, if short-lived, admin session usable
against any real endpoint, not just this one. Instead the reset token is an
opaque random string (secrets.token_urlsafe), hashed and stored server-side
next to the OTP it came from, checked only by reset_password() below. It
cannot be presented anywhere else because nothing else knows to look for it.

Every public function here returns a small, uniform result rather than
raising on "email not found" / "OTP wrong" / "OTP expired" - the route
layer collapses all of these into the same generic response, so a caller
can never tell from the response alone which specific thing was false (no
existence, code, or expiry information leaks - see authenticate() in
auth_service.py for the same convention already used at login).
"""
import secrets
from datetime import timedelta

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError

from app.extensions import db
from app.models import Admin, PasswordResetOtp
from app.models.mixins import aware_utc, utcnow
from app.services.admin_user_service import hash_password
from app.services.auth_service import revoke_all_refresh_tokens_for_admin
from app.services.email_service import send_email
from app.utils.audit import record_audit_log

OTP_TTL_MINUTES = 10
MAX_OTP_ATTEMPTS = 5
RESEND_COOLDOWN_SECONDS = 60

_hasher = PasswordHasher()


def _hash_secret(value):
    return _hasher.hash(value)


def _verify_secret(hash_, value):
    if not hash_:
        return False
    try:
        _hasher.verify(hash_, value)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False
    return True


def _generate_otp():
    return f"{secrets.randbelow(1_000_000):06d}"


def _active_row(admin_id):
    """Most recent not-yet-dead row for this admin, regardless of whether
    it's been OTP-verified yet - the one row an admin can be mid-flow on."""
    return (
        PasswordResetOtp.query.filter_by(admin_id=admin_id, used_at=None)
        .order_by(PasswordResetOtp.id.desc())
        .first()
    )


def _invalidate_active_row(admin_id):
    row = _active_row(admin_id)
    if row is not None:
        row.used_at = utcnow()


def _send_otp_email(admin, otp):
    send_email(
        subject="Password Reset Verification - Singh Amit & Associates",
        template_name="emails/password_reset_otp.html",
        context={
            "heading": "Password Reset Verification",
            "name": admin.name,
            "otp": otp,
            "expiry_minutes": OTP_TTL_MINUTES,
        },
        to=admin.email,
    )


def request_password_reset(email, request):
    """Returns True if an active admin owns this email (and an OTP was sent),
    False otherwise. The route uses this to tell the caller when the email
    isn't a registered admin, so no row/OTP/email is generated for it."""
    admin = Admin.query.filter_by(email=email, is_active=True).first()
    if admin is None:
        return False

    _invalidate_active_row(admin.id)

    otp = _generate_otp()
    row = PasswordResetOtp(
        admin_id=admin.id,
        otp_hash=_hash_secret(otp),
        expires_at=utcnow() + timedelta(minutes=OTP_TTL_MINUTES),
    )
    db.session.add(row)
    record_audit_log(admin.id, "password_reset_requested", "admin", admin.id, request=request)
    db.session.commit()

    _send_otp_email(admin, otp)
    return True


def resend_otp(email, request):
    """Returns "cooldown" with the remaining seconds if resent too soon,
    "sent" if an OTP was (re)sent, or "not_found" if the email doesn't
    belong to an active admin."""
    admin = Admin.query.filter_by(email=email, is_active=True).first()
    if admin is None:
        return "not_found", None

    last_row = (
        PasswordResetOtp.query.filter_by(admin_id=admin.id)
        .order_by(PasswordResetOtp.id.desc())
        .first()
    )
    if last_row is not None:
        elapsed = (utcnow() - aware_utc(last_row.created_at)).total_seconds()
        if elapsed < RESEND_COOLDOWN_SECONDS:
            return "cooldown", int(RESEND_COOLDOWN_SECONDS - elapsed)

    request_password_reset(email, request)
    return "sent", None


def verify_otp(email, otp, request):
    """Returns (reset_token, error). error is None on success; otherwise one
    of "invalid" (wrong code, no admin, no active row, or expired) or
    "locked" (attempts exhausted - caller should be told to request a new
    code rather than keep guessing)."""
    admin = Admin.query.filter_by(email=email, is_active=True).first()
    if admin is None:
        return None, "invalid"

    row = _active_row(admin.id)
    if row is None or row.verified_at is not None or aware_utc(row.expires_at) < utcnow():
        return None, "invalid"

    if row.attempts >= MAX_OTP_ATTEMPTS:
        row.used_at = utcnow()
        db.session.commit()
        return None, "locked"

    if not _verify_secret(row.otp_hash, otp):
        row.attempts += 1
        if row.attempts >= MAX_OTP_ATTEMPTS:
            row.used_at = utcnow()
        db.session.commit()
        return None, "invalid"

    reset_token = secrets.token_urlsafe(32)
    row.reset_token_hash = _hash_secret(reset_token)
    row.verified_at = utcnow()
    record_audit_log(admin.id, "password_reset_otp_verified", "admin", admin.id, request=request)
    db.session.commit()

    return reset_token, None


def reset_password(email, reset_token, new_password, request):
    """Returns True on success, False otherwise (unknown email, no verified
    row, expired, or reset_token mismatch - all collapsed to the same
    generic failure by the route)."""
    admin = Admin.query.filter_by(email=email, is_active=True).first()
    if admin is None:
        return False

    row = _active_row(admin.id)
    if row is None or row.verified_at is None or aware_utc(row.expires_at) < utcnow():
        return False

    if not _verify_secret(row.reset_token_hash, reset_token):
        return False

    admin.password_hash = hash_password(new_password)
    row.used_at = utcnow()
    revoke_all_refresh_tokens_for_admin(admin.id)
    record_audit_log(admin.id, "password_reset_completed", "admin", admin.id, request=request)
    db.session.commit()

    return True
