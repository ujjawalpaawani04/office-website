"""Central configuration. All values are read from environment variables so
secrets never live in source control and the same code deploys to dev,
staging and production by swapping env vars only."""
import os
from datetime import timedelta
from urllib.parse import quote_plus

from dotenv import load_dotenv

load_dotenv()


def _env_list(name, default=""):
    raw = os.getenv(name, default)
    return [item.strip() for item in raw.split(",") if item.strip()]


def _env_bool(name, default=False):
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


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

    # --- File storage (resumes) -------------------------------------------
    # STORAGE_BACKEND selects the implementation storage_service.py hands
    # back: "local" writes to UPLOAD_FOLDER today; "s3" is the seam for
    # swapping to AWS S3 later without touching any calling code.
    STORAGE_BACKEND = os.getenv("STORAGE_BACKEND", "local")
    # abspath() matters: UPLOAD_FOLDER is "./uploads" in .env, and a
    # relative directory passed to Werkzeug's send_from_directory()
    # (used to serve Media Library uploads) fails its safe-path check on
    # Windows even when the file genuinely exists there - resolving once,
    # here, means every consumer (resumes, media, the serving route) gets
    # the same absolute path regardless of the process's cwd.
    UPLOAD_FOLDER = os.path.abspath(
        os.getenv("UPLOAD_FOLDER", os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads"))
    )
    UPLOAD_MAX_MB = int(os.getenv("UPLOAD_MAX_MB", "5"))
    MAX_CONTENT_LENGTH = UPLOAD_MAX_MB * 1024 * 1024

    AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET")
    AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

    # --- Email notifications -----------------------------------------------
    # Resend is the primary, production-ready path (see app/services/email_service.py).
    # EMAIL_ENABLED lets ops kill notification email entirely (e.g. during a
    # provider outage) without redeploying.
    EMAIL_ENABLED = _env_bool("EMAIL_ENABLED", True)
    EMAIL_PROVIDER = os.getenv("EMAIL_PROVIDER", "resend")  # "resend" | "smtp"
    EMAIL_TO = os.getenv("EMAIL_TO", "ujjawaldhiman4@gmail.com")
    EMAIL_FROM = os.getenv("EMAIL_FROM", "onboarding@resend.dev")
    RESEND_API_KEY = os.getenv("RESEND_API_KEY")

    # SMTP is kept only as a local-dev fallback when EMAIL_PROVIDER=smtp.
    # It is NOT recommended for production - see email_service.py docstring.
    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

    RECAPTCHA_SECRET = os.getenv("RECAPTCHA_SECRET")

    # Public frontend origin - used to build absolute links (newsletter
    # unsubscribe links, email CTA/logo URLs) from backend code, since
    # nothing else in this codebase needs to construct a frontend URL.
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


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
    EMAIL_ENABLED = False


CONFIG_BY_NAME = {
    "development": DevelopmentConfig,
    "staging": StagingConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}


def get_config(name=None):
    name = name or os.getenv("FLASK_ENV", "development")
    return CONFIG_BY_NAME.get(name, DevelopmentConfig)
