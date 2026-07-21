"""Small text-normalization helpers shared by the validators.

These trim whitespace and collapse empty strings to None so downstream code
(services, DB writes, email templates) never has to special-case "" vs
whitespace vs missing.
"""


def clean_str(value, max_length=None):
    if value is None:
        return ""
    text = str(value).strip()
    if max_length is not None:
        text = text[:max_length]
    return text


def clean_optional(value, max_length=None):
    text = clean_str(value, max_length)
    return text or None
