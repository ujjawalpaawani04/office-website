from app.extensions import db
from app.models.admin import TABLE_ARGS
from app.models.mixins import TimestampMixin, utcnow


class Appointment(db.Model, TimestampMixin):
    __tablename__ = "appointments"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)

    # Calendly reconciliation keys. Populated from the embed's postMessage
    # payload on free plans (see appointment_service.create_from_embed) and
    # verified/overwritten by the webhook handler once webhooks are active -
    # calendly_event_id is the stable key both paths upsert on.
    calendly_event_id = db.Column(db.String(100), nullable=True, unique=True, index=True)
    calendly_event_uri = db.Column(db.String(500), nullable=True)
    calendly_invitee_uri = db.Column(db.String(500), nullable=True)
    calendly_invitee_id = db.Column(db.String(100), nullable=True, index=True)

    client_name = db.Column(db.String(120), nullable=False)
    client_email = db.Column(db.String(190), nullable=False, index=True)
    # Nullable: rows pulled in by the manual "Sync Appointments" action
    # (source="sync", see appointment_sync_service.py) only have what
    # Calendly's API returns for an invitee, which does not include a phone
    # number - unlike the embed path, which always collects one on our own
    # page before Calendly's widget ever loads.
    client_phone = db.Column(db.String(10), nullable=True)

    event_name = db.Column(db.String(200), nullable=True)

    # Canonical instants - dashboard "today"/"upcoming" and the reminder job
    # query against these. meeting_date/meeting_time/timezone are derived,
    # display-only fields kept in sync at write time.
    starts_at = db.Column(db.DateTime(timezone=True), nullable=True, index=True)
    ends_at = db.Column(db.DateTime(timezone=True), nullable=True)
    meeting_date = db.Column(db.Date, nullable=True)
    meeting_time = db.Column(db.Time, nullable=True)
    timezone = db.Column(db.String(60), nullable=True)

    meeting_link = db.Column(db.String(500), nullable=True)

    # What the client picked when booking on Calendly - read straight off
    # the scheduled event's own `location.type` (see
    # calendly_client.map_calendly_location), never something collected on
    # our own site. Nullable because it's only known once Calendly's API has
    # actually been queried (embed backfill or sync) - a booking captured
    # from the postMessage payload alone, API disabled/unreachable, has no
    # way to know it yet.
    appointment_mode = db.Column(
        db.Enum("phone", "zoom", "in_person", "other", name="appointment_mode"),
        nullable=True,
    )
    # Free-text detail that goes with appointment_mode: the phone number for
    # "phone", the street address for "in_person". Not used for "zoom"
    # (meeting_link already has the join URL) or "other".
    location_detail = db.Column(db.String(255), nullable=True)

    status = db.Column(
        db.Enum("pending", "confirmed", "cancelled", "rescheduled", "completed", name="appointment_status"),
        nullable=False,
        default="pending",
        index=True,
    )
    source = db.Column(
        # "sync" = pulled in via the admin panel's manual "Sync Appointments"
        # action (appointment_sync_service.py) - the Calendly Free plan has
        # no webhooks, so this is how bookings made directly through
        # Calendly's own UI (not our embed) still end up in this table.
        db.Enum("embed", "webhook", "admin", "sync", name="appointment_source"),
        nullable=False,
        default="embed",
    )

    cancel_reason = db.Column(db.Text, nullable=True)
    rescheduled_to_id = db.Column(
        db.Integer, db.ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True
    )
    notes = db.Column(db.Text, nullable=True)

    reminder_24h_sent_at = db.Column(db.DateTime(timezone=True), nullable=True)
    reminder_1h_sent_at = db.Column(db.DateTime(timezone=True), nullable=True)

    rescheduled_to = db.relationship("Appointment", remote_side=[id])


class WebhookEvent(db.Model):
    __tablename__ = "webhook_events"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.BigInteger, primary_key=True)
    provider = db.Column(db.String(40), nullable=False, default="calendly")
    event_type = db.Column(db.String(80), nullable=False)
    payload = db.Column(db.JSON, nullable=True)
    signature_valid = db.Column(db.Boolean, nullable=False, default=False)

    # SHA-256 of the raw request body - a byte-identical retry from
    # Calendly's own retry policy is rejected by the unique index without
    # needing to parse the payload first.
    dedupe_key = db.Column(db.String(64), nullable=False, unique=True, index=True)

    status = db.Column(
        db.Enum("received", "processed", "failed", "duplicate", name="webhook_event_status"),
        nullable=False,
        default="received",
        index=True,
    )
    error_message = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False, index=True)
    processed_at = db.Column(db.DateTime(timezone=True), nullable=True)
