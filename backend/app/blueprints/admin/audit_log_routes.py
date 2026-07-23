"""Audit Log viewer (Document 2 §29) - read-only, admin-only."""
import csv
import io

from flask import Response, jsonify, request

from app.blueprints.admin import admin_bp
from app.middleware.auth_guard import require_role
from app.models import Admin, AuditLog
from app.utils.pagination import paginate_query


def _query():
    query = AuditLog.query
    admin_id = request.args.get("adminId")
    if admin_id:
        query = query.filter_by(admin_id=admin_id)
    entity_type = request.args.get("entityType")
    if entity_type:
        query = query.filter_by(entity_type=entity_type)
    date_from = request.args.get("from")
    if date_from:
        query = query.filter(AuditLog.created_at >= date_from)
    date_to = request.args.get("to")
    if date_to:
        query = query.filter(AuditLog.created_at <= date_to)
    return query.order_by(AuditLog.created_at.desc())


def _serialize(log, admins_by_id):
    return {
        "id": log.id,
        "adminId": log.admin_id,
        "adminName": admins_by_id.get(log.admin_id),
        "action": log.action,
        "entityType": log.entity_type,
        "entityId": log.entity_id,
        "details": log.details,
        "ipAddress": log.ip_address,
        "createdAt": log.created_at.isoformat(),
    }


@admin_bp.get("/audit-logs")
@require_role("admin")
def list_audit_logs():
    result = paginate_query(_query(), request.args)
    admins_by_id = {a.id: a.name for a in Admin.query.all()}
    return jsonify({**result, "items": [_serialize(log, admins_by_id) for log in result["items"]]})


@admin_bp.get("/audit-logs/export")
@require_role("admin")
def export_audit_logs():
    admins_by_id = {a.id: a.name for a in Admin.query.all()}
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["Timestamp", "Admin", "Action", "Entity Type", "Entity ID", "IP Address"])
    for log in _query().all():
        writer.writerow(
            [log.created_at.isoformat(), admins_by_id.get(log.admin_id, ""), log.action, log.entity_type, log.entity_id, log.ip_address]
        )
    return Response(
        buffer.getvalue(), mimetype="text/csv", headers={"Content-Disposition": "attachment; filename=audit_log.csv"}
    )
