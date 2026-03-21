from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.core.store import store, utcnow

router = APIRouter(prefix="/inventory", tags=["inventory"])
settings = get_settings()


def _new_id() -> str:
    if settings.use_in_memory:
        return store.new_id()
    return str(uuid4())


class StockUpdate(BaseModel):
    qty: int
    reason: str = "manual_update"


@router.get("")
async def get_inventory(user=Depends(require_role("vendor"))):
    if not settings.use_in_memory:
        db = await get_db()
        return await db.inventory.find({"vendor_id": user["id"]}, {"_id": 0}).to_list(length=2000)
    return [item for item in store.inventory.values() if item["vendor_id"] == user["id"]]


@router.get("/{product_id}")
async def get_inventory_by_product(product_id: str, user=Depends(require_role("vendor"))):
    if not settings.use_in_memory:
        db = await get_db()
        return await db.inventory.find({"vendor_id": user["id"], "product_id": product_id}, {"_id": 0}).to_list(length=2000)
    return [item for item in store.inventory.values() if item["vendor_id"] == user["id"] and item["product_id"] == product_id]


@router.put("/{sku}")
async def update_inventory(sku: str, payload: StockUpdate, user=Depends(require_role("vendor"))):
    if not settings.use_in_memory:
        db = await get_db()
        item = await db.inventory.find_one({"sku": sku, "vendor_id": user["id"]}, {"_id": 0})
        if not item:
            raise HTTPException(status_code=404, detail="SKU not found")
        old_qty = item["quantity"]
        await db.inventory.update_one({"id": item["id"]}, {"$set": {"quantity": payload.qty}})
        await db.inventory_logs.insert_one(
            {
                "id": _new_id(),
                "sku": sku,
                "old_qty": old_qty,
                "new_qty": payload.qty,
                "reason": payload.reason,
                "changed_by": user["id"],
                "timestamp": utcnow().isoformat(),
            }
        )
        return await db.inventory.find_one({"id": item["id"]}, {"_id": 0})

    item = next((i for i in store.inventory.values() if i["sku"] == sku and i["vendor_id"] == user["id"]), None)
    if not item:
        raise HTTPException(status_code=404, detail="SKU not found")
    old_qty = item["quantity"]
    item["quantity"] = payload.qty
    store.inventory_logs.append(
        {
            "id": _new_id(),
            "sku": sku,
            "old_qty": old_qty,
            "new_qty": payload.qty,
            "reason": payload.reason,
            "changed_by": user["id"],
            "timestamp": utcnow().isoformat(),
        }
    )
    return item


@router.post("/bulk-update")
async def bulk_update(rows: list[dict], user=Depends(require_role("vendor"))):
    if not settings.use_in_memory:
        db = await get_db()
        updated = 0
        for row in rows:
            sku = row.get("sku")
            qty = row.get("qty")
            if sku is None or qty is None:
                continue
            item = await db.inventory.find_one({"sku": sku, "vendor_id": user["id"]}, {"_id": 0})
            if not item:
                continue
            await db.inventory.update_one({"id": item["id"]}, {"$set": {"quantity": int(qty)}})
            updated += 1
        return {"updated": updated}

    updated = 0
    for row in rows:
        sku = row.get("sku")
        qty = row.get("qty")
        if sku is None or qty is None:
            continue
        item = next((i for i in store.inventory.values() if i["sku"] == sku and i["vendor_id"] == user["id"]), None)
        if not item:
            continue
        item["quantity"] = int(qty)
        updated += 1
    return {"updated": updated}


@router.get("/low-stock")
async def low_stock(user=Depends(require_role("vendor"))):
    if not settings.use_in_memory:
        db = await get_db()
        items = await db.inventory.find({"vendor_id": user["id"]}, {"_id": 0}).to_list(length=2000)
        return [i for i in items if i["quantity"] <= i.get("low_stock_threshold", 5)]
    return [i for i in store.inventory.values() if i["vendor_id"] == user["id"] and i["quantity"] <= i.get("low_stock_threshold", 5)]


@router.get("/logs")
async def logs(user=Depends(require_role("vendor"))):
    if not settings.use_in_memory:
        db = await get_db()
        items = await db.inventory.find({"vendor_id": user["id"]}, {"_id": 0}).to_list(length=2000)
        vendor_skus = {item["sku"] for item in items}
        logs_data = await db.inventory_logs.find({"sku": {"$in": list(vendor_skus)}}, {"_id": 0}).to_list(length=5000)
        return logs_data

    vendor_skus = {item["sku"] for item in store.inventory.values() if item["vendor_id"] == user["id"]}
    return [log for log in store.inventory_logs if log["sku"] in vendor_skus]
