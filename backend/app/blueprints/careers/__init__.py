from flask import Blueprint

careers_bp = Blueprint("careers", __name__, url_prefix="/api/careers")

from app.blueprints.careers import routes  # noqa: E402,F401
