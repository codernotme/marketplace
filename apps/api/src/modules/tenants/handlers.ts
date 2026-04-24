import type { FastifyRequest, FastifyReply } from 'fastify'
import { UpdateOnboardingSchema, UpdateTenantProfileSchema, UpdateStoreSchema } from '@themrktplace/schema'
import { updateOnboarding, updateTenantProfile, updateStore, getTenantStatus } from './service.js'
import { sendSuccess } from '@/utils/response.js'

export async function getTenantStatusHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { tenantId: string }
  const result = await getTenantStatus(user.tenantId)
  sendSuccess(reply, result)
}

export async function updateOnboardingHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { tenantId: string }
  const body = UpdateOnboardingSchema.parse(request.body)
  const result = await updateOnboarding(user.tenantId, body)
  sendSuccess(reply, result)
}

export async function updateTenantProfileHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { tenantId: string }
  const body = UpdateTenantProfileSchema.parse(request.body)
  const result = await updateTenantProfile(user.tenantId, body)
  sendSuccess(reply, result)
}

export async function updateStoreHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { tenantId: string }
  const { id } = request.params as { id: string }
  const body = UpdateStoreSchema.parse(request.body)
  const result = await updateStore(user.tenantId, id, body)
  sendSuccess(reply, result)
}
