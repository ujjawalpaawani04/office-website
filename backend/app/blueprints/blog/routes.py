# Public blog read endpoints land here in Step 5.
from flask import jsonify, request

from app.blueprints.blog import blog_bp
from app.models import BlogCategory, BlogPost, BlogTag, Media


def serialize_post(post):
    image = Media.query.get(post.featured_image_media_id) if post.featured_image_media_id else None
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


def _published_posts_query():
    return BlogPost.query.filter_by(status="published").order_by(BlogPost.published_at.desc())


@blog_bp.get("/posts")
def list_posts():
    posts = _published_posts_query().all()
    return jsonify([serialize_post(p) for p in posts])


@blog_bp.get("/posts/<slug>")
def get_post(slug):
    post = BlogPost.query.filter_by(slug=slug, status="published").first()
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    return jsonify(serialize_post(post))


@blog_bp.get("/posts/<slug>/related")
def get_related_posts(slug):
    post = BlogPost.query.filter_by(slug=slug, status="published").first()
    if post is None:
        return jsonify({"error": "Post not found"}), 404

    limit = request.args.get("limit", default=3, type=int)
    others = [p for p in _published_posts_query().all() if p.slug != slug]
    same_category = [p for p in others if p.category_id == post.category_id]
    different_category = [p for p in others if p.category_id != post.category_id]
    related = (same_category + different_category)[:limit]
    return jsonify([serialize_post(p) for p in related])


@blog_bp.get("/categories")
def list_categories():
    categories = BlogCategory.query.order_by(BlogCategory.name.asc()).all()
    return jsonify([c.name for c in categories])


@blog_bp.get("/tags")
def list_tags():
    tags = BlogTag.query.order_by(BlogTag.name.asc()).all()
    return jsonify([t.name for t in tags])
