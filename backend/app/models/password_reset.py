"""Admin self-service password reset via emailed OTP.

One row per OTP "cycle" - `expires_at` is a single 10-minute timer that
governs both the OTP itself and the reset token issued once it's verified,
rather than two separate expiries to keep in sync. `used_at` doubles as the
row's "dead" flag: it's set both on legitimate completion (password reset)
and on invalidation (a newer OTP was requested, or `attempts` was
exhausted), so "is this row still usable" is always a single check
(`used_at IS NULL AND expires_at > now()`) instead of tracking several
independent kill conditions.
"""
from app.extensions import db
from app.models.admin import TABLE_ARGS
from app.models.mixins import BIGINT_PK, TimestampMixin


class PasswordResetOtp(db.Model, TimestampMixin):
    __tablename__ = "password_reset_otps"
    __table_args__ = TABLE_ARGS

    id = db.Column(BIGINT_PK, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey("admins.id", ondelete="CASCADE"), nullable=False, index=True)
    otp_hash = db.Column(db.String(255), nullable=False)
    # Only set once the OTP has been verified - reset-password checks this
    # hash, never otp_hash, so a verified OTP can't be replayed as a reset
    # credential and a stolen OTP alone can't complete a reset.
    reset_token_hash = db.Column(db.String(255), nullable=True)
    expires_at = db.Column(db.DateTime(timezone=True), nullable=False, index=True)
    attempts = db.Column(db.Integer, nullable=False, default=0)
    verified_at = db.Column(db.DateTime(timezone=True), nullable=True)
    used_at = db.Column(db.DateTime(timezone=True), nullable=True)

    admin = db.relationship("Admin")
