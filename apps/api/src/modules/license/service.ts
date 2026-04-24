import { prisma } from '@/lib/prisma.js'
import { redis } from '@/lib/redis.js'

const CACHE_TTL = 3600 // 1 hour

export async function getTenantLicenses(tenantId: string) {
  const cacheKey = `licenses:${tenantId}`
  const cached = await redis.get(cacheKey)
  
  if (cached) {
    return JSON.parse(cached)
  }

  const licenses = await prisma.license.findMany({ where: { tenantId } })
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(licenses))
  
  return licenses
}

export async function updateLicense(tenantId: string, id: string, data: any) {
  const license = await prisma.license.update({
    where: { id, tenantId },
    data,
  })

  // Invalidate cache
  await redis.del(`licenses:${tenantId}`)
  
  return license
}
