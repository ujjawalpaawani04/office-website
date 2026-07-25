"""Admin management of Recruitment: Job Openings (generic CRUD) and Job
Applications (hand-written - no Create since applications are
public-origin only, plus a résumé download endpoint that never exposes a
raw file path).
"""
import os

from flask import current_app, jsonify, request, send_from_directory

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import JobApplication, JobOpening
from app.utils.admin_crud import register_crud_routes
from app.utils.audit import record_audit_log
from app.utils.pagination import paginate_query
from app.validations.career_admin_validator import validate_job_opening


def _serialize_opening(item):
    return {
        "id": item.id,
        "title": item.title,
        "slug": item.slug,
        "department": item.department,
        "location": item.location,
        "employmentType": item.employment_type,
        "description": item.description,
        "requirements": item.requirements,
        "responsibilities": item.responsibilities,
        "minExperienceYears": item.min_experience_years,
        "isActive": item.is_active,
        "applicationCount": item.applications.count(),
    }


register_crud_routes(
    admin_bp,
    path="job-openings",
    model=JobOpening,
    entity_type="job_opening",
    serialize=_serialize_opening,
    validate=validate_job_opening,
    default_order_by=JobOpening.posted_at.desc(),
    search_fields=("title", "department"),
    soft_delete_field="is_active",
)


@admin_bp.delete("/job-openings/<int:opening_id>/permanent")
@require_role("admin")
def delete_job_opening_permanent(opening_id):
    """The generic factory's DELETE above only closes an opening
    (is_active=False, applications kept) since it's registered with
    soft_delete_field. This is the actual hard delete, admin-only and
    gated on the opening already being closed - same two-step guard as
    newsletter subscribers - so a live opening can't be permanently
    removed by mistake while still accepting applications."""
    opening = JobOpening.query.get(opening_id)
    if opening is None:
        return jsonify({"error": "Not found."}), 404

    if opening.is_active:
        return jsonify({"error": "Close this opening before deleting it."}), 422

    record_audit_log(get_current_admin().id, "delete", "job_opening", opening.id, request=request)
    db.session.delete(opening)
    db.session.commit()
    return "", 204


def _serialize_application(item):
    return {
        "id": item.id,
        "jobOpeningId": item.job_opening_id,
        "name": item.name,
        "email": item.email,
        "phone": item.phone,
        "positionAppliedFor": item.position_applied_for,
        "experience": item.experience,
        "message": item.message,
        "resumeFilename": item.resume_filename,
        "resumeMimeType": item.resume_mime_type,
        "resumeSizeBytes": item.resume_size_bytes,
        "status": item.status,
        "createdAt": item.created_at.isoformat(),
    }


@admin_bp.get("/careers/applications")
@require_role("admin", "editor")
def list_job_applications():
    query = JobApplication.query
    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)
    job_opening_id = request.args.get("jobOpeningId")
    if job_opening_id:
        query = query.filter_by(job_opening_id=job_opening_id)
    q = (request.args.get("q") or "").strip()
    if q:
        like = f"%{q}%"
        query = query.filter(db.or_(JobApplication.name.ilike(like), JobApplication.email.ilike(like)))
    query = query.order_by(JobApplication.created_at.desc())
    result = paginate_query(query, request.args)
    return jsonify({**result, "items": [_serialize_application(a) for a in result["items"]]})


@admin_bp.get("/careers/applications/<int:application_id>")
@require_role("admin", "editor")
def get_job_application(application_id):
    application = JobApplication.query.get(application_id)
    if application is None:
        return jsonify({"error": "Not found."}), 404
    return jsonify(_serialize_application(application))


@admin_bp.patch("/careers/applications/<int:application_id>")
@require_role("admin", "editor")
def update_job_application(application_id):
    application = JobApplication.query.get(application_id)
    if application is None:
        return jsonify({"error": "Not found."}), 404

    data = request.get_json(silent=True) or {}
    status = data.get("status")
    valid_statuses = {"new", "reviewed", "shortlisted", "rejected", "hired"}
    if status not in valid_statuses:
        return jsonify({"error": "Validation failed", "fields": {"status": "Invalid status."}}), 422

    application.status = status
    record_audit_log(
        get_current_admin().id, "status_change", "job_application", application.id, {"status": status}, request=request
    )
    db.session.commit()
    return jsonify(_serialize_application(application))


@admin_bp.get("/careers/applications/<int:application_id>/resume")
@require_role("admin", "editor")
def download_resume(application_id):
    """Résumés are never served from a public/guessable URL (Document 5
    §4.6) - this route requires the same admin JWT as every other admin
    endpoint, which is a simpler but equally effective substitute for a
    separate signed-URL scheme: the frontend fetches this with its
    Authorization header and turns the response into a downloadable blob,
    rather than ever rendering a plain <a href> to the file."""
    application = JobApplication.query.get(application_id)
    if application is None:
        return jsonify({"error": "Not found."}), 404

    # abspath() matters: resume_path was stored using whatever UPLOAD_FOLDER
    # resolved to at upload time, and older rows predate the fix that made
    # UPLOAD_FOLDER always absolute (see config/settings.py) - a relative
    # directory makes Werkzeug's send_from_directory 404 even when the file
    # genuinely exists, on Windows (see storage_service.py's media-serving
    # route for the first time this exact bug showed up).
    resume_dir = os.path.abspath(os.path.dirname(application.resume_path))
    filename = os.path.basename(application.resume_path)
    record_audit_log(get_current_admin().id, "download_resume", "job_application", application.id, request=request)
    db.session.commit()
    return send_from_directory(
        resume_dir, filename, as_attachment=True, download_name=application.resume_filename
    )


@admin_bp.delete("/careers/applications/<int:application_id>")
@require_role("admin")
def delete_job_application(application_id):
    application = JobApplication.query.get(application_id)
    if application is None:
        return jsonify({"error": "Not found."}), 404

    record_audit_log(get_current_admin().id, "delete", "job_application", application.id, request=request)
    db.session.delete(application)
    db.session.commit()

    try:
        os.remove(application.resume_path)
    except OSError:
        pass

    return "", 204
