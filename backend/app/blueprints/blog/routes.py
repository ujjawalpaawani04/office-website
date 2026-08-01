# Public blog read endpoints land here in Step 5.
from flask import jsonify, request
from sqlalchemy.orm import joinedload, selectinload

from app.blueprints.blog import blog_bp
from app.models import BlogCategory, BlogPost, BlogTag
from app.utils.media import bulk_fetch_media


def _eager(query):
    # Eager-loads every relationship serialize_post touches, so listing N
    # posts no longer issues 1 + 5N queries (category/author/tags/
    # key_takeaways/faqs each lazy-loaded per row) on top of the N Media
    # lookups already handled separately via bulk_fetch_media.
    return query.options(
        joinedload(BlogPost.category),
        joinedload(BlogPost.author),
        selectinload(BlogPost.tags),
        selectinload(BlogPost.key_takeaways),
        selectinload(BlogPost.faqs),
    )


def _published_posts_query():
    return _eager(BlogPost.query).filter_by(status="published").order_by(BlogPost.published_at.desc())


def serialize_post(post, media_map=None):
    if media_map is not None:
        image = media_map.get(post.featured_image_media_id)
    else:
        image = bulk_fetch_media([post.featured_image_media_id]).get(post.featured_image_media_id)
    return {
        "id": post.id,
        "slug": post.slug,
        "title": post.title,
        "category": post.category.name if post.category else None,
        "tags": [tag.name for tag in post.tags],
        "author": post.author.name if post.author else None,
        "authorRole": post.author.designation if post.author else None,
        "publishDate": post.published_at.strftime("%Y-%m-%d") if post.published_at else None,
        "readingTime": post.reading_time_minutes,
        "featuredImage": image.path if image else None,
        "summary": post.excerpt,
        "content": post.content,
        "keyTakeaways": [t.content for t in post.key_takeaways],
        "faqs": [{"question": f.question, "answer": f.answer} for f in post.faqs],
    }


def serialize_posts(posts):
    media_map = bulk_fetch_media(p.featured_image_media_id for p in posts)
    return [serialize_post(p, media_map) for p in posts]


@blog_bp.get("/posts")
def list_posts():
    posts = _published_posts_query().all()
    return jsonify(serialize_posts(posts))


@blog_bp.get("/posts/<slug>")
def get_post(slug):
    post = _eager(BlogPost.query).filter_by(slug=slug, status="published").first()
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    return jsonify(serialize_post(post))


@blog_bp.get("/posts/<slug>/related")
def get_related_posts(slug):
    post = BlogPost.query.filter_by(slug=slug, status="published").first()
    if post is None:
        return jsonify({"error": "Post not found"}), 404

    limit = request.args.get("limit", default=3, type=int)

    # Same-category posts first, then fill any remaining slots from other
    # categories - filtered in SQL now instead of loading every published
    # post into Python just to pick a handful (same end result, just not
    # O(all posts) per request).
    same_category = []
    if post.category_id is not None:
        same_category = (
            _published_posts_query()
            .filter(BlogPost.id != post.id, BlogPost.category_id == post.category_id)
            .limit(limit)
            .all()
        )

    related = same_category
    remaining = limit - len(related)
    if remaining > 0:
        exclude_ids = [post.id] + [p.id for p in related]
        related = related + (
            _published_posts_query().filter(BlogPost.id.notin_(exclude_ids)).limit(remaining).all()
        )

    return jsonify(serialize_posts(related))


@blog_bp.get("/categories")
def list_categories():
    categories = BlogCategory.query.order_by(BlogCategory.name.asc()).all()
    return jsonify([c.name for c in categories])


@blog_bp.get("/tags")
def list_tags():
    tags = BlogTag.query.order_by(BlogTag.name.asc()).all()
    return jsonify([t.name for t in tags])
