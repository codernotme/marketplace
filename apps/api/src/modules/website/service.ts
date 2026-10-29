import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma.js'
import { NotFoundError, ConflictError, UnauthorizedError, AppError } from '@/utils/errors.js'
import type { CustomerRegisterInput, CustomerLoginInput, CreateWebOrderInput, UpdateBusinessSettingsInput } from '@themrktplace/schema'

// ─── Customer Authentication ──────────────────────────────────────────────────

export async function registerCustomer(body: CustomerRegisterInput) {
  const existing = await prisma.customer.findFirst({
    where: {
      OR: [
        { email: body.email },
        { phone: body.phone }
      ]
    }
  })

  if (existing) {
    throw new ConflictError('A customer account with this email or phone already exists')
  }

  const passwordHash = await bcrypt.hash(body.password, 12)

  const customer = await prisma.customer.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      passwordHash,
    }
  })

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    loyaltyPoints: customer.loyaltyPoints,
    storeCredit: customer.storeCredit
  }
}

export async function loginCustomer(body: CustomerLoginInput) {
  const customer = await prisma.customer.findFirst({
    where: { email: body.email }
  })

  if (!customer || !customer.passwordHash) {
    throw new UnauthorizedError('Invalid email or password')
  }

  const valid = await bcrypt.compare(body.password, customer.passwordHash)
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password')
  }

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    loyaltyPoints: customer.loyaltyPoints,
    storeCredit: customer.storeCredit
  }
}

export async function getCustomerProfile(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      loyaltyLogs: { orderBy: { createdAt: 'desc' }, take: 5 },
      storeCreditLogs: { orderBy: { createdAt: 'desc' }, take: 5 }
    }
  })

  if (!customer) throw new NotFoundError('Customer')

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    loyaltyPoints: customer.loyaltyPoints,
    storeCredit: customer.storeCredit,
    totalOrders: customer.totalOrders,
    totalSpend: customer.totalSpend,
    loyaltyLogs: customer.loyaltyLogs,
    storeCreditLogs: customer.storeCreditLogs
  }
}

export async function getCustomerOrders(customerId: string) {
  return await prisma.sale.findMany({
    where: { customerId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true }
          }
        }
      },
      payments: true,
      store: true
    }
  })
}

// ─── Public Website Data ──────────────────────────────────────────────────────

export async function getWebsiteSettings() {
  const [settings, stores] = await Promise.all([
    prisma.businessSettings.findFirst(),
    prisma.store.findMany({ where: { isActive: true } })
  ])

  return {
    brandName: settings?.businessName || 'themrktplace',
    phone: settings?.phone || '',
    email: settings?.email || '',
    currency: settings?.currency || 'INR',
    websiteEnabled: settings?.websiteEnabled ?? true,
    announcementBanner: settings?.announcementBanner || 'Welcome to our flagship online store. Free shipping on orders over ₹1,999.',
    featuredCollectionName: settings?.featuredCollectionName || 'New Arrivals',
    stores: stores.map(s => ({
      id: s.id,
      name: s.name,
      city: s.city,
      address: s.addressLine1,
      phone: s.phone
    }))
  }
}

export async function getWebsiteCatalog() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      variants: {
        where: { isActive: true },
        include: {
          inventory: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    basePrice: Number(p.basePrice),
    categoryName: p.category?.name || 'Apparel',
    variants: p.variants.map(v => {
      const stock = v.inventory.reduce((sum, i) => sum + i.quantity, 0)
      return {
        id: v.id,
        sku: v.sku,
        price: Number(v.price),
        attributeValues: v.attributeValues as Record<string, string>,
        imageUrl: v.imageUrl,
        inStock: stock > 0,
        stockQuantity: stock
      }
    })
  }))
}

