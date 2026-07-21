# POST /api/newsletter/subscribe lands here in Step 4.
from datetime import datetime, timezone

from flask import jsonify, request

from app.blueprints.newsletter import newsletter_bp
from app.extensions import db, limiter
from app.models import NewsletterSubscriber


@newsletter_bp.post("/subscribe")
@limiter.limit("5 per minute")
def subscribe():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()

    if not email or "@" not in email:
        return jsonify({"error": "A valid email address is required."}), 400

    subscriber = NewsletterSubscriber.query.filter_by(email=email).first()
    if subscriber is None:
        subscriber = NewsletterSubscriber(email=email, status="subscribed", ip_address=request.remote_addr)
        db.session.add(subscriber)
    elif subscriber.status != "subscribed":
        subscriber.status = "subscribed"
        subscriber.subscribed_at = datetime.now(timezone.utc)
        subscriber.unsubscribed_at = None

    db.session.commit()
    return jsonify({"message": "Subscribed successfully."}), 201
