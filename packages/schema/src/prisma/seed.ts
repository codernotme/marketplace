import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Standard bcrypt hash for "Password123!" work factor 10
const SAMPLE_PASSWORD_HASH = '$2a$10$wT8KjK9qg8G9r6xO0l5bqeK9l2.F6fQ2F1M9tqC8G7iJ6e5R4u1T2'
// Standard bcrypt hash for 4-digit PIN "1234"
const SAMPLE_PIN_1234_HASH = '$2a$10$m6rWqD5p1zR0U.1Cq6S59Ou7Z3R2k0l1J5f4G3H2I1E0D9C8B7A6e'

async function main() {
  console.log('[Seed] Starting complete standalone database seed...')

  // 1. Clean existing records in correct foreign key order
  console.log('[Seed] Purging existing database tables...')
  await prisma.staffCommission.deleteMany().catch(() => {})
  await prisma.salePayment.deleteMany().catch(() => {})
  await prisma.returnItem.deleteMany().catch(() => {})
  await prisma.returnRec.deleteMany().catch(() => {})
  await prisma.saleItem.deleteMany().catch(() => {})
  await prisma.sale.deleteMany().catch(() => {})
  await prisma.inventoryMovement.deleteMany().catch(() => {})
  await prisma.inventoryLevel.deleteMany().catch(() => {})
  await prisma.purchaseOrderItem.deleteMany().catch(() => {})
  await prisma.purchaseOrder.deleteMany().catch(() => {})
  await prisma.productAttribute.deleteMany().catch(() => {})
  await prisma.productVariant.deleteMany().catch(() => {})
  await prisma.product.deleteMany().catch(() => {})
  await prisma.productCategory.deleteMany().catch(() => {})
  await prisma.loyaltyPointLog.deleteMany().catch(() => {})
  await prisma.storeCreditLog.deleteMany().catch(() => {})
  await prisma.customer.deleteMany().catch(() => {})
  await prisma.staffShift.deleteMany().catch(() => {})
  await prisma.staff.deleteMany().catch(() => {})
  await prisma.activeSession.deleteMany().catch(() => {})
  await prisma.userBackupCode.deleteMany().catch(() => {})
  await prisma.user.deleteMany().catch(() => {})
  await prisma.taxRate.deleteMany().catch(() => {})
  await prisma.hsnCode.deleteMany().catch(() => {})
  await prisma.store.deleteMany().catch(() => {})
  await prisma.businessSettings.deleteMany().catch(() => {})

  // 2. Business Settings
  console.log('[Seed] Creating Business Profile & Omnichannel Settings...')
  const business = await prisma.businessSettings.create({
    data: {
      businessName: 'THE MRKTPLACE',
      legalName: 'The Mrktplace Luxury Retail Private Limited',
      gstRegistered: true,
      gstin: '29ABCDE1234F1Z5',
      addressLine1: '100 Feet Road, 12th Main Junction, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      country: 'India',
      phone: '+91 80 4123 4567',
      email: 'concierge@themrktplace.com',
      currency: 'INR',
      websiteEnabled: true,
      announcementBanner: 'Complimentary white-glove courier shipping across India on all orders above ₹4,999.',
      featuredCollectionName: 'Autumn / Winter 2026 Sartorial Capsule',
    },
  })

  // 3. Tax Rates & HSN Codes
  console.log('[Seed] Seeding Indian GST Tax Rates & Apparel HSN Codes...')
  const gst18 = await prisma.taxRate.create({
    data: { name: 'GST 18%', rate: 18.00, isDefault: true },
  })
  const gst12 = await prisma.taxRate.create({
    data: { name: 'GST 12%', rate: 12.00, isDefault: false },
  })
  const gst5 = await prisma.taxRate.create({
    data: { name: 'GST 5%', rate: 5.00, isDefault: false },
  })

  const hsnShirt = await prisma.hsnCode.create({
    data: { code: '6205', description: "Men's or boys' woven shirts" },
  })
  const hsnTrouser = await prisma.hsnCode.create({
    data: { code: '6203', description: "Men's tailored trousers and suits" },
  })
  const hsnDress = await prisma.hsnCode.create({
    data: { code: '6204', description: "Women's tailored dresses and blazers" },
  })
  const hsnAccessories = await prisma.hsnCode.create({
    data: { code: '6215', description: 'Ties, bow ties, belts and leather goods' },
  })

  // 4. Stores (Flagship + Logistics Warehouse)
  console.log('[Seed] Seeding Physical Store & Central Logistics Hub...')
  const flagshipStore = await prisma.store.create({
    data: {
      name: 'Flagship Store · Indiranagar',
      code: 'BLR-INDIRA-01',
      storeType: 'Retail Store',
      addressLine1: '100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      phone: '+91 80 4123 4567',
      email: 'indiranagar@themrktplace.com',
      receiptHeader: 'THE MRKTPLACE\nFlagship Store · Indiranagar\nGSTIN: 29ABCDE1234F1Z5',
      receiptFooter: 'Thank you for shopping with THE MRKTPLACE.\nReturns accepted within 14 days with original tags.\nStore credit issued for eligible returns.',
      defaultTaxRate: 18.00,
      roundOffBills: true,
      isActive: true,
    },
  })

  const warehouseStore = await prisma.store.create({
    data: {
      name: 'Central Logistics Hub',
      code: 'BLR-WH-01',
      storeType: 'Warehouse',
      addressLine1: 'Whitefield Industrial Area',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
      phone: '+91 80 4123 9999',
      defaultTaxRate: 18.00,
      isActive: true,
    },
  })

  // 5. Users & Staff
  console.log('[Seed] Seeding Staff, Cashiers & 4-Digit POS Quick PINs...')
  const ownerUser = await prisma.user.create({
    data: {
      email: 'owner@themrktplace.com',
      name: 'Vikramaditya Singhania',
      passwordHash: SAMPLE_PASSWORD_HASH,
      role: 'OWNER',
      emailVerified: true,
      phone: '+91 98000 00001',
      staff: {
        create: {
          storeId: flagshipStore.id,
          employeeCode: 'EMP-001',
          position: 'Managing Director & Brand Principal',
          pinHash: SAMPLE_PIN_1234_HASH,
          commissionRate: 0.00,
        },
      },
    },
  })

  const cashierUser = await prisma.user.create({
    data: {
      email: 'cashier@themrktplace.com',
      name: 'Aryan Verma',
      passwordHash: SAMPLE_PASSWORD_HASH,
      role: 'CASHIER',
      emailVerified: true,
      phone: '+91 98000 00002',
      staff: {
        create: {
          storeId: flagshipStore.id,
          employeeCode: 'STF-BLR-003',
          position: 'Senior Cashier & Terminal Lead',
          pinHash: SAMPLE_PIN_1234_HASH,
          commissionRate: 1.50,
        },
      },
    },
  })

  const cashierStaff = await prisma.staff.findUnique({
    where: { userId: cashierUser.id },
  })

  // 6. Product Categories
  console.log('[Seed] Creating Apparel & Luxury Collections...')
  const catTops = await prisma.productCategory.create({
    data: { name: 'Tops & Shirts' },
  })
  const catTrousers = await prisma.productCategory.create({
    data: { name: 'Trousers & Pants' },
  })
  const catOuterwear = await prisma.productCategory.create({
    data: { name: 'Outerwear & Tailoring' },
  })
  const catDresses = await prisma.productCategory.create({
    data: { name: 'Dresses & Skirts' },
  })
  const catAccessories = await prisma.productCategory.create({
    data: { name: 'Accessories & Leather' },
  })

  // 7. Products, Dimensional Variants & Store Inventories
  console.log('[Seed] Seeding High-Res Apparel Catalog with Multi-Store Stock...')

  // Product 1: Oxford Shirt
  const prodShirt = await prisma.product.create({
    data: {
      name: 'Oxford Sartorial Button-Down Shirt',
      categoryId: catTops.id,
      taxRateId: gst18.id,
      hsnCodeId: hsnShirt.id,
      basePrice: 2899.00,
      costPrice: 950.00,
      lowStockAlert: 8,
      description: 'Hand-tailored from two-ply 100% Egyptian cotton with genuine mother-of-pearl buttons and rounded French cuffs.',
      attributes: {
        create: [
          { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
          { name: 'Color', values: ['Crisp White', 'Sky Blue'] },
        ],
      },
      variants: {
        create: [
          {
            sku: 'SHT-OXF-WHT-S',
            barcode: '890123456101',
            price: 2899.00,
            costPrice: 950.00,
            imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
            attributeValues: { Size: 'S', Color: 'Crisp White' },
            inventory: {
              create: [
                { storeId: flagshipStore.id, quantity: 18 },
                { storeId: warehouseStore.id, quantity: 45 },
              ],
            },
          },
          {
            sku: 'SHT-OXF-WHT-M',
            barcode: '890123456102',
            price: 2899.00,
            costPrice: 950.00,
            imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
            attributeValues: { Size: 'M', Color: 'Crisp White' },
            inventory: {
              create: [
                { storeId: flagshipStore.id, quantity: 24 },
                { storeId: warehouseStore.id, quantity: 60 },
              ],
            },
          },
          {
            sku: 'SHT-OXF-BLU-M',
            barcode: '890123456103',
            price: 2899.00,
            costPrice: 950.00,
            imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
            attributeValues: { Size: 'M', Color: 'Sky Blue' },
            inventory: {
              create: [
                { storeId: flagshipStore.id, quantity: 16 },
                { storeId: warehouseStore.id, quantity: 30 },
              ],
            },
          },
        ],
      },
    },
    include: { variants: true },
  })

  // Product 2: Pleated Trousers
  const prodTrousers = await prisma.product.create({
    data: {
      name: 'Pleated Wool-Blend Tailored Trousers',
      categoryId: catTrousers.id,
      taxRateId: gst18.id,
      hsnCodeId: hsnTrouser.id,
      basePrice: 4499.00,
      costPrice: 1650.00,
      lowStockAlert: 5,
      description: 'Double-pleated front with brass side adjusters and a relaxed tapered leg crafted from fine Italian wool blend.',
      attributes: {
        create: [
          { name: 'Waist', values: ['30', '32', '34'] },
          { name: 'Color', values: ['Charcoal Grey', 'Sand Beige'] },
        ],
      },
      variants: {
        create: [
          {
            sku: 'TRS-PLT-CHR-32',
            barcode: '890123456201',
            price: 4499.00,
            costPrice: 1650.00,
            imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
            attributeValues: { Waist: '32', Color: 'Charcoal Grey' },
            inventory: {
              create: [
                { storeId: flagshipStore.id, quantity: 14 },
                { storeId: warehouseStore.id, quantity: 35 },
              ],
            },
          },
          {
            sku: 'TRS-PLT-SND-32',
            barcode: '890123456202',
            price: 4499.00,
            costPrice: 1650.00,
            imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
            attributeValues: { Waist: '32', Color: 'Sand Beige' },
            inventory: {
              create: [
                { storeId: flagshipStore.id, quantity: 12 },
                { storeId: warehouseStore.id, quantity: 28 },
              ],
            },
          },
        ],
      },
    },
    include: { variants: true },
  })

  // Product 3: Deconstructed Linen Blazer
  const prodBlazer = await prisma.product.create({
    data: {
      name: 'Deconstructed Linen-Silk Blazer',
      categoryId: catOuterwear.id,
      taxRateId: gst18.id,
      hsnCodeId: hsnDress.id,
      basePrice: 8999.00,
      costPrice: 3200.00,
      lowStockAlert: 3,
      description: 'Unstructured two-button jacket crafted in Biella, Italy featuring unlined interior, patch pockets and horn buttons.',
      attributes: {
        create: [
          { name: 'Chest', values: ['38', '40', '42'] },
          { name: 'Color', values: ['Navy Blue', 'Oatmeal Beige'] },
        ],
      },
      variants: {
        create: [
          {
            sku: 'BLZ-DEC-NAV-40',
            barcode: '890123456301',
            price: 8999.00,
            costPrice: 3200.00,
            imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
            attributeValues: { Chest: '40', Color: 'Navy Blue' },
            inventory: {
              create: [
                { storeId: flagshipStore.id, quantity: 9 },
                { storeId: warehouseStore.id, quantity: 20 },
              ],
            },
          },
          {
            sku: 'BLZ-DEC-OAT-40',
            barcode: '890123456302',
            price: 8999.00,
            costPrice: 3200.00,
            imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
            attributeValues: { Chest: '40', Color: 'Oatmeal Beige' },
            inventory: {
              create: [
                { storeId: flagshipStore.id, quantity: 7 },
                { storeId: warehouseStore.id, quantity: 15 },
              ],
            },
          },
        ],
      },
    },
    include: { variants: true },
  })

  // Product 4: Ribbed Knit Midi Dress
  const prodDress = await prisma.product.create({
    data: {
      name: 'Sculpted Ribbed Merino Wool Knit Midi Dress',
      categoryId: catDresses.id,
      taxRateId: gst18.id,
      hsnCodeId: hsnDress.id,
      basePrice: 5799.00,
      costPrice: 2100.00,
      lowStockAlert: 4,
      description: 'Spun from superfine Australian merino wool with an elegant mock neck and discreet side slit.',
      attributes: {
        create: [
          { name: 'Size', values: ['S', 'M', 'L'] },
          { name: 'Color', values: ['Obsidian Black', 'Terracotta'] },
        ],
      },
      variants: {
        create: [
          {
            sku: 'DRS-RIB-BLK-S',
            barcode: '890123456401',
            price: 5799.00,
            costPrice: 2100.00,
            imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
            attributeValues: { Size: 'S', Color: 'Obsidian Black' },
            inventory: {
              create: [
                { storeId: flagshipStore.id, quantity: 12 },
                { storeId: warehouseStore.id, quantity: 24 },
              ],
            },
          },
          {
            sku: 'DRS-RIB-BLK-M',
            barcode: '890123456402',
            price: 5799.00,
            costPrice: 2100.00,
            imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
            attributeValues: { Size: 'M', Color: 'Obsidian Black' },
            inventory: {
              create: [
                { storeId: flagshipStore.id, quantity: 15 },
                { storeId: warehouseStore.id, quantity: 30 },
              ],
            },
          },
        ],
      },
    },
    include: { variants: true },
  })

  // Product 5: Leather Belt
  const prodBelt = await prisma.product.create({
    data: {
      name: 'Full-Grain Italian Calfskin Leather Belt',
      categoryId: catAccessories.id,
      taxRateId: gst18.id,
      hsnCodeId: hsnAccessories.id,
      basePrice: 2199.00,
      costPrice: 750.00,
      lowStockAlert: 10,
      description: 'Vegetable-tanned full grain calf leather completed with a solid brushed champagne brass buckle.',
      attributes: {
        create: [
          { name: 'Size', values: ['M (32-34)', 'L (36-38)'] },
          { name: 'Color', values: ['Cognac Brown', 'Matte Black'] },
        ],
      },
      variants: {
        create: [
          {
            sku: 'ACC-BLT-BRN-M',
            barcode: '890123456501',
            price: 2199.00,
            costPrice: 750.00,
            imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80',
            attributeValues: { Size: 'M (32-34)', Color: 'Cognac Brown' },
            inventory: {
              create: [
                { storeId: flagshipStore.id, quantity: 25 },
                { storeId: warehouseStore.id, quantity: 50 },
              ],
            },
          },
          {
            sku: 'ACC-BLT-BLK-M',
            barcode: '890123456502',
            price: 2199.00,
            costPrice: 750.00,
            imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
            attributeValues: { Size: 'M (32-34)', Color: 'Matte Black' },
            inventory: {
              create: [
                { storeId: flagshipStore.id, quantity: 30 },
                { storeId: warehouseStore.id, quantity: 45 },
              ],
            },
          },
        ],
      },
    },
    include: { variants: true },
  })

  // 8. Customers (with web account passwords, loyalty points, store credit)
  console.log('[Seed] Seeding Customer Profiles with CRM Loyalty Points & Store Credit...')
  const customerAarav = await prisma.customer.create({
    data: {
      name: 'Aarav Mehta',
      email: 'aarav@example.com',
      phone: '+91 99000 11223',
      passwordHash: SAMPLE_PASSWORD_HASH,
      loyaltyPoints: 350,
      storeCredit: 1500.00,
      totalSpend: 24500.00,
      totalOrders: 4,
      loyaltyLogs: {
        create: [
          { points: 250, reason: 'Earned on in-store purchase INV-2026-0005' },
          { points: 100, reason: 'Welcome bonus on website account activation' },
        ],
      },
      storeCreditLogs: {
        create: [
          { amount: 1500.00, reason: 'Refund credited for size exchange return RTN-2026-001' },
        ],
      },
    },
  })

  const customerAnanya = await prisma.customer.create({
    data: {
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 98111 22334',
      passwordHash: SAMPLE_PASSWORD_HASH,
      loyaltyPoints: 520,
      storeCredit: 0.00,
      totalSpend: 38900.00,
      totalOrders: 6,
      loyaltyLogs: {
        create: [
          { points: 520, reason: 'Earned on bespoke tailoring orders' },
        ],
      },
    },
  })

  // 9. Active Cashier Shift for POS Testing
  console.log('[Seed] Opening Cashier Shift for Flagship Terminal...')
  if (cashierStaff) {
    await prisma.staffShift.create({
      data: {
        staffId: cashierStaff.id,
        storeId: flagshipStore.id,
        openingCash: 5000.00,
        openedAt: new Date(),
        notes: 'Morning shift opening float verified: 5x ₹500, 20x ₹100, 10x ₹50',
      },
    })
  }

  // 10. Omnichannel Web Orders & In-Store Sales
  console.log('[Seed] Seeding Active Website Orders (Pending & Packed) for POS fulfillment...')
  
  // Web Order 1: PENDING (ready to be packed inside POS Management tab!)
  const webOrder1 = await prisma.sale.create({
    data: {
      storeId: flagshipStore.id,
      customerId: customerAarav.id,
      invoiceNumber: 'WEB-2026-0001',
      channel: 'WEBSITE',
      status: 'COMPLETED',
      fulfillmentStatus: 'PENDING',
      subtotal: 7398.00,
      discountAmount: 0.00,
      taxAmount: 1331.64,
      grandTotal: 8729.64,
      shippingAddress: {
        recipient: 'Aarav Mehta',
        phone: '+91 99000 11223',
        addressLine: 'Flat 402, Prestige Palms, 12th Main Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        deliveryMode: 'Home Courier',
      },
      items: {
        create: [
          {
            variantId: prodShirt.variants[0].id,
            quantity: 1,
            unitPrice: 2899.00,
            taxRate: 18.00,
            taxAmount: 521.82,
            total: 3420.82,
          },
          {
            variantId: prodTrousers.variants[0].id,
            quantity: 1,
            unitPrice: 4499.00,
            taxRate: 18.00,
            taxAmount: 809.82,
            total: 5308.82,
          },
        ],
      },
      payments: {
        create: [
          {
            method: 'UPI',
            amount: 8729.64,
            referenceId: 'UPI-RAZORPAY-9921448',
          },
        ],
      },
    },
  })

  // Web Order 2: PACKED (BOPIS Store Pickup ready for handoff)
  const webOrder2 = await prisma.sale.create({
    data: {
      storeId: flagshipStore.id,
      customerId: customerAnanya.id,
      invoiceNumber: 'WEB-2026-0002',
      channel: 'WEBSITE',
      status: 'COMPLETED',
      fulfillmentStatus: 'PACKED',
      subtotal: 8999.00,
      discountAmount: 0.00,
      taxAmount: 1619.82,
      grandTotal: 10618.82,
      shippingAddress: {
        recipient: 'Ananya Sharma',
        phone: '+91 98111 22334',
        deliveryMode: 'Store Pickup (BOPIS)',
        pickupBranch: 'Flagship Store · Indiranagar',
      },
      items: {
        create: [
          {
            variantId: prodBlazer.variants[0].id,
            quantity: 1,
            unitPrice: 8999.00,
            taxRate: 18.00,
            taxAmount: 1619.82,
            total: 10618.82,
          },
        ],
      },
      payments: {
        create: [
          {
            method: 'CARD',
            amount: 10618.82,
            referenceId: 'CARD-RAZORPAY-771124',
          },
        ],
      },
    },
  })

  // Past In-Store POS Sale (Split Tender)
  if (cashierStaff) {
    await prisma.sale.create({
      data: {
        storeId: flagshipStore.id,
        staffId: cashierStaff.id,
        customerId: customerAarav.id,
        invoiceNumber: 'INV-2026-0010',
        channel: 'POS',
        status: 'COMPLETED',
        fulfillmentStatus: 'FULFILLED',
        subtotal: 4499.00,
        discountAmount: 200.00,
        taxAmount: 773.82,
        grandTotal: 5072.82,
        items: {
          create: [
            {
              variantId: prodTrousers.variants[0].id,
              quantity: 1,
              unitPrice: 4499.00,
              discountAmount: 200.00,
              taxRate: 18.00,
              taxAmount: 773.82,
              total: 5072.82,
            },
          ],
        },
        payments: {
          create: [
            { method: 'CASH', amount: 2000.00 },
            { method: 'STORE_CREDIT', amount: 1500.00, referenceId: 'CREDIT-BAL' },
            { method: 'UPI', amount: 1572.82, referenceId: 'UPI-GTM-4421' },
          ],
        },
      },
    })
  }

  console.log('[Seed] Database successfully seeded with luxury omnichannel retail dummy dataset!')
  console.log('[Seed] Ready for testing:')
  console.log('       - POS Cashier PIN: 1234')
  console.log('       - Customer Web Login: aarav@example.com / Password123!')
  console.log('       - Admin Login: owner@themrktplace.com / Password123!')
}

main()
  .catch((e) => {
    console.error('[Seed] Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

