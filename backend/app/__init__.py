import os

from flask import Flask, send_from_directory

from app.extensions import cors, db, jwt, limiter, migrate
from app.middleware import configure_logging, register_error_handlers, register_jwt_callbacks

BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def create_app(config_name=None):
    # template_folder points at the top-level backend/templates/ (email
    # templates today) rather than Flask's default app/templates/.
    app = Flask(__name__, template_folder=os.path.join(BACKEND_ROOT, "templates"))

    from config import get_config

    app.config.from_object(get_config(config_name))

    configure_logging(app)

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    register_jwt_callbacks(jwt)
    limiter.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True,
    )

    from app import models  # noqa: F401 - registers models with SQLAlchemy metadata

    from app.blueprints.admin import admin_bp
    from app.blueprints.auth import auth_bp
    from app.blueprints.blog import blog_bp
    from app.blueprints.career import career_bp
    from app.blueprints.contact import contact_bp
    from app.blueprints.firm import firm_bp
    from app.blueprints.newsletter import newsletter_bp
    from app.blueprints.services import services_bp
    from app.blueprints.team import team_bp
    from app.blueprints.testimonials import testimonials_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(career_bp)
    app.register_blueprint(newsletter_bp)
    app.register_blueprint(blog_bp)
    app.register_blueprint(team_bp)
    app.register_blueprint(testimonials_bp)
    app.register_blueprint(firm_bp)
    app.register_blueprint(services_bp)
    app.register_blueprint(admin_bp)

    register_error_handlers(app)

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    # Serves Media Library uploads (storage_service.save_media_image builds
    # URLs pointing here). Not under /api since it's a plain static file
    # fetch (an <img src>), not a JSON endpoint.
    @app.get("/media/<path:filename>")
    def serve_media(filename):
        media_dir = os.path.join(app.config["UPLOAD_FOLDER"], "media")
        return send_from_directory(media_dir, filename)

    return app
