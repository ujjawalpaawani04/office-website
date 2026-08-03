"""Background job that periodically calls appointment_service.
sync_appointments_from_calendly() so bookings made outside our own embed
(a shared calendly.com link, a meeting booked directly on the host's
calendar) still show up in the admin panel - see that function's docstring
for why a one-way, push-only embed capture can never see those on its own.

Single-process-friendly by design: this starts an in-process APScheduler,
not a separate worker. Fine for the current single dev-server / single
gunicorn-worker deployment; running multiple app processes (e.g. a
multi-worker gunicorn setup) would have each start its own copy and poll
Calendly redundantly. That's wasted API calls, not duplicate data (the sync
upserts on calendly_event_id) - revisit with a proper job queue if/when this
ever runs behind more than one worker.
"""
import logging
import os

from apscheduler.schedulers.background import BackgroundScheduler

logger = logging.getLogger(__name__)

_scheduler = None


def init_calendly_sync_scheduler(app):
    global _scheduler

    if not app.config.get("CALENDLY_API_ENABLED") or app.config.get("TESTING"):
        return

    # Flask's debug reloader runs the app in a parent watcher process plus a
    # child worker process; only the child sets WERKZEUG_RUN_MAIN. Starting
    # the scheduler in the parent too would poll Calendly twice on every
    # tick. Outside debug mode there's no parent process, so always start.
    if app.debug and os.environ.get("WERKZEUG_RUN_MAIN") != "true":
        return

    if _scheduler is not None:
        return

    def run_sync():
        with app.app_context():
            from app.services.appointment_service import sync_appointments_from_calendly

            try:
                result = sync_appointments_from_calendly()
                if result.get("created") or result.get("updated"):
                    logger.info("Calendly sync: %s", result)
            except Exception:
                logger.exception("Calendly sync job failed")

    scheduler = BackgroundScheduler(daemon=True, timezone="UTC")
    scheduler.add_job(
        run_sync,
        "interval",
        minutes=app.config.get("CALENDLY_SYNC_INTERVAL_MINUTES", 5),
        id="calendly_sync",
    )
    # Also run once right away, in the scheduler's own thread (never blocks
    # app start-up on a Calendly API round trip) - otherwise a booking made
    # outside the embed while the server was down waits a full interval
    # before appearing after a restart.
    scheduler.add_job(run_sync, id="calendly_sync_startup")
    scheduler.start()
    _scheduler = scheduler
