async def generate_invoice_pdf(ctx, order_id: str) -> str:
    return f"/invoices/{order_id}.pdf"
