from __future__ import annotations

from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


class APIEnvelope(BaseModel, Generic[T]):
    data: T


class MessageResponse(BaseModel):
    message: str


class ErrorPayload(BaseModel):
    code: str
    message: str


class AuditLogCreate(BaseModel):
    action: str
    actor_id: str
    actor_role: str
    target: str
    target_id: str | None = None
    metadata: dict = Field(default_factory=dict)
    created_at: datetime


class MongoBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")
