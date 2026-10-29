import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { authorize } from '@/middleware/authorize.js'
import { 
  getBusinessStatusHandler, 
  updateOnboardingHandler, 
  updateBusinessProfileHandler, 
  updateStoreHandler 
} from './handlers.js'

export async function businessRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)

  app.get('/status', getBusinessStatusHandler)
  app.patch('/onboarding', updateOnboardingHandler)
  app.patch('/profile', { onRequest: [authorize('OWNER')] }, updateBusinessProfileHandler)
  app.patch('/stores/:id', { onRequest: [authorize('OWNER', 'MANAGER')] }, updateStoreHandler)
}

