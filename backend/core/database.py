from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection, AsyncIOMotorDatabase

from core.config import get_settings


class DatabaseManager:
    def __init__(self) -> None:
        self.settings = get_settings()
        self._master_client: AsyncIOMotorClient | None = None
        self._shared_client: AsyncIOMotorClient | None = None
        self._tenant_clients: dict[str, AsyncIOMotorClient] = {}
        self._tenant_lock = asyncio.Lock()

    async def startup(self) -> None:
        self._master_client = self._new_client(self.settings.mongo_master_uri)
        self._shared_client = self._new_client(self.settings.mongo_shared_uri)
        await self.ping()
        await self.ensure_indexes()

    async def shutdown(self) -> None:
        if self._master_client is not None:
            self._master_client.close()
        if self._shared_client is not None:
            self._shared_client.close()
        async with self._tenant_lock:
            for client in self._tenant_clients.values():
                client.close()
            self._tenant_clients.clear()

    def _new_client(self, uri: str) -> AsyncIOMotorClient:
        return AsyncIOMotorClient(
            uri,
            maxPoolSize=self.settings.mongo_max_pool_size,
            minPoolSize=self.settings.mongo_min_pool_size,
            serverSelectionTimeoutMS=5000,
            retryWrites=True,
            retryReads=True,
        )

    @property
    def master_db(self) -> AsyncIOMotorDatabase:
        if self._master_client is None:
            raise RuntimeError("Database manager is not started")
        return self._master_client[self.settings.mongo_master_db]

    @property
    def shared_db(self) -> AsyncIOMotorDatabase:
        if self._shared_client is None:
            raise RuntimeError("Database manager is not started")
        return self._shared_client[self.settings.mongo_shared_db]

    async def get_tenant_db(self, tenant: dict) -> AsyncIOMotorDatabase:
        mode = tenant.get("db_mode", "shared")
        if mode == "shared":
            return self.shared_db

        db_uri = tenant.get("db_uri")
        db_name = tenant.get("db_name")
        if not db_uri or not db_name:
            return self.shared_db

        client = await self._get_or_create_tenant_client(db_uri)
        return client[db_name]

    async def _get_or_create_tenant_client(self, db_uri: str) -> AsyncIOMotorClient:
        async with self._tenant_lock:
            client = self._tenant_clients.get(db_uri)
            if client is not None:
                return client
            new_client = self._new_client(db_uri)
            self._tenant_clients[db_uri] = new_client
            return new_client

    async def ping(self) -> None:
        await self.master_db.command("ping")
        await self.shared_db.command("ping")

    async def ensure_indexes(self) -> None:
        await self._ensure_master_indexes()
        await self._ensure_shared_indexes()

    async def _ensure_master_indexes(self) -> None:
        tenants = self.master_db["tenants"]
        await tenants.create_index("slug", unique=True, sparse=True)
        await tenants.create_index("status")

        tenant_configs = self.master_db["tenant_configs"]
        await tenant_configs.create_index("tenant_id", unique=True)

        plans = self.master_db["plans"]
        await plans.create_index("code", unique=True)

        saas_admins = self.master_db["saas_admins"]
        await saas_admins.create_index("email", unique=True)

        audit_logs = self.master_db["audit_logs"]
        await audit_logs.create_index([("created_at", -1)])

    async def _ensure_shared_indexes(self) -> None:
        users = self.shared_db["users"]
        await users.create_index([("tenant_id", 1), ("email", 1)], unique=True)
        await users.create_index([("tenant_id", 1), ("role", 1)])

        products = self.shared_db["products"]
        await products.create_index([("tenant_id", 1), ("slug", 1)], unique=True)
        await products.create_index([("tenant_id", 1), ("status", 1), ("created_at", -1)])
        await products.create_index([("tenant_id", 1), ("flags.is_featured", 1)])
        await products.create_index([("tenant_id", 1), ("flags.is_trending", 1)])

        orders = self.shared_db["orders"]
        await orders.create_index([("tenant_id", 1), ("order_number", 1)], unique=True)
        await orders.create_index([("tenant_id", 1), ("created_at", -1)])

        otps = self.shared_db["otps"]
        await otps.create_index([("tenant_id", 1), ("email", 1), ("purpose", 1), ("used", 1)])
        await otps.create_index("expires_at", expireAfterSeconds=0)


async def iter_cursor(cursor) -> AsyncIterator[dict]:
    async for item in cursor:
        yield item


def collection(db: AsyncIOMotorDatabase, name: str) -> AsyncIOMotorCollection:
    return db[name]
