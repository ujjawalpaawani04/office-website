from flask import Blueprint, jsonify

home_bp = Blueprint("home", __name__, url_prefix="/api")


@home_bp.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "Backend Running Successfully",
        "version": "1.0.0"
    })