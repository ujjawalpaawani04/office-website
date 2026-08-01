"""Covers the single most failure-sensitive path in the app: refresh-token
rotation and reuse (theft) detection - see auth_service.rotate_refresh_token.
A regression here would silently weaken session security for every admin
account, so this is the highest-priority thing to lock in first."""
from app.models import Admin, RefreshToken
from app.services.admin_user_service import hash_password

EMAIL = "admin@test.com"
PASSWORD = "Passw0rd!234"


def _create_admin(db):
    admin = Admin(name="Test Admin", email=EMAIL, password_hash=hash_password(PASSWORD), role="admin", is_active=True)
    db.session.add(admin)
    db.session.commit()
    return admin


def _login(client):
    return client.post("/api/auth/login", json={"email": EMAIL, "password": PASSWORD})


def test_login_issues_access_token_and_refresh_cookie(client, db):
    _create_admin(db)

    response = _login(client)

    assert response.status_code == 200
    assert "accessToken" in response.get_json()
    assert client.get_cookie("refresh_token_cookie", path="/api/auth/refresh") is not None


def test_wrong_password_is_rejected_without_revealing_which_field_was_wrong(client, db):
    _create_admin(db)

    response = client.post("/api/auth/login", json={"email": EMAIL, "password": "wrong-password"})

    assert response.status_code == 401
    assert response.get_json()["error"] == "Invalid email or password."


def test_refresh_rotates_the_token_and_revokes_the_old_one(client, db):
    _create_admin(db)
    _login(client)
    csrf = client.get_cookie("csrf_refresh_token")

    response = client.post("/api/auth/refresh", headers={"X-CSRF-TOKEN": csrf.value})

    assert response.status_code == 200
    assert "accessToken" in response.get_json()
    assert RefreshToken.query.filter_by(revoked_at=None).count() == 1
    assert RefreshToken.query.filter(RefreshToken.revoked_at.isnot(None)).count() == 1


def test_reusing_a_rotated_refresh_token_kills_every_active_session(client, db):
    """The core theft-detection guarantee: presenting a refresh token that's
    already been rotated past (the sign of a copied/stolen token being used
    a second time) doesn't just fail - it revokes every session the admin
    has, forcing a fresh login everywhere instead of trusting the request."""
    _create_admin(db)
    _login(client)
    old_refresh = client.get_cookie("refresh_token_cookie", path="/api/auth/refresh")
    csrf = client.get_cookie("csrf_refresh_token")

    # Legitimate rotation.
    client.post("/api/auth/refresh", headers={"X-CSRF-TOKEN": csrf.value})
    assert RefreshToken.query.filter_by(revoked_at=None).count() == 1

    # Replay the now-revoked token, as a thief who copied it earlier would.
    client.set_cookie("refresh_token_cookie", old_refresh.value, path="/api/auth/refresh")
    response = client.post("/api/auth/refresh", headers={"X-CSRF-TOKEN": csrf.value})

    assert response.status_code == 401
    assert RefreshToken.query.filter_by(revoked_at=None).count() == 0
