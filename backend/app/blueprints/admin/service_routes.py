"""Admin CRUD for services + their page content (Document 5 §4.2, Document 2
§11/§13). Hand-written (not the generic factory) because of the nested
repeatable content collections - same pattern as blog posts. Delete is
admin-only per the Permission Matrix, reflecting that services are
foundational site content.
"""
from flask import jsonify, request

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import (
    Media,
    Service,
    ServiceBenefit,
    ServiceFaq,
    ServiceFeature,
    ServiceIndustry,
    ServiceOverviewHighlight,
    ServiceOverviewParagraph,
    ServiceProcessStep,
    ServiceWhyChooseUs,
)
from app.services.newsletter_service import classify_content
from app.utils.audit import record_audit_log
from app.utils.pagination import paginate_query
from app.validators.service_validator import validate_service


def _media_url(media_id):
    if not media_id:
        return None
    media = Media.query.get(media_id)
    return media.path if media else None


def _serialize_item(item, *, title_key="title", desc_key="description"):
    return {"icon": item.icon, title_key: getattr(item, title_key), desc_key: getattr(item, desc_key)}


def _serialize_service(service, include_children=True):
    data = {
        "id": service.id,
        "name": service.name,
        "slug": service.slug,
        "shortDescription": service.short_description,
        "fullDescription": service.full_description,
        "icon": service.icon,
        "featuredImageMediaId": service.featured_image_media_id,
        "featuredImageUrl": _media_url(service.featured_image_media_id),
        "sortOrder": service.sort_order,
        "isActive": service.is_active,
        "category": service.category,
        "badgeLabel": service.badge_label,
        "heroBreadcrumbLabel": service.hero_breadcrumb_label,
        "heroTitlePrefix": service.hero_title_prefix,
        "heroTitleHighlight": service.hero_title_highlight,
        "heroDescription": service.hero_description,
        "heroBackgroundMediaId": service.hero_background_media_id,
        "heroBackgroundImageUrl": _media_url(service.hero_background_media_id),
        "overviewTagline": service.overview_tagline,
        "overviewHeadingPrefix": service.overview_heading_prefix,
        "overviewHeadingHighlight": service.overview_heading_highlight,
        "ctaHeading": service.cta_heading,
        "ctaDescription": service.cta_description,
        "ctaPrimaryLabel": service.cta_primary_label,
        "seoTitle": service.seo_title,
        "metaDescription": service.meta_description,
        "metaKeywords": service.meta_keywords,
        "canonicalUrl": service.canonical_url,
        "ogImageMediaId": service.og_image_media_id,
        "ogImageUrl": _media_url(service.og_image_media_id),
        "featuresTagline": service.features_tagline,
        "featuresHeadingPrefix": service.features_heading_prefix,
        "featuresHeadingHighlight": service.features_heading_highlight,
        "featuresIntro": service.features_intro,
        "benefitsTagline": service.benefits_tagline,
        "benefitsHeadingPrefix": service.benefits_heading_prefix,
        "benefitsHeadingHighlight": service.benefits_heading_highlight,
        "benefitsIntro": service.benefits_intro,
        "processIntro": service.process_intro,
        "whyChooseUsIntro": service.why_choose_us_intro,
        "whyChooseUsImageMediaId": service.why_choose_us_image_media_id,
        "whyChooseUsImageUrl": _media_url(service.why_choose_us_image_media_id),
        "whyChooseUsImageAlt": service.why_choose_us_image_alt,
        "industriesIntro": service.industries_intro,
    }
    if include_children:
        data["faqs"] = [{"question": f.question, "answer": f.answer} for f in service.faqs]
        data["benefits"] = [_serialize_item(i) for i in service.benefits]
        data["features"] = [_serialize_item(i) for i in service.features]
        data["process"] = [_serialize_item(i) for i in service.process_steps]
        data["whyChooseUs"] = [_serialize_item(i) for i in service.why_choose_us_items]
        data["industries"] = [_serialize_item(i, title_key="label", desc_key="blurb") for i in service.industries]
        data["overviewParagraphs"] = [p.content for p in service.overview_paragraphs]
        data["overviewHighlights"] = [h.content for h in service.overview_highlights]
    return data


def _apply_children(service, cleaned):
    service.faqs = [ServiceFaq(question=f["question"], answer=f["answer"], sort_order=i) for i, f in enumerate(cleaned["faqs"])]
    service.benefits = [
        ServiceBenefit(icon=i["icon"], title=i["title"], description=i["description"], sort_order=idx)
        for idx, i in enumerate(cleaned["benefits"])
    ]
    service.features = [
        ServiceFeature(icon=i["icon"], title=i["title"], description=i["description"], sort_order=idx)
        for idx, i in enumerate(cleaned["features"])
    ]
    service.process_steps = [
        ServiceProcessStep(icon=i["icon"], title=i["title"], description=i["description"], sort_order=idx)
        for idx, i in enumerate(cleaned["process"])
    ]
    service.why_choose_us_items = [
        ServiceWhyChooseUs(icon=i["icon"], title=i["title"], description=i["description"], sort_order=idx)
        for idx, i in enumerate(cleaned["why_choose_us"])
    ]
    service.industries = [
        ServiceIndustry(icon=i["icon"], label=i["label"], blurb=i["blurb"], sort_order=idx)
        for idx, i in enumerate(cleaned["industries"])
    ]
    service.overview_paragraphs = [
        ServiceOverviewParagraph(content=p, sort_order=idx) for idx, p in enumerate(cleaned["overview_paragraphs"])
    ]
    service.overview_highlights = [
        ServiceOverviewHighlight(content=h, sort_order=idx) for idx, h in enumerate(cleaned["overview_highlights"])
    ]


