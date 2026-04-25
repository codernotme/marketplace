import { buildApp } from './app.js'

const PORT = parseInt(process.env['PORT'] ?? '3001', 10)
const HOST = process.env['HOST'] ?? '0.0.0.0'

const app = buildApp()

app.listen({ port: PORT, host: HOST }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  console.log(`[API] Server listening on http://localhost:${PORT}`)
  console.log(`[API] Docs available at http://localhost:${PORT}/docs`)
})
