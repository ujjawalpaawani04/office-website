"""Admin CRUD for blog posts (Document 5 §4.4). Hand-written rather than
the generic factory - unlike the simple resources, this one has real
business logic: child collections (tags, key takeaways, FAQs), a
draft/published/archived lifecycle that sets published_at automatically,
and a two-step delete guard (can't hard-delete a published post).
"""
from datetime import datetime, timezone

from flask import jsonify, request

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import BlogAuthor, BlogCategory, BlogFaq, BlogKeyTakeaway, BlogPost, BlogTag, Media
from app.services.newsletter_service import classify_content
from app.utils.audit import record_audit_log
from app.utils.pagination import paginate_query
from app.validators.blog_validator import validate_blog_post


def _media_url(media_id):
    if not media_id:
        return None
    media = Media.query.get(media_id)
    return media.path if media else None


def _serialize_post(post, include_children=True):
    data = {
        "id": post.id,
        "title": post.title,
        "slug": post.slug,
        "excerpt": post.excerpt,
        "content": post.content,
        "featuredImageMediaId": post.featured_image_media_id,
        "featuredImageUrl": _media_url(post.featured_image_media_id),
        "categoryId": post.category_id,
        "categoryName": post.category.name if post.category else None,
        "authorId": post.author_id,
        "authorName": post.author.name if post.author else None,
        "status": post.status,
        "publishedAt": post.published_at.isoformat() if post.published_at else None,
        "readingTimeMinutes": post.reading_time_minutes,
        "viewsCount": post.views_count,
        "metaTitle": post.meta_title,
        "metaDescription": post.meta_description,
        "createdAt": post.created_at.isoformat(),
        "updatedAt": post.updated_at.isoformat(),
    }
    if include_children:
        data["tags"] = [{"id": t.id, "name": t.name} for t in post.tags]
        data["keyTakeaways"] = [kt.content for kt in post.key_takeaways]
        data["faqs"] = [{"question": f.question, "answer": f.answer} for f in post.faqs]
    return data


def _apply_children(post, cleaned):
    post.tags = BlogTag.query.filter(BlogTag.id.in_(cleaned["tag_ids"])).all() if cleaned["tag_ids"] else []
    post.key_takeaways = [
        BlogKeyTakeaway(content=content, sort_order=i) for i, content in enumerate(cleaned["key_takeaways"])
    ]
    post.faqs = [
        BlogFaq(question=f["question"], answer=f["answer"], sort_order=i) for i, f in enumerate(cleaned["faqs"])
    ]


@admin_bp.get("/blog/posts")
@require_role("admin", "editor")
def list_blog_posts():
    query = BlogPost.query
    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)
    category_id = request.args.get("categoryId")
    if category_id:
        query = query.filter_by(category_id=category_id)
    q = (request.args.get("q") or "").strip()
    if q:
        query = query.filter(BlogPost.title.ilike(f"%{q}%"))
    query = query.order_by(BlogPost.created_at.desc())
    result = paginate_query(query, request.args)
    return jsonify({**result, "items": [_serialize_post(p, include_children=False) for p in result["items"]]})


@admin_bp.get("/blog/posts/<int:post_id>")
@require_role("admin", "editor")
def get_blog_post(post_id):
    post = BlogPost.query.get(post_id)
    if post is None:
        return jsonify({"error": "Not found."}), 404
    return jsonify(_serialize_post(post))


@admin_bp.post("/blog/posts")
@require_role("admin", "editor")
def create_blog_post():
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_blog_post(data, None)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    post = BlogPost(
        title=cleaned["title"],
        slug=cleaned["slug"],
        excerpt=cleaned["excerpt"],
        content=cleaned["content"],
        featured_image_media_id=cleaned["featured_image_media_id"],
        category_id=cleaned["category_id"],
        author_id=cleaned["author_id"],
        status=cleaned["status"],
        meta_title=cleaned["meta_title"],
        meta_description=cleaned["meta_description"],
        reading_time_minutes=cleaned["reading_time_minutes"],
    )
    if cleaned["status"] == "published":
        post.published_at = datetime.now(timezone.utc)
    _apply_children(post, cleaned)

    db.session.add(post)
    db.session.flush()
    record_audit_log(get_current_admin().id, "create", "blog_post", post.id, request=request)
    db.session.commit()

    response = _serialize_post(post)
    if post.status == "published":
        response["newsletterSuggestion"] = classify_content(post.title, post.excerpt, post.content, source_type="blog")
    return jsonify(response), 201


