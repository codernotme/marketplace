import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { authorize } from '@/middleware/authorize.js'

export async function reportRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)
  app.addHook('onRequest', authorize('manager', 'owner'))

  app.get('/summary', async (request, reply) => {
    void reply.code(501).send({ success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Coming soon' } })
  })

  app.get('/sales', async (request, reply) => {
    void reply.code(501).send({ success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Coming soon' } })
  })

  app.get('/inventory', async (request, reply) => {
    void reply.code(501).send({ success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Coming soon' } })
  })
}
