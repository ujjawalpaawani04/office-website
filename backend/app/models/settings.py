from app.extensions import db
from app.models.admin import TABLE_ARGS
from app.models.mixins import utcnow


class SiteSetting(db.Model):
    __tablename__ = "site_settings"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(120), unique=True, nullable=False, index=True)
    value = db.Column(db.Text, nullable=True)
    value_type = db.Column(
        db.Enum("string", "number", "boolean", "json", name="setting_value_type"),
        nullable=False,
        default="string",
    )
    updated_at = db.Column(db.DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)
