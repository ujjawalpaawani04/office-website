"""Security (Document 2 §32) - admin-only visibility into active sessions
and recent failed login attempts, distinct from Users (§4, who has an
account) vs this (how accounts are actually being used)."""
from datetime import datetime, timezone

from flask import jsonify, request

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import Admin, AuditLog, RefreshToken
from app.utils.audit import record_audit_log
from app.utils.pagination import paginate_query


def _serialize_session(row, admin_name):
    return {
        "id": row.id,
        "adminId": row.admin_id,
        "adminName": admin_name,
        "userAgent": row.user_agent,
        "ipAddress": row.ip_address,
        "issuedAt": row.issued_at.isoformat() if row.issued_at else None,
        "expiresAt": row.expires_at.isoformat() if row.expires_at else None,
    }


@admin_bp.get("/security/sessions")
@require_role("admin")
def list_sessions():
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    query = RefreshToken.query.filter(RefreshToken.revoked_at.is_(None), RefreshToken.expires_at > now).order_by(
        RefreshToken.issued_at.desc()
    )
    result = paginate_query(query, request.args)
    admins_by_id = {a.id: a.name for a in Admin.query.all()}
    return jsonify(
        {**result, "items": [_serialize_session(row, admins_by_id.get(row.admin_id)) for row in result["items"]]}
    )


@admin_bp.post("/security/sessions/<int:session_id>/revoke")
@require_role("admin")
def revoke_session(session_id):
    row = RefreshToken.query.get(session_id)
    if row is None:
        return jsonify({"error": "Not found."}), 404

    row.revoked_at = datetime.now(timezone.utc)
    record_audit_log(get_current_admin().id, "session_revoked", "admin", row.admin_id, request=request)
    db.session.commit()
    return jsonify({"message": "Session revoked."})


@admin_bp.get("/security/failed-logins")
@require_role("admin")
def list_failed_logins():
    query = AuditLog.query.filter_by(action="login_failed").order_by(AuditLog.created_at.desc())
    result = paginate_query(query, request.args)
    return jsonify(
        {
            **result,
            "items": [
                {
                    "id": log.id,
                    "email": (log.details or {}).get("email"),
                    "ipAddress": log.ip_address,
                    "createdAt": log.created_at.isoformat(),
                }
                for log in result["items"]
            ],
        }
    )
