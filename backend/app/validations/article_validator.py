"""Server-side validation for the Articles admin module (Insights & Articles
video showcase). Two-layer file checks mirror media_validator.py/
career_validator.py: extension first (cheap, user-friendly error), then a
content-sniffed MIME check - never trust a filename alone."""
from flask import current_app

from app.utils.file_utils import (
    has_allowed_image_extension,
    has_allowed_video_extension,
    is_allowed_image_mime_type,
    is_allowed_video_mime_type,
    sniff_mime_type,
)
from app.utils.sanitize import clean_optional, clean_str

STATUS_VALUES = {"draft", "published"}


def validate_article_fields(data, instance):
    title = clean_str(data.get("title"), max_length=200)
    errors = {}
    if not title:
        errors["title"] = "Title is required."

    status = clean_str(data.get("status"), max_length=20).lower() or "draft"
    if status not in STATUS_VALUES:
        errors["status"] = "Status must be draft or published."

    display_order_raw = data.get("displayOrder")
    try:
        display_order = int(display_order_raw) if display_order_raw not in (None, "") else 0
    except (TypeError, ValueError):
        display_order = 0
        errors["displayOrder"] = "Display order must be a whole number."

    cleaned = {
        "title": title,
        "short_description": clean_optional(data.get("shortDescription"), max_length=500),
        "status": status,
        "display_order": display_order,
    }
    return cleaned, errors


def validate_thumbnail_upload(file_storage, required):
    if file_storage is None or file_storage.filename == "":
        if required:
            return None, "Please choose a thumbnail image to upload."
        return None, None
    if not has_allowed_image_extension(file_storage.filename):
        return None, "Thumbnail must be one of: JPG, PNG, WEBP, GIF."
    max_bytes = current_app.config["ARTICLE_THUMBNAIL_MAX_MB"] * 1024 * 1024
    file_storage.stream.seek(0, 2)
    size = file_storage.stream.tell()
    file_storage.stream.seek(0)
    if size > max_bytes:
        return None, f"Thumbnail must be under {current_app.config['ARTICLE_THUMBNAIL_MAX_MB']}MB."
    return file_storage, None


def validate_video_upload(file_storage, required):
    if file_storage is None or file_storage.filename == "":
        if required:
            return None, "Please choose an MP4 video to upload."
        return None, None
    if not has_allowed_video_extension(file_storage.filename):
        return None, "Video must be an MP4 file."
    max_bytes = current_app.config["ARTICLE_VIDEO_MAX_MB"] * 1024 * 1024
    file_storage.stream.seek(0, 2)
    size = file_storage.stream.tell()
    file_storage.stream.seek(0)
    if size > max_bytes:
        return None, f"Video must be under {current_app.config['ARTICLE_VIDEO_MAX_MB']}MB."
    return file_storage, None


def validate_thumbnail_content(file_storage):
    mime_type = sniff_mime_type(file_storage)
    if not is_allowed_image_mime_type(mime_type):
        return None, "Thumbnail content did not match an allowed image type."
    return mime_type, None


def validate_video_content(file_storage):
    mime_type = sniff_mime_type(file_storage)
    if not is_allowed_video_mime_type(mime_type):
        return None, "Video content did not match MP4."
    return mime_type, None
