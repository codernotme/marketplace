from typing import Any

from app.core.config import get_settings
from app.core.store import store

settings = get_settings()


async def init_redis() -> None:
    if settings.use_in_memory:
        return

    try:
        import redis.asyncio as redis
    except ImportError as exc:
        raise RuntimeError("redis is required when USE_IN_MEMORY=false") from exc

    # Import check only. The client is created per-request in get_redis to
    # avoid loop-bound connection reuse issues under TestClient on Windows.
    _ = redis


async def close_redis() -> None:
    return


async def get_redis() -> Any:
    if settings.use_in_memory:
        return store

    import redis.asyncio as redis

    return redis.from_url(settings.redis_url, decode_responses=True)
