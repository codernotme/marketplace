from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class Address(BaseModel):
    id: str
    label: Literal["Home", "Work", "Other"]
    full_name: str
    phone: str
    line1: str
    line2: str | None = None
    city: str
    state: str
    pincode: str
    country: str
    is_default: bool = False


class UserModel(BaseModel):
    id: str | None = None
    tenant_id: str
    name: str
    email: EmailStr
    phone: str | None = None
    password_hash: str | None = None
    role: Literal["customer", "vendor", "shop_admin", "saas_admin"] = "customer"
    is_email_verified: bool = False
    is_phone_verified: bool = False
    is_active: bool = True
    auth_provider: Literal["local", "google", "otp"] = "local"
    addresses: list[Address] = Field(default_factory=list)
    wishlist: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    total_orders: int = 0
    total_spent: float = 0
    created_at: datetime
    last_login: datetime | None = None