export async function createWebOrder(customerId: string | null, body: CreateWebOrderInput) {
  // Determine primary fulfillment store
  const store = body.storeId 
    ? await prisma.store.findUnique({ where: { id: body.storeId } })
    : await prisma.store.findFirst({ where: { isActive: true } })

  if (!store) throw new AppError('STORE_NOT_FOUND', 'No active fulfillment store found')

  return await prisma.$transaction(async (tx) => {
    let subtotal = 0
    let totalTaxAmount = 0
    const saleItems = []

    for (const item of body.items) {
      const variant = await tx.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true }
      })

      if (!variant) throw new NotFoundError(`Variant ${item.variantId}`)

      const unitPrice = Number(variant.price)
      const itemSubtotal = unitPrice * item.quantity
      const taxRate = 18.0
      const itemTax = (itemSubtotal * taxRate) / 100
      const itemTotal = itemSubtotal + itemTax

      subtotal += itemSubtotal
      totalTaxAmount += itemTax

      saleItems.push({
        variantId: variant.id,
        quantity: item.quantity,
        unitPrice,
        discountAmount: 0,
        taxRate,
        taxAmount: itemTax,
        total: itemTotal
      })

      // Reserve stock from store inventory
      const level = await tx.inventoryLevel.findUnique({
        where: { variantId_storeId: { variantId: variant.id, storeId: store.id } }
      })

      if (level) {
        await tx.inventoryLevel.update({
          where: { variantId_storeId: { variantId: variant.id, storeId: store.id } },
          data: {
            quantity: { decrement: item.quantity }
          }
        })
      }
    }

    const grandTotal = subtotal + totalTaxAmount
    const invoiceNumber = `WEB-${Date.now()}`

    const sale = await tx.sale.create({
      data: {
        storeId: store.id,
        customerId,
        invoiceNumber,
        channel: 'WEBSITE',
        status: 'PENDING',
        fulfillmentStatus: 'PENDING',
        shippingAddress: body.shippingAddress,
        subtotal,
        taxAmount: totalTaxAmount,
        grandTotal,
        items: {
          create: saleItems
        },
        payments: {
          create: [
            {
              method: body.paymentMethod === 'COD' ? 'CASH' : 'CARD',
              amount: grandTotal,
              referenceId: `TXN-${Date.now()}`
            }
          ]
        }
      },
      include: {
        items: true,
        payments: true
      }
    })

    if (customerId) {
      await tx.customer.update({
        where: { id: customerId },
        data: {
          totalOrders: { increment: 1 },
          totalSpend: { increment: grandTotal }
        }
      })
    }

    return sale
  })
}

// ─── POS Management of Website & Web Orders ───────────────────────────────────

export async function listWebOrders(fulfillmentStatus?: string) {
  const where: any = { channel: 'WEBSITE' }
  if (fulfillmentStatus && fulfillmentStatus !== 'ALL') {
    where.fulfillmentStatus = fulfillmentStatus
  }

  return await prisma.sale.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
      store: true,
      items: {
        include: {
          variant: {
            include: { product: true }
          }
        }
      },
      payments: true
    }
  })
}

export async function updateOrderFulfillment(saleId: string, fulfillmentStatus: string) {
  const sale = await prisma.sale.findUnique({ where: { id: saleId } })
  if (!sale) throw new NotFoundError('Sale order')

  const updated = await prisma.sale.update({
    where: { id: saleId },
    data: {
      fulfillmentStatus,
      status: fulfillmentStatus === 'DELIVERED' || fulfillmentStatus === 'FULFILLED' ? 'COMPLETED' : sale.status
    },
    include: {
      customer: true,
      items: true
    }
  })

  return updated
}

export async function updateWebsiteSettings(body: UpdateBusinessSettingsInput) {
  return await prisma.businessSettings.upsert({
    where: { id: 'default' },
    update: body,
    create: {
      id: 'default',
      businessName: body.businessName || 'themrktplace',
      businessEmail: body.email || 'care@themrktplace.com',
      ...body
    }
  })
}

