"""Generic CRUD route registration for flat, single-table admin resources
(awards, certifications, firm stats, team members, testimonials, blog
taxonomy) that all follow the identical contract documented once in the
API Specification (Document 5 §4.1): list/get/create/update/delete, admin
JWT required, audit-logged, standard error shapes. Each resource still
supplies its own `validate` (field rules differ per table, see Document 8)
and `serialize` (response shape differs per table) - this factory only
removes the mechanics that are genuinely identical everywhere: pagination,
role checks, audit logging, and the 404/409/422 responses.

Resources with real bespoke business logic (blog posts, media, careers,
enquiries, admin users) are hand-written route modules instead of being
forced through this generic shape - see Document 2's per-module notes on
why each of those diverges from the standard template.
"""
from flask import jsonify, request

from app.extensions import db
from app.middleware.auth_guard import get_current_admin, require_role
from app.utils.audit import record_audit_log
from app.utils.pagination import paginate_query


def register_crud_routes(
    blueprint,
    *,
    path,
    model,
    entity_type,
    serialize,
    validate,
    roles=("admin", "editor"),
    delete_roles=None,
    default_order_by=None,
    search_fields=(),
    soft_delete_field=None,
    on_delete_block=None,
):
    """
    soft_delete_field: e.g. "is_active" - if set, DELETE flips that column
        to False instead of removing the row (Document 2's "soft delete"
        modules: Team, Testimonials, Awards, Certifications, Firm Stats).
    on_delete_block: callable(instance) -> error message string, or None if
        deletion is allowed. Used by hard-delete resources (blog taxonomy)
        to block removal while still referenced elsewhere (409).
    """
    delete_roles = delete_roles or roles

    def list_items():
        query = model.query
        q = (request.args.get("q") or "").strip()
        if q and search_fields:
            like = f"%{q}%"
            query = query.filter(db.or_(*[getattr(model, f).ilike(like) for f in search_fields]))
        if default_order_by is not None:
            query = query.order_by(default_order_by)
        result = paginate_query(query, request.args)
        return jsonify({**result, "items": [serialize(item) for item in result["items"]]})

    def get_item(item_id):
        item = model.query.get(item_id)
        if item is None:
            return jsonify({"error": "Not found."}), 404
        return jsonify(serialize(item))

    def create_item():
        data = request.get_json(silent=True) or {}
        cleaned, errors = validate(data, None)
        if errors:
            return jsonify({"error": "Validation failed", "fields": errors}), 422
        item = model(**cleaned)
        db.session.add(item)
        db.session.flush()
        record_audit_log(get_current_admin().id, "create", entity_type, item.id, request=request)
        db.session.commit()
        return jsonify(serialize(item)), 201

    def update_item(item_id):
        item = model.query.get(item_id)
        if item is None:
            return jsonify({"error": "Not found."}), 404
        data = request.get_json(silent=True) or {}
        cleaned, errors = validate(data, item)
        if errors:
            return jsonify({"error": "Validation failed", "fields": errors}), 422
        for key, value in cleaned.items():
            setattr(item, key, value)
        record_audit_log(get_current_admin().id, "update", entity_type, item.id, request=request)
        db.session.commit()
        return jsonify(serialize(item))

    def delete_item(item_id):
        item = model.query.get(item_id)
        if item is None:
            return jsonify({"error": "Not found."}), 404

        if on_delete_block:
            block_message = on_delete_block(item)
            if block_message:
                return jsonify({"error": block_message}), 409

        admin_id = get_current_admin().id
        if soft_delete_field:
            setattr(item, soft_delete_field, False)
            record_audit_log(admin_id, "deactivate", entity_type, item.id, request=request)
            db.session.commit()
            return jsonify(serialize(item))

        record_audit_log(admin_id, "delete", entity_type, item.id, request=request)
        db.session.delete(item)
        db.session.commit()
        return "", 204

    blueprint.get(f"/{path}", endpoint=f"list_{path}")(require_role(*roles)(list_items))
    blueprint.get(f"/{path}/<int:item_id>", endpoint=f"get_{path}")(require_role(*roles)(get_item))
    blueprint.post(f"/{path}", endpoint=f"create_{path}")(require_role(*roles)(create_item))
    blueprint.put(f"/{path}/<int:item_id>", endpoint=f"update_{path}")(require_role(*roles)(update_item))
    blueprint.delete(f"/{path}/<int:item_id>", endpoint=f"delete_{path}")(require_role(*delete_roles)(delete_item))
