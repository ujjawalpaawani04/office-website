"""Admin CRUD for Articles (Insights & Articles video showcase on the
Life@SAA page). Hand-written rather than run through the generic factory
(app/utils/admin_crud.py) because create/update are multipart uploads (a
thumbnail image + an MP4 video), not JSON - same reasoning as media_routes.py.
"""
from flask import jsonify, request

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import Article
from app.services.storage_service import delete_article_file, save_article_thumbnail, save_article_video
from app.utils.audit import record_audit_log
from app.utils.pagination import paginate_query
from app.validations.article_validator import (
    validate_article_fields,
    validate_thumbnail_content,
    validate_thumbnail_upload,
    validate_video_content,
    validate_video_upload,
)


def _serialize_article(item):
    return {
        "id": item.id,
        "title": item.title,
        "shortDescription": item.short_description,
        "thumbnail": item.thumbnail,
        "videoUrl": item.video_url,
        "displayOrder": item.display_order,
        "status": item.status,
        "createdAt": item.created_at.isoformat(),
        "updatedAt": item.updated_at.isoformat(),
    }


@admin_bp.get("/articles")
@require_role("admin", "editor")
def list_articles():
    query = Article.query
    q = (request.args.get("q") or "").strip()
    if q:
        query = query.filter(Article.title.ilike(f"%{q}%"))
    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)
    query = query.order_by(Article.display_order.asc(), Article.id.asc())
    result = paginate_query(query, request.args)
    return jsonify({**result, "items": [_serialize_article(item) for item in result["items"]]})


@admin_bp.get("/articles/<int:article_id>")
@require_role("admin", "editor")
def get_article(article_id):
    article = Article.query.get(article_id)
    if article is None:
        return jsonify({"error": "Not found."}), 404
    return jsonify(_serialize_article(article))


@admin_bp.post("/articles")
@require_role("admin", "editor")
def create_article():
    cleaned, errors = validate_article_fields(request.form, None)

    thumbnail_file, thumbnail_error = validate_thumbnail_upload(request.files.get("thumbnail"), required=True)
    if thumbnail_error:
        errors["thumbnail"] = thumbnail_error
    video_file, video_error = validate_video_upload(request.files.get("video"), required=True)
    if video_error:
        errors["video"] = video_error

    if not errors:
        _, thumb_mime_error = validate_thumbnail_content(thumbnail_file)
        if thumb_mime_error:
            errors["thumbnail"] = thumb_mime_error
        _, video_mime_error = validate_video_content(video_file)
        if video_mime_error:
            errors["video"] = video_mime_error

    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    stored_thumbnail = save_article_thumbnail(thumbnail_file)
    stored_video = save_article_video(video_file)

    article = Article(
        **cleaned,
        thumbnail=stored_thumbnail["path"],
        video_url=stored_video["path"],
    )
    db.session.add(article)
    db.session.flush()
    record_audit_log(get_current_admin().id, "create", "article", article.id, request=request)
    db.session.commit()
    return jsonify(_serialize_article(article)), 201


@admin_bp.put("/articles/<int:article_id>")
@require_role("admin", "editor")
def update_article(article_id):
    article = Article.query.get(article_id)
    if article is None:
        return jsonify({"error": "Not found."}), 404

    cleaned, errors = validate_article_fields(request.form, article)

    # Files are optional on update - omitting one keeps the existing file,
    # matching "Replace old image/video when uploading new one" (a new file
    # replaces it; no file means no change).
    thumbnail_file, thumbnail_error = validate_thumbnail_upload(request.files.get("thumbnail"), required=False)
    if thumbnail_error:
        errors["thumbnail"] = thumbnail_error
    video_file, video_error = validate_video_upload(request.files.get("video"), required=False)
    if video_error:
        errors["video"] = video_error

    if thumbnail_file is not None and "thumbnail" not in errors:
        _, thumb_mime_error = validate_thumbnail_content(thumbnail_file)
        if thumb_mime_error:
            errors["thumbnail"] = thumb_mime_error
    if video_file is not None and "video" not in errors:
        _, video_mime_error = validate_video_content(video_file)
        if video_mime_error:
            errors["video"] = video_mime_error

    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    for key, value in cleaned.items():
        setattr(article, key, value)

    old_thumbnail = None
    old_video = None
    if thumbnail_file is not None:
        old_thumbnail = article.thumbnail
        article.thumbnail = save_article_thumbnail(thumbnail_file)["path"]
    if video_file is not None:
        old_video = article.video_url
        article.video_url = save_article_video(video_file)["path"]

    record_audit_log(get_current_admin().id, "update", "article", article.id, request=request)
    db.session.commit()

    # Only remove the old files once the new row has committed successfully,
    # so a mid-request failure never leaves the DB pointing at a deleted file.
    if old_thumbnail:
        delete_article_file(old_thumbnail)
    if old_video:
        delete_article_file(old_video)

    return jsonify(_serialize_article(article))


@admin_bp.delete("/articles/<int:article_id>")
@require_role("admin")
def delete_article(article_id):
    article = Article.query.get(article_id)
    if article is None:
        return jsonify({"error": "Not found."}), 404

    admin_id = get_current_admin().id
    thumbnail, video_url = article.thumbnail, article.video_url
    record_audit_log(admin_id, "delete", "article", article.id, request=request)
    db.session.delete(article)
    db.session.commit()

    # No orphan files: both the thumbnail and the video are removed from
    # disk once the row is gone.
    delete_article_file(thumbnail)
    delete_article_file(video_url)

    return "", 204
