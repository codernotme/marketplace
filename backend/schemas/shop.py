from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ProductFilter(BaseModel):
    query: str | None = None
    category_id: str | None = None
    status: str | None = None
    sort: str = "-created_at"


class ProductCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    slug: str = Field(min_length=2, max_length=220)
    description: str = ""
    category_id: str
    brand: str | None = None
    price: float = Field(ge=0)
    compare_price: float | None = Field(default=None, ge=0)
    stock: int = Field(default=0, ge=0)
    status: Literal["draft", "active", "archived"] = "draft"


class ProductUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category_id: str | None = None
    brand: str | None = None
    price: float | None = Field(default=None, ge=0)
    compare_price: float | None = Field(default=None, ge=0)
    stock: int | None = Field(default=None, ge=0)
    status: Literal["draft", "active", "archived"] | None = None


class OnboardingStep1(BaseModel):
    shop_name: str
    tagline: str | None = None
    logo_url: str | None = None
    primary_color: str | None = None
    contact_email: str
    contact_phone: str | None = None


class OnboardingStep2(BaseModel):
    email: str
    password: str = Field(min_length=8)
    resend_api_key: str | None = None


class OnboardingStep3(BaseModel):
    razorpay_key_id: str
    razorpay_key_secret: str
    telegram_bot_token: str | None = None
    telegram_chat_id: str | None = None
    dedicated_db_uri: str | None = None
    dedicated_db_name: str | None = None


class VerificationResponse(BaseModel):
    razorpay: Literal["ok", "failed"]
    telegram: Literal["ok", "failed"]
    resend: Literal["ok", "failed"]


class OrderEvent(BaseModel):
    status: str
    note: str
    created_by: str
    created_at: datetime
