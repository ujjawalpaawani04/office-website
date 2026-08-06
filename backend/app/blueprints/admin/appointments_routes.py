"""Admin management of Appointment Booking - read-only listing, a CSV
export, single and bulk admin-only hard deletes (same shape as
leads_routes.py's Enquiries section), and the manual "Sync Appointments"
action the Calendly Free plan needs in place of webhooks (see
appointment_sync_service.py)."""
import csv
import io
import logging

from flask import Response, jsonify, request

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import Appointment
from app.models.mixins import aware_utc
from app.services.appointment_sync_service import sync_appointments_from_calendly
from app.services.calendly_client import CalendlyApiError, parse_calendly_datetime
from app.utils.audit import record_audit_log
from app.utils.pagination import MAX_PAGE_SIZE, paginate_query

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
        "appointmentMode": item.appointment_mode,
        "locationDetail": item.location_detail,
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
    # dateFrom/dateTo are full ISO instants (not bare calendar dates) - the
    # frontend's Date Filter resolves "Today"/"This Week"/a custom range to
    # the admin's own local start/end-of-day before sending them, so the
    # server only ever compares real instants and never has to guess which
    # timezone "today" means (see appointmentDatePresets.js). Filters on
    # starts_at - the appointment's scheduled time - not when it was booked.
    date_from = parse_calendly_datetime(request.args.get("dateFrom"))
    date_to = parse_calendly_datetime(request.args.get("dateTo"))
    if date_from:
        query = query.filter(Appointment.starts_at >= date_from)
    if date_to:
        query = query.filter(Appointment.starts_at <= date_to)
    return query.order_by(Appointment.created_at.desc())


@admin_bp.get("/appointments")
@require_role("admin", "editor")
def list_appointments():
    result = paginate_query(_appointments_query(), request.args)
    return jsonify({**result, "items": [_serialize_appointment(a) for a in result["items"]]})


# Unfiltered (all-time) counts for the summary cards at the top of the
# Appointments list - deliberately ignores the current search/date/status
# filters (unlike list_appointments), since the cards are meant to read as
# "the whole dataset at a glance", not "totals for what you're looking at".
# Grouped SQL counts rather than fetching every row, so this stays cheap
# regardless of how many appointments exist.
@admin_bp.get("/appointments/stats")
@require_role("admin", "editor")
def appointment_stats():
    by_status = dict.fromkeys(("pending", "confirmed", "cancelled", "rescheduled", "completed"), 0)
    by_status.update(
        dict(db.session.query(Appointment.status, db.func.count(Appointment.id)).group_by(Appointment.status).all())
    )
    by_mode = dict.fromkeys(("phone", "zoom", "in_person", "other"), 0)
    by_mode.update(
        dict(
            (mode, count)
            for mode, count in db.session.query(Appointment.appointment_mode, db.func.count(Appointment.id))
            .group_by(Appointment.appointment_mode)
            .all()
            if mode
        )
    )
    return jsonify({"total": sum(by_status.values()), "byStatus": by_status, "byMode": by_mode})


@admin_bp.get("/appointments/export")
@require_role("admin", "editor")
def export_appointments():
    rows = _appointments_query().all()
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["Name", "Email", "Phone", "Event", "Mode", "Meeting Date", "Meeting Time", "Timezone", "Status", "Booked On"])
    for a in rows:
        writer.writerow(
            [
                a.client_name,
                a.client_email,
                a.client_phone or "",
                a.event_name or "",
                a.appointment_mode or "",
                a.meeting_date.isoformat() if a.meeting_date else "",
                a.meeting_time.isoformat() if a.meeting_time else "",
                a.timezone or "",
                a.status,
                aware_utc(a.created_at).isoformat(),
            ]
        )
    return Response(
        buffer.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=appointments.csv"},
    )


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


@admin_bp.post("/appointments/bulk-delete")
@require_role("admin")
def bulk_delete_appointments():
    data = request.get_json(silent=True) or {}
    raw_ids = data.get("ids")
    if not isinstance(raw_ids, list) or not raw_ids:
        return jsonify({"error": "Validation failed", "fields": {"ids": "Select at least one appointment."}}), 422
    if len(raw_ids) > MAX_PAGE_SIZE:
        return jsonify({"error": "Validation failed", "fields": {"ids": f"Cannot delete more than {MAX_PAGE_SIZE} at once."}}), 422
    try:
        ids = {int(i) for i in raw_ids}
    except (TypeError, ValueError):
        return jsonify({"error": "Validation failed", "fields": {"ids": "Invalid appointment id."}}), 422

    appointments = Appointment.query.filter(Appointment.id.in_(ids)).all()
    admin_id = get_current_admin().id
    for appointment in appointments:
        record_audit_log(admin_id, "delete", "appointment", appointment.id, request=request)
        db.session.delete(appointment)
    db.session.commit()

    return jsonify({"deleted": len(appointments)})
