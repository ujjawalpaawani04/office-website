from datetime import datetime, timezone

from app.extensions import db


def utcnow():
    return datetime.now(timezone.utc)


def aware_utc(dt):
    """MySQL/PyMySQL hands back naive datetimes even for DateTime(timezone=True)
    columns (MySQL's DATETIME type has no tz storage) - every value this app
    writes is UTC, so a naive value read back from the DB is re-tagged as UTC
    before comparing it against utcnow() or another aware datetime in Python,
    instead of raising "can't compare offset-naive and offset-aware
    datetimes". Only needed for a genuine Python-level comparison of an
    already-fetched value - a SQLAlchemy filter expression (e.g.
    Model.query.filter(Model.created_at >= utcnow())) compares entirely on
    the database side and never hits this, since the tzinfo never survives
    the trip to MySQL either way."""
    if dt is not None and dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


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
