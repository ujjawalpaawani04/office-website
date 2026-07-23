"""Route-level authorization for the Admin API.

`require_role()` is a thin wrapper over Flask-JWT-Extended's own
verify_jwt_in_request() so every admin route gets both authentication
(valid token) and authorization (correct role) from one decorator, rather
than relying on each route handler to remember both checks.
"""
from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request

from app.models import Admin


def require_role(*roles):
    """@require_role("admin") or @require_role("admin", "editor")."""

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if roles and claims.get("role") not in roles:
                return jsonify({"error": "You do not have permission to perform this action."}), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def get_current_admin():
    """Call only inside a route already guarded by require_role()/jwt_required()."""
    from flask_jwt_extended import get_jwt_identity

    admin_id = int(get_jwt_identity())
    return Admin.query.get(admin_id)
