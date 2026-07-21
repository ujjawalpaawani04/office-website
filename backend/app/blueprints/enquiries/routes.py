# POST /api/enquiries lands here in Step 4.
from flask import jsonify, request

from app.blueprints.enquiries import enquiries_bp
from app.extensions import db, limiter
from app.models import Enquiry


@enquiries_bp.post("")
@limiter.limit("5 per minute")
def create_enquiry():
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    mobile = (data.get("mobile") or "").strip()
    subject = (data.get("subject") or "").strip() or None
    message = (data.get("message") or "").strip()

    errors = {}
    if not name:
        errors["name"] = "Name is required."
    if not email:
        errors["email"] = "Email is required."
    if not mobile:
        errors["mobile"] = "Mobile number is required."
    if not message:
        errors["message"] = "Message is required."

    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 400

    enquiry = Enquiry(
        name=name,
        email=email,
        mobile=mobile,
        subject=subject,
        message=message,
        ip_address=request.remote_addr,
        user_agent=(request.headers.get("User-Agent") or "")[:255] or None,
    )
    db.session.add(enquiry)
    db.session.commit()

    return jsonify({"message": "Enquiry submitted successfully."}), 201
