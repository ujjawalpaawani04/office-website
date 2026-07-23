"""Read-only aggregation for the Admin Dashboard. Every number here is
derived from tables that already exist and are already being written to by
the live public endpoints - no new instrumentation, per Document 2 §1."""
from app.models import (
    Admin,
    AuditLog,
    BlogPost,
    Enquiry,
    JobApplication,
    JobOpening,
    NewsletterSubscriber,
)

RECENT_LIST_LIMIT = 5
ACTIVITY_LIMIT = 20


def _serialize_enquiry(enquiry):
    return {
        "id": enquiry.id,
        "name": enquiry.name,
        "email": enquiry.email,
        "service": enquiry.service,
        "status": enquiry.status,
        "createdAt": enquiry.created_at.isoformat(),
    }


def _serialize_application(application):
    return {
        "id": application.id,
        "name": application.name,
        "email": application.email,
        "positionAppliedFor": application.position_applied_for,
        "status": application.status,
        "createdAt": application.created_at.isoformat(),
    }


def get_summary():
    recent_enquiries = Enquiry.query.order_by(Enquiry.created_at.desc()).limit(RECENT_LIST_LIMIT).all()
    recent_applications = (
        JobApplication.query.order_by(JobApplication.created_at.desc()).limit(RECENT_LIST_LIMIT).all()
    )

    return {
        "newEnquiries": Enquiry.query.filter_by(status="new").count(),
        "newApplications": JobApplication.query.filter_by(status="new").count(),
        "publishedPosts": BlogPost.query.filter_by(status="published").count(),
        "activeJobOpenings": JobOpening.query.filter_by(is_active=True).count(),
        "newsletterSubscribers": NewsletterSubscriber.query.filter_by(status="subscribed").count(),
        "recentEnquiries": [_serialize_enquiry(e) for e in recent_enquiries],
        "recentApplications": [_serialize_application(a) for a in recent_applications],
    }


def get_recent_activity(limit=ACTIVITY_LIMIT):
    logs = AuditLog.query.order_by(AuditLog.created_at.desc()).limit(limit).all()
    admin_ids = {log.admin_id for log in logs if log.admin_id is not None}
    admins_by_id = {a.id: a for a in Admin.query.filter(Admin.id.in_(admin_ids)).all()} if admin_ids else {}

    return [
        {
            "id": log.id,
            "adminName": admins_by_id[log.admin_id].name if log.admin_id in admins_by_id else None,
            "action": log.action,
            "entityType": log.entity_type,
            "entityId": log.entity_id,
            "createdAt": log.created_at.isoformat(),
        }
        for log in logs
    ]
