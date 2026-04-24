import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { authorize } from '@/middleware/authorize.js'
import { getEndOfDayReport, getInventoryReport, exportGstr1ToCSV } from './service.js'

export async function reportRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)
  app.addHook('onRequest', authorize('MANAGER', 'OWNER'))

  app.get('/eod', async (request, reply) => {
    const user = request.user as { tenantId: string }
    const { storeId, date } = request.query as { storeId: string; date: string }
    const report = await getEndOfDayReport(user.tenantId, storeId, date)
    void reply.send({ success: true, data: report })
  })

  app.get('/inventory', async (request, reply) => {
    const user = request.user as { tenantId: string }
    const { storeId } = request.query as { storeId: string }
    const report = await getInventoryReport(user.tenantId, storeId)
    void reply.send({ success: true, data: report })
  })

  app.get('/export-gstr1', async (request, reply) => {
    const user = request.user as { tenantId: string }
    const { startDate, endDate } = request.query as { startDate: string; endDate: string }
    const csv = await exportGstr1ToCSV(user.tenantId, startDate, endDate)
    
    void reply
      .header('Content-Type', 'text/csv')
      .header('Content-Disposition', `attachment; filename=GSTR1_${startDate}_${endDate}.csv`)
      .send(csv)
  })

  app.get('/commissions', async (request, reply) => {
    const user = request.user as { tenantId: string }
    const { getStaffPerformanceReport } = await import('./service.js')
    const report = await getStaffPerformanceReport(user.tenantId)
    void reply.send({ success: true, data: report })
  })
}
