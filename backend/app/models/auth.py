"""Server-side allowlist for refresh tokens.

Flask-JWT-Extended issues stateless JWTs, so without this table a stolen
refresh token stays valid until it expires - there is no way to revoke it.
Every refresh token's `jti` (a random UUID the library already generates
per-token) is stored here on issue and checked on every /auth/refresh call,
which is what makes logout, password-change-revokes-other-devices (see
Profile module), and theft-detection-via-reuse possible.

Column name `token_hash` matches the Database Design Document; it stores
the jti rather than a hash of the raw token, since the jti already gives
the same "never store the bearer token itself" guarantee and is what
Flask-JWT-Extended's own allowlist pattern is built around.
"""
from app.extensions import db

TABLE_ARGS = {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4", "mysql_collate": "utf8mb4_unicode_ci"}


class RefreshToken(db.Model):
    __tablename__ = "refresh_tokens"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.BigInteger, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey("admins.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = db.Column(db.String(255), nullable=False, unique=True, index=True)
    issued_at = db.Column(db.DateTime(timezone=True), nullable=False)
    expires_at = db.Column(db.DateTime(timezone=True), nullable=False, index=True)
    revoked_at = db.Column(db.DateTime(timezone=True), nullable=True)
    replaced_by_id = db.Column(
        db.BigInteger, db.ForeignKey("refresh_tokens.id", ondelete="SET NULL"), nullable=True
    )
    user_agent = db.Column(db.String(255), nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)

    admin = db.relationship("Admin")
