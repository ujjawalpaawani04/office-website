from flask import Blueprint

team_bp = Blueprint("team", __name__, url_prefix="/api/team")

from app.blueprints.team import routes  # noqa: E402,F401
