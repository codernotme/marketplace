from __future__ import annotations

import hmac
from hashlib import sha256

import httpx
from tenacity import retry, stop_after_attempt, wait_fixed

from core.config import get_settings


@retry(stop=stop_after_attempt(3), wait=wait_fixed(1))
async def razorpay_healthcheck(key_id: str, key_secret: str) -> None:
    settings = get_settings()
    auth = (key_id, key_secret)
    async with httpx.AsyncClient(timeout=12.0, auth=auth) as client:
        response = await client.get(f"{settings.razorpay_api_base}/orders", params={"count": 1})
        response.raise_for_status()


def verify_razorpay_signature(order_id: str, payment_id: str, signature: str, key_secret: str) -> bool:
    message = f"{order_id}|{payment_id}".encode("utf-8")
    digest = hmac.new(key_secret.encode("utf-8"), message, sha256).hexdigest()
    return hmac.compare_digest(digest, signature)
