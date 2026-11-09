/**
 * Dedicated Standalone Node.js server for RAK Airport Shuttle Bus & Admin Operations API.
 *
 * Dedicated Port Architecture:
 * - Port 3000: Reserved for Production FIDS Flight API (/getFlights)
 * - Port 3001: Reserved for Chatbot AI Server (/chat)
 * - Port 3002: Dedicated Shuttle Bus Service & Admin Operations API (/bus-service-api/*)
 * - Port 5173: Local Vite frontend development (npm run dev)
 *
 * Run:
 *   node --env-file=.env server/bus-service-server.mjs
 *   (or npm run bus:server)
 */
import { createServer } from 'node:http'
import { handleBusServiceRequest } from './bus-service.mjs'

const PORT = parseInt(process.env.BUS_SERVICE_PORT || '3002', 10)
const HOST = process.env.BUS_SERVICE_HOST || '127.0.0.1'

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`)

  // Health check endpoint for IIS ARR / uptime monitors
  if (url.pathname === '/health' || url.pathname === '/bus-service-api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      ok: true,
      service: 'rak-airport-bus-service-admin',
      port: PORT,
      timestamp: new Date().toISOString(),
    }))
    return
  }

  // Shuttle bus public and protected admin API endpoints
  if (url.pathname.startsWith('/bus-service-api')) {
    try {
      await handleBusServiceRequest(req, res, url)
    } catch (err) {
      console.error('[BusServiceServer] Request handler error:', err)
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
      }
      if (!res.writableEnded) {
        res.end(JSON.stringify({ error: 'server_error', message: err.message }))
      }
    }
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'not_found' }))
})

server.listen(PORT, HOST, () => {
  console.log(`[BusServiceServer] Shuttle Bus & Admin API server listening on http://${HOST}:${PORT}`)
  console.log(`[BusServiceServer] Dedicated port: ${PORT} (Port 3000 = Flight API, Port 3001 = Chatbot AI)`)
})

export default server
