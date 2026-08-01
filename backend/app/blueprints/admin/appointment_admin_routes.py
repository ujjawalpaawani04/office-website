"""Admin management of website appointment bookings. Hand-written (not the
generic CRUD factory) since this resource has bespoke filters, a
status/notes-only PATCH, and a private-document download route - same
shape as career_admin_routes.py's Job Applications section, which this
closely mirrors.

Calendly remains the source of truth for actual scheduling (Document 18):
there is deliberately no create/reschedule endpoint here, only visibility
into what the website + Calendly webhook have already recorded, and a
status/notes editor for the admin's own tracking.
"""
import os

from flask import current_app, jsonify, request, send_from_directory

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import Appointment
from app.utils.audit import record_audit_log
from app.utils.pagination import paginate_query

VALID_STATUSES = {"pending_confirmation", "confirmed", "cancelled", "completed", "failed"}


def _serialize_appointment(item, include_notes=True):
    data = {
        "id": item.id,
        "appointmentId": item.appointment_id,
        "clientName": item.client_name,
        "mobileNumber": item.mobile_number,
        "email": item.email,
        "businessName": item.business_name,
        "isExistingClient": item.is_existing_client,
        "alternateContact": item.alternate_contact,
        "service": item.service,
        "meetingMode": item.meeting_mode,
        "appointmentDate": item.appointment_date.isoformat(),
        "appointmentTime": item.appointment_time.strftime("%H:%M"),
        "durationMinutes": item.duration_minutes,
        "requirementDescription": item.requirement_description,
        "status": item.status,
        "hasDocument": bool(item.document_path),
        "documentFilename": item.document_filename,
        "meetingLink": item.meeting_link,
        "cancelUrl": item.cancel_url,
        "rescheduleUrl": item.reschedule_url,
        "calendlyEventUri": item.calendly_event_uri,
        "createdAt": item.created_at.isoformat(),
        "updatedAt": item.updated_at.isoformat(),
    }
    if include_notes:
        data["internalNotes"] = item.internal_notes
    return data


@admin_bp.get("/appointments")
@require_role("admin", "editor")
def list_appointments():
    query = Appointment.query

    q = (request.args.get("q") or "").strip()
    if q:
        like = f"%{q}%"
        query = query.filter(
            db.or_(
                Appointment.client_name.ilike(like),
                Appointment.appointment_id.ilike(like),
                Appointment.mobile_number.ilike(like),
            )
        )

    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)

    service = request.args.get("service")
    if service:
        query = query.filter_by(service=service)

    appointment_date = request.args.get("date")
    if appointment_date:
        query = query.filter_by(appointment_date=appointment_date)

    query = query.order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc())
    result = paginate_query(query, request.args)
    return jsonify({**result, "items": [_serialize_appointment(a, include_notes=False) for a in result["items"]]})


@admin_bp.get("/appointments/<int:appointment_id>")
@require_role("admin", "editor")
def get_appointment(appointment_id):
    appointment = Appointment.query.get(appointment_id)
    if appointment is None:
        return jsonify({"error": "Not found."}), 404
    return jsonify(_serialize_appointment(appointment))


@admin_bp.patch("/appointments/<int:appointment_id>")
@require_role("admin", "editor")
def update_appointment(appointment_id):
    appointment = Appointment.query.get(appointment_id)
    if appointment is None:
        return jsonify({"error": "Not found."}), 404

    data = request.get_json(silent=True) or {}
    changes = {}

    if "status" in data:
        if data["status"] not in VALID_STATUSES:
            return jsonify({"error": "Validation failed", "fields": {"status": "Invalid status."}}), 422
        appointment.status = data["status"]
        changes["status"] = data["status"]

    if "internalNotes" in data:
        appointment.internal_notes = (data.get("internalNotes") or "").strip() or None
        changes["internalNotes"] = "updated"

    if not changes:
        return jsonify({"error": "Nothing to update."}), 422

    record_audit_log(get_current_admin().id, "update", "appointment", appointment.id, changes, request=request)
    db.session.commit()
    return jsonify(_serialize_appointment(appointment))


@admin_bp.get("/appointments/<int:appointment_id>/document")
@require_role("admin", "editor")
def download_appointment_document(appointment_id):
    """Same private-download pattern as career_admin_routes.download_resume -
    never a guessable public URL, always behind the admin JWT."""
    appointment = Appointment.query.get(appointment_id)
    if appointment is None or not appointment.document_path:
        return jsonify({"error": "Not found."}), 404

    doc_dir = os.path.abspath(os.path.dirname(appointment.document_path))
    filename = os.path.basename(appointment.document_path)
    record_audit_log(
        get_current_admin().id, "download_document", "appointment", appointment.id, request=request
    )
    db.session.commit()
    return send_from_directory(
        doc_dir, filename, as_attachment=True, download_name=appointment.document_filename
    )
