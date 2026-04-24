import bcrypt from 'bcryptjs'
import type { CreateStaffInput, OpenShiftInput, CloseShiftInput } from '@themrktplace/schema'
import { prisma } from '@/lib/prisma.js'
import { NotFoundError, ConflictError, AppError } from '@/utils/errors.js'

export async function createStaff(tenantId: string, storeId: string, body: CreateStaffInput) {
  // Staff are just users tied to a specific store
  const existingUser = await prisma.user.findFirst({
    where: {
      tenantId,
      OR: [
        { email: body.email },
        { phone: body.phone }
      ]
    }
  })

  if (existingUser) throw new ConflictError('A user with this email or phone already exists')

  const passwordHash = await bcrypt.hash(body.password, 12)
  const pinHash = body.pin ? await bcrypt.hash(body.pin, 12) : null

  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        tenantId,
        name: body.name,
        email: body.email,
        phone: body.phone,
        passwordHash,
        role: body.role // 'MANAGER' | 'CASHIER'
      }
    })

    const staff = await tx.staff.create({
      data: {
        userId: user.id,
        storeId,
        employeeCode: body.employeeCode,
        position: body.position,
        pinHash,
        commissionRate: body.commissionRate || 0
      }
    })

    return staff
  })
}

export async function openShift(staffId: string, storeId: string, body: OpenShiftInput) {
  const activeShift = await prisma.staffShift.findFirst({
    where: { staffId, closedAt: null }
  })

  if (activeShift) throw new AppError('SHIFT_ACTIVE', 'You already have an active shift')

  return await prisma.staffShift.create({
    data: {
      staffId,
      storeId,
      openingCash: body.openingCash
    }
  })
}

export async function closeShift(shiftId: string, body: CloseShiftInput) {
  const shift = await prisma.staffShift.findUnique({ where: { id: shiftId } })
  if (!shift) throw new NotFoundError('Shift')
  if (shift.closedAt) throw new AppError('SHIFT_CLOSED', 'This shift is already closed')

  // Calculate expected cash based on cash sales during this shift time
  const cashSales = await prisma.salePayment.aggregate({
    _sum: { amount: true },
    where: {
      method: 'CASH',
      createdAt: { gte: shift.openedAt },
      sale: { staffId: shift.staffId, storeId: shift.storeId, status: 'COMPLETED' }
    }
  })

  const expectedCash = Number(shift.openingCash) + Number(cashSales._sum.amount || 0)
  const discrepancy = body.closingCash - expectedCash

  return await prisma.staffShift.update({
    where: { id: shiftId },
    data: {
      closedAt: new Date(),
      closingCash: body.closingCash,
      expectedCash,
      discrepancy,
      notes: body.notes
    }
  })
}

export async function getStaffList(tenantId: string, storeId: string) {
  return await prisma.staff.findMany({
    where: { storeId, user: { tenantId } },
    include: { user: true }
  })
}
