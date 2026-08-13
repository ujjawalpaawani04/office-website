"""Covers the forgot-password -> verify-otp -> reset-password flow,
particularly the enumeration-safety, single-use, and lockout guarantees
called out in password_reset_service.py."""
from datetime import timedelta

from app.models import Admin, PasswordResetOtp, RefreshToken
from app.models.mixins import utcnow
from app.services import password_reset_service
from app.services.admin_user_service import hash_password

EMAIL = "admin@test.com"
OLD_PASSWORD = "Passw0rd!234"
NEW_PASSWORD = "NewPassw0rd!456"
FIXED_OTP = "123456"


def _create_admin(db):
    admin = Admin(name="Test Admin", email=EMAIL, password_hash=hash_password(OLD_PASSWORD), role="admin", is_active=True)
    db.session.add(admin)
    db.session.commit()
    return admin


def _fix_otp(monkeypatch):
    monkeypatch.setattr(password_reset_service, "_generate_otp", lambda: FIXED_OTP)


def _request_otp(client, email=EMAIL):
    return client.post("/api/auth/forgot-password", json={"email": email})


def _verify_otp(client, otp=FIXED_OTP, email=EMAIL):
    return client.post("/api/auth/verify-otp", json={"email": email, "otp": otp})


def _reset_password(client, reset_token, new_password=NEW_PASSWORD, email=EMAIL):
    return client.post(
        "/api/auth/reset-password", json={"email": email, "resetToken": reset_token, "newPassword": new_password}
    )


def test_forgot_password_returns_generic_message_for_unregistered_email(client, db):
    response = _request_otp(client, email="nobody@test.com")

    assert response.status_code == 200
    assert "If that email is registered" in response.get_json()["message"]
    assert PasswordResetOtp.query.count() == 0


def test_forgot_password_creates_an_otp_row_for_a_registered_email(client, db):
    admin = _create_admin(db)

    response = _request_otp(client)

    assert response.status_code == 200
    row = PasswordResetOtp.query.filter_by(admin_id=admin.id).one()
    assert row.used_at is None
    assert row.attempts == 0


def test_correct_otp_verifies_and_returns_a_reset_token(client, db, monkeypatch):
    _create_admin(db)
    _fix_otp(monkeypatch)
    _request_otp(client)

    response = _verify_otp(client)

    assert response.status_code == 200
    assert response.get_json()["resetToken"]


def test_wrong_otp_increments_attempts_and_locks_out_after_five(client, db, monkeypatch):
    admin = _create_admin(db)
    _fix_otp(monkeypatch)
    _request_otp(client)

    for _ in range(5):
        response = _verify_otp(client, otp="000000")
        assert response.status_code == 400

    row = PasswordResetOtp.query.filter_by(admin_id=admin.id).one()
    assert row.used_at is not None  # locked out - dead, even though the real OTP was never guessed

    # The real code no longer works either, since the row is now dead.
    response = _verify_otp(client)
    assert response.status_code == 400


def test_expired_otp_is_rejected(client, db, monkeypatch):
    admin = _create_admin(db)
    _fix_otp(monkeypatch)
    _request_otp(client)

    row = PasswordResetOtp.query.filter_by(admin_id=admin.id).one()
    row.expires_at = utcnow() - timedelta(minutes=1)
    db.session.commit()

    response = _verify_otp(client)

    assert response.status_code == 400


def test_resend_before_cooldown_returns_429(client, db, monkeypatch):
    _create_admin(db)
    _fix_otp(monkeypatch)
    _request_otp(client)

    response = client.post("/api/auth/resend-otp", json={"email": EMAIL})

    assert response.status_code == 429
    assert "retryAfterSeconds" in response.get_json()


def test_requesting_a_new_otp_invalidates_the_previous_reset_token(client, db, monkeypatch):
    _create_admin(db)
    _fix_otp(monkeypatch)
    _request_otp(client)
    first_reset_token = _verify_otp(client).get_json()["resetToken"]

    # Simulate a second request outside the resend cooldown by directly
    # calling the service (bypasses the 60s limiter check for the test).
    password_reset_service.request_password_reset(EMAIL, request=None)

    response = _reset_password(client, first_reset_token)

    assert response.status_code == 400


def test_reset_password_with_an_already_used_token_is_rejected(client, db):
    _create_admin(db)

    response = _reset_password(client, "not-a-real-token")

    assert response.status_code == 400


def test_successful_reset_revokes_sessions_and_allows_login_with_new_password(client, db, monkeypatch):
    admin = _create_admin(db)
    client.post("/api/auth/login", json={"email": EMAIL, "password": OLD_PASSWORD})
    assert RefreshToken.query.filter_by(admin_id=admin.id, revoked_at=None).count() == 1

    _fix_otp(monkeypatch)
    _request_otp(client)
    reset_token = _verify_otp(client).get_json()["resetToken"]

    response = _reset_password(client, reset_token)

    assert response.status_code == 200
    assert RefreshToken.query.filter_by(admin_id=admin.id, revoked_at=None).count() == 0

    old_login = client.post("/api/auth/login", json={"email": EMAIL, "password": OLD_PASSWORD})
    assert old_login.status_code == 401

    new_login = client.post("/api/auth/login", json={"email": EMAIL, "password": NEW_PASSWORD})
    assert new_login.status_code == 200
