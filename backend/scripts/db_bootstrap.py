from __future__ import annotations

import asyncio
import sys

from core.database import DatabaseManager
from services.demo_data import DEMO_TENANT_ID, ensure_demo_data


async def bootstrap() -> int:
    manager = DatabaseManager()
    started = False
    try:
        await manager.startup()
        started = True
        await ensure_demo_data(manager.master_db, manager.shared_db)
        await manager.ensure_active_tenant_databases_ready()

        users_count = await manager.shared_db["users"].count_documents({"tenant_id": DEMO_TENANT_ID})
        products_count = await manager.shared_db["products"].count_documents({"tenant_id": DEMO_TENANT_ID})
        orders_count = await manager.shared_db["orders"].count_documents({"tenant_id": DEMO_TENANT_ID})

        print("DB bootstrap completed")
        print(f"Demo tenant users: {users_count}")
        print(f"Demo tenant products: {products_count}")
        print(f"Demo tenant orders: {orders_count}")
        return 0
    except Exception as exc:
        print(f"DB bootstrap failed: {exc}")
        return 1
    finally:
        if started:
            await manager.shutdown()


def main() -> int:
    return asyncio.run(bootstrap())


if __name__ == "__main__":
    raise SystemExit(main())
