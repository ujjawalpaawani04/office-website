# Public testimonial read endpoints land here in Step 6.
from flask import jsonify

from app.blueprints.testimonials import testimonials_bp
from app.models import Testimonial
from app.utils.media import bulk_fetch_media


def serialize_testimonial(testimonial, media_map):
    photo = media_map.get(testimonial.photo_media_id)
    return {
        "id": testimonial.id,
        "clientName": testimonial.client_name,
        "clientDesignation": testimonial.client_designation,
        "clientCompany": testimonial.client_company,
        "content": testimonial.content,
        "rating": testimonial.rating,
        "photoUrl": photo.path if photo else None,
    }


@testimonials_bp.get("")
def list_testimonials():
    testimonials = (
        Testimonial.query.filter_by(is_active=True).order_by(Testimonial.sort_order.asc()).all()
    )
    media_map = bulk_fetch_media(t.photo_media_id for t in testimonials)
    return jsonify([serialize_testimonial(t, media_map) for t in testimonials])
