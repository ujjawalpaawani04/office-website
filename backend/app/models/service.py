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

    # Admin sidebar / header mega-menu grouping.
    category = db.Column(
        db.Enum("our_services", "corporate_specialised", name="service_category"),
        nullable=False,
        default="our_services",
        server_default="our_services",
    )
    badge_label = db.Column(db.String(40), nullable=True)

    # Hero (exactly one per service, positionally fixed - flat columns).
    hero_breadcrumb_label = db.Column(db.String(160), nullable=True)
    hero_title_prefix = db.Column(db.String(160), nullable=True)
    hero_title_highlight = db.Column(db.String(160), nullable=True)
    hero_description = db.Column(db.Text, nullable=True)
    hero_background_media_id = db.Column(db.Integer, db.ForeignKey("media.id", ondelete="SET NULL"), nullable=True)

    # Introduction / Overview singular fields (paragraphs/highlights are
    # child tables below since admins add/remove/reorder them individually).
    overview_tagline = db.Column(db.String(80), nullable=True)
    overview_heading_prefix = db.Column(db.String(200), nullable=True)
    overview_heading_highlight = db.Column(db.String(200), nullable=True)

    # CTA - hrefs/secondary button stay hardcoded to /contact (no prop for
    # them exists on the live template today; see Phase 1 plan).
    cta_heading = db.Column(db.String(200), nullable=True)
    cta_description = db.Column(db.Text, nullable=True)
    cta_primary_label = db.Column(db.String(120), nullable=True)

    # SEO
    seo_title = db.Column(db.String(220), nullable=True)
    meta_description = db.Column(db.String(320), nullable=True)
    meta_keywords = db.Column(db.String(300), nullable=True)
    canonical_url = db.Column(db.String(300), nullable=True)
    og_image_media_id = db.Column(db.Integer, db.ForeignKey("media.id", ondelete="SET NULL"), nullable=True)

    # Group-level heading/intro text for each repeatable section.
    features_tagline = db.Column(db.String(80), nullable=True)
    features_heading_prefix = db.Column(db.String(200), nullable=True)
    features_heading_highlight = db.Column(db.String(200), nullable=True)
    features_intro = db.Column(db.Text, nullable=True)

    benefits_tagline = db.Column(db.String(80), nullable=True)
    benefits_heading_prefix = db.Column(db.String(200), nullable=True)
    benefits_heading_highlight = db.Column(db.String(200), nullable=True)
    benefits_intro = db.Column(db.Text, nullable=True)

    process_intro = db.Column(db.Text, nullable=True)

    why_choose_us_intro = db.Column(db.Text, nullable=True)
    why_choose_us_image_media_id = db.Column(db.Integer, db.ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    why_choose_us_image_alt = db.Column(db.String(255), nullable=True)

    industries_intro = db.Column(db.Text, nullable=True)

    faqs = db.relationship(
        "ServiceFaq", back_populates="service", order_by="ServiceFaq.sort_order", cascade="all, delete-orphan"
    )
    benefits = db.relationship(
        "ServiceBenefit", back_populates="service", order_by="ServiceBenefit.sort_order", cascade="all, delete-orphan"
    )
    features = db.relationship(
        "ServiceFeature", back_populates="service", order_by="ServiceFeature.sort_order", cascade="all, delete-orphan"
    )
    process_steps = db.relationship(
        "ServiceProcessStep",
        back_populates="service",
        order_by="ServiceProcessStep.sort_order",
        cascade="all, delete-orphan",
    )
    why_choose_us_items = db.relationship(
        "ServiceWhyChooseUs",
        back_populates="service",
        order_by="ServiceWhyChooseUs.sort_order",
        cascade="all, delete-orphan",
    )
    industries = db.relationship(
        "ServiceIndustry", back_populates="service", order_by="ServiceIndustry.sort_order", cascade="all, delete-orphan"
    )
    overview_paragraphs = db.relationship(
        "ServiceOverviewParagraph",
        back_populates="service",
        order_by="ServiceOverviewParagraph.sort_order",
        cascade="all, delete-orphan",
    )
    overview_highlights = db.relationship(
        "ServiceOverviewHighlight",
        back_populates="service",
        order_by="ServiceOverviewHighlight.sort_order",
        cascade="all, delete-orphan",
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


class ServiceBenefit(db.Model):
    __tablename__ = "service_benefits"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id", ondelete="CASCADE"), nullable=False, index=True)
    icon = db.Column(db.String(80), nullable=True)
    title = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, nullable=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    service = db.relationship("Service", back_populates="benefits")


class ServiceFeature(db.Model):
    __tablename__ = "service_features"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id", ondelete="CASCADE"), nullable=False, index=True)
    icon = db.Column(db.String(80), nullable=True)
    title = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, nullable=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    service = db.relationship("Service", back_populates="features")


class ServiceProcessStep(db.Model):
    __tablename__ = "service_process_steps"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id", ondelete="CASCADE"), nullable=False, index=True)
    icon = db.Column(db.String(80), nullable=True)
    title = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, nullable=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    service = db.relationship("Service", back_populates="process_steps")


class ServiceWhyChooseUs(db.Model):
    __tablename__ = "service_why_choose_us"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id", ondelete="CASCADE"), nullable=False, index=True)
    icon = db.Column(db.String(80), nullable=True)
    title = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, nullable=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    service = db.relationship("Service", back_populates="why_choose_us_items")


class ServiceIndustry(db.Model):
    __tablename__ = "service_industries"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id", ondelete="CASCADE"), nullable=False, index=True)
    icon = db.Column(db.String(80), nullable=True)
    label = db.Column(db.String(160), nullable=False)
    blurb = db.Column(db.Text, nullable=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    service = db.relationship("Service", back_populates="industries")


class ServiceOverviewParagraph(db.Model):
    __tablename__ = "service_overview_paragraphs"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id", ondelete="CASCADE"), nullable=False, index=True)
    content = db.Column(db.Text, nullable=False)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    service = db.relationship("Service", back_populates="overview_paragraphs")


class ServiceOverviewHighlight(db.Model):
    __tablename__ = "service_overview_highlights"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id", ondelete="CASCADE"), nullable=False, index=True)
    content = db.Column(db.String(300), nullable=False)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    service = db.relationship("Service", back_populates="overview_highlights")
