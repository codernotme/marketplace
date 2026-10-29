import type { FastifyRequest, FastifyReply } from 'fastify'
import { OpenShiftSchema, CloseShiftSchema } from '@themrktplace/schema'
import { openShift, closeShift, getCurrentShift } from './service.js'
import { sendSuccess, sendCreated } from '@/utils/response.js'

export async function openShiftHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user
  const staffId = (user as any).staffId || user.sub
  const { storeId } = request.params as { storeId: string }
  const body = OpenShiftSchema.parse(request.body)
  
  const shift = await openShift(storeId, staffId, body)
  sendCreated(reply, shift)
}

export async function closeShiftHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user
  const staffId = (user as any).staffId || user.sub
  const { storeId } = request.params as { storeId: string }
  const body = CloseShiftSchema.parse(request.body)
  
  const shift = await closeShift(storeId, staffId, body)
  sendSuccess(reply, shift)
}

export async function getCurrentShiftHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user
  const staffId = (user as any).staffId || user.sub
  const { storeId } = request.params as { storeId: string }
  
  const shift = await getCurrentShift(staffId, storeId)
  sendSuccess(reply, shift)
}
