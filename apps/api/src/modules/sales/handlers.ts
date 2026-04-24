import type { FastifyRequest, FastifyReply } from 'fastify'
import { CreateSaleSchema, ProcessReturnSchema } from '@themrktplace/schema'
import { createSale, processReturn, listSales, getSale } from './service.js'
import { generateInvoiceHTML } from './invoice.service.js'
import { prisma } from '@/lib/prisma.js'
import { sendSuccess, sendCreated, sendPaginated } from '@/utils/response.js'
import { NotFoundError } from '@/utils/errors.js'

export async function listSalesHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { tenantId: string }
  const query = request.query as { page?: string; pageSize?: string; search?: string }
  const page = parseInt(query.page ?? '1', 10)
  const pageSize = parseInt(query.pageSize ?? '20', 10)
  
  const { items, total } = await listSales(user.tenantId, { page, pageSize, search: query.search })
  sendPaginated(reply, items, total, page, pageSize)
}

export async function getSaleHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { tenantId: string }
  const { id } = request.params as { id: string }
  const sale = await getSale(user.tenantId, id)
  sendSuccess(reply, sale)
}

export async function createSaleHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { sub: string; tenantId: string }
  const storeId = request.headers['x-store-id'] as string || '' // Get from header or session
  const body = CreateSaleSchema.parse(request.body)
  
  const sale = await createSale(user.tenantId, storeId, user.sub, body)
  sendCreated(reply, sale)
}

export async function refundSaleHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { sub: string; tenantId: string }
  const { id } = request.params as { id: string }
  const body = ProcessReturnSchema.parse(request.body)
  
  const result = await processReturn(user.tenantId, id, user.sub, body)
  sendSuccess(reply, result)
}

export async function getInvoiceHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { tenantId: string }
  const { id } = request.params as { id: string }
  
  const sale = await getSale(user.tenantId, id)
  const tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } })
  
  if (!tenant) throw new NotFoundError('Tenant')
  
  const html = generateInvoiceHTML(sale as any, tenant)
  reply.type('text/html').send(html)
}
