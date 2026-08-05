"""Thin read-only client for Calendly's REST API.

The free-plan embed's `calendly.event_scheduled` postMessage only guarantees
event/invitee URIs (see appointment_service.py) - no event name, start/end
time, or meeting link. Calendly's GET endpoints work with just a Personal
Access Token on any plan (unlike webhook subscriptions, which need a paid
plan), so this fills those columns in right after booking capture instead of
leaving them empty until an admin backfills them by hand.

`fetch_event_details()` is best-effort by design: a missing token, a
disabled flag, a timeout, or a non-2xx response all just return None,
because a Calendly outage must never block booking capture - the row still
saves with the URIs it already has.

`list_scheduled_events()` / `list_event_invitees()` back the admin panel's
manual "Sync Appointments" action instead (appointment_sync_service.py) -
an admin-initiated action, not something running on every page load, so
those raise CalendlyApiError on failure rather than swallowing it, letting
the route surface a real error instead of silently reporting "0 synced".
"""
import logging
from datetime import datetime

import requests
from flask import current_app

logger = logging.getLogger(__name__)

REQUEST_TIMEOUT_SECONDS = 5
LIST_PAGE_SIZE = 100


class CalendlyApiError(Exception):
    """Raised by the list_* functions (used by the manual sync action) when
    Calendly can't be reached or the account isn't configured for API
    access - unlike fetch_event_details(), which swallows the same failures
    because it must never block booking capture."""


def parse_calendly_datetime(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None


# Calendly's own location.type values, grouped into the three modes the
# admin panel highlights - anything not listed here (Google Meet, MS Teams,
# GoToMeeting, a custom/free-text location, or unresolved) falls back to
# "other" so a future change to the account's Calendly location settings can
# never produce a mode this app doesn't understand.
_PHONE_LOCATION_TYPES = {"outbound_call", "inbound_call"}
_ZOOM_LOCATION_TYPES = {"zoom"}
_IN_PERSON_LOCATION_TYPES = {"physical"}


def map_calendly_location(location):
    """Returns {"mode", "location_detail", "meeting_link"} for one Calendly
    scheduled event's `location` object - the single place both write paths
    (appointment_service.create_from_embed via fetch_event_details, and
    appointment_sync_service) turn Calendly's raw location shape into the
    three columns the admin panel actually renders.
    """
    location = location or {}
    location_type = location.get("type")

    if location_type in _PHONE_LOCATION_TYPES:
        return {"mode": "phone", "location_detail": location.get("location"), "meeting_link": None}
    if location_type in _IN_PERSON_LOCATION_TYPES:
        return {"mode": "in_person", "location_detail": location.get("location"), "meeting_link": None}
    if location_type in _ZOOM_LOCATION_TYPES:
        return {"mode": "zoom", "location_detail": None, "meeting_link": location.get("join_url")}
    # "other" covers every other conferencing type Calendly supports (Google
    # Meet, MS Teams, GoToMeeting, a custom pasted link) - still worth
    # keeping whatever join link/location it has, just without one of the
    # three highlighted actions.
    return {
        "mode": "other" if location_type else None,
        "location_detail": None,
        "meeting_link": location.get("join_url") or location.get("location"),
    }


def fetch_event_details(event_uri):
    """Returns {"name", "starts_at", "ends_at", "meeting_link",
    "appointment_mode", "location_detail"} or None.

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

    location = map_calendly_location(resource.get("location"))
    return {
        "name": resource.get("name"),
        "starts_at": parse_calendly_datetime(resource.get("start_time")),
        "ends_at": parse_calendly_datetime(resource.get("end_time")),
        "meeting_link": location["meeting_link"],
        "appointment_mode": location["mode"],
        "location_detail": location["location_detail"],
    }


def _require_config():
    """Returns (token, base_url). Raises CalendlyApiError if the list_*
    functions (manual sync) can't run at all - distinct from
    fetch_event_details()'s silent None, since a user explicitly clicked
    "Sync Appointments" and expects to know why nothing happened."""
    if not current_app.config.get("CALENDLY_API_ENABLED"):
        raise CalendlyApiError("Calendly API access is not enabled (set CALENDLY_API_ENABLED=true).")
    token = current_app.config.get("CALENDLY_ACCESS_TOKEN")
    if not token:
        raise CalendlyApiError("CALENDLY_ACCESS_TOKEN is not configured.")
    return token, current_app.config.get("CALENDLY_API_BASE_URL", "https://api.calendly.com")


def _auth_get(url, token, params=None):
    try:
        response = requests.get(
            url,
            headers={"Authorization": f"Bearer {token}"},
            params=params,
            timeout=REQUEST_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        return response.json()
    except (requests.RequestException, ValueError) as exc:
        logger.warning("Calendly API request failed for %s", url, exc_info=True)
        raise CalendlyApiError(f"Calendly API request failed: {exc}") from exc


def get_organization_uri():
    """Returns the configured CALENDLY_ORG_URI, or resolves it from the
    token's own account via GET /users/me if unset - a Personal Access
    Token belongs to exactly one user/organization, so this only needs to
    happen once per sync run, not be pre-configured."""
    configured = current_app.config.get("CALENDLY_ORG_URI")
    if configured:
        return configured

    token, base_url = _require_config()
    data = _auth_get(f"{base_url}/users/me", token)
    org_uri = (data.get("resource") or {}).get("current_organization")
    if not org_uri:
        raise CalendlyApiError("Could not resolve the Calendly organization for this access token.")
    return org_uri


def list_scheduled_events(min_start_time, max_start_time):
    """Returns every scheduled event (any invitee status) in the given
    window, newest first, following Calendly's cursor pagination until
    exhausted. Raises CalendlyApiError on any failure - see _require_config.
    """
    token, base_url = _require_config()
    organization_uri = get_organization_uri()

    events = []
    url = f"{base_url}/scheduled_events"
    params = {
        "organization": organization_uri,
        "min_start_time": min_start_time.isoformat(),
        "max_start_time": max_start_time.isoformat(),
        "count": LIST_PAGE_SIZE,
        "sort": "start_time:desc",
    }
    while url:
        data = _auth_get(url, token, params=params)
        events.extend(data.get("collection") or [])
        url = (data.get("pagination") or {}).get("next_page")
        params = None  # next_page is already a fully-qualified URL with its own query string
    return events


def list_event_invitees(event_uri):
    """Returns every invitee (any status) for one scheduled event, following
    pagination the same way as list_scheduled_events(). Almost always a
    single-item list for a 1:1 consultation booking, but group event types
    can have more."""
    token, _base_url = _require_config()

    invitees = []
    url = f"{event_uri}/invitees"
    params = {"count": LIST_PAGE_SIZE}
    while url:
        data = _auth_get(url, token, params=params)
        invitees.extend(data.get("collection") or [])
        url = (data.get("pagination") or {}).get("next_page")
        params = None
    return invitees
