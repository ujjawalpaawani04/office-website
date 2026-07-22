"""Newsletter campaign logic: the Smart Newsletter Recommendation classifier
(Step 3) and the actual send (Step 4/5), both reusing send_email() rather
than opening a second mail path.

The classifier is a plain rule-based keyword scorer, not an AI/LLM call -
this is deliberate. Nothing else in this codebase integrates an LLM
provider, and the feature is explicitly an admin-facing suggestion that must
never auto-send, which a keyword scorer satisfies without adding a new
external dependency.
"""
import logging

from flask import current_app

from app.extensions import db
from app.models import NewsletterCampaign, NewsletterSubscriber, SiteSetting
from app.services.email_service import send_email
from app.utils.audit import record_audit_log

logger = logging.getLogger(__name__)

# Always recommend sending - regulatory/compliance content subscribers are
# actively waiting on.
HIGH_PRIORITY_KEYWORDS = [
    "income tax", "gst", "budget", "cbdt", "mca", "roc",
    "compliance reminder", "compliance deadline", "itr filing", "itr due",
    "gst return", "tds return", "advance tax", "tax audit",
    "government circular", "circular no", "notification no", "new tax law",
    "due date", "deadline", "filing reminder",
]

# Recommend, but it's the admin's call - useful content, not a regulatory
# alert.
MEDIUM_PRIORITY_KEYWORDS = [
    "blog", "article", "tax tip", "case study", "webinar", "seminar",
    "announcement", "free consultation", "new service",
]

# Cosmetic/internal changes - never worth a subscriber's inbox. Checked
# first and wins outright even if a high-priority term also matches (e.g.
# "Fixed a typo in the GST page" must not read as a GST update).
EXCLUDE_KEYWORDS = [
    "typo", "css", "ui update", "ui change", "bug fix", "bugfix",
    "image change", "image replace", "seo update", "internal admin",
    "wording change", "cosmetic", "contact info update", "minor wording",
]


def classify_content(title, excerpt, content, source_type="blog"):
    """Scores a piece of admin-published content and returns whether the
    Smart Newsletter Recommendation popup should appear.

    Returns {"priority": "high"|"medium"|"low", "reason": str, "shouldPrompt": bool}.
    Never raises - always safe to attach to an API response unconditionally.
    """
    haystack = " ".join(filter(None, [title, excerpt, content])).lower()

    for keyword in EXCLUDE_KEYWORDS:
        if keyword in haystack:
            return {
                "priority": "low",
                "reason": f"Looks like a minor/cosmetic update (matched \"{keyword}\").",
                "shouldPrompt": False,
            }

    for keyword in HIGH_PRIORITY_KEYWORDS:
        if keyword in haystack:
            # A new service page mentioning "GST" is a service offering, not
            # an urgent regulatory alert - cap it at medium regardless.
            priority = "medium" if source_type == "service" else "high"
            return {
                "priority": priority,
                "reason": f"This looks important for your subscribers (matched \"{keyword}\").",
                "shouldPrompt": True,
            }

    for keyword in MEDIUM_PRIORITY_KEYWORDS:
        if keyword in haystack:
            return {
                "priority": "medium",
                "reason": f"This may be worth sharing with subscribers (matched \"{keyword}\").",
                "shouldPrompt": True,
            }

    return {
        "priority": "medium",
        "reason": "New published content - consider letting subscribers know.",
        "shouldPrompt": True,
    }


def _contact_details():
    rows = {row.key: row.value for row in SiteSetting.query.filter(
        SiteSetting.key.in_(["contactEmail", "phone", "address"])
    ).all()}
    return {
        "contact_email": rows.get("contactEmail"),
        "phone": rows.get("phone"),
        "address": rows.get("address"),
    }


def _email_context(subscriber, subject, summary, cta_url, cta_label):
    frontend_url = current_app.config["FRONTEND_URL"]
    return {
        "subject": subject,
        "summary": summary,
        "cta_url": cta_url,
        "cta_label": cta_label,
        "logo_url": f"{frontend_url}/logo.png",
        "unsubscribe_link": f"{frontend_url}/newsletter/unsubscribe/{subscriber.unsubscribe_token}",
        **_contact_details(),
    }


def send_welcome_email(subscriber, reactivated=False):
    """Sends the immediate first-subscription (or resubscription) email.

    Best-effort, same as every other send in this module - a delivery
    failure here must never turn subscribe() into a 500 for the visitor
    who just successfully joined the list.
    """
    frontend_url = current_app.config["FRONTEND_URL"]
    if reactivated:
        subject = "Welcome back to the Singh Amit & Associates Newsletter"
        summary = (
            "You're resubscribed. You'll get our tax, GST and compliance updates again, "
            "straight to this inbox."
        )
    else:
        subject = "You're subscribed to the Singh Amit & Associates Newsletter"
        summary = (
            "Thanks for subscribing! You'll now receive our tax, GST and compliance updates, "
            "new articles, and important announcements as they're published."
        )
    context = _email_context(subscriber, subject, summary, f"{frontend_url}/blogs", "Read Our Latest Articles")
    return send_email(subject, "emails/newsletter.html", context, to=subscriber.email)


def send_newsletter_campaign(subject, summary, cta_url, cta_label, sent_by_admin_id,
                              source_type=None, source_id=None, request=None):
    """Sends `subject`/`summary` to every currently-subscribed subscriber and
    records one campaign + one audit log row for the whole send (never one
    per recipient). Best-effort per recipient - one failed delivery never
    aborts the rest, matching send_email()'s own best-effort contract.

    Returns {"recipientCount", "successCount", "failureCount"}.
    """
    subscribers = NewsletterSubscriber.query.filter_by(status="subscribed").all()

    success_count = 0
    failure_count = 0
    for subscriber in subscribers:
        context = _email_context(subscriber, subject, summary, cta_url, cta_label)
        sent = send_email(subject, "emails/newsletter.html", context, to=subscriber.email)
        if sent:
            success_count += 1
        else:
            failure_count += 1

    campaign = NewsletterCampaign(
        subject=subject,
        summary=summary,
        cta_url=cta_url,
        cta_label=cta_label,
        source_type=source_type,
        source_id=source_id,
        sent_by_admin_id=sent_by_admin_id,
        recipient_count=len(subscribers),
        success_count=success_count,
        failure_count=failure_count,
    )
    db.session.add(campaign)
    db.session.flush()
    record_audit_log(
        sent_by_admin_id,
        "send",
        "newsletter_campaign",
        campaign.id,
        {"recipientCount": len(subscribers), "successCount": success_count, "failureCount": failure_count},
        request=request,
    )
    db.session.commit()

    return {
        "recipientCount": len(subscribers),
        "successCount": success_count,
        "failureCount": failure_count,
    }
