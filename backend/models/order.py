from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class OrderItem(BaseModel):
    product_id: str
    variant_id: str | None = None
    title: str
    image_url: str | None = None
    quantity: int
    unit_price: float
    tax_rate: float = 0
    tax_amount: float = 0
    discount_amount: float = 0
    subtotal: float


class PaymentBlock(BaseModel):
    method: Literal["razorpay", "cod", "wallet", "upi"] = "razorpay"
    status: Literal["pending", "paid", "failed", "refunded", "partially_refunded"] = "pending"
    razorpay_order_id: str | None = None
    razorpay_payment_id: str | None = None
    razorpay_signature: str | None = None
    paid_at: datetime | None = None
    amount_paid: float = 0


class FulfillmentBlock(BaseModel):
    status: Literal[
        "pending",
        "processing",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
    ] = "pending"
    tracking_number: str | None = None
    courier: str | None = None
    tracking_url: str | None = None


class OrderModel(BaseModel):
    id: str | None = None
    tenant_id: str
    order_number: str
    user_id: str | None = None
    items: list[OrderItem]
    pricing: dict
    payment: PaymentBlock
    fulfillment: FulfillmentBlock
    source: Literal["web", "mobile", "admin"] = "web"
    timeline: list[dict] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
