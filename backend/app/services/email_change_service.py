"""Self-service email change: request OTP (sent to the NEW address) ->
verify OTP (which immediately completes the change).

Single-step verification, unlike password reset: there's no follow-up
"set a new X" action after the OTP, so a correct code commits the change
in the same call rather than handing back a separate reset-token credential.

Security note: the OTP goes to the *new* address the admin typed, not the
current one - if a hijacked session tried to redirect the account to an
attacker-controlled inbox, the real admin would see nothing via the OTP
alone. To close that gap, request_email_change() also sends a plain
heads-up notice (no OTP, not actionable) to the *current* email so the
account owner is never silently kept in the dark about a pending change.
"""
import secrets
from datetime import timedelta

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError

from app.extensions import db
from app.models import Admin, EmailChangeOtp
from app.models.mixins import aware_utc, utcnow
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
    return (
        EmailChangeOtp.query.filter_by(admin_id=admin_id, used_at=None)
        .order_by(EmailChangeOtp.id.desc())
        .first()
    )


def email_taken(new_email, admin_id):
    return Admin.query.filter(Admin.email == new_email, Admin.id != admin_id).first() is not None


def _send_otp_email(admin, new_email, otp):
    send_email(
        subject="Confirm Your New Email - Singh Amit & Associates",
        template_name="emails/email_change_otp.html",
        context={
            "heading": "Confirm Your New Email",
            "name": admin.name,
            "otp": otp,
            "expiry_minutes": OTP_TTL_MINUTES,
        },
        to=new_email,
    )


def _send_change_notice(admin, new_email):
    send_email(
        subject="Email Change Requested - Singh Amit & Associates",
        template_name="emails/email_change_notice.html",
        context={
            "heading": "Email Change Requested",
            "name": admin.name,
            "new_email": new_email,
        },
        to=admin.email,
    )


def request_email_change(admin, new_email, request):
    """Returns ("sent", None) on success, or ("cooldown", seconds_remaining)
    if the previous request is still within its resend cooldown."""
    last_row = (
        EmailChangeOtp.query.filter_by(admin_id=admin.id)
        .order_by(EmailChangeOtp.id.desc())
        .first()
    )
    if last_row is not None:
        elapsed = (utcnow() - aware_utc(last_row.created_at)).total_seconds()
        if elapsed < RESEND_COOLDOWN_SECONDS:
            return "cooldown", int(RESEND_COOLDOWN_SECONDS - elapsed)

    if last_row is not None and last_row.used_at is None:
        last_row.used_at = utcnow()

    otp = _generate_otp()
    row = EmailChangeOtp(
        admin_id=admin.id,
        new_email=new_email,
        otp_hash=_hash_secret(otp),
        expires_at=utcnow() + timedelta(minutes=OTP_TTL_MINUTES),
    )
    db.session.add(row)
    record_audit_log(admin.id, "email_change_requested", "admin", admin.id, details={"newEmail": new_email}, request=request)
    db.session.commit()

    _send_otp_email(admin, new_email, otp)
    _send_change_notice(admin, new_email)

    return "sent", None


def verify_and_complete_email_change(admin, otp, request):
    """Returns (new_email, error). error is None on success; otherwise
    "invalid" (wrong code, no active request, or expired), "locked"
    (attempts exhausted), or "taken" (the requested email was claimed by
    another admin between the request and this verification)."""
    row = _active_row(admin.id)
    if row is None or aware_utc(row.expires_at) < utcnow():
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

    if email_taken(row.new_email, admin.id):
        row.used_at = utcnow()
        db.session.commit()
        return None, "taken"

    old_email = admin.email
    admin.email = row.new_email
    row.used_at = utcnow()
    revoke_all_refresh_tokens_for_admin(admin.id)
    record_audit_log(
        admin.id, "email_change_completed", "admin", admin.id,
        details={"oldEmail": old_email, "newEmail": admin.email}, request=request,
    )
    db.session.commit()

    return admin.email, None
