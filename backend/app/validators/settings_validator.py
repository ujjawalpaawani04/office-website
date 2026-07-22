"""Server-side validation for PUT /api/admin/site-settings (Document 2 §28)."""
import re

from app.utils.sanitize import clean_optional
from app.validators.common import validate_email_address

PHONE_PATTERN = re.compile(r"^[6-9]\d{9}$")

# The canonical, admin-editable settings keys - deliberately a small fixed
# set (not an arbitrary key-value editor) so the form stays a simple,
# guided screen rather than a raw config table (Document 2 §28's intent).
SETTING_FIELDS = ["phone", "whatsapp", "address", "businessHours", "contactEmail"]


def validate_site_settings(data):
    errors = {}
    phone = clean_optional(data.get("phone"), max_length=10)
    if phone and not PHONE_PATTERN.match(phone):
        errors["phone"] = "Enter a valid 10-digit Indian mobile number."

    whatsapp = clean_optional(data.get("whatsapp"), max_length=10)
    if whatsapp and not PHONE_PATTERN.match(whatsapp):
        errors["whatsapp"] = "Enter a valid 10-digit Indian mobile number."

    contact_email = clean_optional(data.get("contactEmail"), max_length=190)
    if contact_email:
        email_error = validate_email_address(contact_email)
        if email_error:
            errors["contactEmail"] = email_error

    cleaned = {
        "phone": phone,
        "whatsapp": whatsapp,
        "address": clean_optional(data.get("address")),
        "businessHours": clean_optional(data.get("businessHours"), max_length=200),
        "contactEmail": contact_email,
    }
    return cleaned, errors
