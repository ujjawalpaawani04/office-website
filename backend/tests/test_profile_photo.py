"""Covers the self-service profile photo: attaching/clearing photo_media_id
via PATCH /admin/profile, validation of the referenced Media row, and that
photoUrl round-trips through login/me/profile-update responses."""
from app.models import Admin, Media
from app.services.admin_user_service import hash_password

EMAIL = "admin@test.com"
PASSWORD = "Passw0rd!234"


def _login(client, db):
    admin = Admin(name="Test Admin", email=EMAIL, password_hash=hash_password(PASSWORD), role="admin", is_active=True)
    db.session.add(admin)
    db.session.commit()
    response = client.post("/api/auth/login", json={"email": EMAIL, "password": PASSWORD})
    return {"Authorization": f"Bearer {response.get_json()['accessToken']}"}, admin, response.get_json()


def _create_media(db, admin_id, path="http://localhost/media/abc.png"):
    media = Media(
        filename="abc.png", original_filename="photo.png", path=path,
        mime_type="image/png", size_bytes=1234, uploaded_by=admin_id,
    )
    db.session.add(media)
    db.session.commit()
    return media


def test_login_response_includes_photo_url_key(client, db):
    _, _admin, login_body = _login(client, db)
    assert "photoUrl" in login_body["admin"]
    assert login_body["admin"]["photoUrl"] is None


def test_update_profile_without_photo_key_leaves_it_unchanged(client, db):
    headers, admin, _ = _login(client, db)
    media = _create_media(db, admin.id)
    admin.photo_media_id = media.id
    db.session.commit()

    response = client.patch("/api/admin/profile", json={"name": "New Name"}, headers=headers)

    assert response.status_code == 200
    db.session.refresh(admin)
    assert admin.photo_media_id == media.id
    assert response.get_json()["photoUrl"] == media.path


def test_update_profile_sets_photo_media_id(client, db):
    headers, admin, _ = _login(client, db)
    media = _create_media(db, admin.id)

    response = client.patch("/api/admin/profile", json={"name": "Test Admin", "photoMediaId": media.id}, headers=headers)

    assert response.status_code == 200
    assert response.get_json()["photoUrl"] == media.path
    db.session.refresh(admin)
    assert admin.photo_media_id == media.id


def test_update_profile_clears_photo_with_explicit_null(client, db):
    headers, admin, _ = _login(client, db)
    media = _create_media(db, admin.id)
    admin.photo_media_id = media.id
    db.session.commit()

    response = client.patch("/api/admin/profile", json={"name": "Test Admin", "photoMediaId": None}, headers=headers)

    assert response.status_code == 200
    assert response.get_json()["photoUrl"] is None
    db.session.refresh(admin)
    assert admin.photo_media_id is None


def test_update_profile_rejects_nonexistent_media_id(client, db):
    headers, admin, _ = _login(client, db)

    response = client.patch("/api/admin/profile", json={"name": "Test Admin", "photoMediaId": 999999}, headers=headers)

    assert response.status_code == 422
    assert "photoMediaId" in response.get_json()["fields"]
    db.session.refresh(admin)
    assert admin.photo_media_id is None


def test_me_endpoint_reflects_the_photo(client, db):
    headers, admin, _ = _login(client, db)
    media = _create_media(db, admin.id)
    client.patch("/api/admin/profile", json={"name": "Test Admin", "photoMediaId": media.id}, headers=headers)

    response = client.get("/api/auth/me", headers=headers)

    assert response.status_code == 200
    assert response.get_json()["photoUrl"] == media.path
