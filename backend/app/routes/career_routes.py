"""Thin HTTP layer for the Career feature: job openings listing plus the
application submission. All real logic lives in app/controllers and
app/services.

URL kept at /api/careers/* (not /api/career) since that's what the
frontend is already live-wired to call - see frontend/src/api/careers.js.
"""
from flask import Blueprint, jsonify, request

from app.controllers.career_controller import handle_career_submission
from app.extensions import limiter
from app.models import JobOpening

career_bp = Blueprint("career", __name__, url_prefix="/api/careers")


def _serialize_opening(opening):
    return {
        "id": opening.id,
        "title": opening.title,
        "slug": opening.slug,
        "department": opening.department,
        "location": opening.location,
        "employmentType": opening.employment_type,
        "description": opening.description,
        "requirements": opening.requirements,
        "responsibilities": opening.responsibilities,
        "minExperienceYears": opening.min_experience_years,
    }


@career_bp.get("/openings")
def list_openings():
    openings = JobOpening.query.filter_by(is_active=True).order_by(JobOpening.posted_at.desc()).all()
    return jsonify([_serialize_opening(o) for o in openings])


@career_bp.post("/applications")
@limiter.limit("5 per minute")
def submit_application():
    body, status = handle_career_submission(request.form, request.files, request)
    return jsonify(body), status
