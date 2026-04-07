from __future__ import annotations

from fastapi import APIRouter, Depends

from core.dependencies import get_master_db, saas_admin_required

router = APIRouter(prefix="/dashboard", tags=["saas-dashboard"])


@router.get("/metrics")
async def dashboard_metrics(
    _: dict = Depends(saas_admin_required), master_db=Depends(get_master_db)
):
    total_tenants = await master_db["tenants"].count_documents({})
    active_tenants = await master_db["tenants"].count_documents({"status": "active"})
    suspended_tenants = await master_db["tenants"].count_documents({"status": "suspended"})

    agg = (
        await master_db["tenant_subscriptions"]
        .aggregate(
            [
                {"$match": {"status": "active"}},
                {"$group": {"_id": None, "mrr": {"$sum": "$monthly_amount"}}},
            ]
        )
        .to_list(length=1)
    )
    mrr = float(agg[0]["mrr"]) if agg else 0.0

    return {
        "total_tenants": total_tenants,
        "active_tenants": active_tenants,
        "suspended_tenants": suspended_tenants,
        "mrr": mrr,
    }
