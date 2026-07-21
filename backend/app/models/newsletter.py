from app.extensions import db
from app.models.admin import TABLE_ARGS
from app.models.mixins import utcnow


class NewsletterSubscriber(db.Model):
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
