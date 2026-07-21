from flask import Blueprint

firm_bp = Blueprint("firm", __name__, url_prefix="/api")

from app.blueprints.firm import routes  # noqa: E402,F401
