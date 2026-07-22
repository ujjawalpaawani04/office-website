from flask import Blueprint

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

from app.blueprints.admin import routes  # noqa: E402,F401
from app.blueprints.admin import content_routes  # noqa: E402,F401
from app.blueprints.admin import media_routes  # noqa: E402,F401
from app.blueprints.admin import blog_routes  # noqa: E402,F401
from app.blueprints.admin import service_routes  # noqa: E402,F401
from app.blueprints.admin import settings_routes  # noqa: E402,F401
from app.blueprints.admin import career_admin_routes  # noqa: E402,F401
from app.blueprints.admin import leads_routes  # noqa: E402,F401
from app.blueprints.admin import users_routes  # noqa: E402,F401
from app.blueprints.admin import profile_routes  # noqa: E402,F401
from app.blueprints.admin import security_routes  # noqa: E402,F401
from app.blueprints.admin import audit_log_routes  # noqa: E402,F401
from app.blueprints.admin import db_utilities_routes  # noqa: E402,F401
