"""Resume storage abstraction.

`save_resume()` is the only function callers (career_service.py) should
use. Swapping to AWS S3 later means implementing `_save_to_s3()` below and
setting STORAGE_BACKEND=s3 - nothing in career_service.py, the validator,
or the route needs to change, since they only ever see the returned
{filename, path, size_bytes} shape.
"""
import os

from flask import current_app

from app.utils.file_utils import build_stored_filename


def save_resume(file_storage):
    backend = current_app.config.get("STORAGE_BACKEND", "local")
    if backend == "s3":
        return _save_to_s3(file_storage)
    return _save_to_local(file_storage)


def _save_to_local(file_storage):
    resume_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "resumes")
    os.makedirs(resume_dir, exist_ok=True)

    stored_filename = build_stored_filename(file_storage.filename)
    stored_path = os.path.join(resume_dir, stored_filename)
    file_storage.save(stored_path)

    return {
        "filename": file_storage.filename,
        "path": stored_path,
        "size_bytes": os.path.getsize(stored_path),
    }


def _save_to_s3(file_storage):  # pragma: no cover - not wired up yet
    """Placeholder for the future AWS S3 migration mentioned in the brief.

    To implement: `pip install boto3`, use the AWS_S3_BUCKET / AWS_REGION /
    AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY values already read into
    config/settings.py, upload via `boto3.client("s3").upload_fileobj(...)`,
    and return {"filename": ..., "path": <s3 key or URL>, "size_bytes": ...}
    - the same shape _save_to_local returns, so nothing upstream changes.
    """
    raise NotImplementedError(
        "S3 storage backend is not implemented yet. Set STORAGE_BACKEND=local, "
        "or implement _save_to_s3() with boto3 before setting STORAGE_BACKEND=s3."
    )
