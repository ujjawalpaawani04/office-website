"""Covers the duplicate-submission protection added to the Contact form
(contact_service.create_enquiry) - a double-click or client retry must not
create a second row or re-send the notification email."""
from app.models import Enquiry
from app.services.contact_service import create_enquiry


class _FakeRequest:
    remote_addr = "127.0.0.1"
    headers = {}


def _payload(**overrides):
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "9876543210",
        "service": "Tax Advisory",
        "message": "Please call me back regarding GST filing.",
    }
    payload.update(overrides)
    return payload


def test_duplicate_submission_within_the_window_returns_the_existing_row(app, db):
    first, created_first = create_enquiry(_payload(), _FakeRequest())
    second, created_second = create_enquiry(_payload(), _FakeRequest())

    assert created_first is True
    assert created_second is False
    assert first.id == second.id
    assert Enquiry.query.count() == 1


def test_a_genuinely_different_message_is_not_treated_as_a_duplicate(app, db):
    create_enquiry(_payload(), _FakeRequest())

    _, created = create_enquiry(_payload(message="A completely different question about TDS."), _FakeRequest())

    assert created is True
    assert Enquiry.query.count() == 2
