import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const SAMPLE_FLIGHTS = {
  ARR: [
    { FlightNo: '6E 1496', Airline: '6E', Airport: 'Mumbai (BOM)', City: 'Mumbai', IATA: 'BOM', Time: '14:15', Scheduled: '14:15', Estimated: '14:22', Status: 'LANDED', Date: 'Today' },
    { FlightNo: 'G9 124', Airline: 'G9', Airport: 'Cairo (CAI)', City: 'Cairo', IATA: 'CAI', Time: '15:40', Scheduled: '15:40', Estimated: '15:40', Status: 'ON TIME', Date: 'Today' },
    { FlightNo: 'IX 332', Airline: 'IX', Airport: 'Kozhikode (CCJ)', City: 'Kozhikode', IATA: 'CCJ', Time: '16:25', Scheduled: '16:25', Estimated: '16:40', Status: 'DELAYED', Date: 'Today' },
    { FlightNo: 'AI 933', Airline: 'AI', Airport: 'Delhi (DEL)', City: 'Delhi', IATA: 'DEL', Time: '18:10', Scheduled: '18:10', Estimated: '18:10', Status: 'ON TIME', Date: 'Today' },
    { FlightNo: 'FZ 451', Airline: 'FZ', Airport: 'Jeddah (JED)', City: 'Jeddah', IATA: 'JED', Time: '20:30', Scheduled: '20:30', Estimated: '20:30', Status: 'SCHEDULED', Date: 'Today' },
    { FlightNo: 'SG 81', Airline: 'SG', Airport: 'Lahore (LHE)', City: 'Lahore', IATA: 'LHE', Time: '22:15', Scheduled: '22:15', Estimated: '22:15', Status: 'SCHEDULED', Date: 'Today' },
    { FlightNo: 'G9 188', Airline: 'G9', Airport: 'Doha (DOH)', City: 'Doha', IATA: 'DOH', Time: '23:50', Scheduled: '23:50', Estimated: '23:50', Status: 'SCHEDULED', Date: 'Today' },
  ],
  DEP: [
    { FlightNo: '6E 1497', Airline: '6E', Airport: 'Mumbai (BOM)', City: 'Mumbai', IATA: 'BOM', Time: '15:30', Scheduled: '15:30', Estimated: '15:30', Status: 'BOARDING', Date: 'Today' },
    { FlightNo: 'G9 125', Airline: 'G9', Airport: 'Cairo (CAI)', City: 'Cairo', IATA: 'CAI', Time: '16:50', Scheduled: '16:50', Estimated: '16:50', Status: 'CHECK IN', Date: 'Today' },
    { FlightNo: 'IX 333', Airline: 'IX', Airport: 'Kozhikode (CCJ)', City: 'Kozhikode', IATA: 'CCJ', Time: '17:35', Scheduled: '17:35', Estimated: '17:35', Status: 'ON TIME', Date: 'Today' },
    { FlightNo: 'AI 934', Airline: 'AI', Airport: 'Delhi (DEL)', City: 'Delhi', IATA: 'DEL', Time: '19:20', Scheduled: '19:20', Estimated: '19:20', Status: 'SCHEDULED', Date: 'Today' },
    { FlightNo: 'FZ 452', Airline: 'FZ', Airport: 'Jeddah (JED)', City: 'Jeddah', IATA: 'JED', Time: '21:40', Scheduled: '21:40', Estimated: '21:40', Status: 'SCHEDULED', Date: 'Today' },
    { FlightNo: 'SG 82', Airline: 'SG', Airport: 'Lahore (LHE)', City: 'Lahore', IATA: 'LHE', Time: '23:25', Scheduled: '23:25', Estimated: '23:25', Status: 'SCHEDULED', Date: 'Today' },
  ],
}

function rakDevApiPlugin() {
  const handler = async (req, res, next) => {
    const url = new URL(req.url, 'http://' + (req.headers.host || '127.0.0.1'))
    if (url.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true }))
      return
    }

    if (url.pathname === '/chat' || url.pathname === '/.netlify/functions/chat') {
      try {
        const { handleRakiaRequest } = await import('./server/rakia-server.mjs')
        await handleRakiaRequest(req, res, url)
      } catch (err) {
        console.error('Chat endpoint error:', err)
        if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json' })
        if (!res.writableEnded) res.end(JSON.stringify({ error: 'server_error' }))
      }
      return
    }

    if (url.pathname === '/getFlights') {
      const type = url.searchParams.get('type') === 'DEP' ? 'DEP' : 'ARR'
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 1200)
        const live = await fetch(`https://api.rakairport.com/getFlights?type=${type}`, { signal: controller.signal })
        clearTimeout(timer)
        if (live.ok) {
          const data = await live.json()
          if (Array.isArray(data) && data.length > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
            res.end(JSON.stringify(data))
            return
          }
        }
      } catch {
        // Fall back to sample flights
      }
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      res.end(JSON.stringify(SAMPLE_FLIGHTS[type] || []))
      return
    }

    next()
  }

  return {
    name: 'rak-dev-api',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}

export default defineConfig(({ mode }) => {
  // The development middleware imports the server-side shuttle API directly.
  // Load non-VITE variables into the Node config process only; Vite exposes
  // browser variables solely when they start with VITE_.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return {
    plugins: [react(), tailwindcss(), rakDevApiPlugin()],
    server: {
      host: '0.0.0.0',
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
      allowedHosts: true,
    },
    preview: {
      host: '0.0.0.0',
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
      allowedHosts: true,
    },
  }
})

