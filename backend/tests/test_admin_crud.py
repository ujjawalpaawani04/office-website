"""Smoke test for the generic admin CRUD factory (app/utils/admin_crud.py),
exercised via the FirmStats resource - the simplest resource built on it
(hard delete, no media dependency). A regression in the shared factory would
affect every resource built on it (awards, certifications, firm stats, team
members, testimonials, blog taxonomy), so one full round-trip here is
high-leverage coverage for very little test code."""
from app.models import Admin, AuditLog, FirmStat
from app.services.admin_user_service import hash_password

EMAIL = "admin@test.com"
PASSWORD = "Passw0rd!234"


def _login(client, db):
    admin = Admin(name="Test Admin", email=EMAIL, password_hash=hash_password(PASSWORD), role="admin", is_active=True)
    db.session.add(admin)
    db.session.commit()
    response = client.post("/api/auth/login", json={"email": EMAIL, "password": PASSWORD})
    token = response.get_json()["accessToken"]
    return {"Authorization": f"Bearer {token}"}


def test_firm_stat_full_crud_round_trip(client, db):
    headers = _login(client, db)

    create = client.post(
        "/api/admin/firm-stats",
        json={"key": "years", "label": "Years of Experience", "value": "12", "suffix": "+"},
        headers=headers,
    )
    assert create.status_code == 201
    stat_id = create.get_json()["id"]
    assert create.get_json()["label"] == "Years of Experience"

    get_resp = client.get(f"/api/admin/firm-stats/{stat_id}", headers=headers)
    assert get_resp.status_code == 200
    # FirmStat.value is a real Integer column - the create payload sends it
    # as a string (matching what an HTML number input actually submits),
    # but the API coerces and stores/returns it as a genuine JSON number.
    assert get_resp.get_json()["value"] == 12

    update = client.put(
        f"/api/admin/firm-stats/{stat_id}",
        json={"key": "years", "label": "Years of Experience", "value": "13", "suffix": "+"},
        headers=headers,
    )
    assert update.status_code == 200
    assert update.get_json()["value"] == 13

    delete = client.delete(f"/api/admin/firm-stats/{stat_id}", headers=headers)
    assert delete.status_code == 204

    assert client.get(f"/api/admin/firm-stats/{stat_id}", headers=headers).status_code == 404
    assert FirmStat.query.get(stat_id) is None

    # The factory audit-logs every mutation in the same transaction - a
    # regression here would silently break the admin panel's audit trail.
    actions = {log.action for log in AuditLog.query.filter_by(entity_type="firm_stat", entity_id=stat_id).all()}
    assert actions == {"create", "update", "delete"}


def test_duplicate_key_is_rejected_with_422(client, db):
    headers = _login(client, db)
    payload = {"key": "years", "label": "Years", "value": "12"}
    client.post("/api/admin/firm-stats", json=payload, headers=headers)

    duplicate = client.post("/api/admin/firm-stats", json=payload, headers=headers)

    assert duplicate.status_code == 422
    assert "key" in duplicate.get_json()["fields"]


def test_missing_required_fields_are_rejected(client, db):
    headers = _login(client, db)

    response = client.post("/api/admin/firm-stats", json={"key": "", "label": "", "value": ""}, headers=headers)

    assert response.status_code == 422
    assert set(response.get_json()["fields"].keys()) == {"key", "label", "value"}


def test_unauthenticated_request_is_rejected(client, db):
    response = client.get("/api/admin/firm-stats")

    assert response.status_code == 401
