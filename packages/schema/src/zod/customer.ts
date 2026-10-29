import { z } from 'zod'

// ─── Customers ────────────────────────────────────────────────────────────────

export const CreateCustomerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number')
    .optional(),
  address: z.string().optional(),
})

export const UpdateCustomerSchema = CreateCustomerSchema.partial()

export const CustomerRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const CustomerLoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
})

export const CreateWebOrderSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'At least one item is required'),
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
  deliveryType: z.enum(['HOME_DELIVERY', 'BOPIS_STORE_PICKUP']).default('HOME_DELIVERY'),
  paymentMethod: z.enum(['ONLINE_RAZORPAY', 'COD', 'STORE_CREDIT']).default('ONLINE_RAZORPAY'),
  storeId: z.string().optional(),
})

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>
export type CustomerRegisterInput = z.infer<typeof CustomerRegisterSchema>
export type CustomerLoginInput = z.infer<typeof CustomerLoginSchema>
export type CreateWebOrderInput = z.infer<typeof CreateWebOrderSchema>
