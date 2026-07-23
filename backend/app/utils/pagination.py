"""Shared pagination for every admin list endpoint - one place to keep the
page/pageSize contract (Document 5 §4.1) consistent."""

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100


def paginate_query(query, args):
    try:
        page = max(int(args.get("page", 1)), 1)
    except (TypeError, ValueError):
        page = 1
    try:
        page_size = min(max(int(args.get("pageSize", DEFAULT_PAGE_SIZE)), 1), MAX_PAGE_SIZE)
    except (TypeError, ValueError):
        page_size = DEFAULT_PAGE_SIZE

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return {"items": items, "total": total, "page": page, "pageSize": page_size}
