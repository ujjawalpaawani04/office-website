"""Admin Site Settings (Document 2 §28) - a small fixed set of firm-wide
operational fields (phone, WhatsApp, address, hours, contact email) backed
by the generic `site_settings` key-value table (Document 4 §2.9). GET
always returns all SETTING_FIELDS keys (defaulting to null if never set,
since the table starts empty) rather than only whatever rows happen to
exist, so the form never has to guess which fields are missing.
"""
from flask import jsonify, request

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import SiteSetting
from app.utils.audit import record_audit_log
from app.validators.settings_validator import SETTING_FIELDS, validate_site_settings


@admin_bp.get("/site-settings")
@require_role("admin")
def get_site_settings():
    rows = {row.key: row.value for row in SiteSetting.query.filter(SiteSetting.key.in_(SETTING_FIELDS)).all()}
    return jsonify({field: rows.get(field) for field in SETTING_FIELDS})


@admin_bp.put("/site-settings")
@require_role("admin")
def update_site_settings():
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_site_settings(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    for field in SETTING_FIELDS:
        row = SiteSetting.query.filter_by(key=field).first()
        if row is None:
            row = SiteSetting(key=field, value=cleaned[field], value_type="string")
            db.session.add(row)
        else:
            row.value = cleaned[field]

    record_audit_log(get_current_admin().id, "update", "site_settings", request=request)
    db.session.commit()
    return jsonify(cleaned)
