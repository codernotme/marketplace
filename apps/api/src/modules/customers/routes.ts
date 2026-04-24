import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'

export async function customerRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)

  app.get('/', async (request, reply) => {
    void reply.send({ success: true, data: [] }) // TODO: implement
  })

  app.post('/', async (request, reply) => {
    void reply.code(501).send({ success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Coming soon' } })
  })

  app.get('/:id', async (request, reply) => {
    void reply.code(501).send({ success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Coming soon' } })
  })

  app.patch('/:id', async (request, reply) => {
    void reply.code(501).send({ success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Coming soon' } })
  })
}
