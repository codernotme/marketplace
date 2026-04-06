from __future__ import annotations

from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase


class TenantRepository:
    def __init__(self, db: AsyncIOMotorDatabase, tenant_id):
        self.db = db
        self.tenant_id = tenant_id

    def _scope(self, query: dict[str, Any] | None = None) -> dict[str, Any]:
        scoped = dict(query or {})
        scoped["tenant_id"] = self.tenant_id
        return scoped

    async def find_one(self, collection: str, query: dict[str, Any]) -> dict | None:
        return await self.db[collection].find_one(self._scope(query))

    async def find_many(
        self,
        collection: str,
        query: dict[str, Any],
        skip: int = 0,
        limit: int = 20,
        sort: list[tuple[str, int]] | None = None,
    ) -> list[dict]:
        cursor = self.db[collection].find(self._scope(query)).skip(skip).limit(limit)
        if sort:
            cursor = cursor.sort(sort)
        return [item async for item in cursor]

    async def count(self, collection: str, query: dict[str, Any]) -> int:
        return await self.db[collection].count_documents(self._scope(query))

    async def insert_one(self, collection: str, payload: dict[str, Any]):
        doc = dict(payload)
        doc["tenant_id"] = self.tenant_id
        return await self.db[collection].insert_one(doc)

    async def update_one(self, collection: str, query: dict[str, Any], update: dict[str, Any]):
        return await self.db[collection].update_one(self._scope(query), update)
