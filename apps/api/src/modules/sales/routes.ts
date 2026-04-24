import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { authorize } from '@/middleware/authorize.js'
import { listSalesHandler, getSaleHandler, createSaleHandler, refundSaleHandler, getInvoiceHandler } from './handlers.js'

export async function saleRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)

  app.get('/', listSalesHandler)
  app.get('/:id', getSaleHandler)
  app.get('/:id/invoice', getInvoiceHandler)
  app.post('/', createSaleHandler)
  app.post('/:id/refund', { onRequest: [authorize('MANAGER', 'OWNER')] }, refundSaleHandler)
}
