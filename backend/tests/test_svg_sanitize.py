"""Covers the SVG upload sanitization added to the Media Library
(file_utils.sanitize_svg / media_validator.validate_media_content) - an SVG
is XML and can carry executable script, unlike a raster image."""
import io

from werkzeug.datastructures import FileStorage

from app.utils.file_utils import sanitize_svg

MALICIOUS_SVG = (
    b'<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)">'
    b"<script>alert(2)</script>"
    b'<rect width="10" height="10" onclick="alert(3)"/>'
    b'<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="javascript:alert(4)"><text>click</text></a>'
    b"</svg>"
)


def test_script_tags_and_event_handlers_are_stripped():
    file_storage = FileStorage(stream=io.BytesIO(MALICIOUS_SVG), filename="evil.svg")

    assert sanitize_svg(file_storage) is True

    output = io.BytesIO()
    file_storage.save(output)
    sanitized = output.getvalue()

    assert b"<script" not in sanitized
    assert b"onload" not in sanitized
    assert b"onclick" not in sanitized
    assert b"javascript:" not in sanitized
    assert b"rect" in sanitized  # legitimate content survives


def test_legitimate_content_is_preserved():
    clean_svg = (
        b'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">'
        b'<path d="M12 2L2 22h20z" fill="#123456"/>'
        b"</svg>"
    )
    file_storage = FileStorage(stream=io.BytesIO(clean_svg), filename="logo.svg")

    assert sanitize_svg(file_storage) is True

    output = io.BytesIO()
    file_storage.save(output)
    sanitized = output.getvalue()

    assert b"M12 2L2 22h20z" in sanitized
    assert b"#123456" in sanitized


def test_malformed_content_is_rejected_not_saved_as_is():
    file_storage = FileStorage(stream=io.BytesIO(b"this is not xml <<< broken"), filename="fake.svg")

    assert sanitize_svg(file_storage) is False
