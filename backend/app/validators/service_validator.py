"""Server-side validation for admin service CRUD (Document 5 §4.2)."""
import re

from app.utils.sanitize import clean_optional, clean_str

SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def validate_service(data, instance):
    from app.models import Service

    name = clean_str(data.get("name"), max_length=160)
    slug = clean_str(data.get("slug"), max_length=180).lower()

    errors = {}
    if not name:
        errors["name"] = "Name is required."
    if not slug:
        errors["slug"] = "Slug is required."
    elif not SLUG_PATTERN.match(slug):
        errors["slug"] = "Slug must be lowercase letters, numbers, and hyphens only."
    else:
        query = Service.query.filter_by(slug=slug)
        if instance is not None:
            query = query.filter(Service.id != instance.id)
        if query.first() is not None:
            errors["slug"] = "This slug is already in use."

    faqs = [
        {"question": clean_str(f.get("question")), "answer": clean_str(f.get("answer"))}
        for f in (data.get("faqs") or [])
        if clean_str(f.get("question")) and clean_str(f.get("answer"))
    ]

    cleaned = {
        "name": name,
        "slug": slug,
        "short_description": clean_optional(data.get("shortDescription"), max_length=500),
        "full_description": clean_optional(data.get("fullDescription")),
        "icon": clean_optional(data.get("icon"), max_length=80),
        "featured_image_media_id": data.get("featuredImageMediaId") or None,
        "sort_order": int(data.get("sortOrder") or 0),
        "is_active": bool(data.get("isActive", True)),
        "faqs": faqs,
    }
    return cleaned, errors
