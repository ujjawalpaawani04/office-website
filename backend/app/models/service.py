from app.extensions import db
from app.models.admin import TABLE_ARGS
from app.models.mixins import TimestampMixin


class Service(db.Model, TimestampMixin):
    __tablename__ = "services"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), nullable=False)
    slug = db.Column(db.String(180), unique=True, nullable=False, index=True)
    short_description = db.Column(db.String(500), nullable=True)
    full_description = db.Column(db.Text, nullable=True)
    icon = db.Column(db.String(80), nullable=True)
    featured_image_media_id = db.Column(db.Integer, db.ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)
    is_active = db.Column(db.Boolean, nullable=False, default=True, index=True)

    faqs = db.relationship(
        "ServiceFaq", back_populates="service", order_by="ServiceFaq.sort_order", cascade="all, delete-orphan"
    )


class ServiceFaq(db.Model):
    __tablename__ = "service_faqs"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id", ondelete="CASCADE"), nullable=False, index=True)
    question = db.Column(db.String(300), nullable=False)
    answer = db.Column(db.Text, nullable=False)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    service = db.relationship("Service", back_populates="faqs")
