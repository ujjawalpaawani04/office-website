"""Thin read-only client for Calendly's REST API.

The free-plan embed's `calendly.event_scheduled` postMessage only guarantees
event/invitee URIs (see appointment_service.py) - no event name, start/end
time, or meeting link. Calendly's GET endpoints work with just a Personal
Access Token on any plan (unlike webhook subscriptions, which need a paid
plan), so this fills those columns in right after booking capture instead of
leaving them empty until an admin backfills them by hand.

Every call is best-effort: a missing token, a disabled flag, a timeout, or a
non-2xx response all just return None. A Calendly outage must never block
booking capture - the row still saves with the URIs it already has.
"""
import logging
from datetime import datetime

import requests
from flask import current_app

logger = logging.getLogger(__name__)

REQUEST_TIMEOUT_SECONDS = 5


def _parse_calendly_datetime(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None


def fetch_event_details(event_uri):
    """Returns {"name", "starts_at", "ends_at", "meeting_link"} or None.

    None covers every "can't/shouldn't fetch" case alike (disabled, no
    token, no URI, request failure) - callers treat all of them the same
    way: fall back to whatever the frontend already sent.
    """
    if not current_app.config.get("CALENDLY_API_ENABLED"):
        return None

    token = current_app.config.get("CALENDLY_ACCESS_TOKEN")
    if not token or not event_uri:
        return None

    try:
        response = requests.get(
            event_uri,
            headers={"Authorization": f"Bearer {token}"},
            timeout=REQUEST_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        resource = response.json().get("resource") or {}
    except (requests.RequestException, ValueError):
        logger.warning("Calendly event fetch failed for %s", event_uri, exc_info=True)
        return None

    location = resource.get("location") or {}
    return {
        "name": resource.get("name"),
        "starts_at": _parse_calendly_datetime(resource.get("start_time")),
        "ends_at": _parse_calendly_datetime(resource.get("end_time")),
        "meeting_link": location.get("join_url") or location.get("location"),
    }
