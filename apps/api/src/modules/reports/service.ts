import { prisma } from '@/lib/prisma.js'

export async function getEndOfDayReport(tenantId: string, storeId: string, dateStr: string) {
  // dateStr in YYYY-MM-DD
  const startOfDay = new Date(`${dateStr}T00:00:00.000Z`)
  const endOfDay = new Date(`${dateStr}T23:59:59.999Z`)

  const sales = await prisma.sale.findMany({
    where: {
      tenantId,
      storeId,
      createdAt: { gte: startOfDay, lte: endOfDay },
      status: 'COMPLETED'
    },
    include: { payments: true, items: { include: { variant: { include: { product: true } } } } }
  })

  let totalSales = 0
  const paymentMethods: Record<string, number> = {}
  const topProducts: Record<string, { name: string, quantity: number, revenue: number }> = {}

  for (const sale of sales) {
    totalSales += Number(sale.grandTotal)
    for (const p of sale.payments) {
      paymentMethods[p.method] = (paymentMethods[p.method] || 0) + Number(p.amount)
    }
    for (const item of sale.items) {
      const pId = item.variant.productId
      if (!topProducts[pId]) {
        topProducts[pId] = { name: item.variant.product.name, quantity: 0, revenue: 0 }
      }
      topProducts[pId].quantity += item.quantity
      topProducts[pId].revenue += Number(item.total)
    }
  }

  return {
    totalSales,
    totalTransactions: sales.length,
    paymentMethods,
    topProducts: Object.values(topProducts).sort((a, b) => b.quantity - a.quantity).slice(0, 10)
  }
}

export async function getInventoryReport(tenantId: string, storeId: string) {
  const levels = await prisma.inventoryLevel.findMany({
    where: { storeId, variant: { product: { tenantId } } },
    include: { variant: { include: { product: true } } }
  })

  const currentStock = levels.map(l => ({
    productName: l.variant.product.name,
    sku: l.variant.sku,
    quantity: l.quantity,
    lowStockAlert: l.variant.product.lowStockAlert
  }))

  const lowStockItems = currentStock.filter(s => s.quantity <= s.lowStockAlert)

  return {
    currentStock,
    lowStockItems
  }
}

import { stringify } from 'csv-stringify/sync'

export async function getGstr1Report(tenantId: string, startDateStr: string, endDateStr: string) {
  const start = new Date(`${startDateStr}T00:00:00.000Z`)
  const end = new Date(`${endDateStr}T23:59:59.999Z`)

  const sales = await prisma.sale.findMany({
    where: {
      tenantId,
      createdAt: { gte: start, lte: end },
      status: 'COMPLETED'
    },
    include: { items: { include: { variant: { include: { product: { include: { hsnCode: true } } } } } } }
  })

  // Aggregate by Tax Rate and HSN Code
  const taxBuckets: Record<string, { taxableValue: number, taxAmount: number }> = {}

  for (const sale of sales) {
    for (const item of sale.items) {
      const hsn = item.variant.product.hsnCode?.code || 'NO-HSN'
      const rate = Number(item.taxRate).toFixed(2)
      const key = `${hsn}-${rate}`

      if (!taxBuckets[key]) {
        taxBuckets[key] = { taxableValue: 0, taxAmount: 0 }
      }

      const taxableVal = Number(item.total) - Number(item.taxAmount)
      taxBuckets[key].taxableValue += taxableVal
      taxBuckets[key].taxAmount += Number(item.taxAmount)
    }
  }

  return {
    totalB2CSales: taxBuckets
  }
}

export async function exportGstr1ToCSV(tenantId: string, startDateStr: string, endDateStr: string) {
  const report = await getGstr1Report(tenantId, startDateStr, endDateStr)
  
  const records = Object.entries(report.totalB2CSales).map(([key, val]) => {
    const [hsn, rate] = key.split('-')
    return {
      'HSN Code': hsn,
      'Tax Rate (%)': rate,
      'Taxable Value': val.taxableValue.toFixed(2),
      'IGST Amount': val.taxAmount.toFixed(2),
      'CGST Amount': '0.00',
      'SGST Amount': '0.00',
      'Total Value': (val.taxableValue + val.taxAmount).toFixed(2)
    }
  })

  return stringify(records, { header: true })
}

export async function getStaffPerformanceReport(tenantId: string) {
  const staffPerformance = await prisma.staff.findMany({
    where: { isActive: true, user: { tenantId } },
    include: {
      user: { select: { name: true } },
      sales: {
        where: { status: 'COMPLETED' },
        select: { grandTotal: true }
      },
      commissions: {
        select: { commissionAmount: true }
      }
    }
  })

  return staffPerformance.map(s => ({
    staffId: s.id,
    name: s.user.name,
    totalSales: s.sales.reduce((acc, sale) => acc + Number(sale.grandTotal), 0),
    orderCount: s.sales.length,
    totalCommission: s.commissions.reduce((acc, comm) => acc + Number(comm.commissionAmount), 0)
  }))
}
