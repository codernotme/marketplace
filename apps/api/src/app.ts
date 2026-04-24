import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import cookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

import { AppError } from '@/utils/errors.js'
import { authRoutes } from '@/modules/auth/routes.js'
import { productRoutes } from '@/modules/products/routes.js'
import { inventoryRoutes } from '@/modules/inventory/routes.js'
import { saleRoutes } from '@/modules/sales/routes.js'
import { customerRoutes } from '@/modules/customers/routes.js'
import { staffRoutes } from '@/modules/staff/routes.js'
import { reportRoutes } from '@/modules/reports/routes.js'
import { licenseRoutes } from '@/modules/license/routes.js'
import { shiftRoutes } from '@/modules/shifts/routes.js'
import { tenantRoutes } from '@/modules/tenants/routes.js'

export function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env['NODE_ENV'] === 'development' ? 'info' : 'warn',
    },
  })

  // ─── Plugins ────────────────────────────────────────────────────────────────

  void app.register(cors, {
    origin: [
      process.env['DASHBOARD_URL'] ?? 'http://localhost:3000',
      process.env['STOREFRONT_URL'] ?? 'http://localhost:3002',
    ],
    credentials: true,
  })

  void app.register(jwt, {
    secret: process.env['JWT_SECRET'] ?? 'dev-secret-change-in-prod',
    sign: { expiresIn: process.env['JWT_ACCESS_EXPIRES_IN'] ?? '15m' },
  })

  void app.register(cookie)
  void app.register(multipart)

  void app.register(swagger, {
    openapi: {
      info: { title: 'themrktplace API', version: '1.0.0' },
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
    },
  })

  void app.register(swaggerUi, { routePrefix: '/docs' })

  // ─── Error Handler ──────────────────────────────────────────────────────────

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      void reply.code(error.statusCode).send({
        success: false,
        error: { code: error.code, message: error.message, details: error.details },
      })
      return
    }
    app.log.error(error)
    void reply.code(500).send({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
    })
  })

  // ─── Routes ─────────────────────────────────────────────────────────────────

  void app.register(authRoutes, { prefix: '/api/v1/auth' })
  void app.register(licenseRoutes, { prefix: '/api/v1/licenses' })
  void app.register(productRoutes, { prefix: '/api/v1/products' })
  void app.register(inventoryRoutes, { prefix: '/api/v1/inventory' })
  void app.register(saleRoutes, { prefix: '/api/v1/sales' })
  void app.register(customerRoutes, { prefix: '/api/v1/customers' })
  void app.register(staffRoutes, { prefix: '/api/v1/staff' })
  void app.register(reportRoutes, { prefix: '/api/v1/reports' })
  void app.register(shiftRoutes, { prefix: '/api/v1/shifts' })
  void app.register(tenantRoutes, { prefix: '/api/v1/tenants' })

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  return app
}
