import type { FastifyRequest, FastifyReply } from 'fastify'
import { UnauthorizedError } from '@/utils/errors.js'

export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify()
  } catch {
    const err = new UnauthorizedError('Invalid or expired token')
    void reply.code(err.statusCode).send({
      success: false,
      error: { code: err.code, message: err.message },
    })
  }
}
