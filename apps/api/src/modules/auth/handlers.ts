import type { FastifyRequest, FastifyReply } from 'fastify'
import { LoginSchema, RegisterSchema } from '@themrktplace/schema'
import { prisma } from '@/lib/prisma.js'
import { loginUser, registerTenant, refreshAccessToken, logoutUser } from './service.js'
import { sendSuccess, sendCreated } from '@/utils/response.js'

export async function loginHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = LoginSchema.parse(request.body)
  const user = await loginUser(body)
  
  const payload = {
    sub: user.id,
    tenantId: user.tenantId,
    role: user.role,
  }

  const accessToken = await reply.jwtSign(payload)
  const refreshToken = await reply.jwtSign(payload, {
    expiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d',
  })

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  sendSuccess(reply, {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    },
  })
}

export async function registerHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = RegisterSchema.parse(request.body)
  const result = await registerTenant(body)
  sendCreated(reply, result)
}

export async function refreshHandler(request: FastifyRequest, reply: FastifyReply) {
  const { refreshToken } = request.body as { refreshToken: string }
  const user = await refreshAccessToken(refreshToken)
  
  const payload = {
    sub: user.id,
    tenantId: user.tenantId,
    role: user.role,
  }

  const accessToken = await reply.jwtSign(payload)
  sendSuccess(reply, { accessToken })
}

export async function logoutHandler(request: FastifyRequest, reply: FastifyReply) {
  const { refreshToken } = request.body as { refreshToken: string }
  await logoutUser(refreshToken)
  sendSuccess(reply, { message: 'Logged out successfully' })
}
