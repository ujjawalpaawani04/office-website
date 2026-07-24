"""Server-side validation for admin job-opening CRUD (Document 5 §4.2)."""
import re

from app.utils.sanitize import clean_optional, clean_str

SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
VALID_EMPLOYMENT_TYPES = {"full_time", "part_time", "internship", "contract"}


def validate_job_opening(data, instance):
    from app.models import JobOpening

    title = clean_str(data.get("title"), max_length=160)
    slug = clean_str(data.get("slug"), max_length=180).lower()
    description = clean_str(data.get("description"))
    employment_type = data.get("employmentType") or "full_time"

    errors = {}
    if not title:
        errors["title"] = "Title is required."
    if not slug:
        errors["slug"] = "Slug is required."
    elif not SLUG_PATTERN.match(slug):
        errors["slug"] = "Slug must be lowercase letters, numbers, and hyphens only."
    else:
        query = JobOpening.query.filter_by(slug=slug)
        if instance is not None:
            query = query.filter(JobOpening.id != instance.id)
        if query.first() is not None:
            errors["slug"] = "This slug is already in use."
    if not description:
        errors["description"] = "Description is required."
    if employment_type not in VALID_EMPLOYMENT_TYPES:
        errors["employmentType"] = "Invalid employment type."

    min_experience = data.get("minExperienceYears")
    cleaned = {
        "title": title,
        "slug": slug,
        "department": clean_optional(data.get("department"), max_length=120),
        "location": clean_optional(data.get("location"), max_length=120),
        "employment_type": employment_type,
        "description": description,
        "requirements": clean_optional(data.get("requirements")),
        "responsibilities": clean_optional(data.get("responsibilities")),
        "min_experience_years": int(min_experience) if min_experience not in (None, "") else None,
        "is_active": bool(data.get("isActive", True)),
    }
    return cleaned, errors
