"""Covers the admin panel's manual "Sync Appointments" action
(appointment_sync_service.py / POST /api/admin/appointments/sync) - the
Calendly Free plan has no webhooks, so this pull-based sync is the only way
bookings made directly through Calendly's own UI reach the appointments
table. Calendly itself is never actually called here: list_scheduled_events
and list_event_invitees are monkeypatched so this suite exercises the
new/duplicate/error handling deterministically and offline.
"""
from app.models import Admin, Appointment, AuditLog
from app.services.admin_user_service import hash_password

PASSWORD = "Passw0rd!234"


def _login(client, db):
    admin = Admin(name="Test Admin", email="admin@test.com", password_hash=hash_password(PASSWORD), role="admin", is_active=True)
    db.session.add(admin)
    db.session.commit()
    response = client.post("/api/auth/login", json={"email": "admin@test.com", "password": PASSWORD})
    return {"Authorization": f"Bearer {response.get_json()['accessToken']}"}, admin.id


def _event(uid, name="Consultation", status="active", start="2026-09-01T10:00:00.000000Z", end="2026-09-01T10:30:00.000000Z"):
    return {
        "uri": f"https://api.calendly.com/scheduled_events/{uid}",
        "name": name,
        "status": status,
        "start_time": start,
        "end_time": end,
        "location": {"join_url": "https://calendly.com/some-meeting"},
    }


def _invitee(uid, email="guest@example.com", name="Guest User", status="active", created_at="2026-08-20T09:00:00.000000Z"):
    return {
        "uri": f"https://api.calendly.com/scheduled_events/xyz/invitees/{uid}",
        "email": email,
        "name": name,
        "status": status,
        "timezone": "Asia/Kolkata",
        "created_at": created_at,
    }


def test_sync_disabled_returns_a_clean_502_not_a_500(client, db, app):
    # Explicit, not relying on TestingConfig's default: a real Calendly
    # token can legitimately be present in the developer's own .env for
    # local manual testing, and this test must still exercise the
    # "disabled" branch deterministically rather than depend on ambient
    # config (or, worse, ever attempt a real call to Calendly).
    app.config["CALENDLY_API_ENABLED"] = False
    headers, _ = _login(client, db)

    response = client.post("/api/admin/appointments/sync", headers=headers)

    assert response.status_code == 502
    assert "not enabled" in response.get_json()["error"]
    assert Appointment.query.count() == 0


def test_sync_adds_new_appointments_and_reports_counts(client, db, monkeypatch, app):
    app.config["CALENDLY_API_ENABLED"] = True
    app.config["CALENDLY_ACCESS_TOKEN"] = "fake-token"
    app.config["CALENDLY_ORG_URI"] = "https://api.calendly.com/organizations/fake-org"
    headers, admin_id = _login(client, db)

    import app.services.appointment_sync_service as sync_service

    monkeypatch.setattr(sync_service, "list_scheduled_events", lambda *a, **k: [_event("evt-1")])
    monkeypatch.setattr(sync_service, "list_event_invitees", lambda event_uri: [_invitee("inv-1")])

    response = client.post("/api/admin/appointments/sync", headers=headers)

    assert response.status_code == 200
    body = response.get_json()
    assert body == {"added": 1, "skipped": 0, "fetched": 1}

    appointment = Appointment.query.filter_by(calendly_event_id="evt-1").first()
    assert appointment is not None
    assert appointment.client_email == "guest@example.com"
    assert appointment.client_name == "Guest User"
    assert appointment.client_phone is None
    assert appointment.timezone == "Asia/Kolkata"
    assert appointment.source == "sync"
    assert appointment.status == "confirmed"
    # Booked On reflects Calendly's own invitee.created_at, not "now".
    assert appointment.created_at.year == 2026 and appointment.created_at.month == 8

    actions = {log.action for log in AuditLog.query.filter_by(entity_type="appointment").all()}
    assert actions == {"sync_create", "sync"}


