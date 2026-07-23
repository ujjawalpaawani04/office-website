from app.extensions import db
from app.models.admin import TABLE_ARGS
from app.models.mixins import TimestampMixin


class Testimonial(db.Model, TimestampMixin):
    __tablename__ = "testimonials"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(120), nullable=False)
    client_designation = db.Column(db.String(160), nullable=True)
    client_company = db.Column(db.String(160), nullable=True)
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.SmallInteger, nullable=True)
    photo_media_id = db.Column(db.Integer, db.ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    is_featured = db.Column(db.Boolean, nullable=False, default=False, index=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True, index=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    __table_args__ = (
        db.CheckConstraint("rating IS NULL OR (rating >= 1 AND rating <= 5)", name="ck_testimonial_rating_range"),
        TABLE_ARGS,
    )
