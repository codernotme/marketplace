import bullmq from 'bullmq'
const { Worker } = bullmq
import type { Job } from 'bullmq'
import { redis } from '../lib/redis.js'
import { Resend } from 'resend'
import { prisma } from '../lib/prisma.js'

const resend = new Resend(process.env['RESEND_API_KEY'])

export const notificationWorker = new Worker('notifications', async (job: Job) => {
  console.log(`[Worker] Processing job ${job.id}: ${job.name}`)

  try {
    switch (job.name) {
      case 'LOW_STOCK':
        await handleLowStockAlert(job.data)
        break
      default:
        console.warn(`[Worker] Unknown job name: ${job.name}`)
    }
  } catch (error) {
    console.error(`[Worker] Job ${job.id} failed:`, error)
    throw error
  }
}, {
  connection: redis
})

async function handleLowStockAlert(data: { variantId: string; storeId: string; quantity: number }) {
  const variant = await prisma.productVariant.findUnique({
    where: { id: data.variantId },
    include: { product: { include: { tenant: { include: { users: { where: { role: 'OWNER' } } } } } } }
  })

  if (!variant || !variant.product.tenant.users[0]) return

  const owner = variant.product.tenant.users[0]
  const productName = variant.product.name
  const storeName = 'Default Store' // Should get actual store name

  // 1. Send Email via Resend
  await resend.emails.send({
    from: process.env['EMAIL_FROM'] || 'noreply@themrktplace.com',
    to: owner.email,
    subject: `Low Stock Alert: ${productName}`,
    html: `
      <h1>Low Stock Alert</h1>
      <p>Product <strong>${productName}</strong> is running low in stock at <strong>${storeName}</strong>.</p>
      <p>Current Quantity: <strong>${data.quantity}</strong></p>
      <p>Threshold: <strong>${variant.product.lowStockAlert}</strong></p>
      <a href="${process.env['DASHBOARD_URL']}/inventory">View Inventory</a>
    `
  })

  // 2. Send SMS via MSG91 (Placeholder)
  if (owner.phone) {
    console.log(`[MSG91] Sending SMS to ${owner.phone}: Low stock alert for ${productName}`)
    // Real implementation would use axios/fetch to MSG91 API
  }
}
