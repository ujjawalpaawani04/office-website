"""Resume file validation helpers.

Extension and MIME sniffing are deliberately kept as two independent checks:
an attacker can rename a malicious file to ".pdf" trivially, so the
extension alone is never trusted - the actual file bytes are sniffed with
`python-magic` and checked against an allow-list too.
"""
import io
import os
import uuid
import xml.etree.ElementTree as ET

import magic
from defusedxml.ElementTree import ParseError
from defusedxml.ElementTree import fromstring as safe_fromstring
from werkzeug.utils import secure_filename

ALLOWED_RESUME_EXTENSIONS = {".pdf", ".doc", ".docx"}
ALLOWED_RESUME_MIME_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

# Media Library uploads (Document 2 §17) - same two-layer check as resumes:
# extension first (cheap, user-friendly error), then content-sniffed MIME
# (never trust the extension alone).
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
ALLOWED_IMAGE_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    # python-magic sniffs a bare "<svg ...>" with no "<?xml ...?>" prologue
    # (very common - many tools exported from Figma/Illustrator/Inkscape
    # omit it) as "image/svg" rather than "image/svg+xml". Both are treated
    # as SVG for the sanitization check below.
    "image/svg",
}


def has_allowed_extension(filename):
    _, ext = os.path.splitext(filename or "")
    return ext.lower() in ALLOWED_RESUME_EXTENSIONS


def has_allowed_image_extension(filename):
    _, ext = os.path.splitext(filename or "")
    return ext.lower() in ALLOWED_IMAGE_EXTENSIONS


def is_allowed_image_mime_type(mime_type):
    return mime_type in ALLOWED_IMAGE_MIME_TYPES


def sniff_mime_type(file_storage):
    """Reads only the first few KB - cheap even for large files - then
    rewinds the stream so the caller can still .save() it afterwards."""
    header = file_storage.stream.read(2048)
    file_storage.stream.seek(0)
    return magic.from_buffer(header, mime=True)


def is_allowed_mime_type(mime_type):
    return mime_type in ALLOWED_RESUME_MIME_TYPES


def build_stored_filename(original_filename):
    """Prefixes a UUID onto a sanitized filename so two applicants uploading
    "resume.pdf" on the same day never collide or overwrite each other."""
    return f"{uuid.uuid4().hex}-{secure_filename(original_filename)}"


def sanitize_svg(file_storage):
    """Strips <script> elements and inline event-handler/javascript: URI
    attributes from an uploaded SVG before it's ever written to disk - an
    SVG is XML, so unlike a raster image it can carry executable script
    that would run if the file is ever opened directly or embedded via
    <object>/<iframe> rather than strictly as an <img src>.

    Mutates file_storage.stream in place with the sanitized bytes on
    success. Returns False (upload should be rejected, not saved as-is) if
    the content isn't parseable as XML - defusedxml.fromstring also guards
    the parse itself against XML-bomb/entity-expansion attacks, which the
    stdlib parser alone would not.
    """
    file_storage.stream.seek(0)
    raw = file_storage.stream.read()
    file_storage.stream.seek(0)

    try:
        root = safe_fromstring(raw)
    except (ParseError, ValueError):
        return False

    parent_by_child = {child: parent for parent in root.iter() for child in parent}
    for element in list(root.iter()):
        local_tag = element.tag.rsplit("}", 1)[-1].lower()
        if local_tag == "script":
            parent = parent_by_child.get(element)
            if parent is not None:
                parent.remove(element)
            continue
        for attr, value in list(element.attrib.items()):
            local_attr = attr.rsplit("}", 1)[-1].lower()
            if local_attr.startswith("on") or "javascript:" in value.lower():
                del element.attrib[attr]

    file_storage.stream = io.BytesIO(ET.tostring(root, encoding="utf-8"))
    return True
