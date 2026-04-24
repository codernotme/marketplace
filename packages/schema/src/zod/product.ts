import { z } from 'zod'

// ─── Products ─────────────────────────────────────────────────────────────────

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  isActive: z.boolean().default(true),
})

export const UpdateProductSchema = CreateProductSchema.partial()

// ─── Variants ─────────────────────────────────────────────────────────────────

export const CreateVariantSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  sku: z.string().min(1, 'SKU is required'),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  costPrice: z.number().nonnegative().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
})

export const UpdateVariantSchema = CreateVariantSchema.partial().omit({ productId: true })

// ─── Inventory ────────────────────────────────────────────────────────────────

export const AdjustInventorySchema = z.object({
  variantId: z.string().min(1),
  storeId: z.string().min(1),
  quantity: z.number().int('Quantity must be an integer'),
  reason: z.string().optional(),
})

export type CreateProductInput = z.infer<typeof CreateProductSchema>
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>
export type CreateVariantInput = z.infer<typeof CreateVariantSchema>
export type UpdateVariantInput = z.infer<typeof UpdateVariantSchema>
export type AdjustInventoryInput = z.infer<typeof AdjustInventorySchema>
