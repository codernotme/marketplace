import { z } from 'zod'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional().default(false),
})

export const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  businessEmail: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Invalid Indian phone number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and privacy policy',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const VerifyEmailSchema = z.object({
  token: z.string().uuid('Invalid token format'),
})

export const VerifyPhoneSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const ResetPasswordSchema = z.object({
  token: z.string().uuid('Invalid token format'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ['confirmNewPassword'],
})

export const MfaVerifySchema = z.object({
  mfaSessionToken: z.string(),
  code: z.string().length(6, 'Code must be 6 digits').or(z.string().length(8, 'Backup code must be 8 characters')),
})

export const PinLoginSchema = z.object({
  staffId: z.string().cuid('Invalid staff ID'),
  pin: z.string().regex(/^[0-9]{4,6}$/, 'PIN must be 4 to 6 digits'),
})

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>
export type VerifyPhoneInput = z.infer<typeof VerifyPhoneSchema>
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>
export type MfaVerifyInput = z.infer<typeof MfaVerifySchema>
export type PinLoginInput = z.infer<typeof PinLoginSchema>
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>
