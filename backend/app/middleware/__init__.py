from app.middleware.auth_guard import get_current_admin, require_role
from app.middleware.error_handlers import register_error_handlers
from app.middleware.jwt_callbacks import register_jwt_callbacks
from app.middleware.logging_config import configure_logging

__all__ = [
    "register_error_handlers",
    "configure_logging",
    "register_jwt_callbacks",
    "require_role",
    "get_current_admin",
]
