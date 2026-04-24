import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { authorize } from '@/middleware/authorize.js'
import { 
  getTenantStatusHandler, 
  updateOnboardingHandler, 
  updateTenantProfileHandler, 
  updateStoreHandler 
} from './handlers.js'

export async function tenantRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)

  app.get('/status', getTenantStatusHandler)
  app.patch('/onboarding', updateOnboardingHandler)
  app.patch('/profile', { onRequest: [authorize('OWNER')] }, updateTenantProfileHandler)
  app.patch('/stores/:id', { onRequest: [authorize('OWNER', 'MANAGER')] }, updateStoreHandler)
}
