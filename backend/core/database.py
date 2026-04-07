from __future__ import annotations

import asyncio
import socket
from collections.abc import AsyncIterator

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection, AsyncIOMotorDatabase
from pymongo.errors import ServerSelectionTimeoutError

from core.config import get_settings


_ORIGINAL_GETADDRINFO = socket.getaddrinfo
_IPV4_PATCH_APPLIED = False


def _ipv4_only_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    results = _ORIGINAL_GETADDRINFO(host, port, family, type, proto, flags)
    ipv4_results = [entry for entry in results if entry[0] == socket.AF_INET]
    return ipv4_results or results


class DatabaseManager:
    def __init__(self) -> None:
        self.settings = get_settings()
        self._master_client: AsyncIOMotorClient | None = None
        self._shared_client: AsyncIOMotorClient | None = None
        self._tenant_clients: dict[str, AsyncIOMotorClient] = {}
        self._tenant_lock = asyncio.Lock()

    async def startup(self) -> None:
        self._apply_ipv4_dns_patch_if_enabled()
        self._master_client = self._new_client(self.settings.mongo_master_uri)
        self._shared_client = self._new_client(self.settings.mongo_shared_uri)
        try:
            await self.ping()
        except ServerSelectionTimeoutError as exc:
            raise RuntimeError(self._format_connection_error(exc)) from exc
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

    def _apply_ipv4_dns_patch_if_enabled(self) -> None:
        global _IPV4_PATCH_APPLIED
        if not self.settings.mongo_force_ipv4 or _IPV4_PATCH_APPLIED:
            return
        socket.getaddrinfo = _ipv4_only_getaddrinfo
        _IPV4_PATCH_APPLIED = True

    def _format_connection_error(self, exc: Exception) -> str:
        base = f"MongoDB connection failed during startup: {exc}"
        guidance = (
            "Possible fixes: "
            "1) Allow this machine IP in MongoDB Atlas Network Access. "
            "2) If your network uses NAT64/IPv6-only routing, set MONGO_FORCE_IPV4=true in backend/.env. "
            "3) Try another network or VPN and restart the backend."
        )
        return f"{base}. {guidance}"

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
        await self._ensure_tenant_indexes(self.shared_db)
        await self.ensure_active_tenant_databases_ready()

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

    async def _ensure_tenant_indexes(self, tenant_db: AsyncIOMotorDatabase) -> None:
        categories = tenant_db["categories"]
        await categories.create_index([("tenant_id", 1), ("slug", 1)], unique=True)

        users = tenant_db["users"]
        await users.create_index([("tenant_id", 1), ("email", 1)], unique=True)
        await users.create_index([("tenant_id", 1), ("role", 1)])

        products = tenant_db["products"]
        await products.create_index([("tenant_id", 1), ("slug", 1)], unique=True)
        await products.create_index([("tenant_id", 1), ("status", 1), ("created_at", -1)])
        await products.create_index([("tenant_id", 1), ("flags.is_featured", 1)])
        await products.create_index([("tenant_id", 1), ("flags.is_trending", 1)])

        reviews = tenant_db["reviews"]
        await reviews.create_index([("tenant_id", 1), ("product_id", 1), ("created_at", -1)])

        blog_posts = tenant_db["blog_posts"]
        await blog_posts.create_index([("tenant_id", 1), ("slug", 1)], unique=True)
        await blog_posts.create_index([("tenant_id", 1), ("featured", 1)])

        notifications = tenant_db["notifications"]
        await notifications.create_index([("tenant_id", 1), ("createdAt", -1)])

        addresses = tenant_db["addresses"]
        await addresses.create_index([("tenant_id", 1), ("user_id", 1), ("isDefault", -1)])

        orders = tenant_db["orders"]
        await orders.create_index([("tenant_id", 1), ("order_number", 1)], unique=True)
        await orders.create_index([("tenant_id", 1), ("created_at", -1)])

        otps = tenant_db["otps"]
        await otps.create_index([("tenant_id", 1), ("email", 1), ("purpose", 1), ("used", 1)])
        await otps.create_index("expires_at", expireAfterSeconds=0)

    async def ensure_active_tenant_databases_ready(self) -> None:
        processed_targets: set[str] = set()
        async for tenant in self.master_db["tenants"].find({"status": "active"}):
            mode = tenant.get("db_mode", "shared")
            if mode == "shared":
                target_key = f"shared:{self.settings.mongo_shared_db}"
            else:
                target_key = f"dedicated:{tenant.get('db_uri')}:{tenant.get('db_name')}"

            if target_key in processed_targets:
                continue
            processed_targets.add(target_key)

            tenant_db = await self.get_tenant_db(tenant)
            await tenant_db.command("ping")
            await self._ensure_tenant_indexes(tenant_db)


async def iter_cursor(cursor) -> AsyncIterator[dict]:
    async for item in cursor:
        yield item


def collection(db: AsyncIOMotorDatabase, name: str) -> AsyncIOMotorCollection:
    return db[name]
