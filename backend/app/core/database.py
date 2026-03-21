from typing import Any

from app.core.config import get_settings
from app.core.store import store

settings = get_settings()
_mongo_client: Any | None = None


async def init_db() -> None:
    global _mongo_client
    if settings.use_in_memory:
        return

    if _mongo_client is not None:
        return

    try:
        from motor.motor_asyncio import AsyncIOMotorClient
    except ImportError as exc:
        raise RuntimeError("motor is required when USE_IN_MEMORY=false") from exc

    _mongo_client = AsyncIOMotorClient(settings.mongodb_uri)


async def close_db() -> None:
    global _mongo_client
    if _mongo_client is None:
        return
    _mongo_client.close()
    _mongo_client = None


async def get_db() -> Any:
    if settings.use_in_memory:
        return store
    if _mongo_client is None:
        await init_db()
    return _mongo_client[settings.mongodb_db_name]
