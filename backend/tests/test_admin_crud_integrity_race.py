"""Covers the IntegrityError fallback in admin_crud.py's create/update
handlers (_integrity_race_response). A genuine concurrent-request race was
also verified separately against the real MySQL database - two test clients
firing five simultaneous identical creates got exactly one 201 and four
clean 422s, with exactly one row persisted (SQLite's Python driver isn't
thread-safe enough to simulate real concurrency reliably in-process, which
is why that check ran against MySQL directly rather than as an automated
test here).

This test recreates the same race deterministically: the uniqueness
pre-check (_unique_error) is patched to report "no conflict" for one call,
simulating the exact window where another request's row commits *between*
this request's pre-check and its own insert - so the real database
constraint, not the pre-check, is what has to catch it.
"""
from app.models import Admin, FirmStat
from app.services.admin_user_service import hash_password

PASSWORD = "Passw0rd!234"


def _login(client, db):
    admin = Admin(name="Test Admin", email="admin@test.com", password_hash=hash_password(PASSWORD), role="admin", is_active=True)
    db.session.add(admin)
    db.session.commit()
    response = client.post("/api/auth/login", json={"email": "admin@test.com", "password": PASSWORD})
    return {"Authorization": f"Bearer {response.get_json()['accessToken']}"}


def test_create_returns_clean_422_when_the_db_constraint_catches_a_race(client, db, monkeypatch):
    headers = _login(client, db)
    db.session.add(FirmStat(key="years", label="Existing", value=1))
    db.session.commit()

    import app.validations.content_validator as content_validator

    # Blind the pre-check exactly once, so validate_firm_stat reports "key
    # is available" even though the row above already exists - forcing the
    # real unique constraint on the subsequent INSERT to be what fails.
    real_unique_error = content_validator._unique_error
    call_count = {"n": 0}

    def blind_once(*args, **kwargs):
        call_count["n"] += 1
        if call_count["n"] == 1:
            return None
        return real_unique_error(*args, **kwargs)

    monkeypatch.setattr(content_validator, "_unique_error", blind_once)

    response = client.post(
        "/api/admin/firm-stats",
        json={"key": "years", "label": "Duplicate", "value": "2"},
        headers=headers,
    )

    assert response.status_code == 422
    assert response.get_json()["fields"]["key"] == "This key is already in use."
    assert FirmStat.query.filter_by(key="years").count() == 1


def test_update_returns_clean_422_when_the_db_constraint_catches_a_race(client, db, monkeypatch):
    headers = _login(client, db)
    db.session.add(FirmStat(key="years", label="Existing", value=1))
    other = FirmStat(key="clients", label="Other", value=2)
    db.session.add(other)
    db.session.commit()
    other_id = other.id

    import app.validations.content_validator as content_validator

    real_unique_error = content_validator._unique_error
    call_count = {"n": 0}

    def blind_once(*args, **kwargs):
        call_count["n"] += 1
        if call_count["n"] == 1:
            return None
        return real_unique_error(*args, **kwargs)

    monkeypatch.setattr(content_validator, "_unique_error", blind_once)

    # Try to rename "clients" to the already-taken key "years".
    response = client.put(
        f"/api/admin/firm-stats/{other_id}",
        json={"key": "years", "label": "Other", "value": "2"},
        headers=headers,
    )

    assert response.status_code == 422
    assert response.get_json()["fields"]["key"] == "This key is already in use."
    assert FirmStat.query.get(other_id).key == "clients"  # unchanged
