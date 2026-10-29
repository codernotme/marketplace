import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/authenticate.js'
import { authorize } from '@/middleware/authorize.js'
import { getEndOfDayReport, getInventoryReport, exportGstr1ToCSV, getStaffPerformanceReport } from './service.js'

export async function reportRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)
  app.addHook('onRequest', authorize('MANAGER', 'OWNER'))

  app.get('/eod', async (request, reply) => {
    const { storeId, date } = request.query as { storeId: string; date: string }
    const report = await getEndOfDayReport(storeId, date)
    void reply.send({ success: true, data: report })
  })

  app.get('/inventory', async (request, reply) => {
    const { storeId } = request.query as { storeId: string }
    const report = await getInventoryReport(storeId)
    void reply.send({ success: true, data: report })
  })

  app.get('/export-gstr1', async (request, reply) => {
    const { startDate, endDate } = request.query as { startDate: string; endDate: string }
    const csv = await exportGstr1ToCSV(startDate, endDate)
    
    void reply
      .header('Content-Type', 'text/csv')
      .header('Content-Disposition', `attachment; filename=GSTR1_${startDate}_${endDate}.csv`)
      .send(csv)
  })

  app.get('/commissions', async (_request, reply) => {
    const report = await getStaffPerformanceReport()
    void reply.send({ success: true, data: report })
  })
}
