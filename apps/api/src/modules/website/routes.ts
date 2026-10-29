import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { authorize } from '@/middleware/authorize.js'
import {
  customerRegisterHandler,
  customerLoginHandler,
  customerProfileHandler,
  customerOrdersHandler,
  websiteSettingsHandler,
  websiteCatalogHandler,
  createWebOrderHandler,
  listWebOrdersHandler,
  updateOrderFulfillmentHandler,
  updateWebsiteSettingsHandler
} from './handlers.js'

export async function websiteRoutes(app: FastifyInstance) {
  // Public website endpoints
  app.get('/settings', websiteSettingsHandler)
  app.get('/catalog', websiteCatalogHandler)
  app.post('/orders', createWebOrderHandler)

  // Customer authentication endpoints
  app.post('/customer/register', customerRegisterHandler)
  app.post('/customer/login', customerLoginHandler)

  // Customer protected endpoints
  app.register(async (customerApp) => {
    customerApp.addHook('onRequest', authenticate)
    customerApp.get('/customer/profile', customerProfileHandler)
    customerApp.get('/customer/orders', customerOrdersHandler)
  })

  // POS management endpoints (Requires staff login)
  app.register(async (adminApp) => {
    adminApp.addHook('onRequest', authenticate)
    adminApp.addHook('onRequest', authorize('MANAGER', 'OWNER', 'CASHIER'))
    
    adminApp.get('/orders/manage', listWebOrdersHandler)
    adminApp.patch('/orders/:id/fulfillment', updateOrderFulfillmentHandler)
    adminApp.patch('/settings', updateWebsiteSettingsHandler)
  })
}

