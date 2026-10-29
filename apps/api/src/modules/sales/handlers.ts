import type { FastifyRequest, FastifyReply } from 'fastify'
import { CreateSaleSchema, ProcessReturnSchema } from '@themrktplace/schema'
import { createSale, processReturn, listSales, getSale } from './service.js'
import { generateInvoiceHTML } from './invoice.service.js'
import { prisma } from '@/lib/prisma.js'
import { sendSuccess, sendCreated, sendPaginated } from '@/utils/response.js'

export async function listSalesHandler(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { page?: string; pageSize?: string; search?: string }
  const page = parseInt(query.page ?? '1', 10)
  const pageSize = parseInt(query.pageSize ?? '20', 10)
  
  const { items, total } = await listSales({ page, pageSize, search: query.search })
  sendPaginated(reply, items, total, page, pageSize)
}

export async function getSaleHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const sale = await getSale(id)
  sendSuccess(reply, sale)
}

export async function createSaleHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user
  const headerStoreId = request.headers['x-store-id'] as string
  const storeId = headerStoreId || user.storeId || ''
  const staffId = (user as any).staffId || user.sub
  const body = CreateSaleSchema.parse(request.body)
  
  const sale = await createSale(storeId, staffId, body)
  sendCreated(reply, sale)
}

export async function refundSaleHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user
  const staffId = (user as any).staffId || user.sub
  const { id } = request.params as { id: string }
  const body = ProcessReturnSchema.parse(request.body)
  
  const result = await processReturn(id, staffId, body)
  sendSuccess(reply, result)
}

export async function getInvoiceHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  
  const sale = await getSale(id)
  const business = await prisma.businessSettings.findFirst() || {
    businessName: 'themrktplace Flagship Store',
    gstin: '29ABCDE1234F1Z5'
  }
  
  const html = generateInvoiceHTML(sale as any, business)
  reply.type('text/html').send(html)
}
