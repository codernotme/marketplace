from datetime import datetime, timezone
from threading import RLock
from typing import Any
from uuid import uuid4


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class InMemoryStore:
    def __init__(self) -> None:
        self.lock = RLock()
        self.users: dict[str, dict[str, Any]] = {}
        self.refresh_tokens: dict[str, dict[str, Any]] = {}
        self.otp_codes: dict[str, dict[str, Any]] = {}
        self.password_reset_tokens: dict[str, dict[str, Any]] = {}
        self.categories: dict[str, dict[str, Any]] = {}
        self.products: dict[str, dict[str, Any]] = {}
        self.carts: dict[str, dict[str, Any]] = {}
        self.orders: dict[str, dict[str, Any]] = {}
        self.transactions: dict[str, dict[str, Any]] = {}
        self.inventory: dict[str, dict[str, Any]] = {}
        self.inventory_logs: list[dict[str, Any]] = []
        self.vendors: dict[str, dict[str, Any]] = {}
        self.events: list[dict[str, Any]] = []
        self.reviews: dict[str, dict[str, Any]] = {}
        self.coupons: dict[str, dict[str, Any]] = {}

    def new_id(self) -> str:
        return str(uuid4())


store = InMemoryStore()
