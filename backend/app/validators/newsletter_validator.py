"""Server-side validation for public newsletter subscription and the admin
Send Newsletter action (Step 4/5 of the Newsletter improvement)."""
from app.utils.sanitize import clean_optional, clean_str
from app.validators.common import validate_email_address


def validate_subscribe_email(data):
    email = clean_str(data.get("email")).lower()

    errors = {}
    email_error = validate_email_address(email)
    if email_error:
        errors["email"] = email_error

    return {"email": email}, errors


def validate_send_newsletter(data):
    subject = clean_str(data.get("subject"), max_length=200)
    summary = clean_str(data.get("summary"), max_length=1000)
    cta_url = clean_optional(data.get("ctaUrl"), max_length=500)

    errors = {}
    if not subject:
        errors["subject"] = "Subject is required."
    if not summary:
        errors["summary"] = "Summary is required."
    if cta_url and not (cta_url.startswith("http://") or cta_url.startswith("https://") or cta_url.startswith("/")):
        errors["ctaUrl"] = "CTA link must be an absolute URL or a site-relative path."

    cleaned = {
        "subject": subject,
        "summary": summary,
        "cta_url": cta_url,
        "cta_label": clean_optional(data.get("ctaLabel"), max_length=80) or "Read More",
        "source_type": clean_optional(data.get("sourceType"), max_length=40),
        "source_id": data.get("sourceId") or None,
    }
    return cleaned, errors
