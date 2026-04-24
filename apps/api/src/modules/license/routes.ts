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

  // Admin: update license status
  app.patch('/:id', { onRequest: [authorize('OWNER')] }, async (request, reply) => {
    const user = request.user as { tenantId: string }
    const { id } = request.params as { id: string }
    const { status } = request.body as { status: string }
    const license = await prisma.license.update({
      where: { id, tenantId: user.tenantId },
      data: { status: status as any },
    })
    void reply.send({ success: true, data: license })
  })
}
