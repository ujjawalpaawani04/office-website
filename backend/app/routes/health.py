from flask import Blueprint, jsonify
from sqlalchemy import text

from app.extensions.db import db


health_bp = Blueprint("health", __name__, url_prefix="/api")


@health_bp.route("/health", methods=["GET"])
def health_check():
    try:
        db.session.execute(text("SELECT 1"))

        return jsonify({
            "success": True,
            "message": "Database Connected Successfully"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500