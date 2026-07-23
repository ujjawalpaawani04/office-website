"""Admin management of Lead Management: Enquiries (status updates, plus an
admin-only hard delete for records that no longer need to be retained) and
Newsletter Subscribers (unsubscribe, then delete). Both support a CSV export
of the current filtered result set (Document 5 §4.5/§4.7).
"""
import csv
import io

from flask import Response, jsonify, request

from app.blueprints.admin import admin_bp
from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.models import Enquiry, NewsletterSubscriber
from app.services.newsletter_service import send_newsletter_campaign
from app.utils.audit import record_audit_log
from app.utils.pagination import paginate_query
from app.validators.newsletter_validator import validate_send_newsletter


def _serialize_enquiry(item):
    return {
        "id": item.id,
        "name": item.name,
        "email": item.email,
        "phone": item.phone,
        "service": item.service,
        "message": item.message,
        "status": item.status,
        "ipAddress": item.ip_address,
        "createdAt": item.created_at.isoformat(),
    }


def _enquiries_query():
    query = Enquiry.query
    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)
    q = (request.args.get("q") or "").strip()
    if q:
        like = f"%{q}%"
        query = query.filter(db.or_(Enquiry.name.ilike(like), Enquiry.email.ilike(like), Enquiry.phone.ilike(like)))
    return query.order_by(Enquiry.created_at.desc())


@admin_bp.get("/enquiries")
@require_role("admin", "editor")
def list_enquiries():
    result = paginate_query(_enquiries_query(), request.args)
    return jsonify({**result, "items": [_serialize_enquiry(e) for e in result["items"]]})


@admin_bp.get("/enquiries/export")
@require_role("admin", "editor")
def export_enquiries():
    rows = _enquiries_query().all()
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["Name", "Email", "Phone", "Service", "Message", "Status", "Submitted At"])
    for e in rows:
        writer.writerow([e.name, e.email, e.phone, e.service, e.message, e.status, e.created_at.isoformat()])
    return Response(
        buffer.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=enquiries.csv"},
    )


@admin_bp.patch("/enquiries/<int:enquiry_id>")
@require_role("admin", "editor")
def update_enquiry(enquiry_id):
    enquiry = Enquiry.query.get(enquiry_id)
    if enquiry is None:
        return jsonify({"error": "Not found."}), 404

    status = (request.get_json(silent=True) or {}).get("status")
    if status not in {"new", "in_progress", "resolved"}:
        return jsonify({"error": "Validation failed", "fields": {"status": "Invalid status."}}), 422

    enquiry.status = status
    record_audit_log(get_current_admin().id, "status_change", "enquiry", enquiry.id, {"status": status}, request=request)
    db.session.commit()
    return jsonify(_serialize_enquiry(enquiry))


@admin_bp.delete("/enquiries/<int:enquiry_id>")
@require_role("admin")
def delete_enquiry(enquiry_id):
    enquiry = Enquiry.query.get(enquiry_id)
    if enquiry is None:
        return jsonify({"error": "Not found."}), 404

    record_audit_log(get_current_admin().id, "delete", "enquiry", enquiry.id, request=request)
    db.session.delete(enquiry)
    db.session.commit()
    return "", 204


# --- Newsletter -----------------------------------------------------------


def _serialize_subscriber(item):
    return {
        "id": item.id,
        "email": item.email,
        "status": item.status,
        "subscribedAt": item.subscribed_at.isoformat() if item.subscribed_at else None,
        "unsubscribedAt": item.unsubscribed_at.isoformat() if item.unsubscribed_at else None,
        "createdAt": item.created_at.isoformat() if item.created_at else None,
    }


def _subscribers_query():
    query = NewsletterSubscriber.query
    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)
    q = (request.args.get("q") or "").strip()
    if q:
        query = query.filter(NewsletterSubscriber.email.ilike(f"%{q}%"))
    return query.order_by(NewsletterSubscriber.subscribed_at.desc())


@admin_bp.get("/newsletter/subscribers")
@require_role("admin", "editor")
def list_newsletter_subscribers():
    result = paginate_query(_subscribers_query(), request.args)
    return jsonify({**result, "items": [_serialize_subscriber(s) for s in result["items"]]})


@admin_bp.get("/newsletter/subscribers/export")
@require_role("admin", "editor")
def export_newsletter_subscribers():
    rows = _subscribers_query().all()
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["Email", "Status", "Subscribed At"])
    for s in rows:
        writer.writerow([s.email, s.status, s.subscribed_at.isoformat() if s.subscribed_at else ""])
    return Response(
        buffer.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=newsletter_subscribers.csv"},
    )


@admin_bp.patch("/newsletter/subscribers/<int:subscriber_id>/unsubscribe")
@require_role("admin", "editor")
def unsubscribe_subscriber(subscriber_id):
    from datetime import datetime, timezone

    subscriber = NewsletterSubscriber.query.get(subscriber_id)
    if subscriber is None:
        return jsonify({"error": "Not found."}), 404

    if subscriber.status == "unsubscribed":
        # Idempotent - a double-click or stale UI state shouldn't error.
        return jsonify(_serialize_subscriber(subscriber))

    subscriber.status = "unsubscribed"
    subscriber.unsubscribed_at = datetime.now(timezone.utc)
    record_audit_log(get_current_admin().id, "unsubscribe", "newsletter_subscriber", subscriber.id, request=request)
    db.session.commit()
    return jsonify(_serialize_subscriber(subscriber))


@admin_bp.patch("/newsletter/subscribers/<int:subscriber_id>/subscribe")
@require_role("admin", "editor")
def resubscribe_subscriber(subscriber_id):
    from datetime import datetime, timezone

    subscriber = NewsletterSubscriber.query.get(subscriber_id)
    if subscriber is None:
        return jsonify({"error": "Not found."}), 404

    if subscriber.status == "subscribed":
        # Idempotent - a double-click or stale UI state shouldn't error.
        return jsonify(_serialize_subscriber(subscriber))

    subscriber.status = "subscribed"
    subscriber.subscribed_at = datetime.now(timezone.utc)
    subscriber.unsubscribed_at = None
    record_audit_log(get_current_admin().id, "subscribe", "newsletter_subscriber", subscriber.id, request=request)
    db.session.commit()
    return jsonify(_serialize_subscriber(subscriber))


@admin_bp.delete("/newsletter/subscribers/<int:subscriber_id>")
@require_role("admin", "editor")
def delete_subscriber(subscriber_id):
    subscriber = NewsletterSubscriber.query.get(subscriber_id)
    if subscriber is None:
        return jsonify({"error": "Not found."}), 404

    if subscriber.status != "unsubscribed":
        return jsonify({"error": "Unsubscribe this subscriber before deleting them."}), 422

    record_audit_log(get_current_admin().id, "delete", "newsletter_subscriber", subscriber.id, request=request)
    db.session.delete(subscriber)
    db.session.commit()
    return "", 204


@admin_bp.post("/newsletter/send")
@require_role("admin", "editor")
def send_newsletter():
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_send_newsletter(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    result = send_newsletter_campaign(
        subject=cleaned["subject"],
        summary=cleaned["summary"],
        cta_url=cleaned["cta_url"],
        cta_label=cleaned["cta_label"],
        sent_by_admin_id=get_current_admin().id,
        source_type=cleaned["source_type"],
        source_id=cleaned["source_id"],
        request=request,
    )
    return jsonify(result), 201
