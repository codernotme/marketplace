import { randomUUID } from 'crypto'
import { parse } from 'csv-parse/sync'
import type { CreateProductInput, UpdateProductInput, UpdateVariantInput, CreateCategoryInput } from '@themrktplace/schema'
import { prisma } from '@/lib/prisma.js'
import { MovementReason } from '@prisma/client'
import { NotFoundError, AppError } from '@/utils/errors.js'

import { typesense } from '@/lib/typesense.js'

export async function createCategory(tenantId: string, body: CreateCategoryInput) {
  return await prisma.productCategory.create({
    data: {
      tenantId,
      name: body.name,
      parentId: body.parentId
    }
  })
}

export async function createProduct(tenantId: string, body: CreateProductInput) {
  return await prisma.$transaction(async (tx) => {
    // Create Product
    const product = await tx.product.create({
      data: {
        tenantId,
        categoryId: body.categoryId,
        name: body.name,
        description: body.description,
        basePrice: body.basePrice,
        costPrice: body.costPrice,
        taxRateId: body.taxRateId,
        hsnCodeId: body.hsnCodeId,
        lowStockAlert: body.lowStockAlert,
        isActive: body.isActive,
      }
    })

    // Create Attributes
    if (body.attributes && body.attributes.length > 0) {
      await tx.productAttribute.createMany({
        data: body.attributes.map(attr => ({
          productId: product.id,
          name: attr.name,
          values: attr.values
        }))
      })
    }

    // Create Variants
    if (body.hasVariants && body.variants) {
      for (const v of body.variants) {
        const variant = await tx.productVariant.create({
          data: {
            productId: product.id,
            sku: v.sku,
            barcode: v.barcode,
            attributeValues: v.attributeValues || {},
            price: v.price,
            costPrice: v.costPrice,
            imageUrl: v.imageUrl,
          }
        })

        if (v.openingStock) {
          for (const stock of v.openingStock) {
            if (stock.quantity > 0) {
              await tx.inventoryLevel.create({
                data: {
                  variantId: variant.id,
                  storeId: stock.storeId,
                  quantity: stock.quantity
                }
              })
              await tx.inventoryMovement.create({
                data: {
                  variantId: variant.id,
                  storeId: stock.storeId,
                  quantity: stock.quantity,
                  reason: MovementReason.MANUAL_ADJUSTMENT,
                  notes: 'Opening Stock'
                }
              })
            }
          }
        }
      }
    } else {
      // Create Default Variant
      const defaultVariant = await tx.productVariant.create({
        data: {
          productId: product.id,
          sku: `SKU-${randomUUID().slice(0, 8)}`, // Auto generate SKU
          attributeValues: {},
          price: body.basePrice,
          costPrice: body.costPrice,
        }
      })
      
      // If there's an opening stock provided in the default format
      if (body.variants && body.variants[0]?.openingStock) {
        for (const stock of body.variants[0].openingStock) {
          if (stock.quantity > 0) {
            await tx.inventoryLevel.create({
              data: {
                variantId: defaultVariant.id,
                storeId: stock.storeId,
                quantity: stock.quantity
              }
            })
            await tx.inventoryMovement.create({
              data: {
                variantId: defaultVariant.id,
                storeId: stock.storeId,
                quantity: stock.quantity,
                reason: MovementReason.MANUAL_ADJUSTMENT,
                notes: 'Opening Stock'
              }
            })
          }
        }
      }
    }

    // Sync to Typesense
    await typesense.collections('products').documents().upsert({
      id: product.id,
      tenantId,
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      basePrice: product.basePrice,
      isActive: product.isActive,
      createdAt: Math.floor(product.createdAt.getTime() / 1000)
    })

    return product
  })
}

export async function listProducts(tenantId: string, options: { page: number; pageSize: number; search?: string }) {
  const skip = (options.page - 1) * options.pageSize
  const where: any = { tenantId }

  if (options.search) {
    where.OR = [
      { name: { contains: options.search, mode: 'insensitive' } },
      { description: { contains: options.search, mode: 'insensitive' } }
    ]
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: options.pageSize,
      include: { category: true, variants: true }
    }),
    prisma.product.count({ where })
  ])

  return { items, total }
}

export async function updateProduct(tenantId: string, id: string, body: UpdateProductInput) {
  const product = await prisma.product.findFirst({ where: { id, tenantId } })
  if (!product) throw new NotFoundError('Product')

  return await prisma.product.update({
    where: { id },
    data: {
      categoryId: body.categoryId,
      name: body.name,
      description: body.description,
      basePrice: body.basePrice,
      isActive: body.isActive
    }
  })
}

export async function getProducts(tenantId: string) {
  return await prisma.product.findMany({
    where: { tenantId },
    include: {
      variants: {
        include: { inventory: true }
      },
      category: true,
      attributes: true
    }
  })
}

export async function getProduct(tenantId: string, id: string) {
  const product = await prisma.product.findFirst({
    where: { id, tenantId },
    include: {
      variants: { include: { inventory: true } },
      attributes: true
    }
  })
  if (!product) throw new NotFoundError('Product')
  return product
}

export async function deleteProduct(tenantId: string, id: string) {
  const product = await prisma.product.findFirst({ where: { id, tenantId } })
  if (!product) throw new NotFoundError('Product')

  await prisma.product.delete({ where: { id } })
  
  await typesense.collections('products').documents(id).delete()
  return { message: 'Deleted successfully' }
}
export async function importProductsFromCSV(tenantId: string, csvBuffer: Buffer) {
  const records = parse(csvBuffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  })

  return await prisma.$transaction(async (tx) => {
    const products = []

    for (const record of records as any[]) {
      const name = record.name || record.Name
      const basePrice = parseFloat(record.price || record.Price || '0')
      const costPrice = parseFloat(record.cost || record.Cost || '0')
      const sku = record.sku || record.SKU || `SKU-${randomUUID().slice(0, 8)}`
      const barcode = record.barcode || record.Barcode || null

      if (!name) continue

      const product = await tx.product.create({
        data: {
          tenantId,
          name,
          description: record.description || record.Description || '',
          basePrice,
          costPrice,
          isActive: true,
          variants: {
            create: {
              sku,
              barcode,
              attributeValues: {},
              price: basePrice,
              costPrice,
            }
          }
        }
      })
      products.push(product)
    }

    // Sync to Typesense
    await typesense.collections('products').documents().import(products.map(p => ({
      id: p.id,
      tenantId,
      name: p.name,
      description: p.description || '',
      categoryId: p.categoryId,
      basePrice: p.basePrice,
      isActive: p.isActive,
      createdAt: Math.floor(p.createdAt.getTime() / 1000)
    })), { action: 'upsert' })

    return { imported: products.length }
  })
}
