"""Server-side validation for PUT /api/admin/site-settings (Document 2 §28)."""
import re

from app.utils.sanitize import clean_optional
from app.validations.common import validate_email_address

PHONE_PATTERN = re.compile(r"^[6-9]\d{9}$")

# The canonical, admin-editable settings keys - deliberately a small fixed
# set (not an arbitrary key-value editor) so the form stays a simple,
# guided screen rather than a raw config table (Document 2 §28's intent).
SETTING_FIELDS = ["phone", "whatsapp", "address", "businessHours", "contactEmail"]


def validate_site_settings(data):
    errors = {}

    # phone, contactEmail and businessHours are all stored as a single
    # newline-separated string (the SiteSetting.value column is a plain
    # TEXT field, so no schema change is needed for "more than one line") -
    # the admin can enter multiple numbers/emails, or a multi-line schedule,
    # one per line, and the public site renders each line separately
    # instead of one run-on line.
    phone = clean_optional(data.get("phone"), max_length=100)
    if phone:
        phone_lines = [line.strip() for line in phone.split("\n") if line.strip()]
        invalid_phone = next((line for line in phone_lines if not PHONE_PATTERN.match(line)), None)
        if invalid_phone:
            errors["phone"] = f'"{invalid_phone}" is not a valid 10-digit Indian mobile number.'
        else:
            phone = "\n".join(phone_lines)

    whatsapp = clean_optional(data.get("whatsapp"), max_length=10)
    if whatsapp and not PHONE_PATTERN.match(whatsapp):
        errors["whatsapp"] = "Enter a valid 10-digit Indian mobile number."

    contact_email = clean_optional(data.get("contactEmail"), max_length=500)
    if contact_email:
        email_lines = [line.strip() for line in contact_email.split("\n") if line.strip()]
        invalid_email = next((line for line in email_lines if validate_email_address(line)), None)
        if invalid_email:
            errors["contactEmail"] = f'"{invalid_email}" is not a valid email address.'
        else:
            contact_email = "\n".join(email_lines)

    cleaned = {
        "phone": phone,
        "whatsapp": whatsapp,
        "address": clean_optional(data.get("address")),
        "businessHours": clean_optional(data.get("businessHours"), max_length=500),
        "contactEmail": contact_email,
    }
    return cleaned, errors
