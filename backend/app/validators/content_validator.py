"""Server-side validation for the simple, flat Admin content resources
registered via app/utils/admin_crud.py. Each function returns
(cleaned_data, errors) exactly like the public-facing validators, so a
malformed direct API call can never bypass these rules just because
there's no public form in front of them.
"""
import re

from app.utils.sanitize import clean_optional, clean_str

SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def _slug_error(slug):
    if not slug:
        return "Slug is required."
    if not SLUG_PATTERN.match(slug):
        return "Slug must be lowercase letters, numbers, and hyphens only."
    return None


def _unique_error(model, field, value, instance, label):
    query = model.query.filter(getattr(model, field) == value)
    if instance is not None:
        query = query.filter(model.id != instance.id)
    if query.first() is not None:
        return f"This {label} is already in use."
    return None


def validate_award(data, instance):
    title = clean_str(data.get("title"), max_length=200)
    errors = {}
    if not title:
        errors["title"] = "Title is required."
    cleaned = {
        "title": title,
        "description": clean_optional(data.get("description")),
        "year": data.get("year") or None,
        "image_media_id": data.get("imageMediaId") or None,
        "sort_order": int(data.get("sortOrder") or 0),
        "is_active": bool(data.get("isActive", True)),
    }
    return cleaned, errors


def validate_certification(data, instance):
    name = clean_str(data.get("name"), max_length=200)
    errors = {}
    if not name:
        errors["name"] = "Name is required."
    cleaned = {
        "name": name,
        "description": clean_optional(data.get("description")),
        "issuing_body": clean_optional(data.get("issuingBody"), max_length=200),
        "image_media_id": data.get("imageMediaId") or None,
        "sort_order": int(data.get("sortOrder") or 0),
        "is_active": bool(data.get("isActive", True)),
    }
    return cleaned, errors


def validate_firm_stat(data, instance):
    from app.models import FirmStat

    key = clean_str(data.get("key"), max_length=80)
    label = clean_str(data.get("label"), max_length=160)
    value = clean_str(data.get("value"), max_length=40)
    errors = {}
    if not key:
        errors["key"] = "Key is required."
    else:
        unique_error = _unique_error(FirmStat, "key", key, instance, "key")
        if unique_error:
            errors["key"] = unique_error
    if not label:
        errors["label"] = "Label is required."
    if not value:
        errors["value"] = "Value is required."

    cleaned = {
        "key": key,
        "label": label,
        "value": value,
        "suffix": clean_optional(data.get("suffix"), max_length=20),
        "icon": clean_optional(data.get("icon"), max_length=80),
        "sort_order": int(data.get("sortOrder") or 0),
        "is_active": bool(data.get("isActive", True)),
    }
    return cleaned, errors


def validate_team_member(data, instance):
    from app.models import TeamMember

    name = clean_str(data.get("name"), max_length=120)
    slug = clean_str(data.get("slug"), max_length=140).lower()
    errors = {}
    if not name:
        errors["name"] = "Name is required."
    slug_error = _slug_error(slug)
    if slug_error:
        errors["slug"] = slug_error
    elif (unique_error := _unique_error(TeamMember, "slug", slug, instance, "slug")):
        errors["slug"] = unique_error

    cleaned = {
        "name": name,
        "slug": slug,
        "designation": clean_optional(data.get("designation"), max_length=160),
        "bio": clean_optional(data.get("bio")),
        "qualifications": clean_optional(data.get("qualifications"), max_length=300),
        "photo_media_id": data.get("photoMediaId") or None,
        "email": clean_optional(data.get("email"), max_length=190),
        "linkedin_url": clean_optional(data.get("linkedinUrl"), max_length=300),
        "sort_order": int(data.get("sortOrder") or 0),
        "is_active": bool(data.get("isActive", True)),
    }
    return cleaned, errors


def validate_testimonial(data, instance):
    client_name = clean_str(data.get("clientName"), max_length=120)
    content = clean_str(data.get("content"))
    rating = data.get("rating")
    errors = {}
    if not client_name:
        errors["clientName"] = "Client name is required."
    if not content:
        errors["content"] = "Testimonial content is required."
    if rating is not None and rating != "" and not (1 <= int(rating) <= 5):
        errors["rating"] = "Rating must be between 1 and 5."

    cleaned = {
        "client_name": client_name,
        "client_designation": clean_optional(data.get("clientDesignation"), max_length=160),
        "client_company": clean_optional(data.get("clientCompany"), max_length=160),
        "content": content,
        "rating": int(rating) if rating not in (None, "") else None,
        "photo_media_id": data.get("photoMediaId") or None,
        "is_featured": bool(data.get("isFeatured", False)),
        "is_active": bool(data.get("isActive", True)),
        "sort_order": int(data.get("sortOrder") or 0),
    }
    return cleaned, errors


def validate_blog_category(data, instance):
    from app.models import BlogCategory

    name = clean_str(data.get("name"), max_length=120)
    slug = clean_str(data.get("slug"), max_length=140).lower()
    errors = {}
    if not name:
        errors["name"] = "Name is required."
    slug_error = _slug_error(slug)
    if slug_error:
        errors["slug"] = slug_error
    elif (unique_error := _unique_error(BlogCategory, "slug", slug, instance, "slug")):
        errors["slug"] = unique_error

    cleaned = {"name": name, "slug": slug, "description": clean_optional(data.get("description"))}
    return cleaned, errors


def validate_blog_tag(data, instance):
    from app.models import BlogTag

    name = clean_str(data.get("name"), max_length=80)
    slug = clean_str(data.get("slug"), max_length=100).lower()
    errors = {}
    if not name:
        errors["name"] = "Name is required."
    slug_error = _slug_error(slug)
    if slug_error:
        errors["slug"] = slug_error
    elif (unique_error := _unique_error(BlogTag, "slug", slug, instance, "slug")):
        errors["slug"] = unique_error

    cleaned = {"name": name, "slug": slug}
    return cleaned, errors


def validate_blog_author(data, instance):
    from app.models import BlogAuthor

    name = clean_str(data.get("name"), max_length=120)
    slug = clean_str(data.get("slug"), max_length=140).lower()
    errors = {}
    if not name:
        errors["name"] = "Name is required."
    slug_error = _slug_error(slug)
    if slug_error:
        errors["slug"] = slug_error
    elif (unique_error := _unique_error(BlogAuthor, "slug", slug, instance, "slug")):
        errors["slug"] = unique_error

    cleaned = {
        "name": name,
        "slug": slug,
        "designation": clean_optional(data.get("designation"), max_length=160),
        "bio": clean_optional(data.get("bio")),
        "avatar_media_id": data.get("avatarMediaId") or None,
    }
    return cleaned, errors
