from datetime import datetime, timezone

from app.extensions import db


def utcnow():
    return datetime.now(timezone.utc)


# SQLite only auto-generates a primary key for a column declared as exactly
# INTEGER PRIMARY KEY (its ROWID alias) - a BigInteger PK silently fails to
# auto-increment under SQLite, even though it's the correct, intended type
# for MySQL's BIGINT AUTO_INCREMENT in production (used for high-volume
# append-only tables like audit_logs). This variant keeps the real MySQL
# column type unchanged and only swaps to a plain Integer when the dialect
# is SQLite, so the test suite (which runs against SQLite) can actually
# insert rows into these tables.
BIGINT_PK = db.BigInteger().with_variant(db.Integer, "sqlite")


class TimestampMixin:
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )
