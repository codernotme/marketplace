import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import {
  loginHandler,
  registerHandler,
  refreshHandler,
  logoutHandler,
  verifyEmailHandler,
  verifyPhoneHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  mfaSetupHandler,
  mfaVerifyHandler,
  pinLoginHandler
} from './handlers.js'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', registerHandler)
  app.post('/login', loginHandler)
  app.post('/refresh', refreshHandler)
  app.post('/logout', logoutHandler)
  
  app.post('/verify-email', verifyEmailHandler)
  app.post('/verify-phone', { preHandler: [authenticate] }, verifyPhoneHandler) // Requires user to be logged in partially

  app.post('/forgot-password', forgotPasswordHandler)
  app.post('/reset-password', resetPasswordHandler)

  app.post('/mfa/setup', { preHandler: [authenticate] }, mfaSetupHandler)
  app.post('/mfa/verify', mfaVerifyHandler)
  
  // pos/auth/pin-login
  app.post('/pin-login', { preHandler: [authenticate] }, pinLoginHandler) // POS terminal must be authenticated with standard credentials first
}
