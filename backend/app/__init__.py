import os

from flask import Flask

from app.extensions import cors, db, jwt, limiter, migrate
from app.middleware import configure_logging, register_error_handlers

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
    from app.blueprints.firm import firm_bp
    from app.blueprints.newsletter import newsletter_bp
    from app.blueprints.services import services_bp
    from app.blueprints.team import team_bp
    from app.blueprints.testimonials import testimonials_bp
    from app.routes.career_routes import career_bp
    from app.routes.contact_routes import contact_bp

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

    return app
