from __future__ import annotations

from fastapi import Request

from core.exceptions import NotFoundError
from utils.object_id import try_object_id


def resolve_tenant_identifier(request: Request) -> str | None:
    tenant_header = request.headers.get("X-Tenant-ID") or request.headers.get("X-Tenant-Slug")
    if tenant_header:
        return tenant_header.strip()

    host = request.headers.get("host", "")
    if host and "." in host and not host.startswith("localhost"):
        subdomain = host.split(".")[0].strip()
        if subdomain and subdomain not in {"www", "api"}:
            return subdomain
    return None


async def load_active_tenant(master_db, tenant_identifier: str | None) -> dict:
    if not tenant_identifier:
        raise NotFoundError("Missing tenant identifier")

    query = {"status": "active"}
    oid = try_object_id(tenant_identifier)
    if oid is not None:
        query["$or"] = [{"_id": oid}, {"slug": tenant_identifier}]
    else:
        query["slug"] = tenant_identifier

    tenant = await master_db["tenants"].find_one(query)
    if tenant is None:
        raise NotFoundError("Tenant not found or inactive")
    return tenant
