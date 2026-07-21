from app.extensions import db
from app.models.admin import TABLE_ARGS
from app.models.mixins import TimestampMixin, utcnow

blog_post_tags = db.Table(
    "blog_post_tags",
    db.Column("post_id", db.Integer, db.ForeignKey("blog_posts.id", ondelete="CASCADE"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("blog_tags.id", ondelete="CASCADE"), primary_key=True),
    **TABLE_ARGS,
)


class BlogCategory(db.Model, TimestampMixin):
    __tablename__ = "blog_categories"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    slug = db.Column(db.String(140), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)

    posts = db.relationship("BlogPost", back_populates="category", lazy="dynamic")


class BlogTag(db.Model):
    __tablename__ = "blog_tags"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)

    posts = db.relationship("BlogPost", secondary=blog_post_tags, back_populates="tags")


class BlogAuthor(db.Model, TimestampMixin):
    __tablename__ = "blog_authors"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    slug = db.Column(db.String(140), unique=True, nullable=False, index=True)
    designation = db.Column(db.String(160), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    avatar_media_id = db.Column(db.Integer, db.ForeignKey("media.id", ondelete="SET NULL"), nullable=True)

    posts = db.relationship("BlogPost", back_populates="author", lazy="dynamic")


class BlogPost(db.Model, TimestampMixin):
    __tablename__ = "blog_posts"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(220), nullable=False)
    slug = db.Column(db.String(240), unique=True, nullable=False, index=True)
    excerpt = db.Column(db.String(500), nullable=True)
    content = db.Column(db.Text, nullable=False)
    featured_image_media_id = db.Column(db.Integer, db.ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey("blog_categories.id", ondelete="SET NULL"), nullable=True, index=True)
    author_id = db.Column(db.Integer, db.ForeignKey("blog_authors.id", ondelete="SET NULL"), nullable=True, index=True)
    status = db.Column(
        db.Enum("draft", "published", "archived", name="blog_post_status"),
        nullable=False,
        default="draft",
        index=True,
    )
    published_at = db.Column(db.DateTime(timezone=True), nullable=True, index=True)
    reading_time_minutes = db.Column(db.Integer, nullable=True)
    views_count = db.Column(db.Integer, nullable=False, default=0)
    meta_title = db.Column(db.String(220), nullable=True)
    meta_description = db.Column(db.String(320), nullable=True)

    category = db.relationship("BlogCategory", back_populates="posts")
    author = db.relationship("BlogAuthor", back_populates="posts")
    tags = db.relationship("BlogTag", secondary=blog_post_tags, back_populates="posts")
    key_takeaways = db.relationship(
        "BlogKeyTakeaway", back_populates="post", order_by="BlogKeyTakeaway.sort_order", cascade="all, delete-orphan"
    )
    faqs = db.relationship(
        "BlogFaq", back_populates="post", order_by="BlogFaq.sort_order", cascade="all, delete-orphan"
    )


class BlogKeyTakeaway(db.Model):
    __tablename__ = "blog_key_takeaways"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("blog_posts.id", ondelete="CASCADE"), nullable=False, index=True)
    content = db.Column(db.String(500), nullable=False)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    post = db.relationship("BlogPost", back_populates="key_takeaways")


class BlogFaq(db.Model):
    __tablename__ = "blog_faqs"
    __table_args__ = TABLE_ARGS

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("blog_posts.id", ondelete="CASCADE"), nullable=False, index=True)
    question = db.Column(db.String(300), nullable=False)
    answer = db.Column(db.Text, nullable=False)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    post = db.relationship("BlogPost", back_populates="faqs")
