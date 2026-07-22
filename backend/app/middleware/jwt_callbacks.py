"""Makes Flask-JWT-Extended's failure responses match the rest of the API's
{"error": "..."} shape instead of its own default JSON format."""
from flask import jsonify


def register_jwt_callbacks(jwt):
    @jwt.expired_token_loader
    def expired_token(jwt_header, jwt_payload):
        return jsonify({"error": "Session expired. Please log in again."}), 401

    @jwt.invalid_token_loader
    def invalid_token(reason):
        return jsonify({"error": "Invalid authentication token."}), 401

    @jwt.unauthorized_loader
    def missing_token(reason):
        return jsonify({"error": "Authentication required."}), 401

    @jwt.revoked_token_loader
    def revoked_token(jwt_header, jwt_payload):
        return jsonify({"error": "Session expired. Please log in again."}), 401
