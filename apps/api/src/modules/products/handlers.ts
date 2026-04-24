import type { FastifyRequest, FastifyReply } from 'fastify'
import { CreateProductSchema, UpdateProductSchema } from '@themrktplace/schema'
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from './service.js'
import { sendSuccess, sendCreated, sendPaginated } from '@/utils/response.js'

export async function listProductsHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { tenantId: string }
  const query = request.query as { page?: string; pageSize?: string; search?: string }
  const page = parseInt(query.page ?? '1', 10)
  const pageSize = parseInt(query.pageSize ?? '20', 10)
  const { items, total } = await listProducts(user.tenantId, { page, pageSize, search: query.search })
  sendPaginated(reply, items, total, page, pageSize)
}

export async function getProductHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { tenantId: string }
  const { id } = request.params as { id: string }
  const product = await getProduct(user.tenantId, id)
  sendSuccess(reply, product)
}

export async function createProductHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { tenantId: string }
  const body = CreateProductSchema.parse(request.body)
  const product = await createProduct(user.tenantId, body)
  sendCreated(reply, product)
}

export async function updateProductHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { tenantId: string }
  const { id } = request.params as { id: string }
  const body = UpdateProductSchema.parse(request.body)
  const product = await updateProduct(user.tenantId, id, body)
  sendSuccess(reply, product)
}

export async function deleteProductHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { tenantId: string }
  const { id } = request.params as { id: string }
  await deleteProduct(user.tenantId, id)
  sendSuccess(reply, { message: 'Product deleted' })
}
