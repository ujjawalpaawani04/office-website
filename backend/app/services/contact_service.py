"""Business logic for the Contact Us feature. Kept separate from the
controller so it has no dependency on the HTTP layer beyond the bits of
`request` it actually needs (IP/user-agent) - it could be called from a
script or an admin "resend notification" action just as easily."""
from app.extensions import db
from app.models import Enquiry
from app.services.email_service import send_email


def create_enquiry(cleaned_data, request):
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

    return enquiry
