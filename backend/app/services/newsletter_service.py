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
from concurrent.futures import ThreadPoolExecutor

from flask import current_app

from app.extensions import db
from app.models import NewsletterCampaign, NewsletterSubscriber, SiteSetting
from app.services.email_service import send_email
from app.utils.audit import record_audit_log

logger = logging.getLogger(__name__)

# Runs the actual per-recipient send loop off the request thread (see
# start_newsletter_campaign) - a stdlib ThreadPoolExecutor, not a real task
# queue (Celery/RQ). This app has no other background-job infrastructure,
# and adding one is a bigger architectural change than "don't block this
# one request" calls for; if subscriber volume grows enough to need
# guaranteed delivery/retries, a real queue is the right next step, not
# this. max_workers=2 just bounds how many sends can run concurrently if an
# admin fires off several in quick succession - this isn't a high-throughput
# job system.
_send_executor = ThreadPoolExecutor(max_workers=2, thread_name_prefix="newsletter-send")

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


def start_newsletter_campaign(subject, summary, cta_url, cta_label, sent_by_admin_id,
                               source_type=None, source_id=None, request=None):
    """Records the campaign row immediately (status="sending") and hands the
    actual per-recipient send loop to a background thread, so the request
    that triggered this returns right away instead of blocking on however
    many subscribers exist. Poll GET /admin/newsletter/campaigns/<id> for
    the final success/failure counts once status flips to "sent".

    Returns {"campaignId", "status", "recipientCount"}.
    """
    subscriber_ids = [
        row[0] for row in NewsletterSubscriber.query.filter_by(status="subscribed").with_entities(NewsletterSubscriber.id)
    ]

    campaign = NewsletterCampaign(
        subject=subject,
        summary=summary,
        cta_url=cta_url,
        cta_label=cta_label,
        source_type=source_type,
        source_id=source_id,
        sent_by_admin_id=sent_by_admin_id,
        recipient_count=len(subscriber_ids),
        success_count=0,
        failure_count=0,
        status="sending",
    )
    db.session.add(campaign)
    db.session.flush()
    record_audit_log(
        sent_by_admin_id,
        "send",
        "newsletter_campaign",
        campaign.id,
        {"recipientCount": len(subscriber_ids)},
        request=request,
    )
    db.session.commit()

    # The background thread gets its own app context (Flask-SQLAlchemy's
    # db.session is scoped to one) rather than reusing this request's -
    # _get_current_object() unwraps the real Flask app from the
    # request-bound proxy so the thread can push its own context onto it.
    app = current_app._get_current_object()
    _send_executor.submit(
        _run_campaign_send, app, campaign.id, subject, summary, cta_url, cta_label, subscriber_ids
    )

    return {
        "campaignId": campaign.id,
        "status": campaign.status,
        "recipientCount": len(subscriber_ids),
    }


_SEND_BATCH_SIZE = 50


def _run_campaign_send(app, campaign_id, subject, summary, cta_url, cta_label, subscriber_ids):
    """Runs entirely off the request thread - re-fetches subscribers in
    batches (rather than reusing ORM objects loaded on the request's
    session, which isn't safe to touch from another thread) and re-checks
    each one's subscribed status, so someone who unsubscribes mid-send is
    respected. Batched instead of one query per recipient, but each batch is
    still fetched fresh right before its emails go out."""
    with app.app_context():
        success_count = 0
        failure_count = 0
        try:
            for batch_start in range(0, len(subscriber_ids), _SEND_BATCH_SIZE):
                batch_ids = subscriber_ids[batch_start:batch_start + _SEND_BATCH_SIZE]
                subscribers_by_id = {
                    s.id: s
                    for s in NewsletterSubscriber.query.filter(NewsletterSubscriber.id.in_(batch_ids)).all()
                }
                for subscriber_id in batch_ids:
                    subscriber = subscribers_by_id.get(subscriber_id)
                    if subscriber is None or subscriber.status != "subscribed":
                        continue
                    context = _email_context(subscriber, subject, summary, cta_url, cta_label)
                    sent = send_email(subject, "emails/newsletter.html", context, to=subscriber.email)
                    if sent:
                        success_count += 1
                    else:
                        failure_count += 1
        except Exception:
            logger.exception("Newsletter campaign %s failed mid-send", campaign_id)

        try:
            campaign = NewsletterCampaign.query.get(campaign_id)
            if campaign is not None:
                campaign.success_count = success_count
                campaign.failure_count = failure_count
                campaign.status = "sent"
                db.session.commit()
        except Exception:
            # If even this fails, the campaign is stuck at "sending" - logged
            # loudly since there's no request/caller left to surface it to.
            logger.exception("Could not record final result for newsletter campaign %s", campaign_id)


def get_campaign_status(campaign_id):
    campaign = NewsletterCampaign.query.get(campaign_id)
    if campaign is None:
        return None
    return {
        "campaignId": campaign.id,
        "status": campaign.status,
        "recipientCount": campaign.recipient_count,
        "successCount": campaign.success_count,
        "failureCount": campaign.failure_count,
    }
