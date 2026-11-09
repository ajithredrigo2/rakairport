import { useEffect, useState } from 'react'
import { normalizeFlight } from '../data/flights.js'

// Always use the same-origin endpoint. Vite serves it locally in development
// and IIS proxies it to the FIDS service on 127.0.0.1:3000 in production.
// This prevents browser CORS failures and keeps the FIDS origin private.
const API_BASE = import.meta.env.VITE_API_BASE ?? ''

const REFRESH_MS = 60_000

/**
 * Live arrivals or departures.
 * @param {'arrival'|'departure'} type
 * @returns {{flights: object[], loading: boolean, error: string|null}}
 */
export function useFlights(type) {
  const [state, setState] = useState({ flights: [], loading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    setState({ flights: [], loading: true, error: null })

    async function load() {
      try {
        const res = await fetch(
          `${API_BASE}/getFlights?type=${type === 'arrival' ? 'ARR' : 'DEP'}`,
          { signal: controller.signal },
        )
        if (!res.ok) throw new Error(`Flight data unavailable (${res.status})`)
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('Unexpected response from flight service')
        if (!cancelled) {
          setState({ flights: data.map(normalizeFlight), loading: false, error: null })
        }
      } catch (err) {
        if (cancelled || err.name === 'AbortError') return
        // Keep whatever is on screen; a failed refresh shouldn't blank the board.
        setState((s) => ({ ...s, loading: false, error: err.message }))
      }
    }

    load()
    const id = setInterval(load, REFRESH_MS)
    return () => {
      cancelled = true
      controller.abort()
      clearInterval(id)
    }
  }, [type])

  return state
}
