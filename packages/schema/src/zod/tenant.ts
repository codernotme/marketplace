import { z } from 'zod'

export const UpdateOnboardingSchema = z.object({
  step: z.number().min(0).max(6),
  completed: z.boolean().optional()
})

export const UpdateTenantProfileSchema = z.object({
  businessName: z.string().min(2).optional(),
  businessEmail: z.string().email().optional(),
  businessPhone: z.string().optional(),
  gstin: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  financialYearStart: z.string().optional(),
  logoUrl: z.string().url().optional().nullable()
})

export const UpdateStoreSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean().optional(),
  storeType: z.string().optional()
})

export type UpdateOnboardingInput = z.infer<typeof UpdateOnboardingSchema>
export type UpdateTenantProfileInput = z.infer<typeof UpdateTenantProfileSchema>
export type UpdateStoreInput = z.infer<typeof UpdateStoreSchema>
