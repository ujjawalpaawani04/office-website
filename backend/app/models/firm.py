from app.extensions import db
from app.models.admin import TABLE_ARGS
from app.models.mixins import TimestampMixin


class Award(db.Model, TimestampMixin):
    __tablename__ = "awards"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    year = db.Column(db.SmallInteger, nullable=True)
    image_media_id = db.Column(db.Integer, db.ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)
    is_active = db.Column(db.Boolean, nullable=False, default=True, index=True)


class Certification(db.Model, TimestampMixin):
    __tablename__ = "certifications"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    issuing_body = db.Column(db.String(200), nullable=True)
    image_media_id = db.Column(db.Integer, db.ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)
    is_active = db.Column(db.Boolean, nullable=False, default=True, index=True)


class FirmStat(db.Model, TimestampMixin):
    """Single source of truth for firm-wide figures (e.g. years of experience,
    clients served) so the frontend never shows conflicting numbers again."""

    __tablename__ = "firm_stats"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(80), unique=True, nullable=False, index=True)
    label = db.Column(db.String(160), nullable=False)
    value = db.Column(db.String(40), nullable=False)
    suffix = db.Column(db.String(20), nullable=True)
    icon = db.Column(db.String(80), nullable=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)
    is_active = db.Column(db.Boolean, nullable=False, default=True, index=True)
