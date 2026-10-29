import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma.js'
import { redis } from '@/lib/redis.js'
import { MovementReason } from '@prisma/client'
import { NotFoundError, AppError } from '@/utils/errors.js'
import type { CreateSaleInput, ProcessReturnInput } from '@themrktplace/schema'

export async function createSale(storeId: string, staffId: string, body: CreateSaleInput) {
  // Validate Store
  const store = await prisma.store.findUnique({ where: { id: storeId } })
  if (!store) throw new NotFoundError('Store')

  return await prisma.$transaction(async (tx: any) => {
    // 1. Calculate subtotals and deduct inventory
    let subtotal = 0
    let totalTaxAmount = 0
    let totalDiscountAmount = 0

    const saleItemsData = []

    for (const item of body.items) {
      const variant = await tx.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: { include: { taxRate: true } } }
      })
      if (!variant) throw new NotFoundError(`Variant ${item.variantId}`)

      // Inventory deduction
      const level = await tx.inventoryLevel.findUnique({
        where: { variantId_storeId: { variantId: item.variantId, storeId } }
      })

      if (!level || level.quantity < item.quantity) {
        throw new AppError('INSUFFICIENT_STOCK', `Not enough stock for ${variant.sku}`)
      }

      await tx.inventoryLevel.update({
        where: { variantId_storeId: { variantId: item.variantId, storeId } },
        data: { quantity: { decrement: item.quantity } }
      })

      await tx.inventoryMovement.create({
        data: {
          variantId: item.variantId,
          storeId,
          staffId,
          quantity: -item.quantity,
          reason: MovementReason.SALE
        }
      })

      const itemSubtotal = Number(variant.price) * item.quantity
      const itemDiscount = item.discountAmount || 0
      const itemAfterDiscount = itemSubtotal - itemDiscount
      
      // Calculate Tax
      const taxRate = variant.product.taxRate ? Number(variant.product.taxRate.rate) : Number(store.defaultTaxRate)
      const taxAmount = (itemAfterDiscount * taxRate) / 100

      const itemTotal = itemAfterDiscount + taxAmount

      subtotal += itemSubtotal
      totalDiscountAmount += itemDiscount
      totalTaxAmount += taxAmount

      saleItemsData.push({
        variantId: variant.id,
        quantity: item.quantity,
        unitPrice: variant.price,
        discountAmount: itemDiscount,
        taxRate: taxRate,
        taxAmount: taxAmount,
        total: itemTotal
      })
    }

    // Additional global discount
    if (body.discountAmount) {
      totalDiscountAmount += body.discountAmount
    }

    if (body.couponCode) {
      const coupon = await tx.couponCode.findUnique({
        where: { code: body.couponCode },
        include: { promotion: { include: { rules: true } } }
      })

      if (coupon && coupon.promotion.isActive) {
        const promo = coupon.promotion
        const now = new Date()
        if (now >= promo.startsAt && (!promo.endsAt || now <= promo.endsAt)) {
          if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
            for (const rule of promo.rules) {
              if (!rule.minOrderValue || subtotal >= Number(rule.minOrderValue)) {
                let promoDiscount = 0
                if (rule.discountType === 'PERCENTAGE') {
                  promoDiscount = (subtotal * Number(rule.discountValue)) / 100
                } else {
                  promoDiscount = Number(rule.discountValue)
                }
                totalDiscountAmount += promoDiscount
                
                await tx.couponCode.update({
                  where: { id: coupon.id },
                  data: { usedCount: { increment: 1 } }
                })
                break
              }
            }
          }
        }
      }
    }

    const grandTotal = subtotal - totalDiscountAmount + totalTaxAmount

    // Check payments match grandTotal
    const paymentSum = body.payments.reduce((acc, p) => acc + p.amount, 0)
    if (Math.abs(paymentSum - grandTotal) > 0.01) {
      throw new AppError('PAYMENT_MISMATCH', 'Payment amounts do not equal the grand total')
    }

    // 2. Create the Sale
    const invoiceNumber = `INV-${Date.now()}`
    
    const sale = await tx.sale.create({
      data: {
        storeId,
        staffId,
        customerId: body.customerId,
        invoiceNumber,
        status: 'COMPLETED',
        subtotal,
        discountAmount: totalDiscountAmount,
        taxAmount: totalTaxAmount,
        grandTotal,
        items: {
          create: saleItemsData
        },
        payments: {
          create: body.payments.map(p => ({
            method: p.method,
            amount: p.amount,
            referenceId: p.referenceId
          }))
        }
      },
      include: {
        items: true,
        payments: true
      }
    })

    // 3. Staff Commission
    if (staffId) {
      const staff = await tx.staff.findUnique({ where: { id: staffId } })
      if (staff && Number(staff.commissionRate) > 0) {
        const commissionAmount = grandTotal * (Number(staff.commissionRate) / 100)
        await tx.staffCommission.create({
          data: {
            staffId,
            saleId: sale.id,
            commissionAmount
          }
        })
      }
    }

    // 4. Loyalty Points Logic
    if (body.customerId) {
      const earnRate = 0.1
      const earnedPoints = Math.floor(grandTotal * earnRate)

      await tx.customer.update({
        where: { id: body.customerId },
        data: {
          totalSpend: { increment: grandTotal },
          totalOrders: { increment: 1 },
          loyaltyPoints: { increment: earnedPoints }
        }
      })

      await tx.loyaltyPointLog.create({
        data: {
          customerId: body.customerId,
          points: earnedPoints,
          reason: 'EARNED_ON_SALE',
          referenceId: sale.id
        }
      })
    }

    // Delete held cart if exists
    if (body.heldCartId) {
      await redis.del(`cart:${body.heldCartId}`)
    }

    return sale
  })
}

