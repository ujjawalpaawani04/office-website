"""Covers the self-service email-change flow: OTP sent to the new address,
attempts lockout, resend cooldown, uniqueness checks, and successful
completion revoking other sessions."""
from datetime import timedelta

from app.models import Admin, EmailChangeOtp, RefreshToken
from app.models.mixins import utcnow
from app.services import email_change_service
from app.services.admin_user_service import hash_password

EMAIL = "admin@test.com"
PASSWORD = "Passw0rd!234"
NEW_EMAIL = "new-email@test.com"
FIXED_OTP = "135790"


def _login(client, db):
    admin = Admin(name="Test Admin", email=EMAIL, password_hash=hash_password(PASSWORD), role="admin", is_active=True)
    db.session.add(admin)
    db.session.commit()
    response = client.post("/api/auth/login", json={"email": EMAIL, "password": PASSWORD})
    return {"Authorization": f"Bearer {response.get_json()['accessToken']}"}, admin


def _fix_otp(monkeypatch):
    monkeypatch.setattr(email_change_service, "_generate_otp", lambda: FIXED_OTP)


def _request_otp(client, headers, new_email=NEW_EMAIL):
    return client.post("/api/admin/profile/email/request-otp", json={"newEmail": new_email}, headers=headers)


def _verify_otp(client, headers, otp=FIXED_OTP):
    return client.post("/api/admin/profile/email/verify-otp", json={"otp": otp}, headers=headers)


def test_request_otp_rejects_email_already_in_use(client, db):
    headers, admin = _login(client, db)
    other = Admin(name="Other", email="other@test.com", password_hash=hash_password(PASSWORD), role="editor", is_active=True)
    db.session.add(other)
    db.session.commit()

    response = _request_otp(client, headers, new_email="other@test.com")

    assert response.status_code == 422
    assert "newEmail" in response.get_json()["fields"]


def test_request_otp_rejects_same_as_current_email(client, db):
    headers, admin = _login(client, db)

    response = _request_otp(client, headers, new_email=EMAIL)

    assert response.status_code == 422


def test_request_otp_creates_a_row_and_sends_to_new_address(client, db):
    headers, admin = _login(client, db)

    response = _request_otp(client, headers)

    assert response.status_code == 200
    row = EmailChangeOtp.query.filter_by(admin_id=admin.id).one()
    assert row.new_email == NEW_EMAIL
    assert row.used_at is None


def test_correct_otp_completes_the_change_and_revokes_sessions(client, db, monkeypatch):
    headers, admin = _login(client, db)
    assert RefreshToken.query.filter_by(admin_id=admin.id, revoked_at=None).count() == 1

    _fix_otp(monkeypatch)
    _request_otp(client, headers)

    response = _verify_otp(client, headers)

    assert response.status_code == 200
    assert response.get_json()["admin"]["email"] == NEW_EMAIL
    db.session.refresh(admin)
    assert admin.email == NEW_EMAIL
    assert RefreshToken.query.filter_by(admin_id=admin.id, revoked_at=None).count() == 0


def test_wrong_otp_increments_attempts_and_locks_out_after_five(client, db, monkeypatch):
    headers, admin = _login(client, db)
    _fix_otp(monkeypatch)
    _request_otp(client, headers)

    for _ in range(5):
        response = _verify_otp(client, headers, otp="000000")
        assert response.status_code == 400

    row = EmailChangeOtp.query.filter_by(admin_id=admin.id).one()
    assert row.used_at is not None

    response = _verify_otp(client, headers)
    assert response.status_code == 400
    db.session.refresh(admin)
    assert admin.email == EMAIL


def test_expired_otp_is_rejected(client, db, monkeypatch):
    headers, admin = _login(client, db)
    _fix_otp(monkeypatch)
    _request_otp(client, headers)

    row = EmailChangeOtp.query.filter_by(admin_id=admin.id).one()
    row.expires_at = utcnow() - timedelta(minutes=1)
    db.session.commit()

    response = _verify_otp(client, headers)

    assert response.status_code == 400
    db.session.refresh(admin)
    assert admin.email == EMAIL


def test_resend_before_cooldown_returns_429(client, db):
    headers, admin = _login(client, db)
    _request_otp(client, headers)

    response = _request_otp(client, headers)

    assert response.status_code == 429
    assert "retryAfterSeconds" in response.get_json()


def test_email_taken_between_request_and_verify_is_caught(client, db, monkeypatch):
    headers, admin = _login(client, db)
    _fix_otp(monkeypatch)
    _request_otp(client, headers)

    # Someone else claims the target email after the OTP was requested.
    other = Admin(name="Other", email=NEW_EMAIL, password_hash=hash_password(PASSWORD), role="editor", is_active=True)
    db.session.add(other)
    db.session.commit()

    response = _verify_otp(client, headers)

    assert response.status_code == 422
    db.session.refresh(admin)
    assert admin.email == EMAIL


def test_email_change_requires_authentication(client, db):
    response = client.post("/api/admin/profile/email/request-otp", json={"newEmail": NEW_EMAIL})
    assert response.status_code == 401
