import type { FastifyRequest, FastifyReply } from 'fastify'
import { 
  CustomerRegisterSchema, 
  CustomerLoginSchema, 
  CreateWebOrderSchema,
  UpdateBusinessSettingsSchema
} from '@themrktplace/schema'
import {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  getCustomerOrders,
  getWebsiteSettings,
  getWebsiteCatalog,
  createWebOrder,
  listWebOrders,
  updateOrderFulfillment,
  updateWebsiteSettings
} from './service.js'
import { sendSuccess, sendCreated } from '@/utils/response.js'

// ─── Customer Handlers ────────────────────────────────────────────────────────

export async function customerRegisterHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = CustomerRegisterSchema.parse(request.body)
  const customer = await registerCustomer(body)

  const token = await reply.jwtSign({
    sub: customer.id,
    role: 'CUSTOMER'
  })

  sendCreated(reply, { customer, token })
}

export async function customerLoginHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = CustomerLoginSchema.parse(request.body)
  const customer = await loginCustomer(body)

  const token = await reply.jwtSign({
    sub: customer.id,
    role: 'CUSTOMER'
  })

  sendSuccess(reply, { customer, token })
}

export async function customerProfileHandler(request: FastifyRequest, reply: FastifyReply) {
  const customerId = request.user.sub
  const profile = await getCustomerProfile(customerId)
  sendSuccess(reply, profile)
}

export async function customerOrdersHandler(request: FastifyRequest, reply: FastifyReply) {
  const customerId = request.user.sub
  const orders = await getCustomerOrders(customerId)
  sendSuccess(reply, orders)
}

// ─── Public Website Handlers ──────────────────────────────────────────────────

export async function websiteSettingsHandler(_request: FastifyRequest, reply: FastifyReply) {
  const settings = await getWebsiteSettings()
  sendSuccess(reply, settings)
}

export async function websiteCatalogHandler(_request: FastifyRequest, reply: FastifyReply) {
  const catalog = await getWebsiteCatalog()
  sendSuccess(reply, catalog)
}

export async function createWebOrderHandler(request: FastifyRequest, reply: FastifyReply) {
  const customerId = (request.user as any)?.sub || null
  const body = CreateWebOrderSchema.parse(request.body)
  const order = await createWebOrder(customerId, body)
  sendCreated(reply, order)
}

// ─── POS Website Management Handlers ──────────────────────────────────────────

export async function listWebOrdersHandler(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { status?: string }
  const orders = await listWebOrders(query.status)
  sendSuccess(reply, orders)
}

export async function updateOrderFulfillmentHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const body = request.body as { fulfillmentStatus: string }
  const order = await updateOrderFulfillment(id, body.fulfillmentStatus)
  sendSuccess(reply, order)
}

export async function updateWebsiteSettingsHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = UpdateBusinessSettingsSchema.parse(request.body)
  const updated = await updateWebsiteSettings(body)
  sendSuccess(reply, updated)
}

