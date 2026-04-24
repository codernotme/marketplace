import 'fastify'
import type { UserRole } from '@themrktplace/types'

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      sub: string
      tenantId: string
      role: UserRole
    }
    jwtVerify(): Promise<void>
  }
  interface FastifyReply {
    jwtSign(payload: any, options?: any): Promise<string>
  }
}
