import type { FastifyRequest, FastifyReply } from 'fastify'
import type { ModuleKey } from '@themrktplace/types'
import { prisma } from '@/lib/prisma.js'
import { LicenseError } from '@/utils/errors.js'

export function licenseGuard(module: ModuleKey) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user as { tenantId: string }
    const license = await prisma.license.findUnique({
      where: { tenantId_module: { tenantId: user.tenantId, module } },
    })

    if (!license?.isActive) {
      const err = new LicenseError(module)
      void reply.code(err.statusCode).send({
        success: false,
        error: { code: err.code, message: err.message },
      })
    }
  }
}
