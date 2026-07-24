"""Server-side validation for admin service CRUD (Document 5 §4.2)."""
import re

from app.utils.sanitize import clean_optional, clean_str

SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
VALID_CATEGORIES = {"our_services", "corporate_specialised"}


def _clean_items(items, *, title_key="title", desc_key="description", title_max=160):
    """Shared cleaning for the icon/title/description-shaped repeaters
    (benefits, features, process steps, why-choose-us reasons). Drops any
    item with no title - identical to the existing FAQ drop-if-empty rule.
    """
    cleaned = []
    for item in items or []:
        title = clean_str(item.get(title_key), max_length=title_max)
        if not title:
            continue
        cleaned.append(
            {
                "icon": clean_optional(item.get("icon"), max_length=80),
                title_key: title,
                desc_key: clean_optional(item.get(desc_key)),
            }
        )
    return cleaned


def validate_service(data, instance):
    from app.models import Service

    name = clean_str(data.get("name"), max_length=160)
    slug = clean_str(data.get("slug"), max_length=180).lower()
    category = data.get("category") or "our_services"

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
    if category not in VALID_CATEGORIES:
        errors["category"] = "Category must be 'our_services' or 'corporate_specialised'."

    faqs = [
        {"question": clean_str(f.get("question")), "answer": clean_str(f.get("answer"))}
        for f in (data.get("faqs") or [])
        if clean_str(f.get("question")) and clean_str(f.get("answer"))
    ]
    industries = []
    for item in data.get("industries") or []:
        label = clean_str(item.get("label"), max_length=160)
        if not label:
            continue
        industries.append(
            {
                "icon": clean_optional(item.get("icon"), max_length=80),
                "label": label,
                "blurb": clean_optional(item.get("blurb")),
            }
        )
    overview_paragraphs = [clean_str(p) for p in (data.get("overviewParagraphs") or []) if clean_str(p)]
    overview_highlights = [
        clean_str(h, max_length=300) for h in (data.get("overviewHighlights") or []) if clean_str(h)
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
        "category": category,
        "badge_label": clean_optional(data.get("badgeLabel"), max_length=40),
        # Hero
        "hero_breadcrumb_label": clean_optional(data.get("heroBreadcrumbLabel"), max_length=160),
        "hero_title_prefix": clean_optional(data.get("heroTitlePrefix"), max_length=160),
        "hero_title_highlight": clean_optional(data.get("heroTitleHighlight"), max_length=160),
        "hero_description": clean_optional(data.get("heroDescription")),
        "hero_background_media_id": data.get("heroBackgroundMediaId") or None,
        # Overview
        "overview_tagline": clean_optional(data.get("overviewTagline"), max_length=80),
        "overview_heading_prefix": clean_optional(data.get("overviewHeadingPrefix"), max_length=200),
        "overview_heading_highlight": clean_optional(data.get("overviewHeadingHighlight"), max_length=200),
        "overview_paragraphs": overview_paragraphs,
        "overview_highlights": overview_highlights,
        # CTA
        "cta_heading": clean_optional(data.get("ctaHeading"), max_length=200),
        "cta_description": clean_optional(data.get("ctaDescription")),
        "cta_primary_label": clean_optional(data.get("ctaPrimaryLabel"), max_length=120),
        # SEO
        "seo_title": clean_optional(data.get("seoTitle"), max_length=220),
        "meta_description": clean_optional(data.get("metaDescription"), max_length=320),
        "meta_keywords": clean_optional(data.get("metaKeywords"), max_length=300),
        "canonical_url": clean_optional(data.get("canonicalUrl"), max_length=300),
        "og_image_media_id": data.get("ogImageMediaId") or None,
        # Group headings/intros
        "features_tagline": clean_optional(data.get("featuresTagline"), max_length=80),
        "features_heading_prefix": clean_optional(data.get("featuresHeadingPrefix"), max_length=200),
        "features_heading_highlight": clean_optional(data.get("featuresHeadingHighlight"), max_length=200),
        "features_intro": clean_optional(data.get("featuresIntro")),
        "benefits_tagline": clean_optional(data.get("benefitsTagline"), max_length=80),
        "benefits_heading_prefix": clean_optional(data.get("benefitsHeadingPrefix"), max_length=200),
        "benefits_heading_highlight": clean_optional(data.get("benefitsHeadingHighlight"), max_length=200),
        "benefits_intro": clean_optional(data.get("benefitsIntro")),
        "process_intro": clean_optional(data.get("processIntro")),
        "why_choose_us_intro": clean_optional(data.get("whyChooseUsIntro")),
        "why_choose_us_image_media_id": data.get("whyChooseUsImageMediaId") or None,
        "why_choose_us_image_alt": clean_optional(data.get("whyChooseUsImageAlt"), max_length=255),
        "industries_intro": clean_optional(data.get("industriesIntro")),
        # Repeaters
        "faqs": faqs,
        "benefits": _clean_items(data.get("benefits")),
        "features": _clean_items(data.get("features")),
        "process": _clean_items(data.get("process")),
        "why_choose_us": _clean_items(data.get("whyChooseUs")),
        "industries": industries,
    }
    return cleaned, errors
