from __future__ import annotations

from fastapi import APIRouter, Depends

from core.dependencies import get_master_db, saas_admin_required
from schemas.saas import PlanCreate, PlanUpdate
from utils.object_id import to_object_id
from utils.serialize import to_jsonable
from utils.time import utcnow

router = APIRouter(prefix="/plans", tags=["saas-plans"])


@router.get("")
async def list_plans(_: dict = Depends(saas_admin_required), master_db=Depends(get_master_db)):
    data = [to_jsonable(item) async for item in master_db["plans"].find({}).sort("monthly_price", 1)]
    return {"data": data}


@router.post("")
async def create_plan(payload: PlanCreate, _: dict = Depends(saas_admin_required), master_db=Depends(get_master_db)):
    doc = payload.model_dump()
    doc.update({"is_active": True, "created_at": utcnow(), "updated_at": utcnow()})
    result = await master_db["plans"].insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Plan created"}


@router.patch("/{plan_id}")
async def update_plan(
    plan_id: str,
    payload: PlanUpdate,
    _: dict = Depends(saas_admin_required),
    master_db=Depends(get_master_db),
):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    updates["updated_at"] = utcnow()
    await master_db["plans"].update_one({"_id": to_object_id(plan_id)}, {"$set": updates})
    return {"message": "Plan updated"}


@router.delete("/{plan_id}")
async def deactivate_plan(plan_id: str, _: dict = Depends(saas_admin_required), master_db=Depends(get_master_db)):
    await master_db["plans"].update_one(
        {"_id": to_object_id(plan_id)},
        {"$set": {"is_active": False, "updated_at": utcnow()}},
    )
    return {"message": "Plan deactivated"}
