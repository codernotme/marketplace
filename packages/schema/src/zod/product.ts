import { z } from 'zod'

// ─── Products ─────────────────────────────────────────────────────────────────

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  parentId: z.string().cuid().optional(),
})

export const CreateProductSchema = z.object({
  categoryId: z.string().cuid().optional(),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  basePrice: z.number().positive('Price must be greater than 0'),
  costPrice: z.number().nonnegative().optional(),
  taxRateId: z.string().cuid().optional(),
  hsnCodeId: z.string().cuid().optional(),
  lowStockAlert: z.number().int().nonnegative().default(5),
  isActive: z.boolean().default(true),
  hasVariants: z.boolean().default(false),
  // If hasVariants is false, the frontend can just send a default variant info
  attributes: z.array(z.object({
    name: z.string(),
    values: z.array(z.string())
  })).optional(),
  variants: z.array(z.object({
    sku: z.string().min(1, 'SKU is required'),
    barcode: z.string().optional(),
    attributeValues: z.record(z.string(), z.string()).optional(),
    price: z.number().positive(),
    costPrice: z.number().nonnegative().optional(),
    imageUrl: z.string().url().optional(),
    openingStock: z.array(z.object({
      storeId: z.string().cuid(),
      quantity: z.number().int().nonnegative()
    })).optional()
  })).optional()
})

export const UpdateProductSchema = CreateProductSchema.partial()

// ─── Variants ─────────────────────────────────────────────────────────────────

export const UpdateVariantSchema = z.object({
  sku: z.string().min(1).optional(),
  barcode: z.string().optional(),
  price: z.number().positive().optional(),
  costPrice: z.number().nonnegative().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
})

// ─── Inventory ────────────────────────────────────────────────────────────────

export const AdjustInventorySchema = z.object({
  variantId: z.string().cuid(),
  storeId: z.string().cuid(),
  quantity: z.number().int(), // positive for IN, negative for OUT
  reason: z.enum(['SALE', 'RETURN', 'PURCHASE_RECEIPT', 'MANUAL_ADJUSTMENT', 'TRANSFER', 'DAMAGE']),
  notes: z.string().optional(),
})

export const CreatePurchaseOrderSchema = z.object({
  storeId: z.string().cuid(),
  supplierName: z.string().min(1),
  expectedDeliveryAt: z.string().datetime().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    variantId: z.string().cuid(),
    quantityOrdered: z.number().int().positive(),
    costPrice: z.number().positive()
  }))
})

export const ReceivePurchaseOrderSchema = z.object({
  items: z.array(z.object({
    itemId: z.string().cuid(), // the ID of the PurchaseOrderItem
    quantityReceived: z.number().int().nonnegative()
  }))
})

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>
export type CreateProductInput = z.infer<typeof CreateProductSchema>
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>
export type UpdateVariantInput = z.infer<typeof UpdateVariantSchema>
export type AdjustInventoryInput = z.infer<typeof AdjustInventorySchema>
export type CreatePurchaseOrderInput = z.infer<typeof CreatePurchaseOrderSchema>
export type ReceivePurchaseOrderInput = z.infer<typeof ReceivePurchaseOrderSchema>
