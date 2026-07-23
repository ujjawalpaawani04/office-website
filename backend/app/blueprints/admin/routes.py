from flask import jsonify

from app.blueprints.admin import admin_bp
from app.middleware.auth_guard import require_role
from app.services import dashboard_service


@admin_bp.get("/dashboard/summary")
@require_role("admin", "editor")
def dashboard_summary():
    return jsonify(dashboard_service.get_summary())


@admin_bp.get("/dashboard/activity")
@require_role("admin", "editor")
def dashboard_activity():
    return jsonify(dashboard_service.get_recent_activity())
