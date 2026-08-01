"""Thin wrapper around Calendly's REST API v2.

IMPORTANT - verify against Calendly's current API docs before relying on
this in production: this module is written from Calendly's documented API
shape, but has not been exercised against a live Calendly account (no
credentials were available while building it). Endpoint paths and the
webhook signature scheme below were correct at time of writing; Calendly
can and does change API details, so confirm at
https://developer.calendly.com/api-docs before your first real deployment.

What Calendly's public API can and cannot do (this matters a lot for how
the rest of the appointments feature is built):
  - CAN: read event types, read real availability for an event type
    (`event_type_available_times`), read/verify webhook events.
  - CANNOT: create a booking/invitee directly. There is no
    "POST /scheduled_events" or similar. The only way an appointment is
    actually created in Calendly is through Calendly's own hosted
    scheduling page - see frontend CalendlyHandoff.jsx, which opens that
    page (pre-filled with the client's name/email) as the final step after
    everything else has been collected on our own site.

CALENDLY_ACCESS_TOKEN never leaves this backend process - it is read from
config only inside this module and attached as a bearer token on outgoing
requests to api.calendly.com; nothing in this file (or its callers) should
ever put it in a Flask response.
"""
import hashlib
import hmac
import logging
import time
from datetime import datetime, timedelta, timezone

import requests
from flask import current_app

logger = logging.getLogger(__name__)

REQUEST_TIMEOUT_SECONDS = 8


class CalendlyApiError(Exception):
    """Raised for any non-2xx response or network failure talking to
    Calendly, so callers can turn it into one clean "service unavailable"
    response instead of leaking a raw traceback."""


def _headers():
    token = current_app.config.get("CALENDLY_ACCESS_TOKEN")
    if not token:
        raise CalendlyApiError("CALENDLY_ACCESS_TOKEN is not configured.")
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def _get(path_or_url, params=None):
    base = current_app.config["CALENDLY_API_BASE"]
    url = path_or_url if path_or_url.startswith("http") else f"{base}{path_or_url}"
    try:
        response = requests.get(url, headers=_headers(), params=params, timeout=REQUEST_TIMEOUT_SECONDS)
    except requests.RequestException as exc:
        logger.error("Calendly API request failed: %s", exc)
        raise CalendlyApiError("Could not reach Calendly.") from exc

    if response.status_code >= 400:
        logger.error("Calendly API error %s: %s", response.status_code, response.text[:500])
        raise CalendlyApiError(f"Calendly API returned {response.status_code}.")

    return response.json()


def get_event_type(event_type_uri):
    """GET the full event type resource (name, duration, scheduling_url,
    active locations) - used to show real duration and to hand the public
    `scheduling_url` (not a secret) to the frontend for the final handoff."""
    data = _get(event_type_uri)
    return data.get("resource", data)


def get_available_times(event_type_uri, day):
    """Real availability for a single calendar day, straight from Calendly.

    Calendly's `event_type_available_times` endpoint caps the requested
    range (documented max is 7 days) - a single day per call keeps this
    comfortably under that limit and matches "only fetch what the user is
    looking at" rather than pulling a whole month per request.

    Returns a list of {"startTime": iso8601, "schedulingUrl": str} for
    slots Calendly reports as available. An empty list means either the
    day is fully booked or outside the event type's configured working
    hours - Calendly's API does not distinguish the two, so neither does
    this function (see appointments/routes.py for how that's surfaced).
    """
    start = datetime.combine(day, datetime.min.time(), tzinfo=timezone.utc)
    end = start + timedelta(days=1)
    data = _get(
        "/event_type_available_times",
        params={
            "event_type": event_type_uri,
            "start_time": start.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
            "end_time": end.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
        },
    )
    slots = []
    for item in data.get("collection", []):
        if item.get("status") != "available":
            continue
        slots.append({"startTime": item["start_time"], "schedulingUrl": item.get("scheduling_url")})
    return slots


def get_available_days(event_type_uri, start_day, end_day):
    """Per-day slot counts for a date range, chunked into <=7-day Calendly
    calls (its documented max range) - e.g. a 31-day month view costs at
    most 5 real API calls, not one per day. Used to colour the calendar's
    available/unavailable states without a request per date.
    """
    from collections import defaultdict

    counts = defaultdict(int)
    chunk_start = start_day
    while chunk_start <= end_day:
        chunk_end = min(chunk_start + timedelta(days=6), end_day)
        start_dt = datetime.combine(chunk_start, datetime.min.time(), tzinfo=timezone.utc)
        end_dt = datetime.combine(chunk_end, datetime.min.time(), tzinfo=timezone.utc) + timedelta(days=1)
        data = _get(
            "/event_type_available_times",
            params={
                "event_type": event_type_uri,
                "start_time": start_dt.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                "end_time": end_dt.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
            },
        )
        for item in data.get("collection", []):
            if item.get("status") != "available":
                continue
            day_key = item["start_time"][:10]
            counts[day_key] += 1
        chunk_start = chunk_end + timedelta(days=1)
    return counts


def is_slot_still_available(event_type_uri, day, iso_start_time):
    """Re-checks one specific slot immediately before we hand off to
    Calendly, so a slot someone else took between the client loading the
    page and clicking Confirm doesn't get silently offered as if it were
    still open (see appointments/routes.py's create endpoint)."""
    slots = get_available_times(event_type_uri, day)
    return any(slot["startTime"] == iso_start_time for slot in slots)


def verify_webhook_signature(raw_body, signature_header, signing_key):
    """Validates Calendly's `Calendly-Webhook-Signature` header, format
    `t=<unix timestamp>,v1=<hex hmac-sha256>`, signed content `f"{t}.{raw_body}"`.
    Rejects payloads older than 5 minutes to limit replay-attack exposure.
    Returns True only if both the signature and the timestamp check out.
    """
    if not signing_key or not signature_header:
        return False

    parts = dict(p.split("=", 1) for p in signature_header.split(",") if "=" in p)
    timestamp, signature = parts.get("t"), parts.get("v1")
    if not timestamp or not signature:
        return False

    try:
        if abs(time.time() - int(timestamp)) > 300:
            return False
    except ValueError:
        return False

    signed_payload = f"{timestamp}.{raw_body.decode('utf-8') if isinstance(raw_body, bytes) else raw_body}"
    expected = hmac.new(signing_key.encode("utf-8"), signed_payload.encode("utf-8"), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)
