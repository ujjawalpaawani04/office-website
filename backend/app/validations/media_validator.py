"""Server-side validation for POST /api/admin/media (image upload)."""
from flask import current_app

from app.utils.file_utils import (
    has_allowed_image_extension,
    is_allowed_image_mime_type,
    sanitize_svg,
    sniff_mime_type,
)


def validate_media_upload(files):
    file_storage = files.get("file")
    if file_storage is None or file_storage.filename == "":
        return None, "Please choose an image to upload."
    if not has_allowed_image_extension(file_storage.filename):
        return None, "Image must be one of: JPG, PNG, WEBP, GIF, SVG."
    # Mirrors article_validator.py's thumbnail/video size checks - the only
    # thing standing between this and a 100MB upload otherwise is Flask's
    # global MAX_CONTENT_LENGTH (sized off the article-video limit, not this
    # one), so this endpoint needs its own explicit cap.
    max_bytes = current_app.config["UPLOAD_MAX_MB"] * 1024 * 1024
    file_storage.stream.seek(0, 2)
    size = file_storage.stream.tell()
    file_storage.stream.seek(0)
    if size > max_bytes:
        return None, f"Image must be under {current_app.config['UPLOAD_MAX_MB']}MB."
    return file_storage, None


def validate_media_content(file_storage):
    """Second pass, mirroring career_validator's résumé MIME sniff - never
    trust a file extension alone. SVGs get an extra sanitization pass here
    since, unlike a raster image, they can carry executable script."""
    mime_type = sniff_mime_type(file_storage)
    if not is_allowed_image_mime_type(mime_type):
        return None, "File content did not match an allowed image type."

    if mime_type in ("image/svg+xml", "image/svg") and not sanitize_svg(file_storage):
        return None, "This SVG file could not be safely processed."

    return mime_type, None
