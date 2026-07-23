from flask import Blueprint

newsletter_bp = Blueprint("newsletter", __name__, url_prefix="/api/newsletter")

from app.blueprints.newsletter import routes  # noqa: E402,F401
