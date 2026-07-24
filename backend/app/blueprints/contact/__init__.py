from flask import Blueprint

contact_bp = Blueprint("contact", __name__, url_prefix="/api/enquiries")

from app.blueprints.contact import routes  # noqa: E402,F401
