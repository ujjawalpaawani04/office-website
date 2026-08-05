"""Admin management of Appointment Booking - read-only listing, an
admin-only hard delete (same shape as leads_routes.py's Enquiries section),
and the manual "Sync Appointments" action the Calendly Free plan needs in
place of webhooks (see appointment_sync_service.py)."""
import logging

from flask import jsonify, request

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import Appointment
from app.models.mixins import aware_utc
from app.services.appointment_sync_service import sync_appointments_from_calendly
from app.services.calendly_client import CalendlyApiError
from app.utils.audit import record_audit_log
from app.utils.pagination import paginate_query

logger = logging.getLogger(__name__)


def _serialize_appointment(item):
    return {
        "id": item.id,
        "clientName": item.client_name,
        "clientEmail": item.client_email,
        "clientPhone": item.client_phone,
        "eventName": item.event_name,
        # aware_utc() re-tags the naive value MySQL hands back as UTC before
        # serializing (see mixins.py) - without it, the ISO string has no
        # offset/"Z" suffix, and the browser's `new Date(...)` silently
        # treats it as already-local time instead of converting it, which is
        # what was showing every appointment's time several hours off.
        "startsAt": aware_utc(item.starts_at).isoformat() if item.starts_at else None,
        "endsAt": aware_utc(item.ends_at).isoformat() if item.ends_at else None,
        "meetingDate": item.meeting_date.isoformat() if item.meeting_date else None,
        "meetingTime": item.meeting_time.isoformat() if item.meeting_time else None,
        "timezone": item.timezone,
        "meetingLink": item.meeting_link,
        "status": item.status,
        "source": item.source,
        "cancelReason": item.cancel_reason,
        "notes": item.notes,
        "createdAt": aware_utc(item.created_at).isoformat(),
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


@admin_bp.post("/appointments/sync")
@require_role("admin", "editor")
def sync_appointments():
    try:
        result = sync_appointments_from_calendly(get_current_admin().id, request)
    except CalendlyApiError as exc:
        logger.warning("Calendly sync failed: %s", exc)
        return jsonify({"error": str(exc)}), 502
    return jsonify(result)


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
