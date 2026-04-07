from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from core.dependencies import get_tenant, get_tenant_db, pagination_params, require_roles
from schemas.shop import ProductCreate, ProductUpdate
from utils.object_id import to_object_id, try_object_id
from utils.serialize import to_jsonable
from utils.time import utcnow

router = APIRouter(prefix="/products", tags=["shop-products"])


@router.get("")
async def list_products(
    tenant=Depends(get_tenant),
    tenant_db=Depends(get_tenant_db),
    pg: tuple[int, int] = Depends(pagination_params),
    category: str | None = Query(default=None),
    status: str | None = Query(default=None),
    search: str | None = Query(default=None),
    sort: str = Query(default="-created_at"),
):
    skip, limit = pg
    query = {"tenant_id": tenant["_id"]}
    if category:
        category_oid = try_object_id(category)
        query["category_id"] = category_oid if category_oid is not None else category
    if status:
        query["status"] = status
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}},
            {"slug": {"$regex": search, "$options": "i"}},
        ]

    direction = -1 if sort.startswith("-") else 1
    field = sort[1:] if sort.startswith("-") else sort

    cursor = tenant_db["products"].find(query).sort(field, direction).skip(skip).limit(limit)
    data = [to_jsonable(item) async for item in cursor]
    total = await tenant_db["products"].count_documents(query)
    return {"data": data, "total": total}


@router.get("/featured")
async def featured_products(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    cursor = (
        tenant_db["products"]
        .find({"tenant_id": tenant["_id"], "flags.is_featured": True, "status": "active"})
        .limit(12)
    )
    return {"data": [to_jsonable(item) async for item in cursor]}


@router.get("/new-arrivals")
async def new_arrivals(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    cursor = (
        tenant_db["products"]
        .find({"tenant_id": tenant["_id"], "status": "active"})
        .sort("created_at", -1)
        .limit(20)
    )
    return {"data": [to_jsonable(item) async for item in cursor]}


@router.get("/trending")
async def trending_products(tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    cursor = (
        tenant_db["products"]
        .find({"tenant_id": tenant["_id"], "flags.is_trending": True, "status": "active"})
        .limit(12)
    )
    return {"data": [to_jsonable(item) async for item in cursor]}


@router.get("/{slug}")
async def get_product(slug: str, tenant=Depends(get_tenant), tenant_db=Depends(get_tenant_db)):
    product = await tenant_db["products"].find_one({"tenant_id": tenant["_id"], "slug": slug})
    return {"data": to_jsonable(product) if product else None}


@router.post("")
async def create_product(
    payload: ProductCreate,
    tenant=Depends(get_tenant),
    tenant_db=Depends(get_tenant_db),
    _: dict = Depends(require_roles(["shop_admin", "vendor"])),
):
    now = utcnow()
    doc = payload.model_dump()
    doc.update(
        {
            "tenant_id": tenant["_id"],
            "category_id": to_object_id(payload.category_id),
            "flags": {
                "is_new": True,
                "is_trending": False,
                "is_featured": False,
                "is_best_seller": False,
                "is_digital": False,
            },
            "images": [],
            "variants": [],
            "attributes": [],
            "created_at": now,
            "updated_at": now,
            "published_at": now if payload.status == "active" else None,
        }
    )
    result = await tenant_db["products"].insert_one(dict(doc))
    return {"id": str(result.inserted_id), "message": "Product created"}


@router.patch("/{product_id}")
async def update_product(
    product_id: str,
    payload: ProductUpdate,
    tenant=Depends(get_tenant),
    tenant_db=Depends(get_tenant_db),
    _: dict = Depends(require_roles(["shop_admin", "vendor"])),
):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "category_id" in updates:
        updates["category_id"] = to_object_id(updates["category_id"])
    updates["updated_at"] = utcnow()

    await tenant_db["products"].update_one(
        {"_id": to_object_id(product_id), "tenant_id": tenant["_id"]},
        {"$set": updates},
    )
    return {"message": "Product updated"}


@router.delete("/{product_id}")
async def archive_product(
    product_id: str,
    tenant=Depends(get_tenant),
    tenant_db=Depends(get_tenant_db),
    _: dict = Depends(require_roles(["shop_admin", "vendor"])),
):
    await tenant_db["products"].update_one(
        {"_id": to_object_id(product_id), "tenant_id": tenant["_id"]},
        {"$set": {"status": "archived", "updated_at": utcnow()}},
    )
    return {"message": "Product archived"}
