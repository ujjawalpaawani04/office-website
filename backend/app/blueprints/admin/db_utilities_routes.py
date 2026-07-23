"""Database Utilities (Document 2 §33) - a small, safe diagnostic window,
deliberately not a raw SQL console (unnecessary security risk for this
tool). Re-running the seed script is gated to non-production environments
only, enforced server-side (never just hidden client-side) since running
it against a live database with real enquiries/applications would be
destructive/duplicative.
"""
from flask import current_app, jsonify

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import (
    Admin,
    Award,
    BlogAuthor,
    BlogCategory,
    BlogPost,
    BlogTag,
    Certification,
    Enquiry,
    FirmStat,
    JobApplication,
    JobOpening,
    Media,
    NewsletterSubscriber,
    RefreshToken,
    Service,
    SiteSetting,
    TeamMember,
    Testimonial,
)
from app.utils.audit import record_audit_log

_TABLES = {
    "admins": Admin,
    "refresh_tokens": RefreshToken,
    "media": Media,
    "site_settings": SiteSetting,
    "enquiries": Enquiry,
    "job_openings": JobOpening,
    "job_applications": JobApplication,
    "newsletter_subscribers": NewsletterSubscriber,
    "blog_categories": BlogCategory,
    "blog_tags": BlogTag,
    "blog_authors": BlogAuthor,
    "blog_posts": BlogPost,
    "team_members": TeamMember,
    "testimonials": Testimonial,
    "awards": Award,
    "certifications": Certification,
    "services": Service,
    "firm_stats": FirmStat,
}


@admin_bp.get("/db-utilities/status")
@require_role("admin")
def db_status():
    try:
        version = db.session.execute(db.text("SELECT version_num FROM alembic_version")).scalar()
        connection_ok = True
    except Exception:
        version = None
        connection_ok = False

    row_counts = {name: model.query.count() for name, model in _TABLES.items()} if connection_ok else {}

    return jsonify(
        {
            "connectionOk": connection_ok,
            "migrationVersion": version,
            "environment": current_app.config.get("ENV"),
            "seedAllowed": current_app.config.get("ENV") in {"development", "staging"},
            "rowCounts": row_counts,
        }
    )


@admin_bp.post("/db-utilities/reseed")
@require_role("admin")
def db_reseed():
    if current_app.config.get("ENV") not in {"development", "staging"}:
        return jsonify({"error": "This action is disabled in production."}), 403

    import subprocess
    import sys
    from pathlib import Path

    # Shelled out to, rather than importing and calling seed_data.main()
    # in-process: that script builds its own Flask app + app context
    # internally (it's designed to run standalone), and nesting a second
    # create_app() inside this already-running request would mean two
    # app/db instances briefly overlapping - a subprocess keeps the two
    # completely isolated, which is the safer boundary even though the
    # script's own upsert-by-natural-key logic is idempotent either way.
    script_path = Path(current_app.root_path).parent / "scripts" / "seed_data.py"
    result = subprocess.run(
        [sys.executable, str(script_path)], capture_output=True, text=True, timeout=120
    )
    if result.returncode != 0:
        current_app.logger.error("Reseed failed: %s", result.stderr)
        return jsonify({"error": "Seed script failed. Check server logs."}), 500

    record_audit_log(get_current_admin().id, "seed_data_run", "database")
    db.session.commit()
    return jsonify({"message": "Seed data re-applied."})
