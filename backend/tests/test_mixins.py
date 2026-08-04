"""Covers aware_utc() (app/models/mixins.py) - the shared helper for
comparing a DB-sourced DateTime(timezone=True) value (naive under MySQL,
since MySQL's DATETIME type has no tz storage) against another aware
datetime in Python without raising "can't compare offset-naive and
offset-aware datetimes". Used by auth_service.rotate_refresh_token, the
one place in the codebase that does a genuine Python-level comparison of an
already-fetched timestamp."""
from datetime import datetime, timezone

from app.models.mixins import aware_utc


def test_naive_datetime_gets_utc_tzinfo_attached():
    naive = datetime(2026, 1, 1, 12, 0, 0)

    result = aware_utc(naive)

    assert result.tzinfo == timezone.utc
    assert result.replace(tzinfo=None) == naive


def test_already_aware_datetime_is_returned_unchanged():
    aware = datetime(2026, 1, 1, 12, 0, 0, tzinfo=timezone.utc)

    assert aware_utc(aware) == aware


def test_none_passes_through():
    assert aware_utc(None) is None
