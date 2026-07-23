from flask import Blueprint

services_bp = Blueprint("services", __name__, url_prefix="/api/services")

from app.blueprints.services import routes  # noqa: E402,F401
