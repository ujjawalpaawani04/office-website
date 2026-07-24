"""Thin HTTP layer for the Career feature: job openings listing plus the
application submission. All real logic lives in this blueprint's
controller.py and app/services.

URL kept at /api/careers/* (not /api/career) since that's what the
frontend is already live-wired to call - see frontend/src/website/api/careers.js.
"""
from flask import jsonify, request

from app.blueprints.career import career_bp
from app.blueprints.career.controller import handle_career_submission
from app.extensions import limiter
from app.models import JobOpening


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
        "isActive": opening.is_active,
    }


@career_bp.get("/openings")
def list_openings():
    # Active-only by default (used for the "Current Openings" cards).
    # ?all=true returns every opening including closed ones - the Apply Now
    # form's position dropdown needs this so an applicant can still name a
    # since-closed role; the frontend fetches with ?all=true once and
    # filters down to active-only itself for the cards, rather than firing
    # two requests.
    query = JobOpening.query
    if request.args.get("all") != "true":
        query = query.filter_by(is_active=True)
    openings = query.order_by(JobOpening.posted_at.desc()).all()
    return jsonify([_serialize_opening(o) for o in openings])


@career_bp.post("/applications")
@limiter.limit("5 per minute")
def submit_application():
    body, status = handle_career_submission(request.form, request.files, request)
    return jsonify(body), status
