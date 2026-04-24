import type { CreateCustomerInput } from '@themrktplace/schema'
import { prisma } from '@/lib/prisma.js'
import { NotFoundError, ConflictError } from '@/utils/errors.js'

export async function createCustomer(tenantId: string, body: CreateCustomerInput) {
  const existing = await prisma.customer.findFirst({
    where: {
      tenantId,
      OR: [
        { phone: body.phone },
        { email: body.email }
      ]
    }
  })

  if (existing) {
    throw new ConflictError('A customer with this phone or email already exists')
  }

  return await prisma.customer.create({
    data: {
      tenantId,
      name: body.name,
      phone: body.phone,
      email: body.email,
      address: body.address
    }
  })
}

export async function getCustomers(tenantId: string) {
  return await prisma.customer.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getCustomer(tenantId: string, customerId: string) {
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, tenantId },
    include: {
      loyaltyLogs: { orderBy: { createdAt: 'desc' }, take: 10 },
      storeCreditLogs: { orderBy: { createdAt: 'desc' }, take: 10 }
    }
  })
  
  if (!customer) throw new NotFoundError('Customer')
  return customer
}

export async function getCustomerPurchaseHistory(tenantId: string, customerId: string) {
  return await prisma.sale.findMany({
    where: { tenantId, customerId },
    include: { items: { include: { variant: true } } },
    orderBy: { createdAt: 'desc' }
  })
}
