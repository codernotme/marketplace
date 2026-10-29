import { z } from 'zod'

export const UpdateBusinessSettingsSchema = z.object({
  businessName: z.string().min(2).optional(),
  legalName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  gstRegistered: z.boolean().optional(),
  gstin: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  financialYearStart: z.string().optional(),
  logoUrl: z.string().url().optional().nullable(),
  websiteEnabled: z.boolean().optional(),
  announcementBanner: z.string().optional().nullable(),
  featuredCollectionName: z.string().optional(),
})

export const CreateStoreSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).max(10),
  storeType: z.string().default('Retail Store'),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  phone: z.string(),
  email: z.string().email().optional(),
  receiptHeader: z.string().optional(),
  receiptFooter: z.string().optional(),
  defaultTaxRate: z.number().default(0),
  roundOffBills: z.boolean().default(true),
})

export const UpdateStoreSchema = CreateStoreSchema.partial()

export type UpdateBusinessSettingsInput = z.infer<typeof UpdateBusinessSettingsSchema>
export type CreateStoreInput = z.infer<typeof CreateStoreSchema>
export type UpdateStoreInput = z.infer<typeof UpdateStoreSchema>

// Backward compatibility alias for tenantProfile
export const UpdateTenantProfileSchema = UpdateBusinessSettingsSchema
export type UpdateTenantProfileInput = UpdateBusinessSettingsInput
export const UpdateOnboardingSchema = z.object({
  step: z.number().min(0).max(6),
  completed: z.boolean().optional(),
})
export type UpdateOnboardingInput = z.infer<typeof UpdateOnboardingSchema>

