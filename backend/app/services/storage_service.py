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
from urllib.parse import urlparse

from flask import current_app, request

from app.utils.file_utils import build_stored_filename


def save_resume(file_storage):
    backend = current_app.config.get("STORAGE_BACKEND", "local")
    if backend == "s3":
        # Résumés are never public (Document 5 §4.6) - uploaded without a
        # public ACL, "path" is the S3 key (not a URL), and download_resume()
        # in career_admin_routes.py fetches it through an authenticated
        # boto3 call rather than a public link.
        return _save_to_s3(file_storage, "resumes", public=False)
    return _save_to_local_resume(file_storage)


def save_media_image(file_storage):
    backend = current_app.config.get("STORAGE_BACKEND", "local")
    if backend == "s3":
        return _save_to_s3(file_storage, "media", public=True)
    return _save_to_local_media(file_storage)


def save_article_thumbnail(file_storage):
    backend = current_app.config.get("STORAGE_BACKEND", "local")
    if backend == "s3":
        return _save_to_s3(file_storage, "articles/thumbnails", public=True)
    return _save_to_local_article(file_storage, "thumbnails")


def save_article_video(file_storage):
    backend = current_app.config.get("STORAGE_BACKEND", "local")
    if backend == "s3":
        return _save_to_s3(file_storage, "articles/videos", public=True)
    return _save_to_local_article(file_storage, "videos")


def delete_article_file(relative_path):
    """Best-effort delete for a path previously returned by
    save_article_thumbnail/save_article_video (a local "/uploads/..." path,
    or - under STORAGE_BACKEND=s3 - the public S3 URL stored in its place).
    Never raises - a missing or already-removed file isn't a failure, it's
    the desired end state."""
    if not relative_path:
        return
    if current_app.config.get("STORAGE_BACKEND", "local") == "s3":
        _delete_from_s3(_s3_key_from_public_url(relative_path))
        return
    try:
        os.remove(os.path.join(current_app.config["UPLOAD_FOLDER"], relative_path.lstrip("/").removeprefix("uploads/")))
    except OSError:
        pass


def delete_resume(path_or_key):
    """Best-effort delete for a résumé path previously returned by
    save_resume() - a local absolute filesystem path, or an S3 key under
    STORAGE_BACKEND=s3. Never raises - a missing or already-removed file
    isn't a failure, it's the desired end state."""
    if not path_or_key:
        return
    if current_app.config.get("STORAGE_BACKEND", "local") == "s3":
        _delete_from_s3(path_or_key)
        return
    try:
        os.remove(path_or_key)
    except OSError:
        pass


def fetch_resume(path_or_key):
    """Returns a résumé's raw bytes for career_admin_routes.py's
    download_resume, reading the local file or fetching the S3 object via an
    authenticated boto3 call (résumés are uploaded without a public ACL, see
    save_resume() / _save_to_s3()). Returns None if the file is missing."""
    if current_app.config.get("STORAGE_BACKEND", "local") == "s3":
        try:
            obj = _s3_client().get_object(Bucket=current_app.config["AWS_S3_BUCKET"], Key=path_or_key)
            return obj["Body"].read()
        except Exception:  # noqa: BLE001 - any S3 failure (missing key, auth) means "not found" to the caller
            return None
    try:
        with open(path_or_key, "rb") as f:
            return f.read()
    except OSError:
        return None


def delete_media_file(filename):
    """Best-effort cleanup for a filename previously returned by
    save_media_image() (the "filename" field, not "path") - shared by
    media_routes.py's delete route and its upload-then-DB-write-failed
    cleanup. Never raises."""
    if not filename:
        return
    if current_app.config.get("STORAGE_BACKEND", "local") == "s3":
        _delete_from_s3(f"media/{filename}")
        return
    try:
        media_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "media")
        os.remove(os.path.join(media_dir, filename))
    except OSError:
        pass


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


