import type { FastifyRequest, FastifyReply } from 'fastify'
import { UpdateOnboardingSchema, UpdateBusinessSettingsSchema, UpdateStoreSchema } from '@themrktplace/schema'
import { updateOnboarding, updateBusinessProfile, updateStore, getBusinessStatus } from './service.js'
import { sendSuccess } from '@/utils/response.js'

export async function getBusinessStatusHandler(_request: FastifyRequest, reply: FastifyReply) {
  const result = await getBusinessStatus()
  sendSuccess(reply, result)
}

export async function updateOnboardingHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = UpdateOnboardingSchema.parse(request.body)
  const result = await updateOnboarding(body)
  sendSuccess(reply, result)
}

export async function updateBusinessProfileHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = UpdateBusinessSettingsSchema.parse(request.body)
  const result = await updateBusinessProfile(body)
  sendSuccess(reply, result)
}

export async function updateStoreHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const body = UpdateStoreSchema.parse(request.body)
  const result = await updateStore(id, body)
  sendSuccess(reply, result)
}