export async function processReturn(saleId: string, staffId: string, body: ProcessReturnInput) {
  return await prisma.$transaction(async (tx: any) => {
    const sale = await tx.sale.findUnique({
      where: { id: saleId },
      include: { items: true }
    })
    
    if (!sale) throw new NotFoundError('Sale')

    let totalRefundAmount = 0
    const returnItemsData = []

    for (const retItem of body.items) {
      const saleItem = sale.items.find((i: { id: string }) => i.id === retItem.saleItemId)
      if (!saleItem) throw new AppError('INVALID_ITEM', 'Item not found in sale')

      const refundAmt = Number(saleItem.unitPrice) * retItem.quantity
      totalRefundAmount += refundAmt

      returnItemsData.push({
        variantId: saleItem.variantId,
        quantity: retItem.quantity,
        refundAmount: refundAmt
      })

      if (body.restock) {
        await tx.inventoryLevel.update({
          where: { variantId_storeId: { variantId: saleItem.variantId, storeId: sale.storeId } },
          data: { quantity: { increment: retItem.quantity } }
        })

        await tx.inventoryMovement.create({
          data: {
            variantId: saleItem.variantId,
            storeId: sale.storeId,
            staffId,
            quantity: retItem.quantity,
            reason: MovementReason.RETURN,
            referenceId: sale.id
          }
        })
      }
    }

    const returnRec = await tx.return.create({
      data: {
        saleId: sale.id,
        storeId: sale.storeId,
        staffId,
        refundAmount: totalRefundAmount,
        refundMethod: body.refundMethod,
        reason: body.reason,
        items: {
          create: returnItemsData
        }
      }
    })

    if (body.refundMethod === 'STORE_CREDIT' && sale.customerId) {
      await tx.customer.update({
        where: { id: sale.customerId },
        data: { storeCredit: { increment: totalRefundAmount } }
      })

      await tx.storeCreditLog.create({
        data: {
          customerId: sale.customerId,
          amount: totalRefundAmount,
          reason: 'REFUND_FOR_RETURN',
          referenceId: returnRec.id
        }
      })
    }

    await tx.sale.update({
      where: { id: sale.id },
      data: { status: 'REFUNDED' }
    })

    return returnRec
  })
}

export async function listSales(options: { page: number; pageSize: number; search?: string }) {
  const skip = (options.page - 1) * options.pageSize
  const where: any = {}

  if (options.search) {
    where.OR = [
      { invoiceNumber: { contains: options.search, mode: 'insensitive' } },
      { customer: { name: { contains: options.search, mode: 'insensitive' } } }
    ]
  }

  const [items, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      skip,
      take: options.pageSize,
      orderBy: { createdAt: 'desc' },
      include: { customer: true, staff: { include: { user: true } }, items: { include: { variant: { include: { product: true } } } } }
    }),
    prisma.sale.count({ where })
  ])

  return { items, total }
}

export async function getSale(id: string) {
  const sale = await prisma.sale.findFirst({
    where: { id },
    include: {
      customer: true,
      staff: { include: { user: true } },
      store: true,
      items: { include: { variant: { include: { product: true } } } },
      payments: true,
      returns: { include: { items: true } }
    }
  })
  if (!sale) throw new NotFoundError('Sale')
  return sale
}

// Held Carts
export async function holdCart(deviceId: string, cartState: any) {
  const cartId = randomUUID()
  const key = `cart:${deviceId}:${cartId}`
  await redis.setex(key, 86400, JSON.stringify(cartState)) // 24 hours
  return { cartId }
}

export async function getHeldCarts(deviceId: string) {
  const keys = await redis.keys(`cart:${deviceId}:*`)
  const carts = []
  for (const key of keys) {
    const data = await redis.get(key)
    if (data) {
      const cartId = key.split(':').pop()
      carts.push({ cartId, ...JSON.parse(data) })
    }
  }
  return carts
}
