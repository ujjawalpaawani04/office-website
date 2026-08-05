"""Covers the CSV export and bulk-delete endpoints backing the redesigned
Appointments admin page's "More Actions" menu and Delete Mode selection bar."""
from app.models import Admin, Appointment, AuditLog
from app.services.admin_user_service import hash_password

PASSWORD = "Passw0rd!234"


def _login(client, db, role="admin"):
    admin = Admin(name="Test Admin", email=f"{role}@test.com", password_hash=hash_password(PASSWORD), role=role, is_active=True)
    db.session.add(admin)
    db.session.commit()
    response = client.post("/api/auth/login", json={"email": f"{role}@test.com", "password": PASSWORD})
    return {"Authorization": f"Bearer {response.get_json()['accessToken']}"}, admin.id


def _appointment(**overrides):
    defaults = dict(client_name="Guest", client_email="guest@example.com", status="confirmed", source="embed")
    defaults.update(overrides)
    return Appointment(**defaults)


def test_export_returns_a_csv_with_a_header_row(client, db):
    headers, _ = _login(client, db)
    db.session.add(_appointment(client_name="Katrina Kapoor", client_email="katrina@example.com"))
    db.session.commit()

    response = client.get("/api/admin/appointments/export", headers=headers)

    assert response.status_code == 200
    assert response.mimetype == "text/csv"
    body = response.get_data(as_text=True)
    assert body.startswith("Name,Email,Phone,Event,Mode,Meeting Date,Meeting Time,Timezone,Status,Booked On")
    assert "Katrina Kapoor" in body
    assert "katrina@example.com" in body


def test_export_respects_the_status_filter(client, db):
    headers, _ = _login(client, db)
    db.session.add(_appointment(client_name="Confirmed Guest", status="confirmed"))
    db.session.add(_appointment(client_name="Cancelled Guest", status="cancelled"))
    db.session.commit()

    response = client.get("/api/admin/appointments/export?status=cancelled", headers=headers)

    body = response.get_data(as_text=True)
    assert "Cancelled Guest" in body
    assert "Confirmed Guest" not in body


def test_bulk_delete_removes_only_the_selected_rows(client, db):
    headers, _ = _login(client, db)
    keep = _appointment(client_name="Keep Me")
    delete_1 = _appointment(client_name="Delete Me 1", client_email="d1@example.com")
    delete_2 = _appointment(client_name="Delete Me 2", client_email="d2@example.com")
    db.session.add_all([keep, delete_1, delete_2])
    db.session.commit()
    delete_ids = [delete_1.id, delete_2.id]

    response = client.post("/api/admin/appointments/bulk-delete", json={"ids": delete_ids}, headers=headers)

    assert response.status_code == 200
    assert response.get_json() == {"deleted": 2}
    assert Appointment.query.count() == 1
    assert Appointment.query.first().client_name == "Keep Me"

    actions = AuditLog.query.filter_by(entity_type="appointment", action="delete").all()
    assert {log.entity_id for log in actions} == set(delete_ids)


def test_bulk_delete_rejects_an_empty_list(client, db):
    headers, _ = _login(client, db)

    response = client.post("/api/admin/appointments/bulk-delete", json={"ids": []}, headers=headers)

    assert response.status_code == 422
    assert "ids" in response.get_json()["fields"]


def test_bulk_delete_ignores_ids_that_do_not_exist(client, db):
    headers, _ = _login(client, db)
    real = _appointment(client_name="Real Appointment")
    db.session.add(real)
    db.session.commit()

    response = client.post("/api/admin/appointments/bulk-delete", json={"ids": [real.id, 999999]}, headers=headers)

    assert response.status_code == 200
    assert response.get_json() == {"deleted": 1}
    assert Appointment.query.count() == 0


def test_editor_cannot_bulk_delete(client, db):
    headers, _ = _login(client, db, role="editor")
    appointment = _appointment()
    db.session.add(appointment)
    db.session.commit()

    response = client.post("/api/admin/appointments/bulk-delete", json={"ids": [appointment.id]}, headers=headers)

    assert response.status_code == 403
    assert Appointment.query.count() == 1
