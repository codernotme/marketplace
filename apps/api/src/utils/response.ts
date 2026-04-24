import type { FastifyReply } from 'fastify'
import type { ApiSuccess, PaginatedResponse } from '@themrktplace/types'

export function sendSuccess<T>(reply: FastifyReply, data: T, statusCode = 200): void {
  const body: ApiSuccess<T> = { success: true, data }
  void reply.code(statusCode).send(body)
}

export function sendCreated<T>(reply: FastifyReply, data: T): void {
  sendSuccess(reply, data, 201)
}

export function sendPaginated<T>(
  reply: FastifyReply,
  items: T[],
  total: number,
  page: number,
  pageSize: number
): void {
  const body: ApiSuccess<PaginatedResponse<T>> = {
    success: true,
    data: {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  }
  void reply.code(200).send(body)
}
