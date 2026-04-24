import { z } from 'zod'

// ─── Sales ────────────────────────────────────────────────────────────────────

export const SaleItemSchema = z.object({
  variantId: z.string().min(1, 'Variant ID is required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  unitPrice: z.number().positive('Unit price must be greater than 0'),
  discountAmount: z.number().nonnegative().default(0),
})

export const CreateSaleSchema = z.object({
  customerId: z.string().optional(),
  staffId: z.string().optional(),
  items: z.array(SaleItemSchema).min(1, 'Sale must have at least one item'),
  discountAmount: z.number().nonnegative().default(0),
  paymentMethod: z.enum(['cash', 'card', 'upi', 'mixed']),
})

export const RefundSaleSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
  itemIds: z.array(z.string()).optional(), // partial refund support
})

export type SaleItemInput = z.infer<typeof SaleItemSchema>
export type CreateSaleInput = z.infer<typeof CreateSaleSchema>
export type RefundSaleInput = z.infer<typeof RefundSaleSchema>
