import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { authorize } from '@/middleware/authorize.js'
import { prisma } from '@/lib/prisma.js'

export async function licenseRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)

  // Get all licenses for the current tenant
  app.get('/', async (request, reply) => {
    const user = request.user as { tenantId: string }
    const licenses = await prisma.license.findMany({ where: { tenantId: user.tenantId } })
    void reply.send({ success: true, data: licenses })
  })

  // Admin: toggle a module license
  app.patch('/:module', { onRequest: [authorize('owner')] }, async (request, reply) => {
    const user = request.user as { tenantId: string }
    const { module } = request.params as { module: string }
    const { isActive } = request.body as { isActive: boolean }
    const license = await prisma.license.update({
      where: { tenantId_module: { tenantId: user.tenantId, module: module as any } },
      data: { isActive },
    })
    void reply.send({ success: true, data: license })
  })
}
