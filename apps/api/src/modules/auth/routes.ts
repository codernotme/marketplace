import type { FastifyInstance } from 'fastify'
import { loginHandler, registerHandler, refreshHandler, logoutHandler } from './handlers.js'

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', loginHandler)
  app.post('/register', registerHandler)
  app.post('/refresh', refreshHandler)
  app.post('/logout', logoutHandler)
}
