# Public team member read endpoints land here in Step 6.
from flask import jsonify

from app.blueprints.team import team_bp
from app.models import TeamMember
from app.utils.media import bulk_fetch_media


def serialize_member(member, media_map):
    photo = media_map.get(member.photo_media_id)
    return {
        "id": member.id,
        "name": member.name,
        "slug": member.slug,
        "designation": member.designation,
        "bio": member.bio,
        "qualifications": [q.strip() for q in (member.qualifications or "").split(",") if q.strip()],
        "photoUrl": photo.path if photo else None,
        "email": member.email,
        "linkedinUrl": member.linkedin_url,
    }


@team_bp.get("")
def list_team_members():
    members = TeamMember.query.filter_by(is_active=True).order_by(TeamMember.sort_order.asc()).all()
    media_map = bulk_fetch_media(m.photo_media_id for m in members)
    return jsonify([serialize_member(m, media_map) for m in members])
