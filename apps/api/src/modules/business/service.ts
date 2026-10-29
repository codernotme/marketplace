import { prisma } from '@/lib/prisma.js'
import type { UpdateBusinessSettingsInput, UpdateStoreInput } from '@themrktplace/schema'
import { NotFoundError } from '@/utils/errors.js'

export async function updateOnboarding(data: { step: number; completed?: boolean }) {
  return await prisma.businessSettings.upsert({
    where: { id: 'default' },
    update: {
      onboardingStep: data.step,
      onboardingCompleted: data.completed ?? false
    },
    create: {
      id: 'default',
      businessName: 'My Retail Brand',
      businessEmail: 'owner@brand.com',
      onboardingStep: data.step,
      onboardingCompleted: data.completed ?? false
    }
  })
}

export async function updateBusinessProfile(data: UpdateBusinessSettingsInput) {
  return await prisma.businessSettings.upsert({
    where: { id: 'default' },
    update: data,
    create: {
      id: 'default',
      businessName: data.businessName || 'My Retail Brand',
      businessEmail: data.businessEmail || 'owner@brand.com',
      ...data
    }
  })
}

export async function updateStore(storeId: string, data: UpdateStoreInput) {
  const store = await prisma.store.findUnique({
    where: { id: storeId }
  })

  if (!store) throw new NotFoundError('Store')

  return await prisma.store.update({
    where: { id: storeId },
    data
  })
}

export async function getBusinessStatus() {
  const [settings, stores] = await Promise.all([
    prisma.businessSettings.findFirst(),
    prisma.store.findMany()
  ])

  return {
    ...(settings || {
      id: 'default',
      businessName: 'My Retail Brand',
      businessEmail: 'owner@brand.com',
      onboardingStep: 1,
      onboardingCompleted: false
    }),
    stores
  }
}

