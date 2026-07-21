from app.extensions import db
from app.models.admin import TABLE_ARGS
from app.models.mixins import TimestampMixin, utcnow


class JobOpening(db.Model, TimestampMixin):
    __tablename__ = "job_openings"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    slug = db.Column(db.String(180), unique=True, nullable=False, index=True)
    department = db.Column(db.String(120), nullable=True)
    location = db.Column(db.String(120), nullable=True)
    employment_type = db.Column(
        db.Enum("full_time", "part_time", "internship", "contract", name="employment_type"),
        nullable=False,
        default="full_time",
    )
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text, nullable=True)
    responsibilities = db.Column(db.Text, nullable=True)
    min_experience_years = db.Column(db.Integer, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True, index=True)
    posted_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)
    closes_at = db.Column(db.DateTime(timezone=True), nullable=True)

    applications = db.relationship("JobApplication", back_populates="job_opening", lazy="dynamic")


class JobApplication(db.Model, TimestampMixin):
    __tablename__ = "job_applications"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    job_opening_id = db.Column(
        db.Integer, db.ForeignKey("job_openings.id", ondelete="SET NULL"), nullable=True, index=True
    )
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(190), nullable=False, index=True)
    mobile = db.Column(db.String(10), nullable=False)
    position_applied_for = db.Column(db.String(160), nullable=True)
    cover_letter = db.Column(db.Text, nullable=True)
    resume_filename = db.Column(db.String(255), nullable=False)
    resume_path = db.Column(db.String(500), nullable=False)
    resume_mime_type = db.Column(db.String(100), nullable=False)
    resume_size_bytes = db.Column(db.Integer, nullable=False)
    status = db.Column(
        db.Enum("new", "reviewed", "shortlisted", "rejected", "hired", name="application_status"),
        nullable=False,
        default="new",
        index=True,
    )
    ip_address = db.Column(db.String(45), nullable=True)

    job_opening = db.relationship("JobOpening", back_populates="applications")
