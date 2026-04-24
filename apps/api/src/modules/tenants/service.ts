import { prisma } from '@/lib/prisma.js'
import { UpdateOnboardingInput, UpdateTenantProfileInput, UpdateStoreInput } from '@themrktplace/schema'
import { NotFoundError } from '@/utils/errors.js'

export async function updateOnboarding(tenantId: string, data: UpdateOnboardingInput) {
  return await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      onboardingStep: data.step,
      onboardingCompleted: data.completed ?? false
    }
  })
}

export async function updateTenantProfile(tenantId: string, data: UpdateTenantProfileInput) {
  return await prisma.tenant.update({
    where: { id: tenantId },
    data
  })
}

export async function updateStore(tenantId: string, storeId: string, data: UpdateStoreInput) {
  const store = await prisma.store.findFirst({
    where: { id: storeId, tenantId }
  })

  if (!store) throw new NotFoundError('Store')

  return await prisma.store.update({
    where: { id: storeId },
    data
  })
}

export async function getTenantStatus(tenantId: string) {
  return await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      id: true,
      onboardingStep: true,
      onboardingCompleted: true,
      businessName: true,
      businessEmail: true,
      businessPhone: true,
      addressLine1: true,
      addressLine2: true,
      city: true,
      state: true,
      pincode: true,
      country: true,
      gstin: true,
      currency: true,
      stores: true
    }
  })
}
