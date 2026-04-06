from __future__ import annotations

from fastapi import APIRouter, Depends

from core.dependencies import get_master_db, saas_admin_required
from schemas.saas import AnnouncementCreate, AnnouncementUpdate
from utils.object_id import to_object_id
from utils.serialize import to_jsonable
from utils.time import utcnow

router = APIRouter(prefix="/announcements", tags=["saas-announcements"])


@router.get("")
async def list_announcements(_: dict = Depends(saas_admin_required), master_db=Depends(get_master_db)):
    query = {"is_active": {"$ne": False}}
    data = [to_jsonable(item) async for item in master_db["announcements"].find(query).sort("created_at", -1)]
    return {"data": data}


@router.post("")
async def create_announcement(
    payload: AnnouncementCreate,
    _: dict = Depends(saas_admin_required),
    master_db=Depends(get_master_db),
):
    doc = payload.model_dump()
    doc.update({"is_active": True, "created_at": utcnow(), "updated_at": utcnow()})
    result = await master_db["announcements"].insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Announcement created"}


@router.patch("/{announcement_id}")
async def update_announcement(
    announcement_id: str,
    payload: AnnouncementUpdate,
    _: dict = Depends(saas_admin_required),
    master_db=Depends(get_master_db),
):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    updates["updated_at"] = utcnow()
    await master_db["announcements"].update_one(
        {"_id": to_object_id(announcement_id)},
        {"$set": updates},
    )
    return {"message": "Announcement updated"}


@router.delete("/{announcement_id}")
async def delete_announcement(
    announcement_id: str,
    _: dict = Depends(saas_admin_required),
    master_db=Depends(get_master_db),
):
    await master_db["announcements"].update_one(
        {"_id": to_object_id(announcement_id)},
        {"$set": {"is_active": False, "updated_at": utcnow()}},
    )
    return {"message": "Announcement deleted"}