def _save_to_local_article(file_storage, subfolder):
    """subfolder is "thumbnails" or "videos" (app/models/article.py). Stores
    under UPLOAD_FOLDER/articles/<subfolder>/ and returns a path relative to
    the site root ("/uploads/articles/<subfolder>/<file>") rather than an
    absolute host-prefixed URL like save_media_image - the Articles table
    stores exactly this string (per the brief: "store only the thumbnail
    path and video path"), and the frontend resolves it the same way it
    resolves "/api/..." - proxied same-origin in dev (vite.config.js),
    same-origin in production."""
    article_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "articles", subfolder)
    os.makedirs(article_dir, exist_ok=True)

    stored_filename = build_stored_filename(file_storage.filename)
    stored_path = os.path.join(article_dir, stored_filename)
    file_storage.save(stored_path)

    return {
        "filename": stored_filename,
        "path": f"/uploads/articles/{subfolder}/{stored_filename}",
        "size_bytes": os.path.getsize(stored_path),
    }


def _s3_client():
    import boto3

    return boto3.client(
        "s3",
        region_name=current_app.config["AWS_REGION"],
        aws_access_key_id=current_app.config["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=current_app.config["AWS_SECRET_ACCESS_KEY"],
    )


def _s3_public_url(key):
    bucket = current_app.config["AWS_S3_BUCKET"]
    region = current_app.config["AWS_REGION"]
    return f"https://{bucket}.s3.{region}.amazonaws.com/{key}"


def _s3_key_from_public_url(path_or_key):
    """save_article_thumbnail/save_article_video store whatever "path" this
    module returns directly on the Article row - under S3 that's the public
    URL from _s3_public_url() above, whose URL path component is exactly the
    key (bucket/region are the host), so this recovers it without a
    separate "key" column."""
    if path_or_key.startswith("http://") or path_or_key.startswith("https://"):
        return urlparse(path_or_key).path.lstrip("/")
    return path_or_key.lstrip("/")


def _delete_from_s3(key):
    if not key:
        return
    try:
        _s3_client().delete_object(Bucket=current_app.config["AWS_S3_BUCKET"], Key=key)
    except Exception:  # noqa: BLE001 - best-effort, matches the local delete helpers' contract
        pass


def _save_to_s3(file_storage, key_prefix, public):
    """Uploads to AWS_S3_BUCKET under `<key_prefix>/<stored_filename>`.

    `public` distinguishes media/article assets (need a plain <img>/<video>
    src) from résumés, which must never be reachable by a guessable URL
    (Document 5 §4.6) - callers fetch résumés back through
    download_resume() in career_admin_routes.py using the same AWS
    credentials, not a public link.

    Deliberately does NOT set an object ACL (e.g. "public-read") - AWS
    buckets created since ~April 2023 default to Block Public Access with
    ACLs disabled, and an ACL='public-read' PUT on such a bucket fails the
    upload outright. For `public=True` uploads (media/article assets), the
    bucket itself must be configured for public read via a bucket policy
    (see DEPLOYMENT.md) - that works regardless of the bucket's ACL
    settings. `public=False` (résumé) uploads rely entirely on the bucket
    already being private by default; nothing here makes it so.

    Returns the same {"filename", "path", "size_bytes"} shape the local
    _save_to_local_* functions return, so nothing upstream needs to know
    which backend is active. "path" is a public URL when public=True, or the
    bare S3 key when public=False.
    """
    bucket = current_app.config["AWS_S3_BUCKET"]
    stored_filename = build_stored_filename(file_storage.filename)
    key = f"{key_prefix}/{stored_filename}"

    file_storage.stream.seek(0, os.SEEK_END)
    size_bytes = file_storage.stream.tell()
    file_storage.stream.seek(0)

    extra_args = {}
    if file_storage.mimetype:
        extra_args["ContentType"] = file_storage.mimetype

    _s3_client().upload_fileobj(file_storage.stream, bucket, key, ExtraArgs=extra_args)

    return {
        "filename": stored_filename,
        "path": _s3_public_url(key) if public else key,
        "size_bytes": size_bytes,
    }
