import os

from flask import Flask

from app.extensions import cors, db, jwt, limiter, migrate


def create_app(config_name=None):
    app = Flask(__name__)

    from config import get_config

    app.config.from_object(get_config(config_name))

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
    from app.blueprints.careers import careers_bp
    from app.blueprints.enquiries import enquiries_bp
    from app.blueprints.firm import firm_bp
    from app.blueprints.newsletter import newsletter_bp
    from app.blueprints.services import services_bp
    from app.blueprints.team import team_bp
    from app.blueprints.testimonials import testimonials_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(enquiries_bp)
    app.register_blueprint(careers_bp)
    app.register_blueprint(newsletter_bp)
    app.register_blueprint(blog_bp)
    app.register_blueprint(team_bp)
    app.register_blueprint(testimonials_bp)
    app.register_blueprint(firm_bp)
    app.register_blueprint(services_bp)
    app.register_blueprint(admin_bp)

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app
