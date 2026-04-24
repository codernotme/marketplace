import type { FastifyRequest, FastifyReply } from 'fastify'
import { OpenShiftSchema, CloseShiftSchema } from '@themrktplace/schema'
import { openShift, closeShift, getCurrentShift } from './service.js'
import { sendSuccess, sendCreated } from '@/utils/response.js'

export async function openShiftHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { tenantId: string; staffId: string }
  const { storeId } = request.params as { storeId: string }
  const body = OpenShiftSchema.parse(request.body)
  
  const shift = await openShift(user.tenantId, storeId, user.staffId, body)
  sendCreated(reply, shift)
}

export async function closeShiftHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { tenantId: string; staffId: string }
  const { storeId } = request.params as { storeId: string }
  const body = CloseShiftSchema.parse(request.body)
  
  const shift = await closeShift(user.tenantId, storeId, user.staffId, body)
  sendSuccess(reply, shift)
}

export async function getCurrentShiftHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { staffId: string }
  const { storeId } = request.params as { storeId: string }
  
  const shift = await getCurrentShift(user.staffId, storeId)
  sendSuccess(reply, shift)
}
