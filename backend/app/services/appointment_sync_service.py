"""Business logic for the admin panel's manual "Sync Appointments" action -
the Calendly Free plan has no webhooks, so this is how bookings made
directly through Calendly's own UI (not our embed) get pulled into the
`appointments` table. A sibling write path to appointment_service.py's
create_from_embed(), not a replacement for it: both funnel into the same
table, keyed on the same calendly_event_id uniqueness.

Kept as its own module (rather than folded into appointment_service.py) so
that adding real webhook support later - a paid-plan upgrade, per
appointment_service.py's own docstrings - is a third sibling
(upsert_from_webhook()) dropped in next to these two, with no changes
needed here or in the embed path.
"""
import logging
from datetime import timedelta

from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import Appointment
from app.models.mixins import utcnow
from app.services.appointment_service import extract_id_from_uri
from app.services.calendly_client import (
    list_event_invitees,
    list_scheduled_events,
    map_calendly_location,
    parse_calendly_datetime,
)
from app.utils.audit import record_audit_log
from app.utils.sanitize import clean_optional, clean_str

logger = logging.getLogger(__name__)

# How far back/forward a sync run looks. Calendly retains full history, but
# a CA firm's admin panel only cares about recent and upcoming
# consultations - and an unbounded window would make every sync slower the
# longer the account has been in use for no practical benefit.
SYNC_LOOKBACK = timedelta(days=30)
SYNC_LOOKAHEAD = timedelta(days=180)

_STATUS_MAP = {"active": "confirmed", "canceled": "cancelled"}


def _map_status(calendly_event_status):
    return _STATUS_MAP.get(calendly_event_status, "confirmed")


def _pick_invitee(event_uri):
    """Returns the most relevant invitee resource for one event, or None if
    there isn't a usable one (e.g. everyone cancelled). Active invitees are
    preferred; a cancelled-only event is still recorded so the admin panel
    reflects its true (cancelled) status rather than being silently skipped.
    """
    invitees = list_event_invitees(event_uri)
    if not invitees:
        return None
    for invitee in invitees:
        if invitee.get("status") == "active":
            return invitee
    return invitees[0]


def _reconcile_existing(existing, event):
    """Brings an already-synced row's status in line with Calendly's own
    record of it - specifically a cancellation made directly on Calendly (by
    either party) that this row doesn't know about yet, so an admin clicking
    "Sync Appointments" sees it immediately instead of waiting for the
    background job's next tick (see calendly_sync_scheduler.py).

    Deliberately one-directional: only ever moves a row *to* "cancelled",
    never away from it, and never touches "completed" - both are judgment
    calls this action must never override (an admin who cancelled a booking
    from our own panel without also cancelling it on Calendly must not have
    that decision silently undone the next time someone clicks Sync).
    Client-submitted fields (name/email/phone/notes) are never touched
    either, same as the create path.
    """
    if existing.status in ("cancelled", "completed"):
        return False
    if event.get("status") != "canceled":
        return False

    existing.status = "cancelled"
    reason = (event.get("cancellation") or {}).get("reason")
    existing.cancel_reason = existing.cancel_reason or clean_optional(reason, max_length=1000)
    return True


def sync_appointments_from_calendly(admin_id, request):
    """Returns {"added": int, "updated": int, "skipped": int, "fetched": int}.
    Raises CalendlyApiError if Calendly itself couldn't be reached/queried -
    the route translates that into a clean error response instead of a raw
    500.

    An event whose calendly_event_id already has a row (created here in a
    previous sync, or via the embed) is reconciled via _reconcile_existing()
    rather than recreated - counted as "updated" if that changed its status,
    "skipped" (truly a no-op) otherwise.
    """
    now = utcnow()
    events = list_scheduled_events(now - SYNC_LOOKBACK, now + SYNC_LOOKAHEAD)

    added = 0
    updated = 0
    skipped = 0

    for event in events:
        event_id = extract_id_from_uri(event.get("uri"))
        if not event_id:
            continue

        existing = Appointment.query.filter_by(calendly_event_id=event_id).first()
        if existing:
            if _reconcile_existing(existing, event):
                record_audit_log(
                    admin_id=admin_id,
                    action="sync_update",
                    entity_type="appointment",
                    entity_id=existing.id,
                    details={"status": existing.status, "calendlyEventId": event_id},
                    request=request,
                )
                db.session.commit()
                updated += 1
            else:
                db.session.rollback()
                skipped += 1
            continue

        invitee = _pick_invitee(event.get("uri"))
        if invitee is None or not invitee.get("email"):
            # No invitee at all (a slot held with nobody actually booked),
            # or one with no email on record - client_email is required on
            # this table and there's nothing else usable to store either way.
            continue

        location = map_calendly_location(event.get("location"))
        starts_at = parse_calendly_datetime(event.get("start_time"))
        booked_at = parse_calendly_datetime(invitee.get("created_at"))

        appointment = Appointment(
            calendly_event_id=event_id,
            calendly_event_uri=event.get("uri"),
            calendly_invitee_uri=invitee.get("uri"),
            calendly_invitee_id=extract_id_from_uri(invitee.get("uri")),
            client_name=clean_str(invitee.get("name"), max_length=120) or "Calendly Guest",
            client_email=clean_str(invitee.get("email"), max_length=190),
            # Not backfilled from Calendly's own phone-location data: that
            # field isn't guaranteed to be a bare 10-digit number (may carry
            # a country code/formatting), which is what this column assumes
            # everywhere else it's written - location_detail below is the
            # right home for it instead, and is what the admin panel's Call
            # button actually uses for a sync-only row.
            client_phone=None,
            event_name=clean_optional(event.get("name"), max_length=200),
            starts_at=starts_at,
            ends_at=parse_calendly_datetime(event.get("end_time")),
            meeting_date=starts_at.date() if starts_at else None,
            meeting_time=starts_at.time() if starts_at else None,
            timezone=clean_optional(invitee.get("timezone"), max_length=60),
            meeting_link=clean_optional(location["meeting_link"], max_length=500),
            appointment_mode=location["mode"],
            location_detail=clean_optional(location["location_detail"], max_length=255),
            status=_map_status(event.get("status")),
            source="sync",
            # Reflects the real Calendly booking time, not "when this sync
            # happened to run" - default=utcnow on the column only applies
            # when not explicitly set, so this is an intentional override.
            created_at=booked_at or now,
        )
        db.session.add(appointment)

        try:
            db.session.flush()
            record_audit_log(
                admin_id=admin_id,
                action="sync_create",
                entity_type="appointment",
                entity_id=appointment.id,
                details={"source": "sync", "calendlyEventId": event_id},
                request=request,
            )
            db.session.commit()
            added += 1
        except IntegrityError:
            # Lost a race against another write to the same calendly_event_id
            # (e.g. the embed capturing this exact booking concurrently) -
            # the unique index is the real guard; not an error, just a skip.
            db.session.rollback()
            skipped += 1

    record_audit_log(
        admin_id=admin_id,
        action="sync",
        entity_type="appointment",
        details={"added": added, "updated": updated, "skipped": skipped, "fetched": len(events)},
        request=request,
    )
    db.session.commit()

    logger.info(
        "Calendly sync by admin %s: %d added, %d updated, %d skipped, %d fetched",
        admin_id, added, updated, skipped, len(events),
    )
    return {"added": added, "updated": updated, "skipped": skipped, "fetched": len(events)}
