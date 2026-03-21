import logging

import httpx

from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


async def _send_email(to: str, subject: str, html: str) -> None:
    if not settings.resend_api_key:
        logger.info("Email skipped (RESEND_API_KEY missing): to=%s subject=%s", to, subject)
        return

    payload = {
        "from": settings.resend_from_email,
        "to": [to],
        "subject": subject,
        "html": html,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {settings.resend_api_key}"},
            json=payload,
        )
        response.raise_for_status()


async def send_otp_email(ctx, email: str, otp: str) -> None:
    await _send_email(email, "Verify your account", f"<p>Your OTP is <b>{otp}</b>. It expires in 10 minutes.</p>")


async def send_password_reset(ctx, email: str, reset_url: str) -> None:
    await _send_email(email, "Reset your password", f"<p>Reset your password: <a href=\"{reset_url}\">{reset_url}</a></p>")


async def send_order_confirmation(ctx, email: str, order_id: str) -> None:
    await _send_email(email, "Order confirmed", f"<p>Your order <b>{order_id}</b> has been confirmed.</p>")


async def send_shipping_update(ctx, email: str, order_id: str) -> None:
    await _send_email(email, "Order shipped", f"<p>Your order <b>{order_id}</b> is now shipped.</p>")


async def send_delivery_confirmation(ctx, email: str, order_id: str) -> None:
    await _send_email(email, "Order delivered", f"<p>Your order <b>{order_id}</b> was delivered.</p>")


async def send_low_stock_alert(ctx, email: str, sku: str) -> None:
    await _send_email(email, "Low stock alert", f"<p>Inventory is low for SKU <b>{sku}</b>.</p>")


async def send_refund_email(ctx, email: str, order_id: str) -> None:
    await _send_email(email, "Refund processed", f"<p>Refund has been processed for order <b>{order_id}</b>.</p>")


async def send_payout_confirmation(ctx, email: str, amount: float) -> None:
    await _send_email(email, "Payout processed", f"<p>Your payout of <b>{amount:.2f}</b> has been processed.</p>")
