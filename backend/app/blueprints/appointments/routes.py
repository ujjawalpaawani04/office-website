"""Thin HTTP layer for booking capture: parses the request and maps the
controller's (body, status) result to a JSON response. All real logic lives
in this blueprint's controller.py and app/services (Document parity with
contact/routes.py).
"""
from flask import jsonify, request

from app.blueprints.appointments import appointments_bp
from app.blueprints.appointments.controller import handle_booking_capture
from app.extensions import limiter


@appointments_bp.post("/booked")
@limiter.limit("5 per minute")
def submit_booking():
    data = request.get_json(silent=True) or {}
    body, status = handle_booking_capture(data, request)
    return jsonify(body), status
