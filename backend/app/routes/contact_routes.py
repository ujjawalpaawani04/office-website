"""Thin HTTP layer for the Contact Us feature: parses the request and maps
the controller's (body, status) result to a JSON response. All real logic
lives in app/controllers and app/services.

URL kept at /api/enquiries (not /api/contact) since that's what the
frontend is already live-wired to call - see frontend/src/api/enquiries.js.
"""
from flask import Blueprint, jsonify, request

from app.controllers.contact_controller import handle_contact_submission
from app.extensions import limiter

contact_bp = Blueprint("contact", __name__, url_prefix="/api/enquiries")


@contact_bp.post("")
@limiter.limit("5 per minute")
def submit_contact():
    data = request.get_json(silent=True) or {}
    body, status = handle_contact_submission(data, request)
    return jsonify(body), status
