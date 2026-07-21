from flask import jsonify

from app.blueprints.firm import firm_bp
from app.models import Award, Certification, FirmStat


@firm_bp.get("/awards")
def list_awards():
    awards = Award.query.filter_by(is_active=True).order_by(Award.sort_order.asc()).all()
    return jsonify(
        [
            {
                "id": a.id,
                "title": a.title,
                "description": a.description,
                "year": a.year,
            }
            for a in awards
        ]
    )


@firm_bp.get("/certifications")
def list_certifications():
    certifications = (
        Certification.query.filter_by(is_active=True).order_by(Certification.sort_order.asc()).all()
    )
    return jsonify(
        [
            {
                "id": c.id,
                "name": c.name,
                "description": c.description,
                "issuingBody": c.issuing_body,
            }
            for c in certifications
        ]
    )


@firm_bp.get("/firm-stats")
def list_firm_stats():
    stats = FirmStat.query.filter_by(is_active=True).order_by(FirmStat.sort_order.asc()).all()
    return jsonify(
        [
            {
                "id": s.id,
                "key": s.key,
                "label": s.label,
                "value": s.value,
                "suffix": s.suffix,
                "icon": s.icon,
            }
            for s in stats
        ]
    )
