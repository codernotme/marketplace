from __future__ import annotations

from fastapi import APIRouter

from routers.shop import auth, data, onboarding, products

router = APIRouter(prefix="/api/shop")

router.include_router(auth.router)
router.include_router(onboarding.router)
router.include_router(products.router)
router.include_router(data.router)
