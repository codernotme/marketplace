from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class TenantCreate(BaseModel):
    name: str = Field(min_length=2, max_length=140)
    slug: str = Field(min_length=2, max_length=80)
    owner_email: EmailStr
    plan_code: str


class TenantUpdate(BaseModel):
    name: str | None = None
    owner_email: EmailStr | None = None
    status: str | None = None


class TenantConfigUpdate(BaseModel):
    resend_api_key: str | None = None
    razorpay_key_id: str | None = None
    razorpay_key_secret: str | None = None
    telegram_bot_token: str | None = None
    telegram_chat_id: str | None = None


class PlanCreate(BaseModel):
    code: str
    name: str
    monthly_price: float = Field(ge=0)
    yearly_price: float = Field(ge=0)
    max_products: int = Field(ge=1)
    max_staff: int = Field(ge=1)


class PlanUpdate(BaseModel):
    name: str | None = None
    monthly_price: float | None = Field(default=None, ge=0)
    yearly_price: float | None = Field(default=None, ge=0)
    max_products: int | None = Field(default=None, ge=1)
    max_staff: int | None = Field(default=None, ge=1)
    is_active: bool | None = None


class AnnouncementCreate(BaseModel):
    title: str
    body: str
    severity: str = Field(default="info")
    starts_at: datetime | None = None
    ends_at: datetime | None = None


class AnnouncementUpdate(BaseModel):
    title: str | None = None
    body: str | None = None
    severity: str | None = None
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    is_active: bool | None = None


class SaasAdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=8)
    role: str = Field(default="support")
