import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { authorize } from '@/middleware/authorize.js'

export async function staffRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)

  app.get('/', { onRequest: [authorize('MANAGER', 'OWNER')] }, async (request, reply) => {
    void reply.send({ success: true, data: [] }) // TODO: implement
  })

  app.post('/', { onRequest: [authorize('OWNER')] }, async (request, reply) => {
    void reply.code(501).send({ success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Coming soon' } })
  })

  app.patch('/:id', { onRequest: [authorize('MANAGER', 'OWNER')] }, async (request, reply) => {
    void reply.code(501).send({ success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Coming soon' } })
  })

  app.post('/shifts/open', async (request, reply) => {
    void reply.code(501).send({ success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Coming soon' } })
  })

  app.post('/shifts/close', async (request, reply) => {
    void reply.code(501).send({ success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Coming soon' } })
  })
}
