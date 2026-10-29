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
  const agent = (request.headers['user-agent'] as string) || 'Unknown'
  
  const result = await loginUser(body, ip, agent)
  
  if ('mfaRequired' in result) {
    sendSuccess(reply, result)
    return
  }

  const payload = {
    sub: result.user.id,
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
  const agent = (request.headers['user-agent'] as string) || 'Unknown'

  const result = await verifyMfa(body, ip, agent)

  const payload = {
    sub: result.user.id,
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
    },
  })
}

export async function forgotPasswordHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = ForgotPasswordSchema.parse(request.body)
  const result = await forgotPassword(body)
  sendSuccess(reply, result)
}

export async function resetPasswordHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = ResetPasswordSchema.parse(request.body)
  const result = await resetPassword('', body)
  sendSuccess(reply, result)
}

export async function pinLoginHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = PinLoginSchema.parse(request.body)
  const staff = await pinLogin(body)

  const payload = {
    sub: staff.userId,
    role: 'CASHIER',
    staffId: staff.id,
    storeId: staff.storeId
  }

  const accessToken = await reply.jwtSign(payload, { expiresIn: '8h' })
  sendSuccess(reply, { accessToken, staff: { id: staff.id, employeeCode: staff.employeeCode, storeId: staff.storeId } })
}

export async function refreshHandler(request: FastifyRequest, reply: FastifyReply) {
  const refreshToken = request.cookies.refreshToken
  if (!refreshToken) {
    reply.code(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'No refresh token provided' } })
    return
  }

  const result = await refreshAccessToken(refreshToken)
  
  const payload = {
    sub: result.user.id,
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
