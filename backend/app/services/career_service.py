"""Business logic for the Career application feature: stores the resume via
storage_service, persists the application, and fires the notification
email. Separate from the controller for the same testability reason as
contact_service.py."""
from app.extensions import db
from app.models import JobApplication, JobOpening
from app.services.email_service import send_email
from app.services.storage_service import save_resume


def create_application(cleaned_data, mime_type, request):
    resume = cleaned_data["resume"]

    # Captured from the upload stream directly (not re-read from disk after
    # saving) so this works the same once STORAGE_BACKEND=s3 is implemented.
    resume.stream.seek(0)
    resume_bytes = resume.read()
    resume.stream.seek(0)

    stored = save_resume(resume)

    position = cleaned_data["position"]
    # Best-effort match to a real opening so the admin view can filter by
    # role; unmatched (e.g. "General Application") just leaves this unset -
    # the free-text position is still preserved below.
    job_opening = (
        JobOpening.query.filter(JobOpening.title.ilike(position), JobOpening.is_active.is_(True)).first()
        if position
        else None
    )

    application = JobApplication(
        job_opening_id=job_opening.id if job_opening else None,
        name=cleaned_data["name"],
        email=cleaned_data["email"],
        phone=cleaned_data["phone"],
        position_applied_for=position,
        experience=cleaned_data["experience"],
        message=cleaned_data["message"],
        resume_filename=stored["filename"],
        resume_path=stored["path"],
        resume_mime_type=mime_type,
        resume_size_bytes=stored["size_bytes"],
        ip_address=request.remote_addr,
    )
    db.session.add(application)
    db.session.commit()

    send_email(
        subject=f"New Career Application - {application.name}",
        template_name="emails/career_notification.html",
        context={
            "name": application.name,
            "email": application.email,
            "phone": application.phone,
            "position": application.position_applied_for or "General Application",
            "experience": application.experience,
            "message": application.message,
            "resume_filename": application.resume_filename,
            "submitted_at": application.created_at,
        },
        attachments=[
            {
                "filename": application.resume_filename,
                "content": resume_bytes,
                "content_type": mime_type,
            }
        ],
    )

    return application
