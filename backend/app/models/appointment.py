from app.extensions import db
from app.models.admin import TABLE_ARGS
from app.models.mixins import TimestampMixin, utcnow


class Appointment(db.Model, TimestampMixin):
    """A website booking request. Calendly remains the source of truth for
    actual scheduling - this row starts as `pending_confirmation` the moment
    the client submits the form on our site, and is only flipped to
    `confirmed` once the Calendly webhook (or the client's own return from
    the Calendly handoff) proves the event was really created there. See
    app/services/appointment_service.py and the webhook receiver in
    app/blueprints/appointments/webhook_routes.py.
    """

    __tablename__ = "appointments"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    # Public-facing identifier shown to the client (never the raw integer
    # id) - short, unambiguous, safe to read out over the phone.
    appointment_id = db.Column(db.String(20), unique=True, nullable=False, index=True)

    # Populated only once Calendly confirms the booking via webhook.
    calendly_event_uri = db.Column(db.String(255), unique=True, nullable=True, index=True)
    calendly_invitee_uri = db.Column(db.String(255), unique=True, nullable=True, index=True)

    client_name = db.Column(db.String(120), nullable=False)
    mobile_number = db.Column(db.String(10), nullable=False, index=True)
    email = db.Column(db.String(190), nullable=False, index=True)
    business_name = db.Column(db.String(160), nullable=True)
    is_existing_client = db.Column(db.Boolean, nullable=False, default=False)
    alternate_contact = db.Column(db.String(10), nullable=True)

    service = db.Column(db.String(40), nullable=False, index=True)
    meeting_mode = db.Column(
        db.Enum("office", "phone", "video", name="appointment_meeting_mode"), nullable=False
    )
    appointment_date = db.Column(db.Date, nullable=False, index=True)
    appointment_time = db.Column(db.Time, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=True)

    requirement_description = db.Column(db.Text, nullable=False)
    consent_given = db.Column(db.Boolean, nullable=False, default=False)

    document_filename = db.Column(db.String(255), nullable=True)
    document_path = db.Column(db.String(500), nullable=True)
    document_mime_type = db.Column(db.String(100), nullable=True)
    document_size_bytes = db.Column(db.Integer, nullable=True)

    status = db.Column(
        db.Enum(
            "pending_confirmation", "confirmed", "cancelled", "completed", "failed",
            name="appointment_status",
        ),
        nullable=False,
        default="pending_confirmation",
        index=True,
    )

    meeting_link = db.Column(db.Text, nullable=True)
    cancel_url = db.Column(db.Text, nullable=True)
    reschedule_url = db.Column(db.Text, nullable=True)

    internal_notes = db.Column(db.Text, nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)


class WebhookEvent(db.Model):
    """Idempotency + audit log for inbound provider webhooks (Calendly
    today). `external_id` is the provider's own event id - a webhook
    delivery retried by the provider (or replayed by an attacker who
    captured a valid payload once) is a no-op the second time because of
    the unique constraint, rather than double-updating an appointment.
    """

    __tablename__ = "webhook_events"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.BigInteger, primary_key=True)
    provider = db.Column(db.String(40), nullable=False, default="calendly")
    external_id = db.Column(db.String(190), unique=True, nullable=False, index=True)
    event_type = db.Column(db.String(80), nullable=False)
    payload = db.Column(db.JSON, nullable=True)
    processed_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)