@admin_bp.put("/blog/posts/<int:post_id>")
@require_role("admin", "editor")
def update_blog_post(post_id):
    post = BlogPost.query.get(post_id)
    if post is None:
        return jsonify({"error": "Not found."}), 404

    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_blog_post(data, post)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    warnings = []
    if post.status == "published" and post.slug != cleaned["slug"]:
        warnings.append("Changing the slug of a published post breaks existing inbound links and search rankings.")

    was_published = post.status == "published"
    post.title = cleaned["title"]
    post.slug = cleaned["slug"]
    post.excerpt = cleaned["excerpt"]
    post.content = cleaned["content"]
    post.featured_image_media_id = cleaned["featured_image_media_id"]
    post.category_id = cleaned["category_id"]
    post.author_id = cleaned["author_id"]
    post.status = cleaned["status"]
    post.meta_title = cleaned["meta_title"]
    post.meta_description = cleaned["meta_description"]
    post.reading_time_minutes = cleaned["reading_time_minutes"]
    if cleaned["status"] == "published" and not was_published:
        post.published_at = datetime.now(timezone.utc)
    _apply_children(post, cleaned)

    record_audit_log(get_current_admin().id, "update", "blog_post", post.id, request=request)
    db.session.commit()

    response = _serialize_post(post)
    if warnings:
        response["warnings"] = warnings
    if post.status == "published":
        response["newsletterSuggestion"] = classify_content(post.title, post.excerpt, post.content, source_type="blog")
    return jsonify(response)


@admin_bp.patch("/blog/posts/<int:post_id>/status")
@require_role("admin", "editor")
def update_blog_post_status(post_id):
    post = BlogPost.query.get(post_id)
    if post is None:
        return jsonify({"error": "Not found."}), 404

    status = (request.get_json(silent=True) or {}).get("status")
    from app.validators.blog_validator import VALID_STATUSES

    if status not in VALID_STATUSES:
        return jsonify({"error": "Validation failed", "fields": {"status": "Invalid status."}}), 422

    was_published = post.status == "published"
    post.status = status
    if status == "published" and not was_published:
        post.published_at = datetime.now(timezone.utc)

    record_audit_log(get_current_admin().id, "status_change", "blog_post", post.id, {"status": status}, request=request)
    db.session.commit()

    response = _serialize_post(post)
    if post.status == "published":
        response["newsletterSuggestion"] = classify_content(post.title, post.excerpt, post.content, source_type="blog")
    return jsonify(response)


@admin_bp.delete("/blog/posts/<int:post_id>")
@require_role("admin", "editor")
def delete_blog_post(post_id):
    post = BlogPost.query.get(post_id)
    if post is None:
        return jsonify({"error": "Not found."}), 404

    if post.status == "published":
        return jsonify({"error": "Unpublish this post before deleting it."}), 422

    record_audit_log(get_current_admin().id, "delete", "blog_post", post.id, request=request)
    db.session.delete(post)
    db.session.commit()
    return "", 204


# --- lightweight lookups the post editor needs for its pickers -----------


@admin_bp.get("/blog/categories/options")
@require_role("admin", "editor")
def blog_category_options():
    categories = BlogCategory.query.order_by(BlogCategory.name.asc()).all()
    return jsonify([{"id": c.id, "name": c.name} for c in categories])


@admin_bp.get("/blog/tags/options")
@require_role("admin", "editor")
def blog_tag_options():
    tags = BlogTag.query.order_by(BlogTag.name.asc()).all()
    return jsonify([{"id": t.id, "name": t.name} for t in tags])


@admin_bp.get("/blog/authors/options")
@require_role("admin", "editor")
def blog_author_options():
    authors = BlogAuthor.query.order_by(BlogAuthor.name.asc()).all()
    return jsonify([{"id": a.id, "name": a.name} for a in authors])
