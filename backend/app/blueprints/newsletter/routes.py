# POST /api/newsletter/subscribe lands here in Step 4.
from datetime import datetime, timezone

from flask import jsonify, request

from app.blueprints.newsletter import newsletter_bp
from app.extensions import db, limiter
from app.models import NewsletterSubscriber
from app.services.newsletter_service import send_welcome_email
from app.validations.newsletter_validator import validate_subscribe_email


@newsletter_bp.post("/subscribe")
@limiter.limit("5 per minute")
def subscribe():
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_subscribe_email(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    email = cleaned["email"]
    subscriber = NewsletterSubscriber.query.filter_by(email=email).first()

    if subscriber is None:
        subscriber = NewsletterSubscriber(email=email, status="subscribed", ip_address=request.remote_addr)
        db.session.add(subscriber)
        db.session.commit()
        send_welcome_email(subscriber)
        return jsonify({"message": "Subscribed successfully.", "alreadySubscribed": False}), 201

    if subscriber.status == "subscribed":
        # No DB write - requirement is explicit that re-subscribing an
        # already-active email must never create a duplicate record.
        return jsonify({"message": "You are already subscribed to our newsletter.", "alreadySubscribed": True}), 200

    subscriber.status = "subscribed"
    subscriber.subscribed_at = datetime.now(timezone.utc)
    subscriber.unsubscribed_at = None
    db.session.commit()
    send_welcome_email(subscriber, reactivated=True)
    return jsonify({"message": "Subscribed successfully.", "alreadySubscribed": False}), 200


@newsletter_bp.post("/unsubscribe/<token>")
@limiter.limit("10 per minute")
def unsubscribe(token):
    subscriber = NewsletterSubscriber.query.filter_by(unsubscribe_token=token).first()
    if subscriber is None:
        return jsonify({"error": "This unsubscribe link is invalid or has expired."}), 404

    if subscriber.status == "unsubscribed":
        return jsonify({"message": "You are already unsubscribed."}), 200

    subscriber.status = "unsubscribed"
    subscriber.unsubscribed_at = datetime.now(timezone.utc)
    db.session.commit()
    return jsonify({"message": "You have successfully unsubscribed from our newsletter."}), 200