def _apply_flat_fields(service, cleaned):
    service.name = cleaned["name"]
    service.slug = cleaned["slug"]
    service.short_description = cleaned["short_description"]
    service.full_description = cleaned["full_description"]
    service.icon = cleaned["icon"]
    service.featured_image_media_id = cleaned["featured_image_media_id"]
    service.sort_order = cleaned["sort_order"]
    service.is_active = cleaned["is_active"]
    service.category = cleaned["category"]
    service.badge_label = cleaned["badge_label"]
    service.hero_breadcrumb_label = cleaned["hero_breadcrumb_label"]
    service.hero_title_prefix = cleaned["hero_title_prefix"]
    service.hero_title_highlight = cleaned["hero_title_highlight"]
    service.hero_description = cleaned["hero_description"]
    service.hero_background_media_id = cleaned["hero_background_media_id"]
    service.overview_tagline = cleaned["overview_tagline"]
    service.overview_heading_prefix = cleaned["overview_heading_prefix"]
    service.overview_heading_highlight = cleaned["overview_heading_highlight"]
    service.cta_heading = cleaned["cta_heading"]
    service.cta_description = cleaned["cta_description"]
    service.cta_primary_label = cleaned["cta_primary_label"]
    service.seo_title = cleaned["seo_title"]
    service.meta_description = cleaned["meta_description"]
    service.meta_keywords = cleaned["meta_keywords"]
    service.canonical_url = cleaned["canonical_url"]
    service.og_image_media_id = cleaned["og_image_media_id"]
    service.features_tagline = cleaned["features_tagline"]
    service.features_heading_prefix = cleaned["features_heading_prefix"]
    service.features_heading_highlight = cleaned["features_heading_highlight"]
    service.features_intro = cleaned["features_intro"]
    service.benefits_tagline = cleaned["benefits_tagline"]
    service.benefits_heading_prefix = cleaned["benefits_heading_prefix"]
    service.benefits_heading_highlight = cleaned["benefits_heading_highlight"]
    service.benefits_intro = cleaned["benefits_intro"]
    service.process_intro = cleaned["process_intro"]
    service.why_choose_us_intro = cleaned["why_choose_us_intro"]
    service.why_choose_us_image_media_id = cleaned["why_choose_us_image_media_id"]
    service.why_choose_us_image_alt = cleaned["why_choose_us_image_alt"]
    service.industries_intro = cleaned["industries_intro"]


@admin_bp.get("/services")
@require_role("admin", "editor")
def list_services():
    query = Service.query.order_by(Service.category.asc(), Service.sort_order.asc())
    q = (request.args.get("q") or "").strip()
    if q:
        query = query.filter(Service.name.ilike(f"%{q}%"))
    category = request.args.get("category")
    if category:
        query = query.filter(Service.category == category)
    result = paginate_query(query, request.args)
    return jsonify({**result, "items": [_serialize_service(s, include_children=False) for s in result["items"]]})


@admin_bp.get("/services/<int:service_id>")
@require_role("admin", "editor")
def get_service(service_id):
    service = Service.query.get(service_id)
    if service is None:
        return jsonify({"error": "Not found."}), 404
    return jsonify(_serialize_service(service))


@admin_bp.post("/services")
@require_role("admin", "editor")
def create_service():
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_service(data, None)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    service = Service()
    _apply_flat_fields(service, cleaned)
    _apply_children(service, cleaned)
    db.session.add(service)
    db.session.flush()
    record_audit_log(get_current_admin().id, "create", "service", service.id, request=request)
    db.session.commit()

    response = _serialize_service(service)
    if service.is_active:
        response["newsletterSuggestion"] = classify_content(
            service.name, service.short_description, service.full_description, source_type="service"
        )
    return jsonify(response), 201


@admin_bp.put("/services/<int:service_id>")
@require_role("admin", "editor")
def update_service(service_id):
    service = Service.query.get(service_id)
    if service is None:
        return jsonify({"error": "Not found."}), 404

    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_service(data, service)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    warnings = []
    if service.slug != cleaned["slug"]:
        warnings.append("Changing this slug may break the live service page URL.")

    _apply_flat_fields(service, cleaned)
    _apply_children(service, cleaned)

    record_audit_log(get_current_admin().id, "update", "service", service.id, request=request)
    db.session.commit()

    response = _serialize_service(service)
    if warnings:
        response["warnings"] = warnings
    if service.is_active:
        response["newsletterSuggestion"] = classify_content(
            service.name, service.short_description, service.full_description, source_type="service"
        )
    return jsonify(response)


@admin_bp.delete("/services/<int:service_id>")
@require_role("admin")
def delete_service(service_id):
    service = Service.query.get(service_id)
    if service is None:
        return jsonify({"error": "Not found."}), 404

    record_audit_log(get_current_admin().id, "delete", "service", service.id, request=request)
    db.session.delete(service)
    db.session.commit()
    return "", 204


@admin_bp.patch("/services/reorder")
@require_role("admin", "editor")
def reorder_services():
    data = request.get_json(silent=True) or []
    if not isinstance(data, list) or not data:
        return jsonify({"error": "Validation failed"}), 422

    try:
        ids = [int(item["id"]) for item in data]
        sort_orders = [int(item["sortOrder"]) for item in data]
    except (KeyError, TypeError, ValueError):
        return jsonify({"error": "Validation failed"}), 422

    services = {s.id: s for s in Service.query.filter(Service.id.in_(ids)).all()}
    if len(services) != len(set(ids)):
        return jsonify({"error": "Not found."}), 404

    for service_id, sort_order in zip(ids, sort_orders):
        services[service_id].sort_order = sort_order

    record_audit_log(get_current_admin().id, "reorder", "service", details={"order": data}, request=request)
    db.session.commit()
    return jsonify(data)
