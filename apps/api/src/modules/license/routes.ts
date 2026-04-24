import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { authorize } from '@/middleware/authorize.js'
import { getTenantLicenses, updateLicense } from './service.js'

export async function licenseRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)

  app.get('/', async (request, reply) => {
    const user = request.user as { tenantId: string }
    const licenses = await getTenantLicenses(user.tenantId)
    void reply.send({ success: true, data: licenses })
  })

  app.patch('/:id', { onRequest: [authorize('OWNER')] }, async (request, reply) => {
    const user = request.user as { tenantId: string }
    const { id } = request.params as { id: string }
    const { status } = request.body as { status: string }
    const license = await updateLicense(user.tenantId, id, { status: status as any })
    void reply.send({ success: true, data: license })
  })
}
