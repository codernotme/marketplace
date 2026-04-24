import type { CreateProductInput, UpdateProductInput } from '@themrktplace/schema'
import { prisma } from '@/lib/prisma.js'
import { NotFoundError } from '@/utils/errors.js'

interface ListOptions {
  page: number
  pageSize: number
  search?: string
}

export async function listProducts(tenantId: string, opts: ListOptions) {
  const where = {
    store: { tenantId },
    ...(opts.search ? { name: { contains: opts.search, mode: 'insensitive' as const } } : {}),
  }
  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip: (opts.page - 1) * opts.pageSize,
      take: opts.pageSize,
      include: { variants: true, category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ])
  return { items, total }
}

export async function getProduct(id: string, tenantId: string) {
  const product = await prisma.product.findFirst({
    where: { id, store: { tenantId } },
    include: { variants: { include: { inventory: true } }, category: true },
  })
  if (!product) throw new NotFoundError('Product')
  return product
}

export async function createProduct(data: CreateProductInput, tenantId: string) {
  const store = await prisma.store.findFirst({ where: { tenantId } })
  if (!store) throw new NotFoundError('Store')
  return prisma.product.create({ data: { ...data, storeId: store.id } })
}

export async function updateProduct(id: string, data: UpdateProductInput, tenantId: string) {
  await getProduct(id, tenantId)
  return prisma.product.update({ where: { id }, data })
}

export async function deleteProduct(id: string, tenantId: string) {
  await getProduct(id, tenantId)
  await prisma.product.delete({ where: { id } })
}
