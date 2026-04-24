import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { authorize } from '@/middleware/authorize.js'

export async function saleRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)

  app.get('/', async (request, reply) => {
    void reply.send({ success: true, data: [] }) // TODO: implement
  })

  app.post('/', async (request, reply) => {
    void reply.code(501).send({ success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Coming soon' } })
  })

  app.post('/:id/refund', { onRequest: [authorize('manager', 'owner')] }, async (request, reply) => {
    void reply.code(501).send({ success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Coming soon' } })
  })
}
