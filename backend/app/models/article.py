from app.extensions import db
from app.models.admin import TABLE_ARGS
from app.models.mixins import TimestampMixin


class Article(db.Model, TimestampMixin):
    """Insights & Articles video showcase (Life@SAA page). Thumbnail and
    video are stored as plain server paths (see storage_service.save_article_
    thumbnail/save_article_video) - never as BLOBs - so the row stays small
    and the files are served directly by the static routes in app/__init__.py."""

    __tablename__ = "articles"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    short_description = db.Column(db.String(500), nullable=True)
    thumbnail = db.Column(db.String(500), nullable=False)
    video_url = db.Column(db.String(500), nullable=False)
    display_order = db.Column(db.Integer, nullable=False, default=0)
    status = db.Column(
        db.Enum("draft", "published", name="article_status"),
        nullable=False,
        default="draft",
        index=True,
    )
