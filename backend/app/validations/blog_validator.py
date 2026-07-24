"""Server-side validation for admin blog post CRUD (Document 5 §4.4)."""
import re

from app.utils.sanitize import clean_optional, clean_str

SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
VALID_STATUSES = {"draft", "published", "archived"}
WORDS_PER_MINUTE = 200


def estimate_reading_minutes(content):
    word_count = len(re.findall(r"\w+", content or ""))
    return max(1, round(word_count / WORDS_PER_MINUTE))


def validate_blog_post(data, instance):
    from app.models import BlogPost

    title = clean_str(data.get("title"), max_length=220)
    slug = clean_str(data.get("slug"), max_length=240).lower()
    content = clean_str(data.get("content"))
    status = data.get("status") or "draft"

    errors = {}
    if not title:
        errors["title"] = "Title is required."
    if not slug:
        errors["slug"] = "Slug is required."
    elif not SLUG_PATTERN.match(slug):
        errors["slug"] = "Slug must be lowercase letters, numbers, and hyphens only."
    else:
        query = BlogPost.query.filter_by(slug=slug)
        if instance is not None:
            query = query.filter(BlogPost.id != instance.id)
        if query.first() is not None:
            errors["slug"] = "This slug is already in use."
    if not content:
        errors["content"] = "Content is required."
    if status not in VALID_STATUSES:
        errors["status"] = "Status must be draft, published, or archived."

    tag_ids = data.get("tagIds") or []
    key_takeaways = [clean_str(t) for t in (data.get("keyTakeaways") or []) if clean_str(t)]
    faqs = [
        {"question": clean_str(f.get("question")), "answer": clean_str(f.get("answer"))}
        for f in (data.get("faqs") or [])
        if clean_str(f.get("question")) and clean_str(f.get("answer"))
    ]

    cleaned = {
        "title": title,
        "slug": slug,
        "excerpt": clean_optional(data.get("excerpt"), max_length=500),
        "content": content,
        "featured_image_media_id": data.get("featuredImageMediaId") or None,
        "category_id": data.get("categoryId") or None,
        "author_id": data.get("authorId") or None,
        "status": status,
        "meta_title": clean_optional(data.get("metaTitle"), max_length=220),
        "meta_description": clean_optional(data.get("metaDescription"), max_length=320),
        "reading_time_minutes": estimate_reading_minutes(content),
        "tag_ids": tag_ids,
        "key_takeaways": key_takeaways,
        "faqs": faqs,
    }
    return cleaned, errors
