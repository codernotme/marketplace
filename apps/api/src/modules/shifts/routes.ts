import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { openShiftHandler, closeShiftHandler, getCurrentShiftHandler } from './handlers.js'

export async function shiftRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)

  app.get('/current/:storeId', getCurrentShiftHandler)
  app.post('/open/:storeId', openShiftHandler)
  app.post('/close/:storeId', closeShiftHandler)
}
