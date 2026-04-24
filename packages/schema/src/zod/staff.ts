import { z } from 'zod'

// ─── Staff ────────────────────────────────────────────────────────────────────

export const CreateStaffSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  employeeCode: z.string().min(1, 'Employee code is required'),
  position: z.string().optional(),
  storeId: z.string().min(1, 'Store ID is required'),
  role: z.enum(['manager', 'cashier', 'staff']).default('cashier'),
})

export const UpdateStaffSchema = z.object({
  name: z.string().min(2).optional(),
  employeeCode: z.string().min(1).optional(),
  position: z.string().optional(),
  role: z.enum(['manager', 'cashier', 'staff']).optional(),
  isActive: z.boolean().optional(),
})

// ─── Shifts ───────────────────────────────────────────────────────────────────

export const OpenShiftSchema = z.object({
  openingCash: z.number().nonnegative('Opening cash cannot be negative'),
})

export const CloseShiftSchema = z.object({
  closingCash: z.number().nonnegative('Closing cash cannot be negative'),
})

export type CreateStaffInput = z.infer<typeof CreateStaffSchema>
export type UpdateStaffInput = z.infer<typeof UpdateStaffSchema>
export type OpenShiftInput = z.infer<typeof OpenShiftSchema>
export type CloseShiftInput = z.infer<typeof CloseShiftSchema>
