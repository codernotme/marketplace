import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { authorize } from '@/middleware/authorize.js'
import { listProductsHandler, getProductHandler, createProductHandler, updateProductHandler, deleteProductHandler } from './handlers'


export async function productRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)

  app.get('/', listProductsHandler)
  app.get('/:id', getProductHandler)
  app.post('/', { onRequest: [authorize('MANAGER', 'OWNER')] }, createProductHandler)
  app.patch('/:id', { onRequest: [authorize('MANAGER', 'OWNER')] }, updateProductHandler)
  app.delete('/:id', { onRequest: [authorize('OWNER')] }, deleteProductHandler)
}
