"""Self-service email change via OTP sent to the new address.

Single-step verification: unlike password reset, there's no separate
"verified, now set a new password" phase - matching the correct OTP against
this row immediately completes the change (updates Admin.email in the same
call). used_at doubles as the row's "dead" flag, set both on completion and
on invalidation (a newer request superseding it, or attempts exhausted).
"""
from app.extensions import db
from app.models.admin import TABLE_ARGS
from app.models.mixins import BIGINT_PK, TimestampMixin


class EmailChangeOtp(db.Model, TimestampMixin):
    __tablename__ = "email_change_otps"
    __table_args__ = TABLE_ARGS

    id = db.Column(BIGINT_PK, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey("admins.id", ondelete="CASCADE"), nullable=False, index=True)
    new_email = db.Column(db.String(190), nullable=False)
    otp_hash = db.Column(db.String(255), nullable=False)
    expires_at = db.Column(db.DateTime(timezone=True), nullable=False, index=True)
    attempts = db.Column(db.Integer, nullable=False, default=0)
    used_at = db.Column(db.DateTime(timezone=True), nullable=True)

    admin = db.relationship("Admin")
