"""Covers the non-blocking newsletter send (newsletter_service.
start_newsletter_campaign) - the request must return immediately with a
"sending" campaign, and polling the campaign endpoint must eventually
reflect the background thread's real result."""
import time

from app.models import Admin, NewsletterCampaign, NewsletterSubscriber
from app.services.admin_user_service import hash_password

PASSWORD = "Passw0rd!234"


def _login(client, db):
    admin = Admin(name="Test Admin", email="admin@test.com", password_hash=hash_password(PASSWORD), role="admin", is_active=True)
    db.session.add(admin)
    db.session.commit()
    response = client.post("/api/auth/login", json={"email": "admin@test.com", "password": PASSWORD})
    return {"Authorization": f"Bearer {response.get_json()['accessToken']}"}


def _wait_until_sent(client, headers, campaign_id, timeout_seconds=5):
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        response = client.get(f"/api/admin/newsletter/campaigns/{campaign_id}", headers=headers)
        body = response.get_json()
        if body["status"] != "sending":
            return body
        time.sleep(0.05)
    raise AssertionError("Campaign never left 'sending' status within the timeout")


def test_send_returns_immediately_with_a_sending_campaign(client, db):
    headers = _login(client, db)
    for i in range(3):
        db.session.add(NewsletterSubscriber(email=f"sub{i}@example.com", status="subscribed"))
    db.session.commit()

    response = client.post(
        "/api/admin/newsletter/send",
        json={"subject": "Test", "summary": "Hello subscribers"},
        headers=headers,
    )

    assert response.status_code == 202
    body = response.get_json()
    assert body["status"] == "sending"
    assert body["recipientCount"] == 3
    assert "campaignId" in body


def test_polling_reflects_the_background_thread_completing(client, db):
    headers = _login(client, db)
    for i in range(2):
        db.session.add(NewsletterSubscriber(email=f"sub{i}@example.com", status="subscribed"))
    db.session.commit()

    create = client.post(
        "/api/admin/newsletter/send",
        json={"subject": "Test", "summary": "Hello subscribers"},
        headers=headers,
    )
    campaign_id = create.get_json()["campaignId"]

    final = _wait_until_sent(client, headers, campaign_id)

    assert final["status"] == "sent"
    assert final["recipientCount"] == 2
    assert final["successCount"] + final["failureCount"] == 2

    campaign = NewsletterCampaign.query.get(campaign_id)
    assert campaign.status == "sent"


def test_unknown_campaign_id_returns_404(client, db):
    headers = _login(client, db)

    response = client.get("/api/admin/newsletter/campaigns/999999", headers=headers)

    assert response.status_code == 404
