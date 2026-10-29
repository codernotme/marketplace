import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { CreateCustomerSchema } from '@themrktplace/schema'
import { createCustomer, getCustomers, getCustomer, getCustomerPurchaseHistory } from './service.js'
import { sendSuccess, sendCreated } from '@/utils/response.js'

export async function customerRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)

  app.get('/', async (request, reply) => {
    const customers = await getCustomers()
    sendSuccess(reply, customers)
  })

  app.post('/', async (request, reply) => {
    const body = CreateCustomerSchema.parse(request.body)
    const customer = await createCustomer(body)
    sendCreated(reply, customer)
  })

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const customer = await getCustomer(id)
    sendSuccess(reply, customer)
  })

  app.get('/:id/purchases', async (request, reply) => {
    const { id } = request.params as { id: string }
    const history = await getCustomerPurchaseHistory(id)
    sendSuccess(reply, history)
  })
}
