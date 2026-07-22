"""Single write path into `audit_logs`, shared by every admin feature.

Deliberately does not call db.session.commit() - the caller already has a
transaction open for the actual mutation (create/update/status-change) and
the audit row must land in the *same* commit, never a separate one, so a
crash between the two can't produce a change with no audit trail or an
audit trail with no change.
"""
from app.extensions import db
from app.models import AuditLog


def record_audit_log(admin_id, action, entity_type, entity_id=None, details=None, request=None):
    ip_address = None
    if request is not None:
        ip_address = request.remote_addr

    log = AuditLog(
        admin_id=admin_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=details,
        ip_address=ip_address,
    )
    db.session.add(log)
    return log
