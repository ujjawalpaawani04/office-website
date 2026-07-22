"""Server-side validation for POST /api/admin/media (image upload)."""
from app.utils.file_utils import has_allowed_image_extension, is_allowed_image_mime_type, sniff_mime_type


def validate_media_upload(files):
    file_storage = files.get("file")
    if file_storage is None or file_storage.filename == "":
        return None, "Please choose an image to upload."
    if not has_allowed_image_extension(file_storage.filename):
        return None, "Image must be one of: JPG, PNG, WEBP, GIF, SVG."
    return file_storage, None


def validate_media_content(file_storage):
    """Second pass, mirroring career_validator's résumé MIME sniff - never
    trust a file extension alone."""
    mime_type = sniff_mime_type(file_storage)
    if not is_allowed_image_mime_type(mime_type):
        return None, "File content did not match an allowed image type."
    return mime_type, None
