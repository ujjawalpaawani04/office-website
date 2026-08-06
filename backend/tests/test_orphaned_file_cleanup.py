"""Covers the disk-cleanup added to media_routes.upload_media and
career_service.create_application: both save the uploaded file to disk
*before* the DB commit, so a commit failure must not leave an orphaned
file behind that no row will ever reference or let an admin clean up.

Each test forces a failure at the exact point the code under test guards
against (audit-log write / commit), after the real file has already been
written to the real upload folder, then asserts the folder ends up exactly
as it started.
"""
import base64
import io
import os

import pytest

from app.models import Admin, JobApplication, Media
from app.services.admin_user_service import hash_password

PASSWORD = "Passw0rd!234"

# Smallest possible valid PNG (1x1 transparent pixel) - sniffs as image/png.
PNG_BYTES = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
)

# Minimal content libmagic sniffs as application/pdf (signature-based, body
# doesn't need to be a structurally complete PDF).
PDF_BYTES = b"%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF"


def _login(client, db):
    admin = Admin(name="Test Admin", email="admin@test.com", password_hash=hash_password(PASSWORD), role="admin", is_active=True)
    db.session.add(admin)
    db.session.commit()
    response = client.post("/api/auth/login", json={"email": "admin@test.com", "password": PASSWORD})
    return {"Authorization": f"Bearer {response.get_json()['accessToken']}"}


def test_upload_media_deletes_file_when_db_write_fails(app, client, db, monkeypatch):
    headers = _login(client, db)

    media_dir = os.path.join(app.config["UPLOAD_FOLDER"], "media")
    before = set(os.listdir(media_dir)) if os.path.isdir(media_dir) else set()

    import app.blueprints.admin.media_routes as media_routes

    def boom(*args, **kwargs):
        raise RuntimeError("simulated audit-log/DB failure")

    monkeypatch.setattr(media_routes, "record_audit_log", boom)

    with pytest.raises(RuntimeError):
        client.post(
            "/api/admin/media",
            data={"file": (io.BytesIO(PNG_BYTES), "pixel.png")},
            content_type="multipart/form-data",
            headers=headers,
        )

    after = set(os.listdir(media_dir)) if os.path.isdir(media_dir) else set()
    assert after == before  # the file written mid-request was cleaned back up
    assert Media.query.count() == 0


def test_career_application_deletes_resume_when_db_write_fails(app, client, db, monkeypatch):
    resume_dir = os.path.join(app.config["UPLOAD_FOLDER"], "resumes")
    before = set(os.listdir(resume_dir)) if os.path.isdir(resume_dir) else set()

    import app.services.career_service as career_service

    def boom(*args, **kwargs):
        raise RuntimeError("simulated DB failure")

    monkeypatch.setattr(career_service.db.session, "commit", boom)

    with pytest.raises(RuntimeError):
        client.post(
            "/api/careers/applications",
            data={
                "name": "Test Applicant",
                "email": "applicant@example.com",
                "phone": "9876543210",
                "position": "",
                "experience": "",
                "message": "",
                "resume": (io.BytesIO(PDF_BYTES), "resume.pdf"),
            },
            content_type="multipart/form-data",
        )

    after = set(os.listdir(resume_dir)) if os.path.isdir(resume_dir) else set()
    assert after == before  # the résumé written mid-request was cleaned back up
    assert JobApplication.query.count() == 0
