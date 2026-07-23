from flask import Blueprint

blog_bp = Blueprint("blog", __name__, url_prefix="/api/blog")

from app.blueprints.blog import routes  # noqa: E402,F401
