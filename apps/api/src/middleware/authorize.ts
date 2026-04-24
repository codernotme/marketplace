import type { FastifyRequest, FastifyReply } from 'fastify'
import type { UserRole } from '@themrktplace/types'
import { ForbiddenError } from '@/utils/errors.js'

const ROLE_HIERARCHY: Record<UserRole, number> = {
  OWNER: 3,
  MANAGER: 2,
  CASHIER: 1,
}

export function authorize(...allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user as { role: UserRole }
    const userLevel = ROLE_HIERARCHY[user.role] ?? 0
    const hasAccess = allowedRoles.some((role) => userLevel >= (ROLE_HIERARCHY[role] ?? 0))

    if (!hasAccess) {
      const err = new ForbiddenError('You do not have permission to perform this action')
      void reply.code(err.statusCode).send({
        success: false,
        error: { code: err.code, message: err.message },
      })
    }
  }
}
