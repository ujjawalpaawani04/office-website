"""Admin CRUD for the Media Library (Document 2 §17, Document 5 §4.3).
Hand-written rather than run through the generic factory (app/utils/
admin_crud.py) because create is a multipart upload, not JSON, and delete
must check seven other tables' *_media_id foreign keys before allowing it.
"""
from flask import current_app, jsonify, request

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import Award, BlogAuthor, BlogPost, Certification, Media, Service, TeamMember, Testimonial
from app.services.storage_service import save_media_image
from app.utils.audit import record_audit_log
from app.utils.pagination import paginate_query
from app.utils.sanitize import clean_optional
from app.validators.media_validator import validate_media_content, validate_media_upload

# Every table with a *_media_id FK pointing at media.id - checked before a
# delete is allowed, so removing an image never silently breaks a live
# team photo, award badge, etc.
_REFERENCING_MODELS = [
    (Award, "image_media_id", "award"),
    (Certification, "image_media_id", "certification"),
    (Service, "featured_image_media_id", "service"),
    (TeamMember, "photo_media_id", "team member"),
    (Testimonial, "photo_media_id", "testimonial"),
    (BlogAuthor, "avatar_media_id", "blog author"),
    (BlogPost, "featured_image_media_id", "blog post"),
]


def _serialize_media(item):
    return {
        "id": item.id,
        "filename": item.filename,
        "originalFilename": item.original_filename,
        "path": item.path,
        "mimeType": item.mime_type,
        "sizeBytes": item.size_bytes,
        "altText": item.alt_text,
        "uploadedBy": item.uploaded_by,
        "createdAt": item.created_at.isoformat(),
    }


def _find_references(media_id):
    references = []
    for model, column, label in _REFERENCING_MODELS:
        count = model.query.filter(getattr(model, column) == media_id).count()
        if count:
            references.append(f"{count} {label}{'s' if count != 1 else ''}")
    return references


@admin_bp.get("/media")
@require_role("admin", "editor")
def list_media():
    query = Media.query
    q = (request.args.get("q") or "").strip()
    if q:
        like = f"%{q}%"
        query = query.filter(db.or_(Media.original_filename.ilike(like), Media.alt_text.ilike(like)))
    query = query.order_by(Media.created_at.desc())
    result = paginate_query(query, request.args)
    return jsonify({**result, "items": [_serialize_media(item) for item in result["items"]]})


@admin_bp.post("/media")
@require_role("admin", "editor")
def upload_media():
    file_storage, error = validate_media_upload(request.files)
    if error:
        return jsonify({"error": error}), 422

    mime_type, mime_error = validate_media_content(file_storage)
    if mime_error:
        return jsonify({"error": mime_error}), 422

    stored = save_media_image(file_storage)
    admin = get_current_admin()

    media = Media(
        filename=stored["filename"],
        original_filename=file_storage.filename,
        path=stored["path"],
        mime_type=mime_type,
        size_bytes=stored["size_bytes"],
        alt_text=clean_optional(request.form.get("altText"), max_length=255),
        uploaded_by=admin.id,
    )
    db.session.add(media)
    db.session.flush()
    record_audit_log(admin.id, "create", "media", media.id, request=request)
    db.session.commit()
    return jsonify(_serialize_media(media)), 201


@admin_bp.patch("/media/<int:media_id>")
@require_role("admin", "editor")
def update_media(media_id):
    media = Media.query.get(media_id)
    if media is None:
        return jsonify({"error": "Not found."}), 404

    data = request.get_json(silent=True) or {}
    media.alt_text = clean_optional(data.get("altText"), max_length=255)
    record_audit_log(get_current_admin().id, "update", "media", media.id, request=request)
    db.session.commit()
    return jsonify(_serialize_media(media))


@admin_bp.delete("/media/<int:media_id>")
@require_role("admin", "editor")
def delete_media(media_id):
    import os

    media = Media.query.get(media_id)
    if media is None:
        return jsonify({"error": "Not found."}), 404

    references = _find_references(media_id)
    if references:
        return jsonify({"error": f"Still used by {', '.join(references)}.", "references": references}), 409

    admin_id = get_current_admin().id
    record_audit_log(admin_id, "delete", "media", media.id, request=request)
    db.session.delete(media)
    db.session.commit()

    try:
        media_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "media")
        os.remove(os.path.join(media_dir, media.filename))
    except OSError:
        pass  # DB row is already gone; a missing/already-removed file isn't a failure

    return "", 204
