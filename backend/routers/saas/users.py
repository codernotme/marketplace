from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
import uuid

# In a real application, these would be fetched from MongoDB
# Here we mock it for the SaaS dashboard.
MOCK_USERS = [
    {
        "_id": "usr_001",
        "tenant_id": "65f2b1a2c3d4",
        "name": "Alex Jenkins",
        "email": "alex.j@example.com",
        "phone": "+1 555-0100",
        "role": "customer",
        "is_email_verified": True,
        "is_phone_verified": True,
        "is_active": True,
        "auth_provider": "local",
        "total_orders": 24,
        "total_spent": 1450.50,
        "created_at": datetime.now().isoformat(),
        "last_login": datetime.now().isoformat(),
    },
    {
        "_id": "usr_002",
        "tenant_id": "65f2b1a2c3d4",
        "name": "Sarah Connor",
        "email": "s.connor@example.com",
        "phone": "+1 555-0199",
        "role": "shop_admin",
        "is_email_verified": True,
        "is_phone_verified": False,
        "is_active": True,
        "auth_provider": "google",
        "total_orders": 0,
        "total_spent": 0,
        "created_at": datetime.now().isoformat(),
        "last_login": datetime.now().isoformat(),
    },
    {
        "_id": "usr_003",
        "tenant_id": "65f2c2a3b1c2",
        "name": "Marcus Wright",
        "email": "marcus@unknown.com",
        "phone": None,
        "role": "customer",
        "is_email_verified": False,
        "is_phone_verified": False,
        "is_active": False,
        "auth_provider": "local",
        "total_orders": 3,
        "total_spent": 45.0,
        "created_at": datetime.now().isoformat(),
        "last_login": datetime.now().isoformat(),
    }
]

router = APIRouter(tags=["SaaS Users"])

@router.get("/users")
async def get_all_users(role: Optional[str] = None):
    """
    Retrieve global users across the platform.
    Optional filter by role.
    """
    if role and role != "all":
        filtered = [u for u in MOCK_USERS if u["role"] == role]
        return {"data": filtered}
    return {"data": MOCK_USERS}


@router.patch("/users/{user_id}/status")
async def update_user_status(user_id: str, payload: dict):
    """
    Suspend or activate a user account across the platform.
    """
    for u in MOCK_USERS:
        if u["_id"] == user_id:
            if "is_active" in payload:
                u["is_active"] = payload["is_active"]
            return {"data": u}
    raise HTTPException(status_code=404, detail="User not found")
