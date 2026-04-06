from __future__ import annotations

import httpx
from tenacity import retry, stop_after_attempt, wait_fixed

from core.config import get_settings


@retry(stop=stop_after_attempt(3), wait=wait_fixed(1))
async def send_email(api_key: str, to: str, subject: str, html: str) -> None:
    settings = get_settings()
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "from": settings.default_from_email,
        "to": [to],
        "subject": subject,
        "html": html,
    }

    async with httpx.AsyncClient(timeout=12.0) as client:
        response = await client.post(f"{settings.resend_api_base}/emails", headers=headers, json=payload)
        response.raise_for_status()
