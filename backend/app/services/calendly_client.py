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


def parse_event_resource(resource):
    """Normalizes a Calendly scheduled_event resource (whether fetched singly
    or as one entry of a /scheduled_events list) into the shape callers use:
    {"name", "starts_at", "ends_at", "meeting_link", "status", "cancel_reason"}.
    """
    location = resource.get("location") or {}
    cancellation = resource.get("cancellation") or {}
    return {
        "name": resource.get("name"),
        "starts_at": _parse_calendly_datetime(resource.get("start_time")),
        "ends_at": _parse_calendly_datetime(resource.get("end_time")),
        "meeting_link": location.get("join_url") or location.get("location"),
        "status": resource.get("status"),
        "cancel_reason": cancellation.get("reason"),
    }


def _api_get(path_or_url, params=None):
    """GET against either a full Calendly resource URL or a path relative to
    CALENDLY_API_BASE_URL. Returns the parsed JSON body, or None on any
    failure - a missing token, a disabled flag, a timeout, or a non-2xx
    response all just return None so a Calendly outage never blocks booking
    capture or the background sync job."""
    if not current_app.config.get("CALENDLY_API_ENABLED"):
        return None
    token = current_app.config.get("CALENDLY_ACCESS_TOKEN")
    if not token:
        return None

    url = path_or_url if path_or_url.startswith("http") else f"{current_app.config['CALENDLY_API_BASE_URL']}{path_or_url}"
    try:
        response = requests.get(
            url, headers={"Authorization": f"Bearer {token}"}, params=params, timeout=REQUEST_TIMEOUT_SECONDS
        )
        response.raise_for_status()
        return response.json()
    except (requests.RequestException, ValueError):
        logger.warning("Calendly API GET failed for %s", url, exc_info=True)
        return None


def fetch_event_details(event_uri):
    """Returns {"name", "starts_at", "ends_at", "meeting_link", "status",
    "cancel_reason"} or None.

    None covers every "can't/shouldn't fetch" case alike (disabled, no
    token, no URI, request failure) - callers treat all of them the same
    way: fall back to whatever the frontend already sent.
    """
    if not event_uri:
        return None
    body = _api_get(event_uri)
    if not body:
        return None
    return parse_event_resource(body.get("resource") or {})


def get_current_user_uri():
    """Returns the URI of the account CALENDLY_ACCESS_TOKEN belongs to, or
    None. Used to scope the scheduled-events sync to this user's calendar."""
    body = _api_get("/users/me")
    if not body:
        return None
    return (body.get("resource") or {}).get("uri")


def list_scheduled_events(user_uri, min_start_time, max_start_time):
    """Yields every scheduled_event resource (active or canceled) for
    `user_uri` starting in [min_start_time, max_start_time], across as many
    pages as Calendly reports. Best-effort: a failure on any page just stops
    the generator early rather than raising - the sync job treats a partial
    result as "try again next run", never as a hard error.
    """
    params = {
        "user": user_uri,
        "min_start_time": min_start_time.isoformat(),
        "max_start_time": max_start_time.isoformat(),
        "count": 100,
        "sort": "start_time:asc",
    }
    next_url = None
    while True:
        body = _api_get(next_url or "/scheduled_events", None if next_url else params)
        if not body:
            return
        for event in body.get("collection") or []:
            yield event
        next_url = (body.get("pagination") or {}).get("next_page")
        if not next_url:
            return


def fetch_primary_invitee(event_uri):
    """Returns {"name", "email", "timezone"} for the first invitee on
    `event_uri`, or None. Calendly's own invitee record has no phone field
    here (our event type has no custom "phone" question) - only
    name/email/timezone are ever available for bookings the sync job pulls
    in that didn't go through our site's own pre-form.
    """
    body = _api_get(f"{event_uri}/invitees")
    if not body:
        return None
    invitees = body.get("collection") or []
    if not invitees:
        return None
    invitee = invitees[0]
    return {"name": invitee.get("name"), "email": invitee.get("email"), "timezone": invitee.get("timezone")}
