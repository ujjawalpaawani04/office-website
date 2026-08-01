"""Public HTTP layer for the Book Appointment feature. Real logic lives in
controller.py / app/services/appointment_service.py / calendly_service.py -
this module only parses the request and shapes the response, same split as
the Career blueprint.
"""
import calendar
from datetime import date, datetime, timedelta

from flask import current_app, jsonify, request

from app.blueprints.appointments import appointments_bp
from app.blueprints.appointments.controller import handle_appointment_submission
from app.extensions import limiter
from app.services.appointment_service import (
    AppointmentServiceUnavailableError,
    get_service_availability,
    get_service_availability_month,
)

# Keeping the frontend's presentational service data (label, description,
# icon) out of the backend on purpose - only which services are actually
# bookable right now is backend-owned, since that depends on whether a
# Calendly event type has been configured for it (Document 13: "do not
# hardcode these URLs directly inside React components").
SERVICE_KEYS = (
    "income_tax", "gst", "tds", "audit", "accounting", "company_llp",
    "roc_filing", "rera", "trust_ngo", "advisory", "general",
)


@appointments_bp.get("/services")
def list_bookable_services():
    configured = current_app.config["CALENDLY_EVENT_TYPE_URIS"]
    return jsonify([{"key": key, "isBookable": bool(configured.get(key))} for key in SERVICE_KEYS])


@appointments_bp.get("/availability")
@limiter.limit("30 per minute")
def availability():
    service = (request.args.get("service") or "").strip()
    date_str = (request.args.get("date") or "").strip()

    try:
        day = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "A valid date (YYYY-MM-DD) is required."}), 400

    if day < datetime.utcnow().date():
        return jsonify({"date": date_str, "slots": []})

    try:
        slots = get_service_availability(service, request.args.get("mode"), day)
    except AppointmentServiceUnavailableError as exc:
        return jsonify({"error": str(exc), "code": "scheduling_unavailable"}), 503

    return jsonify({"date": date_str, "slots": slots})


@appointments_bp.get("/availability-month")
@limiter.limit("20 per minute")
def availability_month():
    """Per-day availability for one calendar month, so the custom calendar
    can colour available/unavailable dates without a request per day (see
    calendly_service.get_available_days). Never returns days before today."""
    service = (request.args.get("service") or "").strip()
    month_str = (request.args.get("month") or "").strip()

    try:
        month_start = datetime.strptime(month_str, "%Y-%m").date()
    except ValueError:
        return jsonify({"error": "A valid month (YYYY-MM) is required."}), 400

    today = datetime.utcnow().date()
    start_day = max(month_start, today)
    last_day_num = calendar.monthrange(month_start.year, month_start.month)[1]
    end_day = date(month_start.year, month_start.month, last_day_num)
    if end_day < start_day:
        return jsonify({"month": month_str, "days": {}})

    try:
        counts = get_service_availability_month(service, request.args.get("mode"), start_day, end_day)
    except AppointmentServiceUnavailableError as exc:
        return jsonify({"error": str(exc), "code": "scheduling_unavailable"}), 503

    days = {
        day_key: {"status": "available" if count > 0 else "unavailable", "slotCount": count}
        for day_key, count in counts.items()
    }
    return jsonify({"month": month_str, "days": days})


@appointments_bp.post("")
@limiter.limit("5 per minute")
def create_appointment_request():
    body, status = handle_appointment_submission(request.form, request.files, request)
    return jsonify(body), status
