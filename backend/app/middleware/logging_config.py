"""Application-wide logging setup. Called once from create_app().

Render (and most PaaS hosts) captures whatever the process writes to
stdout, so a stream handler is enough in production - no log files to
manage or lose on redeploy. Level drops to DEBUG in development for more
detail while iterating locally.
"""
import logging


def configure_logging(app):
    level = logging.DEBUG if app.config.get("DEBUG") else logging.INFO

    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
        force=True,  # Werkzeug's reloader configures the root logger first; without this, basicConfig() is a no-op and app.services.* log calls never reach stdout.
    )

    app.logger.setLevel(level)
