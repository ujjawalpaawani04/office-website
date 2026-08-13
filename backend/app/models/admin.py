from app.extensions import db
from app.models.mixins import BIGINT_PK, TimestampMixin, utcnow

TABLE_ARGS = {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4", "mysql_collate": "utf8mb4_unicode_ci"}


class Admin(db.Model, TimestampMixin):
    __tablename__ = "admins"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(190), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum("admin", "editor", name="admin_role"), nullable=False, default="editor")
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    last_login_at = db.Column(db.DateTime(timezone=True), nullable=True)
    photo_media_id = db.Column(db.Integer, db.ForeignKey("media.id", ondelete="SET NULL"), nullable=True)

    audit_logs = db.relationship("AuditLog", back_populates="admin", lazy="dynamic")

    @property
    def photo_url(self):
        """Resolves photo_media_id -> the Media row's servable URL. A
        property (not a relationship) so every admin-serializing route
        (login, /me, profile update, email-change) gets it for free with
        one shared implementation instead of duplicating the lookup."""
        from app.utils.media import media_url_for

        return media_url_for(self.photo_media_id)


class AuditLog(db.Model):
    __tablename__ = "audit_logs"
    # Composite index replaces a standalone entity_type index: the admin
    # panel's actual query pattern is "history for this one record"
    # (WHERE entity_type=... AND entity_id=...), and a leftmost-prefix
    # index already serves lookups by entity_type alone just as well, so
    # keeping both would just be a redundant, unused index to maintain.
    __table_args__ = (
        db.Index("ix_audit_logs_entity_type_id", "entity_type", "entity_id"),
        TABLE_ARGS,
    )

    id = db.Column(BIGINT_PK, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey("admins.id", ondelete="SET NULL"), nullable=True, index=True)
    action = db.Column(db.String(80), nullable=False)
    entity_type = db.Column(db.String(80), nullable=False)
    entity_id = db.Column(db.Integer, nullable=True)
    details = db.Column(db.JSON, nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False, index=True)

    admin = db.relationship("Admin", back_populates="audit_logs")
