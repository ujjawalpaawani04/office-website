import secrets

from app.extensions import db
from app.models.admin import TABLE_ARGS
from app.models.mixins import TimestampMixin, utcnow


class NewsletterSubscriber(db.Model, TimestampMixin):
    __tablename__ = "newsletter_subscribers"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(190), unique=True, nullable=False, index=True)
    status = db.Column(
        db.Enum("subscribed", "unsubscribed", name="newsletter_status"),
        nullable=False,
        default="subscribed",
    )
    ip_address = db.Column(db.String(45), nullable=True)
    subscribed_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)
    unsubscribed_at = db.Column(db.DateTime(timezone=True), nullable=True)
    # Unguessable per-subscriber secret used to authorize the public unsubscribe
    # link embedded in every campaign email - generated with `secrets` (not
    # uuid4/random) so it can't be predicted or brute-forced.
    unsubscribe_token = db.Column(
        db.String(64), unique=True, nullable=False, index=True, default=lambda: secrets.token_urlsafe(32)
    )


class NewsletterCampaign(db.Model):
    """One row per admin-triggered newsletter send (Document 5-style audit
    trail for Step 4's Smart Newsletter Recommendation). Deliberately an
    insert-only log like AuditLog - aggregate counts only, no per-recipient
    row, since there's no delivery-tracking infrastructure to back one."""

    __tablename__ = "newsletter_campaigns"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.BigInteger, primary_key=True)
    subject = db.Column(db.String(255), nullable=False)
    summary = db.Column(db.Text, nullable=False)
    cta_url = db.Column(db.String(500), nullable=True)
    cta_label = db.Column(db.String(80), nullable=True)
    source_type = db.Column(db.String(40), nullable=True)
    source_id = db.Column(db.Integer, nullable=True)
    sent_by_admin_id = db.Column(db.Integer, db.ForeignKey("admins.id", ondelete="SET NULL"), nullable=True, index=True)
    recipient_count = db.Column(db.Integer, nullable=False, default=0)
    success_count = db.Column(db.Integer, nullable=False, default=0)
    failure_count = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False, index=True)
