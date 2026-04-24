import bcrypt from 'bcryptjs'
import type { FastifyRequest } from 'fastify'
import type { LoginInput, RegisterInput } from '@themrktplace/schema'
import { prisma } from '@/lib/prisma.js'
import { UnauthorizedError, ConflictError, NotFoundError } from '@/utils/errors.js'

export async function loginUser(body: LoginInput) {
  const user = await prisma.user.findFirst({
    where: { email: body.email, isActive: true },
    include: { tenant: true },
  })

  if (!user) throw new UnauthorizedError('Invalid email or password')

  const valid = await bcrypt.compare(body.password, user.passwordHash)
  if (!valid) throw new UnauthorizedError('Invalid email or password')

  return user
}

export async function registerTenant(body: RegisterInput) {
  const existing = await prisma.tenant.findUnique({ where: { slug: body.tenantSlug } })
  if (existing) throw new ConflictError('A business with this slug already exists')

  const passwordHash = await bcrypt.hash(body.password, 12)

  const tenant = await prisma.tenant.create({
    data: {
      name: body.tenantName,
      slug: body.tenantSlug,
      users: {
        create: {
          email: body.email,
          name: body.name,
          passwordHash,
          role: 'owner',
        },
      },
      licenses: {
        create: [
          { module: 'pos', isActive: true },
          { module: 'inventory', isActive: true },
          { module: 'sales', isActive: true },
          { module: 'customers', isActive: false },
          { module: 'staff', isActive: false },
          { module: 'reports', isActive: false },
          { module: 'ecommerce', isActive: false },
        ],
      },
    },
  })

  return { tenantId: tenant.id }
}

export async function refreshAccessToken(token: string) {
  const record = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!record || record.expiresAt < new Date()) {
    throw new UnauthorizedError('Refresh token expired or invalid')
  }

  return record.user
}

export async function logoutUser(token: string) {
  await prisma.refreshToken.deleteMany({ where: { token } })
}
