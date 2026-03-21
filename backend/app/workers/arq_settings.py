from arq import cron

from app.core.config import get_settings
from app.workers.analytics_tasks import flush_event_buffer
from app.workers.email_tasks import (
    send_delivery_confirmation,
    send_low_stock_alert,
    send_order_confirmation,
    send_otp_email,
    send_password_reset,
    send_payout_confirmation,
    send_refund_email,
    send_shipping_update,
)
from app.workers.inventory_tasks import check_low_stock
from app.workers.pdf_tasks import generate_invoice_pdf

settings = get_settings()


class WorkerSettings:
    redis_settings = {
        "host": settings.redis_url.split("//", 1)[-1].split(":")[0],
        "port": int(settings.redis_url.rsplit(":", 1)[-1].split("/")[0]),
        "database": int(settings.redis_url.rsplit("/", 1)[-1]),
    }

    functions = [
        send_otp_email,
        send_password_reset,
        send_order_confirmation,
        send_shipping_update,
        send_delivery_confirmation,
        send_low_stock_alert,
        send_refund_email,
        send_payout_confirmation,
        generate_invoice_pdf,
        check_low_stock,
        flush_event_buffer,
    ]

    cron_jobs = [
        cron(check_low_stock, hour=2, minute=0),
        cron(flush_event_buffer, minute={0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55}),
    ]
