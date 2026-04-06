from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ProductFlags(BaseModel):
    is_new: bool = False
    is_trending: bool = False
    is_featured: bool = False
    is_best_seller: bool = False
    is_digital: bool = False


class ProductModel(BaseModel):
    id: str | None = None
    tenant_id: str
    title: str
    slug: str
    description: str = ""
    category_id: str
    brand: str | None = None
    price: float
    compare_price: float | None = None
    stock: int = 0
    status: Literal["draft", "active", "archived"] = "draft"
    flags: ProductFlags = Field(default_factory=ProductFlags)
    tags: list[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
    published_at: datetime | None = None
