from flask import jsonify

from app.blueprints.services import services_bp
from app.models import Media, Service


def _media_url(media_id):
    if not media_id:
        return None
    media = Media.query.get(media_id)
    return media.path if media else None


def _serialize_item(item, *, title_key="title", desc_key="description"):
    return {"icon": item.icon, title_key: getattr(item, title_key), desc_key: getattr(item, desc_key)}


def serialize_service(service, include_content=False):
    data = {
        "id": service.id,
        "name": service.name,
        "slug": service.slug,
        "shortDescription": service.short_description,
        "fullDescription": service.full_description,
        "icon": service.icon,
        "featuredImageUrl": _media_url(service.featured_image_media_id),
        "category": service.category,
        "badgeLabel": service.badge_label,
    }
    if include_content:
        data.update(
            {
                "heroBreadcrumbLabel": service.hero_breadcrumb_label,
                "heroTitlePrefix": service.hero_title_prefix,
                "heroTitleHighlight": service.hero_title_highlight,
                "heroDescription": service.hero_description,
                "heroBackgroundImageUrl": _media_url(service.hero_background_media_id),
                "overviewTagline": service.overview_tagline,
                "overviewHeadingPrefix": service.overview_heading_prefix,
                "overviewHeadingHighlight": service.overview_heading_highlight,
                "overviewParagraphs": [p.content for p in service.overview_paragraphs],
                "overviewHighlights": [h.content for h in service.overview_highlights],
                "ctaHeading": service.cta_heading,
                "ctaDescription": service.cta_description,
                "ctaPrimaryLabel": service.cta_primary_label,
                "seoTitle": service.seo_title,
                "metaDescription": service.meta_description,
                "metaKeywords": service.meta_keywords,
                "canonicalUrl": service.canonical_url,
                "ogImageUrl": _media_url(service.og_image_media_id),
                "featuresTagline": service.features_tagline,
                "featuresHeadingPrefix": service.features_heading_prefix,
                "featuresHeadingHighlight": service.features_heading_highlight,
                "featuresIntro": service.features_intro,
                "features": [_serialize_item(i) for i in service.features],
                "benefitsTagline": service.benefits_tagline,
                "benefitsHeadingPrefix": service.benefits_heading_prefix,
                "benefitsHeadingHighlight": service.benefits_heading_highlight,
                "benefitsIntro": service.benefits_intro,
                "benefits": [_serialize_item(i) for i in service.benefits],
                "processIntro": service.process_intro,
                "process": [_serialize_item(i) for i in service.process_steps],
                "whyChooseUsIntro": service.why_choose_us_intro,
                "whyChooseUsImageUrl": _media_url(service.why_choose_us_image_media_id),
                "whyChooseUsImageAlt": service.why_choose_us_image_alt,
                "whyChooseUs": [_serialize_item(i) for i in service.why_choose_us_items],
                "industriesIntro": service.industries_intro,
                "industries": [_serialize_item(i, title_key="label", desc_key="blurb") for i in service.industries],
                "faqs": [{"question": f.question, "answer": f.answer} for f in service.faqs],
            }
        )
    return data


@services_bp.get("")
def list_services():
    services = Service.query.filter_by(is_active=True).order_by(Service.category.asc(), Service.sort_order.asc()).all()
    return jsonify([serialize_service(s) for s in services])


@services_bp.get("/<slug>")
def get_service(slug):
    service = Service.query.filter_by(slug=slug, is_active=True).first()
    if service is None:
        return jsonify({"error": "Service not found"}), 404
    return jsonify(serialize_service(service, include_content=True))
