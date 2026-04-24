import type { Sale, SaleItem, SalePayment, Store, Tenant, Customer, ProductVariant, Product } from '@prisma/client'

type SaleWithDetails = Sale & {
  items: (SaleItem & { variant: ProductVariant & { product: Product } })[]
  payments: SalePayment[]
  store: Store
  customer: Customer | null
}

export function generateInvoiceHTML(sale: SaleWithDetails, tenant: Tenant) {
  const itemsHTML = sale.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.variant.product.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(item.unitPrice).toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(item.taxAmount).toFixed(2)} (${item.taxRate}%)</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(item.total).toFixed(2)}</td>
    </tr>
  `).join('')

  const paymentsHTML = sale.payments.map(p => `
    <div>${p.method}: ₹${Number(p.amount).toFixed(2)}</div>
  `).join('')

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice ${sale.invoiceNumber}</title>
    <style>
        body { font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .business-info h2 { margin: 0; color: #000; }
        .invoice-details { text-align: right; }
        .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .customer-info h4, .store-info h4 { margin-bottom: 5px; color: #666; text-transform: uppercase; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f9f9f9; text-align: left; padding: 10px; border-bottom: 2px solid #eee; }
        .totals { float: right; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
        .grand-total { border-top: 2px solid #000; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 18px; }
        .footer { clear: both; margin-top: 50px; text-align: center; color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <div class="business-info">
                <h2>${tenant.businessName}</h2>
                <p>${sale.store.address || ''}<br>${sale.store.phone || ''}</p>
            </div>
            <div class="invoice-details">
                <h1 style="margin:0; color: #000;">INVOICE</h1>
                <p>#${sale.invoiceNumber}<br>${new Date(sale.createdAt).toLocaleDateString()}</p>
            </div>
        </div>

        <div class="details">
            <div class="store-info">
                <h4>Bill From</h4>
                <strong>${sale.store.name}</strong><br>
                GSTIN: ${tenant.gstNumber || 'N/A'}
            </div>
            <div class="customer-info">
                <h4>Bill To</h4>
                ${sale.customer ? `
                    <strong>${sale.customer.name}</strong><br>
                    ${sale.customer.phone || ''}<br>
                    ${sale.customer.email || ''}
                ` : 'Walk-in Customer'}
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Tax</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>

        <div class="totals">
            <div class="total-row">
                <span>Subtotal</span>
                <span>₹${Number(sale.subtotal).toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>Discount</span>
                <span>- ₹${Number(sale.discountAmount).toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>Tax</span>
                <span>₹${Number(sale.taxAmount).toFixed(2)}</span>
            </div>
            <div class="total-row grand-total">
                <span>Grand Total</span>
                <span>₹${Number(sale.grandTotal).toFixed(2)}</span>
            </div>
            
            <div style="margin-top: 20px; font-size: 12px; color: #666;">
                <strong>Payments:</strong>
                ${paymentsHTML}
            </div>
        </div>

        <div class="footer">
            <p>Thank you for your business!</p>
            <p>This is a computer generated invoice.</p>
        </div>
    </div>
</body>
</html>
  `
}
