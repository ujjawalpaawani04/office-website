"""Admin CRUD for the simple, flat content resources: awards,
certifications, firm stats, team members, testimonials, and blog taxonomy
(categories/tags/authors). All registered through the generic factory in
app/utils/admin_crud.py per the Standard Admin CRUD Template (Document 5
§4.1) - see that module's docstring for why these (and not blog posts,
media, careers, etc.) are handled generically.
"""
from app.blueprints.admin import admin_bp
from app.models import (
    Award,
    BlogAuthor,
    BlogCategory,
    BlogPost,
    BlogTag,
    Certification,
    FirmStat,
    Media,
    TeamMember,
    Testimonial,
)
from app.utils.admin_crud import register_crud_routes
from app.validators.content_validator import (
    validate_award,
    validate_blog_author,
    validate_blog_category,
    validate_blog_tag,
    validate_certification,
    validate_firm_stat,
    validate_team_member,
    validate_testimonial,
)


def _media_url(media_id):
    if not media_id:
        return None
    media = Media.query.get(media_id)
    return media.path if media else None


def serialize_award(item):
    return {
        "id": item.id,
        "title": item.title,
        "description": item.description,
        "year": item.year,
        "imageMediaId": item.image_media_id,
        "imageUrl": _media_url(item.image_media_id),
        "sortOrder": item.sort_order,
        "isActive": item.is_active,
    }


def serialize_certification(item):
    return {
        "id": item.id,
        "name": item.name,
        "description": item.description,
        "issuingBody": item.issuing_body,
        "imageMediaId": item.image_media_id,
        "imageUrl": _media_url(item.image_media_id),
        "sortOrder": item.sort_order,
        "isActive": item.is_active,
    }


def serialize_firm_stat(item):
    return {
        "id": item.id,
        "key": item.key,
        "label": item.label,
        "value": item.value,
        "suffix": item.suffix,
        "icon": item.icon,
        "sortOrder": item.sort_order,
        "isActive": item.is_active,
    }


def serialize_team_member(item):
    return {
        "id": item.id,
        "name": item.name,
        "slug": item.slug,
        "designation": item.designation,
        "bio": item.bio,
        "qualifications": item.qualifications,
        "photoMediaId": item.photo_media_id,
        "photoUrl": _media_url(item.photo_media_id),
        "email": item.email,
        "linkedinUrl": item.linkedin_url,
        "sortOrder": item.sort_order,
        "isActive": item.is_active,
    }


def serialize_testimonial(item):
    return {
        "id": item.id,
        "clientName": item.client_name,
        "clientDesignation": item.client_designation,
        "clientCompany": item.client_company,
        "content": item.content,
        "rating": item.rating,
        "photoMediaId": item.photo_media_id,
        "photoUrl": _media_url(item.photo_media_id),
        "isFeatured": item.is_featured,
        "isActive": item.is_active,
        "sortOrder": item.sort_order,
    }


def serialize_blog_category(item):
    return {"id": item.id, "name": item.name, "slug": item.slug, "description": item.description}


def serialize_blog_tag(item):
    return {"id": item.id, "name": item.name, "slug": item.slug}


def serialize_blog_author(item):
    return {
        "id": item.id,
        "name": item.name,
        "slug": item.slug,
        "designation": item.designation,
        "bio": item.bio,
        "avatarMediaId": item.avatar_media_id,
        "avatarUrl": _media_url(item.avatar_media_id),
    }


register_crud_routes(
    admin_bp,
    path="awards",
    model=Award,
    entity_type="award",
    serialize=serialize_award,
    validate=validate_award,
    default_order_by=Award.sort_order.asc(),
    search_fields=("title",),
    soft_delete_field="is_active",
)

register_crud_routes(
    admin_bp,
    path="certifications",
    model=Certification,
    entity_type="certification",
    serialize=serialize_certification,
    validate=validate_certification,
    default_order_by=Certification.sort_order.asc(),
    search_fields=("name",),
    soft_delete_field="is_active",
)

register_crud_routes(
    admin_bp,
    path="firm-stats",
    model=FirmStat,
    entity_type="firm_stat",
    serialize=serialize_firm_stat,
    validate=validate_firm_stat,
    default_order_by=FirmStat.sort_order.asc(),
    search_fields=("label", "key"),
    soft_delete_field="is_active",
)

register_crud_routes(
    admin_bp,
    path="team-members",
    model=TeamMember,
    entity_type="team_member",
    serialize=serialize_team_member,
    validate=validate_team_member,
    default_order_by=TeamMember.sort_order.asc(),
    search_fields=("name", "designation"),
    soft_delete_field="is_active",
    delete_roles=("admin",),
)

register_crud_routes(
    admin_bp,
    path="testimonials",
    model=Testimonial,
    entity_type="testimonial",
    serialize=serialize_testimonial,
    validate=validate_testimonial,
    default_order_by=Testimonial.sort_order.asc(),
    search_fields=("client_name", "client_company"),
    soft_delete_field="is_active",
)

register_crud_routes(
    admin_bp,
    path="blog-categories",
    model=BlogCategory,
    entity_type="blog_category",
    serialize=serialize_blog_category,
    validate=validate_blog_category,
    default_order_by=BlogCategory.name.asc(),
    search_fields=("name",),
    on_delete_block=lambda item: (
        "This category is still used by one or more blog posts."
        if BlogPost.query.filter_by(category_id=item.id).first() is not None
        else None
    ),
)

register_crud_routes(
    admin_bp,
    path="blog-tags",
    model=BlogTag,
    entity_type="blog_tag",
    serialize=serialize_blog_tag,
    validate=validate_blog_tag,
    default_order_by=BlogTag.name.asc(),
    search_fields=("name",),
    on_delete_block=lambda item: (
        "This tag is still used by one or more blog posts." if len(item.posts) > 0 else None
    ),
)

register_crud_routes(
    admin_bp,
    path="blog-authors",
    model=BlogAuthor,
    entity_type="blog_author",
    serialize=serialize_blog_author,
    validate=validate_blog_author,
    default_order_by=BlogAuthor.name.asc(),
    search_fields=("name",),
    on_delete_block=lambda item: (
        "This author is still credited on one or more blog posts."
        if BlogPost.query.filter_by(author_id=item.id).first() is not None
        else None
    ),
)
