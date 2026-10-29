import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import type { LoginInput, RegisterInput, ResetPasswordInput, PinLoginInput, MfaVerifyInput, VerifyEmailInput, VerifyPhoneInput, ForgotPasswordInput } from '@themrktplace/schema'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { createHash } from 'node:crypto'
import { encrypt, decrypt } from '@/utils/crypto.js'
import { prisma } from '@/lib/prisma.js'
import { redis } from '@/lib/redis.js'
import { UnauthorizedError, ConflictError, NotFoundError, AppError } from '@/utils/errors.js'

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function registerTenant(body: RegisterInput) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: body.businessEmail },
        { phone: body.phoneNumber }
      ]
    }
  })
  
  if (existingUser) throw new ConflictError('A user with this email or phone already exists')

  const passwordHash = await bcrypt.hash(body.password, 12)

  return await prisma.$transaction(async (tx) => {
    // 1. Create root admin user
    const user = await tx.user.create({
      data: {
        name: body.fullName,
        email: body.businessEmail,
        phone: body.phoneNumber,
        passwordHash,
        role: 'OWNER',
      }
    })

    // 2. Initialize business settings
    await tx.businessSettings.upsert({
      where: { id: 'default' },
      update: {
        businessName: body.businessName,
        businessEmail: body.businessEmail,
        businessPhone: body.phoneNumber,
      },
      create: {
        id: 'default',
        businessName: body.businessName,
        businessEmail: body.businessEmail,
        businessPhone: body.phoneNumber,
      }
    })

    // 3. Initialize default primary store
    await tx.store.create({
      data: {
        name: 'Default Store',
        phone: body.phoneNumber,
        storeType: 'Retail Store'
      }
    })

    // 4. Initialize default GST tax rate
    await tx.taxRate.create({
      data: {
        name: 'GST 18%',
        rate: 18,
        isDefault: true
      }
    })

    // Generate Verification Tokens
    const emailToken = randomUUID()
    const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString()

    await redis.setex(`email-verify:${emailToken}`, 86400, user.id) // 24 hours
    await redis.setex(`phone-otp:${user.id}`, 600, phoneOtp) // 10 mins

    // Mocked Email & SMS Sending
    console.log(`[Resend] Sent verification email to ${user.email} with token: ${emailToken}`)
    console.log(`[MSG91] Sent OTP to ${user.phone}: ${phoneOtp}`)

    return { userId: user.id, emailToken, message: 'Registration successful. Please verify email and phone.' }
  })
}

export async function verifyEmail(body: VerifyEmailInput) {
  const userId = await redis.get(`email-verify:${body.token}`)
  if (!userId) throw new UnauthorizedError('Invalid or expired verification token')

  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true }
  })
  
  await redis.del(`email-verify:${body.token}`)
  return { message: 'Email verified successfully' }
}

export async function verifyPhone(userId: string, body: VerifyPhoneInput) {
  const otp = await redis.get(`phone-otp:${userId}`)
  if (!otp || otp !== body.otp) throw new UnauthorizedError('Invalid or expired OTP')

  await prisma.user.update({
    where: { id: userId },
    data: { phoneVerified: true }
  })

  await redis.del(`phone-otp:${userId}`)
  return { message: 'Phone verified successfully' }
}

export async function loginUser(body: LoginInput, reqIp: string, reqAgent: string) {
  const rateLimitKey = `login-attempts:${body.email}`
  const attempts = await redis.incr(rateLimitKey)
  
  if (attempts === 1) {
    await redis.expire(rateLimitKey, 600) // 10 minutes window
  }
  
  if (attempts > 5) {
    await redis.expire(rateLimitKey, 900) // 15 minutes lockout
    throw new UnauthorizedError('Account temporarily locked due to too many failed attempts. Try again in 15 minutes.')
  }

  const user = await prisma.user.findFirst({
    where: { email: body.email },
  })

  if (!user || !user.isActive) throw new UnauthorizedError('Invalid email or password')

  const valid = await bcrypt.compare(body.password, user.passwordHash)
  if (!valid) throw new UnauthorizedError('Invalid email or password')

  await redis.del(rateLimitKey) // Reset attempts on success

  if (user.mfaEnabled) {
    const mfaSessionToken = randomUUID()
    await redis.setex(`mfa-session:${mfaSessionToken}`, 300, user.id) // 5 minutes
    return { mfaRequired: true, mfaSessionToken }
  }

  return await createSession(user.id, body.rememberMe ? 30 : 7, reqIp, reqAgent)
}

export async function setupMfa(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new NotFoundError('User')

  const secret = speakeasy.generateSecret({
    name: `themrktplace:${user.email}`,
    issuer: 'themrktplace'
  })

  const encryptedSecret = encrypt(secret.base32)
  
  const backupCodes = Array.from({ length: 8 }, () => randomUUID().replace(/-/g, '').slice(0, 16))
  const hashedBackupCodes = await Promise.all(
    backupCodes.map(code => bcrypt.hash(code, 10))
  )

  await prisma.$transaction(async (tx) => {
    // Delete existing backup codes if any
    await tx.userBackupCode.deleteMany({ where: { userId } })
    
    await tx.user.update({
      where: { id: userId },
      data: {
        mfaSecret: encryptedSecret,
        mfaEnabled: false // Stay disabled until first successful verification
      }
    })

    await tx.userBackupCode.createMany({
      data: hashedBackupCodes.map(hash => ({
        userId,
        codeHash: hash
      }))
    })
  })

  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url!)

  return {
    secret: secret.base32,
    qrCode: qrCodeDataUrl,
    backupCodes
  }
}

