"""Covers validate_testimonial's rating check (content_validator.py). The
DB also has a CHECK constraint (ck_testimonial_rating_range) enforcing the
same 1-5 range as defense-in-depth, but this validator is the actual path
every write goes through - a non-numeric rating used to raise an uncaught
ValueError here (int(rating) with no try/except) instead of a clean 422.
"""
from app.models import Admin, Testimonial
from app.services.admin_user_service import hash_password

PASSWORD = "Passw0rd!234"


def _login(client, db):
    admin = Admin(name="Test Admin", email="admin@test.com", password_hash=hash_password(PASSWORD), role="admin", is_active=True)
    db.session.add(admin)
    db.session.commit()
    response = client.post("/api/auth/login", json={"email": "admin@test.com", "password": PASSWORD})
    return {"Authorization": f"Bearer {response.get_json()['accessToken']}"}


def test_out_of_range_rating_is_rejected_with_422(client, db):
    headers = _login(client, db)

    response = client.post(
        "/api/admin/testimonials",
        json={"clientName": "Jane Doe", "content": "Great service.", "rating": 7},
        headers=headers,
    )

    assert response.status_code == 422
    assert response.get_json()["fields"]["rating"] == "Rating must be between 1 and 5."
    assert Testimonial.query.count() == 0


def test_non_numeric_rating_is_rejected_with_422_not_a_500(client, db):
    headers = _login(client, db)

    response = client.post(
        "/api/admin/testimonials",
        json={"clientName": "Jane Doe", "content": "Great service.", "rating": "abc"},
        headers=headers,
    )

    assert response.status_code == 422
    assert response.get_json()["fields"]["rating"] == "Rating must be a whole number."
    assert Testimonial.query.count() == 0


def test_valid_rating_is_accepted(client, db):
    headers = _login(client, db)

    response = client.post(
        "/api/admin/testimonials",
        json={"clientName": "Jane Doe", "content": "Great service.", "rating": 5},
        headers=headers,
    )

    assert response.status_code == 201
    assert response.get_json()["rating"] == 5


def test_omitted_rating_is_accepted_as_null(client, db):
    headers = _login(client, db)

    response = client.post(
        "/api/admin/testimonials",
        json={"clientName": "Jane Doe", "content": "Great service."},
        headers=headers,
    )

    assert response.status_code == 201
    assert response.get_json()["rating"] is None
