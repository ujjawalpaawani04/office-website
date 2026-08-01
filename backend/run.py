from app import create_app

app = create_app()

if __name__ == "__main__":
    # debug is tied to the resolved config (see config/settings.py get_config)
    # instead of hardcoded True, so accidentally running this file in
    # production - gunicorn is the intended entrypoint there, per
    # requirements.txt - never exposes the interactive Werkzeug debugger.
    app.run(host="0.0.0.0", port=5000, debug=app.config["DEBUG"])