export async function verifyMfa(body: MfaVerifyInput, reqIp: string, reqAgent: string) {
  const userId = await redis.get(`mfa-session:${body.mfaSessionToken}`)
  if (!userId) throw new UnauthorizedError('MFA session expired')

  const user = await prisma.user.findUnique({ 
    where: { id: userId },
    include: { backupCodes: { where: { used: false } } }
  })
  if (!user) throw new NotFoundError('User')

  let isValid = false

  // 1. Try TOTP if code is 6 digits
  if (body.code.length === 6 && user.mfaSecret) {
    const decryptedSecret = decrypt(user.mfaSecret)
    isValid = speakeasy.totp.verify({
      secret: decryptedSecret,
      encoding: 'base32',
      token: body.code,
      window: 1 // 30s window
    })
  }

  // 2. Try Backup Codes
  if (!isValid) {
    for (const bc of user.backupCodes) {
      if (await bcrypt.compare(body.code, bc.codeHash)) {
        isValid = true
        await prisma.userBackupCode.update({
          where: { id: bc.id },
          data: { used: true }
        })
        break
      }
    }
  }

  if (!isValid) throw new UnauthorizedError('Invalid MFA code or backup code')

  // If this was the first verification, enable MFA
  if (!user.mfaEnabled) {
    await prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true }
    })
  }

  await redis.del(`mfa-session:${body.mfaSessionToken}`)
  
  return await createSession(user.id, 7, reqIp, reqAgent)
}

export async function forgotPassword(body: ForgotPasswordInput) {
  const user = await prisma.user.findFirst({ where: { email: body.email } })
  if (!user) return { message: 'If that email is in our system, we have sent a reset link.' }

  const token = randomUUID()
  const tokenHash = await bcrypt.hash(token, 10)
  
  await redis.setex(`reset-password:${user.id}`, 3600, tokenHash) // 1 hr
  await redis.setex(`reset-token-map:${token}`, 3600, user.id) // Map token to userId

  console.log(`[Resend] Sent password reset link to ${user.email} with token: ${token} & userId: ${user.id}`)
  return { message: 'If that email is in our system, we have sent a reset link.' }
}

export async function resetPassword(_: string, body: ResetPasswordInput) {
  const userId = await redis.get(`reset-token-map:${body.token}`)
  if (!userId) throw new UnauthorizedError('Invalid or expired reset token')

  const tokenHash = await redis.get(`reset-password:${userId}`)
  if (!tokenHash) throw new UnauthorizedError('Invalid or expired reset token')

  const valid = await bcrypt.compare(body.token, tokenHash)
  if (!valid) throw new UnauthorizedError('Invalid or expired reset token')

  const newHash = await bcrypt.hash(body.newPassword, 12)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash }
    }),
    prisma.activeSession.deleteMany({
      where: { userId }
    })
  ])

  await redis.del(`reset-password:${userId}`)
  await redis.del(`reset-token-map:${body.token}`)
  return { message: 'Password reset successfully' }
}

export async function pinLogin(body: PinLoginInput) {
  const staff = await prisma.staff.findUnique({
    where: { id: body.staffId },
    include: { user: true }
  })

  if (!staff || !staff.isActive) throw new UnauthorizedError('Invalid staff PIN')
  if (!staff.pinHash) throw new UnauthorizedError('PIN not set up for this staff member')

  const valid = await bcrypt.compare(body.pin, staff.pinHash)
  if (!valid) throw new UnauthorizedError('Invalid staff PIN')

  return staff
}

export async function refreshAccessToken(token: string) {
  const tokenHash = hashToken(token)
  const session = await prisma.activeSession.findFirst({
    where: { refreshTokenHash: tokenHash, revokedAt: null },
    include: { user: true }
  })

  if (!session || session.expiresAt < new Date()) {
    throw new UnauthorizedError('Refresh token expired or invalid')
  }

  const user = session.user

  // Rotate refresh token
  const newRefreshToken = randomUUID()
  const newRefreshTokenHash = hashToken(newRefreshToken)

  await prisma.activeSession.update({
    where: { id: session.id },
    data: { 
      refreshTokenHash: newRefreshTokenHash,
      lastActiveAt: new Date()
    }
  })

  return { user, newRefreshToken }
}

export async function logoutUser(token: string) {
  const tokenHash = hashToken(token)
  await prisma.activeSession.deleteMany({
    where: { refreshTokenHash: tokenHash }
  })
}

async function createSession(userId: string, days: number, ip: string, userAgent: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new NotFoundError('User')

  const refreshToken = randomUUID()
  const refreshTokenHash = hashToken(refreshToken)

  const session = await prisma.activeSession.create({
    data: {
      userId,
      refreshTokenHash,
      expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      ipAddress: ip,
      userAgent: userAgent,
      deviceName: 'Web Browser'
    }
  })

  return { user, refreshToken, sessionId: session.id }
}
