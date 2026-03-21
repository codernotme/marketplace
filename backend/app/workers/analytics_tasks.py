from app.core.config import get_settings
from app.core.database import get_db
from app.core.store import store

settings = get_settings()


async def flush_event_buffer(ctx) -> None:
    if settings.use_in_memory:
        return

    if not store.events:
        return

    db = await get_db()
    batch = [dict(event) for event in store.events]
    await db.events.insert_many(batch)
    store.events.clear()
