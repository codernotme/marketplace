import type { AdjustInventoryInput, CreatePurchaseOrderInput, ReceivePurchaseOrderInput } from '@themrktplace/schema'
import { prisma } from '@/lib/prisma.js'
import { MovementReason } from '@prisma/client'
import { addNotificationJob } from '@/lib/queue.js'
import { NotFoundError, AppError } from '@/utils/errors.js'

export async function adjustInventory(tenantId: string, staffId: string, body: AdjustInventoryInput) {
  // Verify store belongs to tenant
  const store = await prisma.store.findFirst({ where: { id: body.storeId, tenantId } })
  if (!store) throw new NotFoundError('Store')

  return await prisma.$transaction(async (tx) => {
    const level = await tx.inventoryLevel.findUnique({
      where: { variantId_storeId: { variantId: body.variantId, storeId: body.storeId } }
    })

    if (!level && body.quantity < 0) {
      throw new AppError('INSUFFICIENT_STOCK', 'Not enough stock to deduct')
    }

    if (level && level.quantity + body.quantity < 0) {
      throw new AppError('INSUFFICIENT_STOCK', 'Not enough stock to deduct')
    }

    const updatedLevel = await tx.inventoryLevel.upsert({
      where: { variantId_storeId: { variantId: body.variantId, storeId: body.storeId } },
      create: {
        variantId: body.variantId,
        storeId: body.storeId,
        quantity: body.quantity
      },
      update: {
        quantity: { increment: body.quantity }
      }
    })

    const move = await tx.inventoryMovement.create({
      data: {
        variantId: body.variantId,
        storeId: body.storeId,
        staffId,
        quantity: body.quantity,
        reason: body.reason,
        notes: body.notes
      }
    })

    // BullMQ Job simulation for low stock
    const variant = await tx.productVariant.findUnique({ 
      where: { id: body.variantId },
      include: { product: true }
    })
    
    if (variant && updatedLevel.quantity <= variant.product.lowStockAlert) {
      await addNotificationJob('LOW_STOCK', {
        variantId: variant.id,
        storeId: body.storeId,
        quantity: updatedLevel.quantity
      })
    }

    return updatedLevel
  })
}

export async function createPurchaseOrder(tenantId: string, body: CreatePurchaseOrderInput) {
  const store = await prisma.store.findFirst({ where: { id: body.storeId, tenantId } })
  if (!store) throw new NotFoundError('Store')

  let totalAmount = 0
  for (const item of body.items) {
    totalAmount += item.quantityOrdered * item.costPrice
  }

  return await prisma.purchaseOrder.create({
    data: {
      storeId: body.storeId,
      supplierName: body.supplierName,
      expectedDeliveryAt: body.expectedDeliveryAt ? new Date(body.expectedDeliveryAt) : null,
      notes: body.notes,
      totalAmount,
      items: {
        create: body.items.map(i => ({
          variantId: i.variantId,
          quantityOrdered: i.quantityOrdered,
          costPrice: i.costPrice
        }))
      }
    },
    include: { items: true }
  })
}

export async function receivePurchaseOrder(tenantId: string, poId: string, staffId: string, body: ReceivePurchaseOrderInput) {
  return await prisma.$transaction(async (tx) => {
    const po = await tx.purchaseOrder.findUnique({ 
      where: { id: poId }, 
      include: { items: true, store: true } 
    })
    
    if (!po) throw new NotFoundError('Purchase Order')
    if (po.store.tenantId !== tenantId) throw new NotFoundError('Purchase Order')

    let isFullyReceived = true

    for (const receivedItem of body.items) {
      const poItem = po.items.find(i => i.id === receivedItem.itemId)
      if (!poItem) continue

      const newReceivedQty = poItem.quantityReceived + receivedItem.quantityReceived

      await tx.purchaseOrderItem.update({
        where: { id: poItem.id },
        data: { quantityReceived: newReceivedQty }
      })

      if (receivedItem.quantityReceived > 0) {
        await tx.inventoryLevel.upsert({
          where: { variantId_storeId: { variantId: poItem.variantId, storeId: po.storeId } },
          create: {
            variantId: poItem.variantId,
            storeId: po.storeId,
            quantity: receivedItem.quantityReceived
          },
          update: {
            quantity: { increment: receivedItem.quantityReceived }
          }
        })

        await tx.inventoryMovement.create({
          data: {
            variantId: poItem.variantId,
            storeId: po.storeId,
            staffId,
            quantity: receivedItem.quantityReceived,
            reason: MovementReason.PURCHASE_RECEIPT,
            referenceId: po.id
          }
        })
      }

      if (newReceivedQty < poItem.quantityOrdered) {
        isFullyReceived = false
      }
    }

    const updatedPo = await tx.purchaseOrder.update({
      where: { id: poId },
      data: { status: isFullyReceived ? 'COMPLETED' : 'PARTIAL' },
      include: { items: true }
    })

    return updatedPo
  })
}
