"""Business logic for the Appointment Booking module.

Booking capture (this file's current scope) works without any Calendly
webhook or API access - see CalendlyEmbed/Appointment.jsx on the frontend.
When the embed fires `calendly.event_scheduled`, the frontend has already
had the visitor fill in their details on our own page (used to prefill the
embed) and sends both that data and Calendly's event/invitee URIs here.

Known limitation, by design: until a webhook subscription exists (paid
Calendly plan), the client_name/client_email/client_phone stored here are
client-submitted and unverified against Calendly's own record of the
booking. `calendly_event_id` is still a trustworthy reconciliation key (it
comes from the URI Calendly's own script embeds in the postMessage event),
so once webhooks are active, upsert_from_webhook() can correct/verify these
fields on the same row instead of creating a duplicate.
"""
import logging
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import Appointment
from app.services.calendly_client import (
    fetch_event_details,
    fetch_primary_invitee,
    get_current_user_uri,
    list_scheduled_events,
    parse_event_resource,
)
from app.utils.audit import record_audit_log

logger = logging.getLogger(__name__)

# How far back/forward the background sync job (calendly_sync_scheduler.py)
# looks each run. A day of lookback is enough to catch a same-day
# cancellation of an embed-created appointment; 90 days forward covers any
# realistic booking horizon without the window (and therefore the per-run
# API/DB cost) growing unbounded over time.
SYNC_LOOKBACK = timedelta(days=1)
SYNC_LOOKAHEAD = timedelta(days=90)


def _extract_id_from_uri(uri):
    """Calendly resource URIs end in the resource's UUID, e.g.
    https://api.calendly.com/scheduled_events/AAAAAAAA-BBBB-.../ -> the UUID."""
    if not uri:
        return None
    return uri.rstrip("/").rsplit("/", 1)[-1] or None


def _local_date_and_time(starts_at, tz_name):
    """meeting_date/meeting_time are plain Date/Time columns (no timezone of
    their own) meant to display the meeting in the invitee's own timezone,
    unlike starts_at/ends_at which are UTC instants. Splitting starts_at's
    .date()/.time() directly - i.e. without converting first - reads off the
    UTC time-of-day instead (e.g. 10:00 AM IST stored as 04:30 UTC shows as
    "04:30"), the exact bug this fixes. Falls back to UTC if tz_name is
    missing/unrecognized rather than raising - a wrong-but-consistent
    timezone beats a 500 on an otherwise-valid booking.
    """
    if starts_at is None:
        return None, None
    # MySQL DATETIME columns come back tzinfo-naive even though every value
    # written here is UTC (see app/utils/dates.py's isoformat_utc, same
    # underlying gap) - .astimezone() on a naive datetime assumes it's
    # already in the *system's local* time and converts from there, which
    # silently produces the wrong instant unless the server's local
    # timezone happens to be UTC. Stamp UTC explicitly first.
    if starts_at.tzinfo is None:
        starts_at = starts_at.replace(tzinfo=timezone.utc)
    try:
        local = starts_at.astimezone(ZoneInfo(tz_name)) if tz_name else starts_at
    except ZoneInfoNotFoundError:
        local = starts_at
    return local.date(), local.time()


def create_from_embed(cleaned_data, request):
    """Returns (appointment, created: bool). Idempotent on calendly_event_id -
    a duplicate postMessage fire (double-invoked effects, a resubmitted
    request) returns the existing row rather than creating a second one,
    satisfying the "prevent duplicate appointments" requirement without
    needing the webhook path.
    """
    calendly_event_id = _extract_id_from_uri(cleaned_data["calendly_event_uri"])
    calendly_invitee_id = _extract_id_from_uri(cleaned_data["calendly_invitee_uri"])

    existing = None
    if calendly_event_id:
        existing = Appointment.query.filter_by(calendly_event_id=calendly_event_id).first()
    if existing:
        return existing, False

    event_name = cleaned_data["event_name"]
    starts_at = cleaned_data["starts_at"]
    ends_at = cleaned_data["ends_at"]
    meeting_link = cleaned_data["meeting_link"]

    # Backfill whatever the frontend didn't send from Calendly's own API -
    # see calendly_client.py. cleaned_data wins wherever it already has a
    # value; this only fills gaps, never overwrites.
    event_details = fetch_event_details(cleaned_data["calendly_event_uri"])
    if event_details:
        event_name = event_name or event_details["name"]
        starts_at = starts_at or event_details["starts_at"]
        ends_at = ends_at or event_details["ends_at"]
        meeting_link = meeting_link or event_details["meeting_link"]

    meeting_date, meeting_time = _local_date_and_time(starts_at, cleaned_data["timezone"])

    appointment = Appointment(
        calendly_event_id=calendly_event_id,
        calendly_event_uri=cleaned_data["calendly_event_uri"],
        calendly_invitee_uri=cleaned_data["calendly_invitee_uri"],
        calendly_invitee_id=calendly_invitee_id,
        client_name=cleaned_data["name"],
        client_email=cleaned_data["email"],
        client_phone=cleaned_data["phone"],
        event_name=event_name,
        starts_at=starts_at,
        ends_at=ends_at,
        meeting_date=meeting_date,
        meeting_time=meeting_time,
        timezone=cleaned_data["timezone"],
        meeting_link=meeting_link,
        notes=cleaned_data["notes"],
        # `calendly.event_scheduled` only fires once Calendly has already
        # confirmed the booking on its end (unless the event type requires
        # host approval, not distinguishable from this payload alone) - so
        # "confirmed" reflects reality better than "pending" here. Admin
        # actions (cancel/reschedule/complete) move it on from there.
        status="confirmed",
        source="embed",
    )
    db.session.add(appointment)

    try:
        db.session.flush()  # assigns appointment.id for the audit log row below

        record_audit_log(
            admin_id=None,
            action="created",
            entity_type="appointment",
            entity_id=appointment.id,
            details={"source": "embed", "clientEmail": appointment.client_email},
            request=request,
        )
        db.session.commit()
    except IntegrityError:
        # Two `calendly.event_scheduled` fires for the same booking (double-
        # invoked effect, resubmitted request) racing past the SELECT above
        # both reach here - the unique index on calendly_event_id is the
        # real guard. Losing that race isn't an error: fall back to the row
        # the winner just inserted instead of surfacing a 500.
        db.session.rollback()
        if not calendly_event_id:
            raise
        existing = Appointment.query.filter_by(calendly_event_id=calendly_event_id).first()
        if not existing:
            raise
        return existing, False

    return appointment, True


