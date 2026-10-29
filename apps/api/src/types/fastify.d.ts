import 'fastify'
import type { UserRole } from '@themrktplace/types'

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      sub: string
      role: UserRole
      storeId?: string
      staffId?: string
    }
    jwtVerify(): Promise<void>
  }
  interface FastifyReply {
    jwtSign(payload: any, options?: any): Promise<string>
  }
}
