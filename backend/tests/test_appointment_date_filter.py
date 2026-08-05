"""Covers the dateFrom/dateTo query params on GET /admin/appointments and
its CSV export - backing the Appointments page's new Date Filter (Today /
Yesterday / This Week / This Month / Custom Date / Custom Date Range). The
frontend always resolves a preset to two full ISO instants before sending
them (see appointmentDatePresets.js), so these tests exercise the same
shape: real UTC timestamps, not bare calendar dates."""
from app.models import Admin, Appointment
from app.services.admin_user_service import hash_password

PASSWORD = "Passw0rd!234"


def _login(client, db):
    admin = Admin(name="Test Admin", email="admin@test.com", password_hash=hash_password(PASSWORD), role="admin", is_active=True)
    db.session.add(admin)
    db.session.commit()
    response = client.post("/api/auth/login", json={"email": "admin@test.com", "password": PASSWORD})
    return {"Authorization": f"Bearer {response.get_json()['accessToken']}"}


def _appointment(name, starts_at):
    return Appointment(client_name=name, client_email=f"{name.lower()}@example.com", status="confirmed", source="embed", starts_at=starts_at)


def test_date_filter_returns_only_appointments_within_the_range(client, db):
    headers = _login(client, db)
    from datetime import datetime, timezone

    db.session.add(_appointment("InRange", datetime(2026, 8, 5, 10, 0, tzinfo=timezone.utc)))
    db.session.add(_appointment("BeforeRange", datetime(2026, 8, 1, 10, 0, tzinfo=timezone.utc)))
    db.session.add(_appointment("AfterRange", datetime(2026, 8, 10, 10, 0, tzinfo=timezone.utc)))
    db.session.commit()

    response = client.get(
        "/api/admin/appointments?dateFrom=2026-08-04T00:00:00.000Z&dateTo=2026-08-06T23:59:59.999Z",
        headers=headers,
    )

    assert response.status_code == 200
    names = {item["clientName"] for item in response.get_json()["items"]}
    assert names == {"InRange"}


def test_appointments_with_no_starts_at_are_excluded_from_a_date_filter(client, db):
    headers = _login(client, db)
    db.session.add(_appointment("NoSchedule", None))
    db.session.commit()

    response = client.get(
        "/api/admin/appointments?dateFrom=2026-08-04T00:00:00.000Z&dateTo=2026-08-06T23:59:59.999Z",
        headers=headers,
    )

    assert response.get_json()["items"] == []


def test_no_date_filter_returns_everything(client, db):
    headers = _login(client, db)
    db.session.add(_appointment("NoSchedule", None))
    db.session.commit()

    response = client.get("/api/admin/appointments", headers=headers)

    assert len(response.get_json()["items"]) == 1


def test_export_also_respects_the_date_filter(client, db):
    headers = _login(client, db)
    from datetime import datetime, timezone

    db.session.add(_appointment("InRange", datetime(2026, 8, 5, 10, 0, tzinfo=timezone.utc)))
    db.session.add(_appointment("OutOfRange", datetime(2026, 1, 1, 10, 0, tzinfo=timezone.utc)))
    db.session.commit()

    response = client.get(
        "/api/admin/appointments/export?dateFrom=2026-08-04T00:00:00.000Z&dateTo=2026-08-06T23:59:59.999Z",
        headers=headers,
    )

    body = response.get_data(as_text=True)
    assert "InRange" in body
    assert "OutOfRange" not in body
