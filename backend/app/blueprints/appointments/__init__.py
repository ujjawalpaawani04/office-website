from flask import Blueprint

appointments_bp = Blueprint("appointments", __name__, url_prefix="/api/appointments")

from app.blueprints.appointments import routes  # noqa: E402,F401
from app.blueprints.appointments import webhook_routes  # noqa: E402,F401
