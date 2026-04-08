from __future__ import annotations

from typing import Literal

ModuleName = Literal["shop", "web", "app"]

PLAN_ALIASES: dict[str, str] = {
    "pro": "intermediate",
}

PLAN_MODULES: dict[str, list[ModuleName]] = {
    "free": ["shop"],
    "starter": ["shop"],
    "intermediate": ["shop", "web"],
    "growth": ["shop", "web", "app"],
    "enterprise": ["shop", "web", "app"],
}

PLAN_DEFAULTS: dict[str, dict] = {
    "free": {
        "name": "Free",
        "description": "Launch a single-storefront shop with core commerce tools.",
        "monthly_price": 0,
        "yearly_price": 0,
        "max_products": 50,
        "max_staff": 1,
        "allowed_modules": ["shop"],
        "requires_contact_sales": False,
    },
    "starter": {
        "name": "Starter",
        "description": "Shop platform only for small teams that want a focused storefront.",
        "monthly_price": 29,
        "yearly_price": 290,
        "max_products": 500,
        "max_staff": 3,
        "allowed_modules": ["shop"],
        "requires_contact_sales": False,
    },
    "intermediate": {
        "name": "Intermediate",
        "description": "Shop plus web storefront for multi-channel selling.",
        "monthly_price": 99,
        "yearly_price": 990,
        "max_products": 5000,
        "max_staff": 10,
        "allowed_modules": ["shop", "web"],
        "requires_contact_sales": False,
    },
    "growth": {
        "name": "Growth",
        "description": "Shop, web, and mobile app access for scaling brands.",
        "monthly_price": 249,
        "yearly_price": 2490,
        "max_products": 10000,
        "max_staff": 25,
        "allowed_modules": ["shop", "web", "app"],
        "requires_contact_sales": False,
    },
    "enterprise": {
        "name": "Enterprise",
        "description": "Custom rollout, dedicated support, and sales-led onboarding.",
        "monthly_price": 499,
        "yearly_price": 4990,
        "max_products": -1,
        "max_staff": -1,
        "allowed_modules": ["shop", "web", "app"],
        "requires_contact_sales": True,
    },
}


def normalize_plan_code(plan_code: str) -> str:
    cleaned = plan_code.strip().lower()
    return PLAN_ALIASES.get(cleaned, cleaned)


def get_plan_modules(plan_code: str) -> list[ModuleName]:
    normalized = normalize_plan_code(plan_code)
    return PLAN_MODULES.get(normalized, ["shop"])


def requires_contact_sales(plan_code: str) -> bool:
    normalized = normalize_plan_code(plan_code)
    return normalized == "enterprise"


def get_plan_display_name(plan_code: str) -> str:
    normalized = normalize_plan_code(plan_code)
    return PLAN_DEFAULTS.get(normalized, {}).get("name", normalized.title())


def seed_plan_documents() -> list[dict]:
    from utils.time import utcnow

    now = utcnow()
    documents: list[dict] = []
    for code, payload in PLAN_DEFAULTS.items():
        document = {
            "code": code,
            "name": payload["name"],
            "description": payload["description"],
            "monthly_price": payload["monthly_price"],
            "yearly_price": payload["yearly_price"],
            "max_products": payload["max_products"],
            "max_staff": payload["max_staff"],
            "allowed_modules": payload["allowed_modules"],
            "requires_contact_sales": payload["requires_contact_sales"],
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        }
        documents.append(document)
    return documents


def build_plan_document(payload: dict) -> dict:
    normalized = normalize_plan_code(payload["code"])
    defaults = PLAN_DEFAULTS.get(normalized, PLAN_DEFAULTS["free"])
    allowed_modules = payload.get("allowed_modules") or defaults["allowed_modules"]
    document = {
        "code": normalized,
        "name": payload.get("name") or defaults["name"],
        "description": payload.get("description") or defaults["description"],
        "monthly_price": payload.get("monthly_price", defaults["monthly_price"]),
        "yearly_price": payload.get("yearly_price", defaults["yearly_price"]),
        "currency": payload.get("currency", "USD"),
        "max_products": payload.get("max_products", defaults["max_products"]),
        "max_staff": payload.get("max_staff", defaults["max_staff"]),
        "allowed_modules": allowed_modules,
        "requires_contact_sales": payload.get(
            "requires_contact_sales", defaults["requires_contact_sales"]
        ),
    }
    if payload.get("features") is not None:
        document["features"] = payload["features"]
    return document
