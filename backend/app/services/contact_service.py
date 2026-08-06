"""Business logic for the Contact Us feature. Kept separate from the
controller so it has no dependency on the HTTP layer beyond the bits of
`request` it actually needs (IP/user-agent) - it could be called from a
script or an admin "resend notification" action just as easily."""
from datetime import timedelta

from app.extensions import db
from app.models import Enquiry
from app.models.mixins import utcnow
from app.services.email_service import send_email

# A double-click, a slow-network client retry, or a resubmission within the
# rate-limit window would otherwise create a second identical enquiry row
# and re-send the notification email. Short-lived dedupe on the same
# email+message closes that without a client-generated idempotency key -
# mirrors the upsert-on-natural-key pattern already used for Calendly embed
# bookings in appointment_service.create_from_embed.
DEDUPE_WINDOW = timedelta(minutes=2)


def create_enquiry(cleaned_data, request):
    """Returns (enquiry, created: bool) - a duplicate submission within
    DEDUPE_WINDOW returns the existing row instead of creating a second one
    and re-sending the notification email."""
    existing = (
        Enquiry.query.filter(
            Enquiry.email == cleaned_data["email"],
            Enquiry.message == cleaned_data["message"],
            Enquiry.created_at >= utcnow() - DEDUPE_WINDOW,
        )
        .order_by(Enquiry.created_at.desc())
        .first()
    )
    if existing:
        return existing, False

    enquiry = Enquiry(
        name=cleaned_data["name"],
        email=cleaned_data["email"],
        phone=cleaned_data["phone"],
        service=cleaned_data["service"],
        message=cleaned_data["message"],
        ip_address=request.remote_addr,
        user_agent=(request.headers.get("User-Agent") or "")[:255] or None,
    )
    db.session.add(enquiry)
    db.session.commit()

    send_email(
        subject=f"New Contact Enquiry - {enquiry.name}",
        template_name="emails/contact_notification.html",
        context={
            "name": enquiry.name,
            "email": enquiry.email,
            "phone": enquiry.phone,
            "service": enquiry.service,
            "message": enquiry.message,
            "submitted_at": enquiry.created_at,
        },
    )

    return enquiry, True
