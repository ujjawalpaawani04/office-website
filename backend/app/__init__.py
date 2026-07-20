from flask import Flask
from flask_cors import CORS

from config.config import Config
from app.extensions.db import db

from app.routes.home import home_bp
from app.routes.health import health_bp


def create_app():
    # Flask Application Create
    app = Flask(__name__)

    # Load Configuration
    app.config.from_object(Config)

    # Initialize Database
    db.init_app(app)

    # Enable CORS for React Frontend
    CORS(
        app,
        resources={r"/api/*": {"origins": "http://localhost:5174"}}
    )

    # Register Blueprints
    app.register_blueprint(home_bp)
    app.register_blueprint(health_bp)

    return app