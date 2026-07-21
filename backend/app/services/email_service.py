"""Production email notifications via Resend, with an SMTP fallback kept
around for local development only.

Why Resend (or SendGrid / SES) instead of Gmail SMTP in production:
- Gmail enforces roughly a 500-email/day limit per account and throttles
  aggressively; a burst of form spam can lock out the whole account.
- Gmail SMTP has no delivery/bounce/complaint webhooks and no way to
  authenticate a dedicated sending domain - mail sent this way increasingly
  lands in spam, and you have no visibility into why.
- It requires storing a personal Google account password/app-password as a
  long-lived secret; a leak compromises more than just form notifications.
- No sending-domain reputation isolation: if the contact form gets spammed,
  the same Gmail account used for real mail can end up on a blacklist.

Resend (and SendGrid/SES the same way) give a scoped API key, a verified
sending domain (or Resend's shared `onboarding@resend.dev` sender while you
haven't verified one yet), delivery tracking, and sending limits sized for
an application rather than one person's inbox. Resend is used here as the
top pick from the brief (Resend > SendGrid > SES) for its simplicity.
"""
import logging

import resend
from flask import current_app, render_template

logger = logging.getLogger(__name__)


def _send_via_resend(to, subject, html, attachments):
    resend.api_key = current_app.config["RESEND_API_KEY"]
    payload = {
        "from": current_app.config["EMAIL_FROM"],
        "to": [to],
        "subject": subject,
        "html": html,
    }
    if attachments:
        payload["attachments"] = [
            {
                "filename": a["filename"],
                "content": list(a["content"]),  # Resend expects raw bytes as a list of ints
                "content_type": a.get("content_type"),
            }
            for a in attachments
        ]
    resend.Emails.send(payload)


def _send_via_smtp(to, subject, html, attachments):
    """Local-dev-only fallback, used only when EMAIL_PROVIDER=smtp. Not
    recommended for production - see module docstring."""
    import smtplib
    from email.mime.application import MIMEApplication
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText

    host = current_app.config["SMTP_HOST"]
    port = current_app.config["SMTP_PORT"]
    user = current_app.config["SMTP_USER"]
    password = current_app.config["SMTP_PASSWORD"]

    message = MIMEMultipart("mixed")
    message["Subject"] = subject
    message["From"] = user
    message["To"] = to

    body = MIMEMultipart("alternative")
    body.attach(MIMEText(html, "html"))
    message.attach(body)

    for attachment in attachments or []:
        part = MIMEApplication(bytes(attachment["content"]), Name=attachment["filename"])
        part["Content-Disposition"] = f'attachment; filename="{attachment["filename"]}"'
        message.attach(part)

    with smtplib.SMTP(host, port) as server:
        server.starttls()
        server.login(user, password)
        server.sendmail(user, [to], message.as_string())


def send_email(subject, template_name, context, to=None, attachments=None):
    """Renders `template_name` (a Jinja2 template under backend/templates/,
    autoescaped so user-supplied form fields can't inject markup into the
    notification email) and sends it.

    `attachments` is an optional list of {"filename", "content" (raw bytes),
    "content_type"} dicts - used by career_service.py to attach the actual
    resume file rather than just naming it in the email body.

    Best-effort by design: a mail provider outage is logged, never raised,
    so it can never roll back or block a form submission that has already
    been safely written to the database. Returns True/False for callers
    that want to know whether the send actually happened.
    """
    if not current_app.config.get("EMAIL_ENABLED", True):
        logger.info("Email disabled (EMAIL_ENABLED=false); skipping '%s'", subject)
        return False

    recipient = to or current_app.config["EMAIL_TO"]
    html = render_template(template_name, **context)
    provider = current_app.config.get("EMAIL_PROVIDER", "resend")

    try:
        if provider == "smtp":
            if not current_app.config.get("SMTP_HOST"):
                logger.warning("EMAIL_PROVIDER=smtp but SMTP_HOST is not set; skipping '%s'", subject)
                return False
            _send_via_smtp(recipient, subject, html, attachments)
        else:
            if not current_app.config.get("RESEND_API_KEY"):
                logger.warning(
                    "RESEND_API_KEY is not set; skipping email '%s'. Set RESEND_API_KEY "
                    "(and optionally EMAIL_FROM once a sending domain is verified) to enable it.",
                    subject,
                )
                return False
            _send_via_resend(recipient, subject, html, attachments)

        logger.info("Sent email '%s' to %s via %s", subject, recipient, provider)
        return True
    except Exception:
        logger.exception("Failed to send email '%s' to %s via %s", subject, recipient, provider)
        return False
