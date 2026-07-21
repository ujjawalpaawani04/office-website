import os
from datetime import timedelta
from urllib.parse import quote_plus

from dotenv import load_dotenv

load_dotenv()


def _env_list(name, default=""):
    raw = os.getenv(name, default)
    return [item.strip() for item in raw.split(",") if item.strip()]


class BaseConfig:
    ENV = "base"
    DEBUG = False
    TESTING = False

    SECRET_KEY = os.getenv("SECRET_KEY", "change-me")

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{quote_plus(os.getenv('DB_USER', 'root'))}:"
        f"{quote_plus(os.getenv('DB_PASSWORD', ''))}@"
        f"{os.getenv('DB_HOST', 'localhost')}:"
        f"{os.getenv('DB_PORT', '3306')}/"
        f"{os.getenv('DB_NAME', 'saa_cms')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 280,
    }

    CORS_ORIGINS = _env_list("CORS_ORIGINS", "http://localhost:5173")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-too")
    JWT_TOKEN_LOCATION = ["headers", "cookies"]
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=int(os.getenv("JWT_ACCESS_MINUTES", "15")))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(os.getenv("JWT_REFRESH_DAYS", "7")))
    JWT_COOKIE_SECURE = True
    JWT_COOKIE_SAMESITE = "Strict"
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_REFRESH_COOKIE_PATH = "/api/auth/refresh"
    JWT_ACCESS_COOKIE_PATH = "/api/"

    RATELIMIT_STORAGE_URI = os.getenv("RATELIMIT_STORAGE_URI", "memory://")

    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", os.path.join(os.path.dirname(__file__), "uploads"))
    UPLOAD_MAX_MB = int(os.getenv("UPLOAD_MAX_MB", "5"))
    MAX_CONTENT_LENGTH = UPLOAD_MAX_MB * 1024 * 1024

    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    SMTP_FROM = os.getenv("SMTP_FROM")

    RECAPTCHA_SECRET = os.getenv("RECAPTCHA_SECRET")


class DevelopmentConfig(BaseConfig):
    ENV = "development"
    DEBUG = True
    JWT_COOKIE_SECURE = False


class StagingConfig(BaseConfig):
    ENV = "staging"
    DEBUG = False


class ProductionConfig(BaseConfig):
    ENV = "production"
    DEBUG = False


class TestingConfig(BaseConfig):
    ENV = "testing"
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv("TEST_DATABASE_URL", "sqlite:///:memory:")
    JWT_COOKIE_SECURE = False
    RATELIMIT_ENABLED = False


CONFIG_BY_NAME = {
    "development": DevelopmentConfig,
    "staging": StagingConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}


def get_config(name=None):
    name = name or os.getenv("FLASK_ENV", "development")
    return CONFIG_BY_NAME.get(name, DevelopmentConfig)
