from flask import Blueprint

testimonials_bp = Blueprint("testimonials", __name__, url_prefix="/api/testimonials")

from app.blueprints.testimonials import routes  # noqa: E402,F401
