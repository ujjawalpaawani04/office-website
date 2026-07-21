# Public team member read endpoints land here in Step 6.
from flask import jsonify

from app.blueprints.team import team_bp
from app.models import Media, TeamMember


def serialize_member(member):
    photo = Media.query.get(member.photo_media_id) if member.photo_media_id else None
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
    return jsonify([serialize_member(m) for m in members])