def _upsert_from_calendly_event(event):
    """Creates or reconciles a single Appointment row from one Calendly
    scheduled_event resource returned by list_scheduled_events(). Returns
    "created", "updated", or None (nothing worth persisting - e.g. an event
    with no invitee record left to attribute it to).
    """
    calendly_event_id = _extract_id_from_uri(event.get("uri"))
    if not calendly_event_id:
        return None

    details = parse_event_resource(event)
    is_cancelled = details["status"] == "canceled"

    existing = Appointment.query.filter_by(calendly_event_id=calendly_event_id).first()

    if existing:
        # Never touch client-submitted fields (name/email/phone/notes) or an
        # admin's own status choice (e.g. "completed") - the one thing we
        # can't otherwise learn is a cancellation made directly on Calendly,
        # so that's the only status change this ever applies.
        changed = False
        if is_cancelled and existing.status != "cancelled":
            existing.status = "cancelled"
            existing.cancel_reason = existing.cancel_reason or details["cancel_reason"]
            changed = True
        if not existing.event_name and details["name"]:
            existing.event_name = details["name"]
            changed = True
        if not existing.starts_at and details["starts_at"]:
            existing.starts_at = details["starts_at"]
            existing.meeting_date, existing.meeting_time = _local_date_and_time(
                details["starts_at"], existing.timezone
            )
            changed = True
        if not existing.ends_at and details["ends_at"]:
            existing.ends_at = details["ends_at"]
            changed = True
        if not existing.meeting_link and details["meeting_link"]:
            existing.meeting_link = details["meeting_link"]
            changed = True
        return "updated" if changed else None

    # A brand-new row: this booking never reached us via the embed (booked
    # straight from a shared calendly.com link, or made directly on the
    # host's own calendar), so there's no client-submitted name/email/phone
    # to fall back to - the invitee record is the only source of truth.
    invitee = fetch_primary_invitee(event.get("uri"))
    if not invitee or not invitee.get("email"):
        return None

    meeting_date, meeting_time = _local_date_and_time(details["starts_at"], invitee.get("timezone"))

    appointment = Appointment(
        calendly_event_id=calendly_event_id,
        calendly_event_uri=event.get("uri"),
        client_name=invitee.get("name") or "Calendly Invitee",
        client_email=invitee["email"],
        client_phone=None,
        event_name=details["name"],
        starts_at=details["starts_at"],
        ends_at=details["ends_at"],
        meeting_date=meeting_date,
        meeting_time=meeting_time,
        meeting_link=details["meeting_link"],
        timezone=invitee.get("timezone"),
        status="cancelled" if is_cancelled else "confirmed",
        cancel_reason=details["cancel_reason"] if is_cancelled else None,
        source="calendly_sync",
    )
    db.session.add(appointment)
    db.session.flush()  # assigns appointment.id for the audit log row below
    record_audit_log(
        admin_id=None,
        action="created",
        entity_type="appointment",
        entity_id=appointment.id,
        details={"source": "calendly_sync", "clientEmail": appointment.client_email},
    )
    return "created"


def sync_appointments_from_calendly():
    """Pulls every scheduled event on the connected Calendly calendar into
    the appointments table, so bookings made outside our own embed (a
    shared calendly.com link, or a meeting the host booked themself) show up
    in the admin panel too - the embed's postMessage only ever tells us
    about bookings completed through our own site.

    Runs on a timer (see calendly_sync_scheduler.py); safe to call anytime -
    upserts on calendly_event_id the same way create_from_embed() does, so a
    row this run already created/updated is simply left alone (or has a
    Calendly-side cancellation applied) on the next one.
    """
    user_uri = get_current_user_uri()
    if not user_uri:
        return {"created": 0, "updated": 0, "seen": 0, "error": "no_user_uri"}

    now = datetime.now(timezone.utc)
    created = updated = seen = 0
    for event in list_scheduled_events(user_uri, now - SYNC_LOOKBACK, now + SYNC_LOOKAHEAD):
        seen += 1
        try:
            result = _upsert_from_calendly_event(event)
            db.session.commit()
        except Exception:
            # Commit per event, not once at the end: a single bad event
            # rolling back the whole session would also undo every good
            # upsert already staged earlier in this same run.
            logger.exception("Calendly sync: failed to upsert event %s", event.get("uri"))
            db.session.rollback()
            continue
        if result == "created":
            created += 1
        elif result == "updated":
            updated += 1

    return {"created": created, "updated": updated, "seen": seen}
