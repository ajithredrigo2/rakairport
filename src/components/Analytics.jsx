import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID
const CONSENT_KEY = 'rak-analytics-consent'

function savedConsent() {
  try { return localStorage.getItem(CONSENT_KEY) }
  catch { return null }
}

function loadAnalytics() {
  if (window.__rakAnalyticsLoaded) return
  window.__rakAnalyticsLoaded = true
  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`
  document.head.appendChild(script)
}

/** Optional GA4 integration. It remains inactive until an ID and visitor consent exist. */
export default function Analytics() {
  const { pathname } = useLocation()
  const [consent, setConsent] = useState(savedConsent)
  const enabled = /^G-[A-Z0-9]+$/i.test(MEASUREMENT_ID || '')

  useEffect(() => {
    if (!enabled || consent !== 'accepted') return
    loadAnalytics()
    window.gtag('config', MEASUREMENT_ID, { page_path: pathname })
  }, [consent, enabled, pathname])

  if (!enabled || consent) return null
  const choose = (value) => {
    try { localStorage.setItem(CONSENT_KEY, value) } catch { /* Browser storage may be unavailable. */ }
    setConsent(value)
  }

  return (
    <aside className="fixed inset-x-4 bottom-4 z-[250] mx-auto max-w-xl rounded-2xl bg-ink p-5 text-sm text-white shadow-2xl sm:flex sm:items-center sm:gap-5" aria-label="Cookie preference">
      <p className="leading-relaxed text-white/85">We use optional analytics cookies to understand how visitors use this website.</p>
      <div className="mt-4 flex shrink-0 gap-2 sm:mt-0">
        <button type="button" onClick={() => choose('rejected')} className="rounded-lg border border-white/30 px-3 py-2 font-medium text-white">Reject</button>
        <button type="button" onClick={() => choose('accepted')} className="rounded-lg bg-brand-500 px-3 py-2 font-semibold text-white">Accept</button>
      </div>
    </aside>
  )
}
