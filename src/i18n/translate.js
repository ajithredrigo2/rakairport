import arabic from './ar.json'

export const normalize = value => value.replace(/\s+/g, ' ').trim()

// Translate display text only. Identifiers, URLs and application state stay unchanged.
export function translate(value, language = 'en') {
  if (language !== 'ar' || typeof value !== 'string') return value
  const key = normalize(value)
  if (Object.hasOwn(arabic, key)) {
    return value.match(/^\s*/)[0] + arabic[key] + value.match(/\s*$/)[0]
  }
  const noFlights = /^No (arrivals|departures) scheduled right now\.$/.exec(key)
  if (noFlights) return noFlights[1] === 'arrivals' ? 'لا توجد رحلات وصول مجدولة حالياً.' : 'لا توجد رحلات مغادرة مجدولة حالياً.'
  const noMatch = /^No flights match “(.*)”\.$/.exec(key)
  if (noMatch) return `لا توجد رحلات تطابق «${noMatch[1]}».`
  if (key.startsWith('Open ')) return `افتح ${translate(key.slice(5), language)}`
  if (key.startsWith('View ')) return `عرض ${translate(key.slice(5), language)}`
  if (key.endsWith(' location')) return `موقع ${translate(key.slice(0, -9), language)}`
  reportMissing(key)
  return value
}

/* ---------------------------------------------------------------------------
   Dev-only helper: any string that reaches translate() in Arabic without a
   dictionary entry is collected and logged once, so a missing translation is
   visible while browsing instead of silently rendering in English.
   Type  __missingAr()  in the browser console for a paste-ready JSON block.
--------------------------------------------------------------------------- */
const missing = new Set()
let missingTimer = null

function reportMissing(key) {
  if (!import.meta.env?.DEV) return
  // Ignore anything with no letters (numbers, times, flight codes, symbols).
  if (!/[A-Za-z]/.test(key) || missing.has(key)) return
  missing.add(key)
  clearTimeout(missingTimer)
  missingTimer = setTimeout(() => {
    console.warn(`[i18n] ${missing.size} string(s) have no Arabic translation. Run __missingAr() to copy them.`)
  }, 400)
}

if (import.meta.env?.DEV && typeof window !== 'undefined') {
  window.__missingAr = () => {
    const out = {}
    for (const k of [...missing].sort()) out[k] = ''
    console.log(JSON.stringify(out, null, 2))
    return out
  }
}
