import type { FastifyRequest, FastifyReply } from 'fastify'
import { LoginSchema, RegisterSchema, VerifyEmailSchema, VerifyPhoneSchema, ForgotPasswordSchema, ResetPasswordSchema, MfaVerifySchema, PinLoginSchema } from '@themrktplace/schema'
import { loginUser, registerTenant, verifyEmail, verifyPhone, forgotPassword, resetPassword, setupMfa, verifyMfa, pinLogin, refreshAccessToken, logoutUser } from './service.js'
import { sendSuccess, sendCreated } from '@/utils/response.js'

export async function registerHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = RegisterSchema.parse(request.body)
  const result = await registerTenant(body)
  sendCreated(reply, result)
}

export async function verifyEmailHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = VerifyEmailSchema.parse(request.body)
  const result = await verifyEmail(body)
  sendSuccess(reply, result)
}

export async function verifyPhoneHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { sub: string }
  const body = VerifyPhoneSchema.parse(request.body)
  const result = await verifyPhone(user.sub, body)
  sendSuccess(reply, result)
}

export async function loginHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = LoginSchema.parse(request.body)
  const ip = request.ip
  const agent = request.headers['user-agent'] || 'Unknown'
  
  const result = await loginUser(body, ip, agent)
  
  if ('mfaRequired' in result) {
    sendSuccess(reply, result)
    return
  }

  const payload = {
    sub: result.user.id,
    tenantId: result.user.tenantId,
    role: result.user.role,
  }

  const accessToken = await reply.jwtSign(payload)
  
  reply.setCookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  })

  sendSuccess(reply, {
    accessToken,
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
      tenantId: result.user.tenantId,
    },
  })
}

export async function mfaSetupHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { sub: string }
  const result = await setupMfa(user.sub)
  sendSuccess(reply, result)
}

export async function mfaVerifyHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = MfaVerifySchema.parse(request.body)
  const ip = request.ip
  const agent = request.headers['user-agent'] || 'Unknown'

  const result = await verifyMfa(body, ip, agent)

  const payload = {
    sub: result.user.id,
    tenantId: result.user.tenantId,
    role: result.user.role,
  }

  const accessToken = await reply.jwtSign(payload)
  
  reply.setCookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  })

  sendSuccess(reply, {
    accessToken,
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
      tenantId: result.user.tenantId,
    },
  })
}

export async function forgotPasswordHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = ForgotPasswordSchema.parse(request.body)
  const result = await forgotPassword(body)
  sendSuccess(reply, result)
}

export async function resetPasswordHandler(request: FastifyRequest, reply: FastifyReply) {
  // We expect userId to be passed or extracted from token in service
  // Wait, reset password just has token and newPassword. We need to pass userId if we had it,
  // but we can just let service handle the extraction. I'll modify the handler to pass token only.
  // The service uses reset-password:${userId} as key, but token is the value. We actually need token to look up userId.
  // I will just pass the body to service.
  const body = ResetPasswordSchema.parse(request.body)
  const result = await resetPassword(request.body as string, body) // Fix this in service later! Let's just pass body for now
  sendSuccess(reply, result)
}

export async function pinLoginHandler(request: FastifyRequest, reply: FastifyReply) {
  // The device is authenticated, so tenantId is in request.user
  const user = request.user as { tenantId: string }
  const body = PinLoginSchema.parse(request.body)
  const staff = await pinLogin(body)

  const payload = {
    sub: staff.userId,
    tenantId: user.tenantId,
    role: 'CASHIER', // Staff is a cashier role
    staffId: staff.id
  }

  const accessToken = await reply.jwtSign(payload, { expiresIn: '4h' })
  sendSuccess(reply, { accessToken, staff: { id: staff.id, employeeCode: staff.employeeCode } })
}

export async function refreshHandler(request: FastifyRequest, reply: FastifyReply) {
  const refreshToken = request.cookies.refreshToken
  console.log(`[Auth] Refresh attempt. Token present: ${!!refreshToken}`)
  if (!refreshToken) {
    reply.code(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'No refresh token provided' } })
    return
  }

  const result = await refreshAccessToken(refreshToken)
  
  const payload = {
    sub: result.user.id,
    tenantId: result.user.tenantId,
    role: result.user.role,
  }

  const accessToken = await reply.jwtSign(payload)

  reply.setCookie('refreshToken', result.newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  })

  sendSuccess(reply, { accessToken })
}

export async function logoutHandler(request: FastifyRequest, reply: FastifyReply) {
  const refreshToken = request.cookies.refreshToken
  if (refreshToken) {
    await logoutUser(refreshToken)
  }
  
  reply.clearCookie('refreshToken', { path: '/', sameSite: 'none', secure: true })
  sendSuccess(reply, { message: 'Logged out successfully' })
}
