import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { authorize } from '@/middleware/authorize.js'
import { AdjustInventorySchema, CreatePurchaseOrderSchema, ReceivePurchaseOrderSchema } from '@themrktplace/schema'
import { adjustInventory, createPurchaseOrder, receivePurchaseOrder, listInventory } from './service.js'
import { sendSuccess, sendCreated } from '@/utils/response.js'

export async function inventoryRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)

  app.get('/', async (request, reply) => {
    const query = request.query as { storeId?: string }
    const items = await listInventory(query.storeId)
    sendSuccess(reply, items)
  })

  app.post('/adjust', { onRequest: [authorize('MANAGER', 'OWNER')] }, async (request, reply) => {
    const body = AdjustInventorySchema.parse(request.body)
    const staffId = (request.user as any).staffId || request.user.sub
    const result = await adjustInventory(staffId, body)
    sendSuccess(reply, result)
  })

  app.post('/purchase-orders', { onRequest: [authorize('MANAGER', 'OWNER')] }, async (request, reply) => {
    const body = CreatePurchaseOrderSchema.parse(request.body)
    const po = await createPurchaseOrder(body)
    sendCreated(reply, po)
  })

  app.post('/purchase-orders/:id/receive', { onRequest: [authorize('MANAGER', 'OWNER')] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const staffId = (request.user as any).staffId || request.user.sub
    const body = ReceivePurchaseOrderSchema.parse(request.body)
    const updatedPo = await receivePurchaseOrder(id, staffId, body)
    sendSuccess(reply, updatedPo)
  })
}
