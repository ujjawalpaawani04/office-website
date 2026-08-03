from datetime import datetime, timezone


def isoformat_utc(dt: datetime | None) -> str | None:
    """Serialize a stored-as-UTC datetime to ISO 8601 with an explicit UTC marker.

    MySQL DATETIME columns come back timezone-naive even though every value
    written here comes from ``utcnow()``. Without an explicit offset, the
    frontend's ``new Date(...)`` parses the naive string as local time and
    never applies the UTC -> local conversion, so times display several
    hours off depending on the viewer's timezone.
    """
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()
