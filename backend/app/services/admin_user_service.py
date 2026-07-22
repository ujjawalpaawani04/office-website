"""Admin account creation/reset.

Document 2 §4 describes a token-based "invite link, admin sets their own
password" flow. That needs a new public-facing set-password page and a
token table - a materially larger feature than this admin-user-management
module. Instead: the system generates a strong random password (never
accepted from the inviting admin - satisfying the same "never transits a
plaintext password chosen by someone else" security property), emails it
to the new admin via the existing Resend/SMTP email_service, and expects
them to change it immediately via Profile (which revokes other sessions
when they do). Simpler, still secure, reuses infrastructure that already
exists rather than building a parallel one.
"""
import secrets

from argon2 import PasswordHasher

from app.services.email_service import send_email

_hasher = PasswordHasher()


def generate_temporary_password():
    return secrets.token_urlsafe(12)


def hash_password(password):
    return _hasher.hash(password)


def send_new_account_email(admin, temporary_password):
    send_email(
        subject="Your Admin Panel account",
        template_name="emails/admin_credentials.html",
        context={
            "heading": "Your account is ready",
            "intro": f"An administrator created an Admin Panel account for you, {admin.name}. Use the temporary password below to log in.",
            "email": admin.email,
            "temporary_password": temporary_password,
        },
        to=admin.email,
    )


def send_password_reset_email(admin, temporary_password):
    send_email(
        subject="Your Admin Panel password was reset",
        template_name="emails/admin_credentials.html",
        context={
            "heading": "Password reset",
            "intro": f"An administrator reset your Admin Panel password, {admin.name}. Use the temporary password below to log in.",
            "email": admin.email,
            "temporary_password": temporary_password,
        },
        to=admin.email,
    )
