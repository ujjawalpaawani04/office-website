"""Centralized JSON error handling.

Without this, Flask's default error pages are HTML - fine for a browser,
useless for a JSON API client, and in the 500 case they leak a stack trace
in debug mode. Every error the API can produce comes back as the same
{"error": "..."} shape the rest of the API already uses, and every 500 is
logged server-side with its traceback but never shown to the caller.
"""
import logging

from flask import jsonify

logger = logging.getLogger(__name__)


def register_error_handlers(app):
    @app.errorhandler(400)
    def handle_bad_request(error):
        return jsonify({"error": "The request could not be understood."}), 400

    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({"error": "Not found."}), 404

    @app.errorhandler(413)
    def handle_payload_too_large(error):
        max_mb = app.config.get("UPLOAD_MAX_MB", 5)
        return jsonify({"error": f"Upload too large. Maximum allowed size is {max_mb}MB."}), 413

    @app.errorhandler(429)
    def handle_rate_limited(error):
        return jsonify({"error": "Too many requests. Please try again in a minute."}), 429

    @app.errorhandler(500)
    def handle_internal_error(error):
        logger.exception("Unhandled server error")
        return jsonify({"error": "Something went wrong on our end. Please try again shortly."}), 500
