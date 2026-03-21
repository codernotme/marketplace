from math import ceil
from typing import Any


def paginate(items: list[dict[str, Any]], page: int = 1, limit: int = 20) -> dict[str, Any]:
    safe_page = max(1, page)
    safe_limit = max(1, limit)
    start = (safe_page - 1) * safe_limit
    end = start + safe_limit
    total = len(items)
    return {
        "items": items[start:end],
        "page": safe_page,
        "limit": safe_limit,
        "total": total,
        "pages": ceil(total / safe_limit) if total else 1,
    }