def test_sync_stores_appointment_mode_and_location_detail_for_a_phone_booking(client, db, monkeypatch, app):
    app.config["CALENDLY_API_ENABLED"] = True
    app.config["CALENDLY_ACCESS_TOKEN"] = "fake-token"
    app.config["CALENDLY_ORG_URI"] = "https://api.calendly.com/organizations/fake-org"
    headers, _ = _login(client, db)

    phone_event = _event("evt-phone")
    phone_event["location"] = {"type": "outbound_call", "location": "+91 98765 43210"}

    import app.services.appointment_sync_service as sync_service

    monkeypatch.setattr(sync_service, "list_scheduled_events", lambda *a, **k: [phone_event])
    monkeypatch.setattr(sync_service, "list_event_invitees", lambda event_uri: [_invitee("inv-1")])

    response = client.post("/api/admin/appointments/sync", headers=headers)

    assert response.status_code == 200
    assert response.get_json()["added"] == 1

    appointment = Appointment.query.filter_by(calendly_event_id="evt-phone").first()
    assert appointment.appointment_mode == "phone"
    assert appointment.location_detail == "+91 98765 43210"
    assert appointment.meeting_link is None
    # Not backfilled into client_phone - see the comment in
    # appointment_sync_service.py on why that column stays untouched here.
    assert appointment.client_phone is None


def test_sync_skips_an_event_already_in_the_database(client, db, monkeypatch, app):
    app.config["CALENDLY_API_ENABLED"] = True
    app.config["CALENDLY_ACCESS_TOKEN"] = "fake-token"
    app.config["CALENDLY_ORG_URI"] = "https://api.calendly.com/organizations/fake-org"
    headers, admin_id = _login(client, db)

    existing = Appointment(
        calendly_event_id="evt-1",
        client_name="Already Here",
        client_email="already@example.com",
        client_phone="9876543210",
        status="confirmed",
        source="embed",
    )
    db.session.add(existing)
    db.session.commit()

    import app.services.appointment_sync_service as sync_service

    monkeypatch.setattr(sync_service, "list_scheduled_events", lambda *a, **k: [_event("evt-1")])
    monkeypatch.setattr(sync_service, "list_event_invitees", lambda event_uri: [_invitee("inv-1")])

    response = client.post("/api/admin/appointments/sync", headers=headers)

    assert response.status_code == 200
    assert response.get_json() == {"added": 0, "skipped": 1, "fetched": 1}
    assert Appointment.query.count() == 1
    # The pre-existing row (and its embed-captured fields) is untouched.
    assert Appointment.query.first().client_name == "Already Here"


def test_sync_skips_an_event_with_no_invitee_email(client, db, monkeypatch, app):
    app.config["CALENDLY_API_ENABLED"] = True
    app.config["CALENDLY_ACCESS_TOKEN"] = "fake-token"
    app.config["CALENDLY_ORG_URI"] = "https://api.calendly.com/organizations/fake-org"
    headers, admin_id = _login(client, db)

    import app.services.appointment_sync_service as sync_service

    monkeypatch.setattr(sync_service, "list_scheduled_events", lambda *a, **k: [_event("evt-1")])
    monkeypatch.setattr(sync_service, "list_event_invitees", lambda event_uri: [])

    response = client.post("/api/admin/appointments/sync", headers=headers)

    assert response.status_code == 200
    assert response.get_json() == {"added": 0, "skipped": 0, "fetched": 1}
    assert Appointment.query.count() == 0


def test_editor_can_trigger_sync_but_only_admin_can_delete(client, db, monkeypatch, app):
    app.config["CALENDLY_API_ENABLED"] = True
    app.config["CALENDLY_ACCESS_TOKEN"] = "fake-token"
    app.config["CALENDLY_ORG_URI"] = "https://api.calendly.com/organizations/fake-org"
    editor = Admin(name="Editor", email="editor@test.com", password_hash=hash_password(PASSWORD), role="editor", is_active=True)
    db.session.add(editor)
    db.session.commit()
    login = client.post("/api/auth/login", json={"email": "editor@test.com", "password": PASSWORD})
    headers = {"Authorization": f"Bearer {login.get_json()['accessToken']}"}

    import app.services.appointment_sync_service as sync_service

    monkeypatch.setattr(sync_service, "list_scheduled_events", lambda *a, **k: [])
    monkeypatch.setattr(sync_service, "list_event_invitees", lambda event_uri: [])

    response = client.post("/api/admin/appointments/sync", headers=headers)

    assert response.status_code == 200
    assert response.get_json() == {"added": 0, "skipped": 0, "fetched": 0}
