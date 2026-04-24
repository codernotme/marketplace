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
  payments: z.array(z.object({
    method: z.enum(['CASH', 'CARD', 'UPI', 'STORE_CREDIT', 'LOYALTY_POINTS']),
    amount: z.number().positive(),
    referenceId: z.string().optional(),
  })).min(1, 'At least one payment method is required'),
  heldCartId: z.string().optional(),
})

export const RefundSaleSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
  itemIds: z.array(z.string()).optional(), // partial refund support
})

export const ProcessReturnSchema = z.object({
  items: z.array(z.object({
    saleItemId: z.string().min(1),
    quantity: z.number().int().positive(),
  })).min(1),
  refundMethod: z.enum(['CASH', 'CARD', 'UPI', 'STORE_CREDIT']),
  reason: z.string().optional(),
  restock: z.boolean().default(true),
})

export type SaleItemInput = z.infer<typeof SaleItemSchema>
export type CreateSaleInput = z.infer<typeof CreateSaleSchema>
export type RefundSaleInput = z.infer<typeof RefundSaleSchema>
export type ProcessReturnInput = z.infer<typeof ProcessReturnSchema>
