"""Security (Document 2 §32) - admin-only visibility into active sessions
and recent failed login attempts, distinct from Users (§4, who has an
account) vs this (how accounts are actually being used)."""
from flask import jsonify, request

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import Admin, AuditLog, RefreshToken
from app.models.mixins import utcnow
from app.utils.audit import record_audit_log
from app.utils.dates import isoformat_utc
from app.utils.pagination import paginate_query


def _serialize_session(row, admin_name):
    return {
        "id": row.id,
        "adminId": row.admin_id,
        "adminName": admin_name,
        "userAgent": row.user_agent,
        "ipAddress": row.ip_address,
        "issuedAt": isoformat_utc(row.issued_at),
        "expiresAt": isoformat_utc(row.expires_at),
    }


@admin_bp.get("/security/sessions")
@require_role("admin")
def list_sessions():
    # A SQLAlchemy filter expression compares entirely on the database side
    # (the value becomes a bind parameter in the SQL WHERE clause), so this
    # doesn't need the naive/aware reconciliation a genuine Python-level
    # comparison of an already-fetched value would (see
    # app/models/mixins.py's aware_utc for that case, used in
    # auth_service.rotate_refresh_token).
    query = RefreshToken.query.filter(RefreshToken.revoked_at.is_(None), RefreshToken.expires_at > utcnow()).order_by(
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

    row.revoked_at = utcnow()
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
                    "createdAt": isoformat_utc(log.created_at),
                }
                for log in result["items"]
            ],
        }
    )
