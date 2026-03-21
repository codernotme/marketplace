from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.store import store

router = APIRouter(prefix="/users", tags=["users"])
settings = get_settings()


def _new_id() -> str:
    if settings.use_in_memory:
        return store.new_id()
    return str(uuid4())


async def _get_product_by_id(product_id: str):
    if settings.use_in_memory:
        return store.products.get(product_id)

    db = await get_db()
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if product:
        return product
    return store.products.get(product_id)


class ProfileUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    avatar: str | None = None


class Address(BaseModel):
    id: str | None = None
    line1: str
    line2: str | None = None
    city: str
    state: str
    pincode: str
    country: str = "India"


@router.get("/profile")
async def get_profile(user=Depends(get_current_user)):
    return {k: user[k] for k in ["id", "name", "email", "role", "is_active", "addresses", "wishlist"]}


@router.put("/profile")
async def update_profile(payload: ProfileUpdate, user=Depends(get_current_user)):
    data = payload.model_dump(exclude_none=True)

    if settings.use_in_memory:
        for key, value in data.items():
            user[key] = value
        return {"ok": True, "user": {k: user[k] for k in ["id", "name", "email", "role"]}}

    db = await get_db()
    if data:
        await db.users.update_one({"id": user["id"]}, {"$set": data})
    updated_user = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    return {"ok": True, "user": {k: updated_user[k] for k in ["id", "name", "email", "role"]}}


@router.get("/addresses")
async def get_addresses(user=Depends(get_current_user)):
    return user.get("addresses", [])


@router.post("/addresses")
async def add_address(payload: Address, user=Depends(get_current_user)):
    record = payload.model_dump()
    record["id"] = _new_id()

    if settings.use_in_memory:
        user.setdefault("addresses", []).append(record)
    else:
        db = await get_db()
        await db.users.update_one({"id": user["id"]}, {"$push": {"addresses": record}})
    return record


@router.put("/addresses/{address_id}")
async def update_address(address_id: str, payload: Address, user=Depends(get_current_user)):
    data = payload.model_dump(exclude_none=True)
    data.pop("id", None)

    if settings.use_in_memory:
        for address in user.setdefault("addresses", []):
            if address["id"] == address_id:
                address.update(data)
                return address
        raise HTTPException(status_code=404, detail="Address not found")

    db = await get_db()
    db_user = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    addresses = db_user.get("addresses", [])
    found = False
    for address in addresses:
        if address["id"] == address_id:
            address.update(data)
            found = True
            break
    if not found:
        raise HTTPException(status_code=404, detail="Address not found")

    await db.users.update_one({"id": user["id"]}, {"$set": {"addresses": addresses}})
    return next(address for address in addresses if address["id"] == address_id)


@router.delete("/addresses/{address_id}")
async def delete_address(address_id: str, user=Depends(get_current_user)):
    if settings.use_in_memory:
        addresses = user.setdefault("addresses", [])
        user["addresses"] = [item for item in addresses if item["id"] != address_id]
    else:
        db = await get_db()
        db_user = await db.users.find_one({"id": user["id"]}, {"_id": 0})
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        addresses = db_user.get("addresses", [])
        updated_addresses = [item for item in addresses if item["id"] != address_id]
        await db.users.update_one({"id": user["id"]}, {"$set": {"addresses": updated_addresses}})
    return {"ok": True}


@router.get("/wishlist")
async def get_wishlist(user=Depends(get_current_user)):
    ids = user.get("wishlist", [])
    if settings.use_in_memory:
        return [store.products[pid] for pid in ids if pid in store.products]

    products = []
    for pid in ids:
        product = await _get_product_by_id(pid)
        if product:
            products.append(product)
    return products


@router.post("/wishlist/{product_id}")
async def add_wishlist(product_id: str, user=Depends(get_current_user)):
    product = await _get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if settings.use_in_memory:
        wishlist = user.setdefault("wishlist", [])
        if product_id not in wishlist:
            wishlist.append(product_id)
        return {"wishlist": wishlist}

    db = await get_db()
    db_user = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    wishlist = db_user.get("wishlist", [])
    if product_id not in wishlist:
        wishlist.append(product_id)
        await db.users.update_one({"id": user["id"]}, {"$set": {"wishlist": wishlist}})
    return {"wishlist": wishlist}


@router.delete("/wishlist/{product_id}")
async def remove_wishlist(product_id: str, user=Depends(get_current_user)):
    if settings.use_in_memory:
        wishlist = user.setdefault("wishlist", [])
        user["wishlist"] = [item for item in wishlist if item != product_id]
        return {"wishlist": user["wishlist"]}

    db = await get_db()
    db_user = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    wishlist = db_user.get("wishlist", [])
    updated_wishlist = [item for item in wishlist if item != product_id]
    await db.users.update_one({"id": user["id"]}, {"$set": {"wishlist": updated_wishlist}})
    return {"wishlist": updated_wishlist}
