from flask import jsonify

from app.blueprints.services import services_bp
from app.models import Service


def serialize_service(service, include_faqs=False):
    data = {
        "id": service.id,
        "name": service.name,
        "slug": service.slug,
        "shortDescription": service.short_description,
        "fullDescription": service.full_description,
        "icon": service.icon,
    }
    if include_faqs:
        data["faqs"] = [{"question": f.question, "answer": f.answer} for f in service.faqs]
    return data


@services_bp.get("")
def list_services():
    services = Service.query.filter_by(is_active=True).order_by(Service.sort_order.asc()).all()
    return jsonify([serialize_service(s) for s in services])


@services_bp.get("/<slug>")
def get_service(slug):
    service = Service.query.filter_by(slug=slug, is_active=True).first()
    if service is None:
        return jsonify({"error": "Service not found"}), 404
    return jsonify(serialize_service(service, include_faqs=True))
