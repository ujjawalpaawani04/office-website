"""Resume file validation helpers.

Extension and MIME sniffing are deliberately kept as two independent checks:
an attacker can rename a malicious file to ".pdf" trivially, so the
extension alone is never trusted - the actual file bytes are sniffed with
`python-magic` and checked against an allow-list too.
"""
import os
import uuid

import magic
from werkzeug.utils import secure_filename

ALLOWED_RESUME_EXTENSIONS = {".pdf", ".doc", ".docx"}
ALLOWED_RESUME_MIME_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def has_allowed_extension(filename):
    _, ext = os.path.splitext(filename or "")
    return ext.lower() in ALLOWED_RESUME_EXTENSIONS


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
