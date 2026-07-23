"""File storage abstraction for both résumés and Media Library images.

`save_resume()` / `save_media_image()` are the only functions callers
should use. Swapping to AWS S3 later means implementing `_save_to_s3()`
below and setting STORAGE_BACKEND=s3 - nothing upstream needs to change,
since callers only ever see the returned {filename, path, size_bytes}
shape.

Media images differ from résumés in one important way: résumés are never
publicly servable (only ever downloaded via a signed admin URL, see
Document 5 §4.6), while media images must be reachable by a plain URL so
`<img src>` on both the public site and the Admin Panel can load them.
`save_media_image()` therefore returns an absolute URL in `path`
(`request.host_url` + the static route below), not a filesystem path -
consistent with how `media.path` already works for the seed-time entries
that point at the frontend's own /public assets (e.g. "/about-images/bg1.png"),
just resolved against the backend's origin instead of the frontend's.
"""
import os

from flask import current_app, request

from app.utils.file_utils import build_stored_filename


def save_resume(file_storage):
    backend = current_app.config.get("STORAGE_BACKEND", "local")
    if backend == "s3":
        return _save_to_s3(file_storage)
    return _save_to_local_resume(file_storage)


def save_media_image(file_storage):
    backend = current_app.config.get("STORAGE_BACKEND", "local")
    if backend == "s3":
        return _save_to_s3(file_storage)
    return _save_to_local_media(file_storage)


def _save_to_local_resume(file_storage):
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


def _save_to_local_media(file_storage):
    media_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "media")
    os.makedirs(media_dir, exist_ok=True)

    stored_filename = build_stored_filename(file_storage.filename)
    stored_path = os.path.join(media_dir, stored_filename)
    file_storage.save(stored_path)

    public_url = f"{request.host_url.rstrip('/')}/media/{stored_filename}"

    return {
        "filename": stored_filename,
        "path": public_url,
        "size_bytes": os.path.getsize(stored_path),
    }


def _save_to_s3(file_storage):  # pragma: no cover - not wired up yet
    """Placeholder for the future AWS S3 migration mentioned in the brief.

    To implement: `pip install boto3`, use the AWS_S3_BUCKET / AWS_REGION /
    AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY values already read into
    config/settings.py, upload via `boto3.client("s3").upload_fileobj(...)`,
    and return {"filename": ..., "path": <s3 key or URL>, "size_bytes": ...}
    - the same shape the local functions return, so nothing upstream changes.
    """
    raise NotImplementedError(
        "S3 storage backend is not implemented yet. Set STORAGE_BACKEND=local, "
        "or implement _save_to_s3() with boto3 before setting STORAGE_BACKEND=s3."
    )
