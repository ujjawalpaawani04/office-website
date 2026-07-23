"""Admin CRUD for services + their FAQs (Document 5 §4.2, Document 2 §11/§13).
Hand-written (not the generic factory) because of the nested FAQ
collection - same pattern as blog posts. Delete is admin-only per the
Permission Matrix, reflecting that services are foundational site content.
"""
from flask import jsonify, request

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import Media, Service, ServiceFaq
from app.services.newsletter_service import classify_content
from app.utils.audit import record_audit_log
from app.utils.pagination import paginate_query
from app.validators.service_validator import validate_service


def _media_url(media_id):
    if not media_id:
        return None
    media = Media.query.get(media_id)
    return media.path if media else None


def _serialize_service(service, include_faqs=True):
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
    }
    if include_faqs:
        data["faqs"] = [{"question": f.question, "answer": f.answer} for f in service.faqs]
    return data


def _apply_faqs(service, faqs):
    service.faqs = [ServiceFaq(question=f["question"], answer=f["answer"], sort_order=i) for i, f in enumerate(faqs)]


@admin_bp.get("/services")
@require_role("admin", "editor")
def list_services():
    query = Service.query.order_by(Service.sort_order.asc())
    q = (request.args.get("q") or "").strip()
    if q:
        query = query.filter(Service.name.ilike(f"%{q}%"))
    result = paginate_query(query, request.args)
    return jsonify({**result, "items": [_serialize_service(s, include_faqs=False) for s in result["items"]]})


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

    service = Service(
        name=cleaned["name"],
        slug=cleaned["slug"],
        short_description=cleaned["short_description"],
        full_description=cleaned["full_description"],
        icon=cleaned["icon"],
        featured_image_media_id=cleaned["featured_image_media_id"],
        sort_order=cleaned["sort_order"],
        is_active=cleaned["is_active"],
    )
    _apply_faqs(service, cleaned["faqs"])
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

    service.name = cleaned["name"]
    service.slug = cleaned["slug"]
    service.short_description = cleaned["short_description"]
    service.full_description = cleaned["full_description"]
    service.icon = cleaned["icon"]
    service.featured_image_media_id = cleaned["featured_image_media_id"]
    service.sort_order = cleaned["sort_order"]
    service.is_active = cleaned["is_active"]
    _apply_faqs(service, cleaned["faqs"])

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
