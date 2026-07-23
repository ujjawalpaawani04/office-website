# Public testimonial read endpoints land here in Step 6.
from flask import jsonify

from app.blueprints.testimonials import testimonials_bp
from app.models import Media, Testimonial


def serialize_testimonial(testimonial):
    photo = Media.query.get(testimonial.photo_media_id) if testimonial.photo_media_id else None
    return {
        "id": testimonial.id,
        "clientName": testimonial.client_name,
        "clientDesignation": testimonial.client_designation,
        "clientCompany": testimonial.client_company,
        "content": testimonial.content,
        "rating": testimonial.rating,
        "photoUrl": photo.path if photo else None,
        "isFeatured": testimonial.is_featured,
    }


@testimonials_bp.get("")
def list_testimonials():
    testimonials = (
        Testimonial.query.filter_by(is_active=True).order_by(Testimonial.sort_order.asc()).all()
    )
    return jsonify([serialize_testimonial(t) for t in testimonials])
