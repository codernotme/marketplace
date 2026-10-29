import { prisma } from '@/lib/prisma.js'
import { AppError } from '@/utils/errors.js'
import type { OpenShiftInput, CloseShiftInput } from '@themrktplace/schema'

export async function openShift(storeId: string, staffId: string, body: OpenShiftInput) {
  // Check for existing open shift
  const existing = await prisma.staffShift.findFirst({
    where: { staffId, storeId, closedAt: null }
  })
  
  if (existing) {
    throw new AppError('CONFLICT', 'Staff already has an open shift in this store')
  }

  return await prisma.staffShift.create({
    data: {
      staffId,
      storeId,
      openingCash: body.openingCash,
      notes: body.notes
    }
  })
}

export async function closeShift(storeId: string, staffId: string, body: CloseShiftInput) {
  const shift = await prisma.staffShift.findFirst({
    where: { staffId, storeId, closedAt: null }
  })

  if (!shift) {
    throw new AppError('NOT_FOUND', 'No active shift found to close')
  }

  // Calculate expected cash
  const cashPayments = await prisma.salePayment.aggregate({
    where: {
      sale: {
        staffId,
        storeId,
        createdAt: { gte: shift.openedAt }
      },
      method: 'CASH'
    },
    _sum: { amount: true }
  })

  const totalCashSales = Number(cashPayments._sum.amount || 0)
  const expectedCash = Number(shift.openingCash) + totalCashSales
  const discrepancy = Number(body.closingCash) - expectedCash

  return await prisma.staffShift.update({
    where: { id: shift.id },
    data: {
      closedAt: new Date(),
      closingCash: body.closingCash,
      expectedCash,
      discrepancy,
      notes: body.notes
    }
  })
}

export async function getCurrentShift(staffId: string, storeId: string) {
  return await prisma.staffShift.findFirst({
    where: { staffId, storeId, closedAt: null }
  })
}
