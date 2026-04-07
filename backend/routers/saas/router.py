from __future__ import annotations

from fastapi import APIRouter

from routers.saas import admins, announcements, audit_logs, auth, dashboard, plans, tenants, users, orders

router = APIRouter(prefix="/api/saas")

router.include_router(auth.router)
router.include_router(dashboard.router)
router.include_router(tenants.router)
router.include_router(plans.router)
router.include_router(announcements.router)
router.include_router(admins.router)
router.include_router(audit_logs.router)
router.include_router(users.router)
router.include_router(orders.router)
