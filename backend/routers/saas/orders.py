from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime, timedelta
import random

# Mock database
MOCK_ORDERS = [
    {
        "_id": f"ord_{i:04d}",
        "tenant_id": random.choice(["65f2b1a2c3d4", "65f2c2a3b1c2"]),
        "order_number": f"TRZ-{1000 + i}",
        "user_email": f"customer_{i}@example.com",
        "total_amount": round(random.uniform(20.0, 500.0), 2),
        "payment_status": random.choice(["paid", "pending", "failed", "refunded"]),
        "fulfillment_status": random.choice(["pending", "processing", "shipped", "delivered", "cancelled"]),
        "created_at": (datetime.now() - timedelta(days=random.randint(0, 30), minutes=random.randint(0, 1440))).isoformat(),
    } for i in range(1, 21)
]

router = APIRouter(tags=["SaaS Orders"])

@router.get("/orders")
async def get_all_orders(
    tenant_id: Optional[str] = None,
    payment_status: Optional[str] = None,
    fulfillment_status: Optional[str] = None
):
    """
    Retrieve all transactions across the entire multi-tenant ecosystem.
    """
    filtered = MOCK_ORDERS
    if tenant_id:
        filtered = [o for o in filtered if o["tenant_id"] == tenant_id]
    if payment_status:
        filtered = [o for o in filtered if o["payment_status"] == payment_status]
    if fulfillment_status:
        filtered = [o for o in filtered if o["fulfillment_status"] == fulfillment_status]
        
    return {"data": filtered}

@router.get("/orders/stats")
async def get_order_stats():
    """
    Return platform-level KPI statistics for the Orders dashboard.
    """
    total_revenue = sum(o["total_amount"] for o in MOCK_ORDERS if o["payment_status"] == "paid")
    successful_orders = len([o for o in MOCK_ORDERS if o["payment_status"] == "paid"])
    
    return {
        "gross_revenue": round(total_revenue, 2),
        "avg_order_value": round(total_revenue / successful_orders if successful_orders > 0 else 0, 2),
        "total_volume": len(MOCK_ORDERS),
        "success_rate": round(successful_orders / len(MOCK_ORDERS) * 100, 2) if len(MOCK_ORDERS) > 0 else 0
    }
