# Public job openings + POST /api/careers/applications land here in Step 4.
import os
import uuid

import magic
from flask import current_app, jsonify, request
from werkzeug.utils import secure_filename

from app.blueprints.careers import careers_bp
from app.extensions import db, limiter
from app.models import JobApplication, JobOpening

ALLOWED_RESUME_EXTENSIONS = {".pdf", ".doc", ".docx"}
ALLOWED_RESUME_MIME_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def serialize_opening(opening):
    return {
        "id": opening.id,
        "title": opening.title,
        "slug": opening.slug,
        "department": opening.department,
        "location": opening.location,
        "employmentType": opening.employment_type,
        "description": opening.description,
        "requirements": opening.requirements,
        "responsibilities": opening.responsibilities,
        "minExperienceYears": opening.min_experience_years,
    }


@careers_bp.get("/openings")
def list_openings():
    openings = (
        JobOpening.query.filter_by(is_active=True).order_by(JobOpening.posted_at.desc()).all()
    )
    return jsonify([serialize_opening(o) for o in openings])


@careers_bp.post("/applications")
@limiter.limit("5 per minute")
def submit_application():
    form = request.form
    name = (form.get("name") or "").strip()
    email = (form.get("email") or "").strip()
    mobile = (form.get("mobile") or "").strip()
    position = (form.get("position") or "").strip()
    cover_letter = (form.get("coverLetter") or "").strip() or None

    errors = {}
    if not name:
        errors["name"] = "Name is required."
    if not email:
        errors["email"] = "Email is required."
    if not mobile:
        errors["mobile"] = "Mobile number is required."

    resume = request.files.get("resume")
    if resume is None or resume.filename == "":
        errors["resume"] = "Resume is required."

    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 400

    _, ext = os.path.splitext(resume.filename)
    if ext.lower() not in ALLOWED_RESUME_EXTENSIONS:
        return jsonify({"error": "Resume must be a PDF or Word document."}), 400

    header = resume.stream.read(2048)
    resume.stream.seek(0)
    mime_type = magic.from_buffer(header, mime=True)
    if mime_type not in ALLOWED_RESUME_MIME_TYPES:
        return jsonify({"error": "Resume file content did not match an allowed document type."}), 400

    resume_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "resumes")
    os.makedirs(resume_dir, exist_ok=True)

    stored_filename = f"{uuid.uuid4().hex}-{secure_filename(resume.filename)}"
    stored_path = os.path.join(resume_dir, stored_filename)
    resume.save(stored_path)
    size_bytes = os.path.getsize(stored_path)

    job_opening = (
        JobOpening.query.filter(JobOpening.title.ilike(position), JobOpening.is_active.is_(True)).first()
        if position
        else None
    )

    application = JobApplication(
        job_opening_id=job_opening.id if job_opening else None,
        name=name,
        email=email,
        mobile=mobile,
        position_applied_for=position or None,
        cover_letter=cover_letter,
        resume_filename=resume.filename,
        resume_path=stored_path,
        resume_mime_type=mime_type,
        resume_size_bytes=size_bytes,
        ip_address=request.remote_addr,
    )
    db.session.add(application)
    db.session.commit()

    return jsonify({"message": "Application submitted successfully."}), 201
