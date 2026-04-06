from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from core.dependencies import get_master_db, saas_admin_required
from utils.serialize import to_jsonable

router = APIRouter(prefix="/audit-logs", tags=["saas-audit"])


@router.get("")
async def list_audit_logs(
    _: dict = Depends(saas_admin_required),
    master_db=Depends(get_master_db),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    skip = (page - 1) * limit
    cursor = master_db["audit_logs"].find({}).sort("created_at", -1).skip(skip).limit(limit)
    data = [to_jsonable(item) async for item in cursor]
    total = await master_db["audit_logs"].count_documents({})
    return {"data": data, "total": total, "page": page, "limit": limit}
