"""Covers the admin-only role gate on genuine hard-delete actions. Firm
Stats and Blog Posts were the only two real hard-deletes in the admin API
reachable by the "editor" role - every other hard delete (team-members/
awards/testimonials/job-openings via their "/permanent" endpoint, plus
services) already required "admin". See blog_routes.py and
content_routes.py for the fix this locks in."""
from app.models import Admin, BlogPost, FirmStat
from app.services.admin_user_service import hash_password

PASSWORD = "Passw0rd!234"


def _create_admin(db, email, role):
    admin = Admin(name=f"Test {role}", email=email, password_hash=hash_password(PASSWORD), role=role, is_active=True)
    db.session.add(admin)
    db.session.commit()
    return admin


def _login(client, email):
    response = client.post("/api/auth/login", json={"email": email, "password": PASSWORD})
    return {"Authorization": f"Bearer {response.get_json()['accessToken']}"}


def test_editor_cannot_delete_a_firm_stat(client, db):
    _create_admin(db, "editor@test.com", "editor")
    headers = _login(client, "editor@test.com")
    stat = FirmStat(key="years", label="Years", value="12", suffix="+")
    db.session.add(stat)
    db.session.commit()

    response = client.delete(f"/api/admin/firm-stats/{stat.id}", headers=headers)

    assert response.status_code == 403
    assert FirmStat.query.get(stat.id) is not None


def test_admin_can_delete_a_firm_stat(client, db):
    _create_admin(db, "admin@test.com", "admin")
    headers = _login(client, "admin@test.com")
    stat = FirmStat(key="years", label="Years", value="12", suffix="+")
    db.session.add(stat)
    db.session.commit()

    response = client.delete(f"/api/admin/firm-stats/{stat.id}", headers=headers)

    assert response.status_code == 204
    assert FirmStat.query.get(stat.id) is None


def test_editor_cannot_delete_a_blog_post(client, db):
    _create_admin(db, "editor2@test.com", "editor")
    headers = _login(client, "editor2@test.com")
    post = BlogPost(title="Draft", slug="draft-post", excerpt="x", content="body", status="draft")
    db.session.add(post)
    db.session.commit()

    response = client.delete(f"/api/admin/blog/posts/{post.id}", headers=headers)

    assert response.status_code == 403
    assert BlogPost.query.get(post.id) is not None


def test_admin_can_delete_a_non_published_blog_post(client, db):
    _create_admin(db, "admin2@test.com", "admin")
    headers = _login(client, "admin2@test.com")
    post = BlogPost(title="Draft", slug="draft-post-2", excerpt="x", content="body", status="draft")
    db.session.add(post)
    db.session.commit()

    response = client.delete(f"/api/admin/blog/posts/{post.id}", headers=headers)

    assert response.status_code == 204
    assert BlogPost.query.get(post.id) is None


def test_admin_still_cannot_delete_a_published_blog_post(client, db):
    """The not-published guard is independent of the role fix - confirms it
    still works after the require_role change."""
    _create_admin(db, "admin3@test.com", "admin")
    headers = _login(client, "admin3@test.com")
    post = BlogPost(title="Live", slug="live-post", excerpt="x", content="body", status="published")
    db.session.add(post)
    db.session.commit()

    response = client.delete(f"/api/admin/blog/posts/{post.id}", headers=headers)

    assert response.status_code == 422
    assert BlogPost.query.get(post.id) is not None
