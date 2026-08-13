"""Shared helper for batch-resolving Media rows referenced by a list of
items - replaces the one-query-per-row Media.query.get() pattern that was
previously duplicated across the blog/team/testimonials/services blueprints.
"""
from app.models import Media


def bulk_fetch_media(media_ids):
    """Returns {media_id: Media} for every non-empty id in media_ids,
    fetched in a single query instead of one per id."""
    ids = {mid for mid in media_ids if mid}
    if not ids:
        return {}
    return {m.id: m for m in Media.query.filter(Media.id.in_(ids)).all()}


def media_url_for(media_id):
    """Single-item counterpart to bulk_fetch_media(), for call sites that
    only ever resolve one id (e.g. the current admin's own photo)."""
    if not media_id:
        return None
    media = Media.query.get(media_id)
    return media.path if media else None
