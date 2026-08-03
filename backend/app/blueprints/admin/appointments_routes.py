"""Admin management of Appointment Booking - read-only listing plus an
admin-only hard delete, same shape as leads_routes.py's Enquiries section."""
from flask import jsonify, request

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import Appointment
from app.utils.audit import record_audit_log
from app.utils.dates import isoformat_utc
from app.utils.pagination import paginate_query


def _serialize_appointment(item):
    return {
        "id": item.id,
        "clientName": item.client_name,
        "clientEmail": item.client_email,
        "clientPhone": item.client_phone,
        "eventName": item.event_name,
        "startsAt": isoformat_utc(item.starts_at),
        "endsAt": isoformat_utc(item.ends_at),
        "meetingDate": item.meeting_date.isoformat() if item.meeting_date else None,
        "meetingTime": item.meeting_time.isoformat() if item.meeting_time else None,
        "timezone": item.timezone,
        "meetingLink": item.meeting_link,
        "status": item.status,
        "source": item.source,
        "cancelReason": item.cancel_reason,
        "notes": item.notes,
        "createdAt": isoformat_utc(item.created_at),
    }


def _appointments_query():
    query = Appointment.query
    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)
    q = (request.args.get("q") or "").strip()
    if q:
        like = f"%{q}%"
        query = query.filter(
            db.or_(
                Appointment.client_name.ilike(like),
                Appointment.client_email.ilike(like),
                Appointment.client_phone.ilike(like),
            )
        )
    return query.order_by(Appointment.created_at.desc())


@admin_bp.get("/appointments")
@require_role("admin", "editor")
def list_appointments():
    result = paginate_query(_appointments_query(), request.args)
    return jsonify({**result, "items": [_serialize_appointment(a) for a in result["items"]]})


@admin_bp.delete("/appointments/<int:appointment_id>")
@require_role("admin")
def delete_appointment(appointment_id):
    appointment = Appointment.query.get(appointment_id)
    if appointment is None:
        return jsonify({"error": "Not found."}), 404

    record_audit_log(get_current_admin().id, "delete", "appointment", appointment.id, request=request)
    db.session.delete(appointment)
    db.session.commit()
    return "", 204
