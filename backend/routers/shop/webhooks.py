from __future__ import annotations

from fastapi import APIRouter, Header, HTTPException, Request

from core.config import get_settings

router = APIRouter(prefix="/api/v3/webhooks", tags=["webhooks"])


@router.post("/telegram/active")
async def telegram_active_webhook(
    request: Request,
    x_webhook_secret: str | None = Header(default=None, alias="X-Webhook-Secret"),
):
    settings = get_settings()
    if settings.telegram_webhook_secret and x_webhook_secret != settings.telegram_webhook_secret:
        raise HTTPException(status_code=403, detail="Invalid webhook secret")

    payload = await request.json()
    return {"ok": True, "received": bool(payload)}
