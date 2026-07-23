from app.extensions import db
from app.models.admin import TABLE_ARGS
from app.models.mixins import TimestampMixin


class TeamMember(db.Model, TimestampMixin):
    __tablename__ = "team_members"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    slug = db.Column(db.String(140), unique=True, nullable=False, index=True)
    designation = db.Column(db.String(160), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    qualifications = db.Column(db.String(300), nullable=True)
    photo_media_id = db.Column(db.Integer, db.ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    email = db.Column(db.String(190), nullable=True)
    linkedin_url = db.Column(db.String(300), nullable=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)
    is_active = db.Column(db.Boolean, nullable=False, default=True, index=True)
