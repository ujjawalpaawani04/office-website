from flask import Blueprint

enquiries_bp = Blueprint("enquiries", __name__, url_prefix="/api/enquiries")

from app.blueprints.enquiries import routes  # noqa: E402,F401
