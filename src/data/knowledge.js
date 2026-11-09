/**
 * Self-contained knowledge base for the on-site assistant.
 * It flattens all page content (from pages.js) plus the standalone pages into a
 * searchable index, so the chatbot answers from THIS website's own content -  * no external API, no key, fully client-side.
 */
import { pages } from './pages.js'

const STOP = new Set(
  'a an the of to for in on at is are am be do does i we you my me our your it its this that these those with and or how what which when where who can could would should need want about get from please tell show give any some'.split(' '),
)

// Query synonyms → expand user words to the vocabulary used on the site.
export const SYN = {
  phone: 'telephone contact', number: 'telephone contact', call: 'telephone contact', tel: 'telephone',
  email: 'email contact', mail: 'email contact', feedback: 'complaints feedback email',
  price: 'rate aed charge fee cost tariff', prices: 'rate aed charge tariff', cost: 'rate aed charge fee',
  fee: 'rate aed charge', charges: 'rate aed charge', charge: 'rate aed', rate: 'aed tariff', tariff: 'rate aed',
  wifi: 'wi-fi internet connectivity', internet: 'wi-fi connectivity', '4g': 'connectivity wi-fi',
  car: 'parking taxi rental', park: 'parking', parking: 'parking car tariff rate',
  taxi: 'taxi rental transport', rental: 'car rental dice',
  bus: 'shuttle bus transport rakta', shuttle: 'bus shuttle free transport',
  transport: 'transport bus shuttle taxi rakta',
  food: 'dining restaurant cafe cafeteria', eat: 'dining restaurant cafe', restaurant: 'dining cafe restaurant',
  drink: 'bar cafe beverage', coffee: 'cafe cafeteria coffee', cafe: 'cafeteria coffee',
  shop: 'duty free shopping retail shops', shopping: 'duty free retail shops', dutyfree: 'duty free',
  hotel: 'hotel resort stay accommodation', hotels: 'hotel resort stay', stay: 'hotel resort accommodation',
  flight: 'flight arrival departure', flights: 'flight arrivals departures', fly: 'flight',
  arrival: 'arrival arriving flight', arriving: 'arrival flight', departure: 'departure departing flight',
  checkin: 'check-in counters', 'check-in': 'check-in counters',
  baggage: 'baggage luggage', luggage: 'baggage luggage check-in', bag: 'baggage luggage', bags: 'baggage luggage',
  prohibited: 'prohibited restricted items', liquids: 'liquids cabin baggage',
  cargo: 'cargo freight import export shipping', freight: 'cargo freight', ship: 'cargo shipping freight',
  vip: 'vip lounge handling', lounge: 'lounge vip business',
  job: 'careers job internship', jobs: 'careers internship', career: 'careers internship',
  internship: 'internship careers student graduate', work: 'careers job',
  map: 'map terminal location directions', location: 'location map address coordinates', directions: 'map location',
  smoke: 'smoking', smoking: 'smoking rooms',
  pray: 'worship prayer mosque', prayer: 'worship prayer mosque', mosque: 'worship prayer',
  medical: 'medical nurse ambulance hospital', hospital: 'medical hospital emergency', emergency: 'medical hospital emergency',
  disabled: 'disabled accessibility wheelchair assistance', wheelchair: 'disabled accessibility assistance',
  vat: 'vat refund tax planet', tax: 'vat refund tax free',
  business: 'business opportunities advertising retail office', advertise: 'advertising media',
  jais: 'jebel jais mountain adventure zipline', mountain: 'jebel jais mountain adventure',
  beach: 'beach island beaches', desert: 'desert safari dune',
}

function add(arr, title, text, path, page) {
  if (title || text) arr.push({ title: title || page, text: text || '', path, page })
}

function buildIndex() {
  const idx = []

  // Standalone / high-value entries
  add(idx, 'Contact & Information Desk',
    'Telephone +971 7 2075200 and +971 7 2075208. Fax +971 7 2448199. Email info@rakairport.com. Complaints & suggestions feedback@rakairport.com. AFTN OMRKYAYX. P.O. Box 501, Ras Al Khaimah. Coordinates 25°36ʹ48ʺN, 55°56ʹ20ʺE.',
    '/contact', 'Contact')
  add(idx, 'Flight Information',
    'Check live arrival and departure times, check-in information, gates and flight status. You can search flights by city, flight number or airline.',
    '/flights', 'Flight Information')
  add(idx, 'Terminal & Location Map',
    'Terminal map with check-in counters, security, immigration, duty free, dining, lounge, boarding gates, baggage claim, customs and car rentals across the departures and arrivals levels.',
    '/map', 'Location Map')
  add(idx, 'Airport hours',
    'The airport and air traffic control operate 24 hours a day, 7 days a week.',
    '/operations', 'Operating Rules & Regulations')

  const label = (slug) => (pages[slug].hero && pages[slug].hero.title) || slug

  for (const slug of Object.keys(pages)) {
    const cfg = pages[slug]
    const path = '/' + slug
    const page = label(slug)
    if (cfg.hero) add(idx, page, cfg.hero.subtitle || '', path, page)

    for (const s of cfg.sections || []) {
      if (typeof s.text === 'string') {
        add(idx, [s.title, s.highlight].filter(Boolean).join(' ') || page, s.text, path, page)
      }
      for (const it of s.items || []) {
        const t = [it.text, ...(it.points || [])].filter(Boolean).join('. ')
        add(idx, it.title, t, path, page)
      }
      if (s.rates && s.rates.length) {
        const summary = s.rates.map((r) => `${r.label}: ${r.value}`).join('; ')
        const mem = s.membership
          ? `. Membership rates: ${(s.membership.rows || []).map((r) => `${r.period} ${r.price}`).join(', ')}`
          : ''
        add(idx, `${page} rates & tariffs`, summary + mem, path, page)
        for (const r of s.rates) add(idx, `${page} - ${r.label}`, r.value, path, page)
      }
      if (s.membership) {
        for (const row of s.membership.rows || []) add(idx, `${page} membership - ${row.period}`, row.price, path, page)
      }
      for (const c of s.cards || []) {
        const t = (c.facts || []).map((f) => f.text).join(', ')
        add(idx, c.title, t, path, page)
      }
      for (const g of s.groups || []) {
        const subs = g.sections || [{ heading: g.heading, links: g.links }]
        for (const sub of subs) for (const l of sub.links || []) add(idx, l.label, l.url, path, page)
      }
    }
  }
  return idx
}

const INDEX = buildIndex()

const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9\s+&-]/g, ' ')
const stem = (w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w)

// Build a Set of whole words (plus singular stems) from a string.
function wordSet(s) {
  const set = new Set()
  for (const w of norm(s).split(/\s+/)) {
    if (!w || w.length < 2) continue
    set.add(w)
    set.add(stem(w))
  }
  return set
}

// Pre-compute word sets per entry so matching is by whole word, not substring
// (prevents e.g. "car" matching "cargo").
INDEX.forEach((e) => {
  e._t = wordSet(e.title)
  e._p = wordSet(e.page)
  e._x = wordSet(e.text)
})

// Vocabulary of every word on the site (+ synonym words) for typo correction.
const VOCAB = new Set()
INDEX.forEach((e) => {
  for (const s of [e._t, e._p, e._x]) for (const w of s) VOCAB.add(w)
})
for (const k of Object.keys(SYN)) {
  VOCAB.add(k)
  for (const w of SYN[k].split(' ')) VOCAB.add(w)
}

// Bounded Levenshtein edit distance.
function lev(a, b) {
  const m = a.length, n = b.length
  if (Math.abs(m - n) > 2) return 3
  const dp = Array.from({ length: m + 1 }, (_, i) => i)
  for (let j = 1; j <= n; j++) {
    let prev = dp[0]
    dp[0] = j
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i]
      dp[i] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[i], dp[i - 1])
      prev = tmp
    }
  }
  return dp[m]
}

// Closest real site word to a mistyped token (e.g. "lugage" -> "luggage").
function nearest(w) {
  if (w.length < 4) return null
  const maxD = w.length <= 5 ? 1 : 2
  let best = null
  let bestD = maxD + 1
  for (const v of VOCAB) {
    if (v.length < 3 || v[0] !== w[0] || Math.abs(v.length - w.length) > maxD) continue
    const d = lev(w, v)
    if (d < bestD) {
      bestD = d
      best = v
      if (d === 1) break
    }
  }
  return bestD <= maxD ? best : null
}

function tokens(q) {
  const base = norm(q).split(/\s+/).filter((w) => w && w.length > 1 && !STOP.has(w))
  const out = []
  for (let w of base) {
    if (!VOCAB.has(w) && !VOCAB.has(stem(w)) && !SYN[w]) {
      const fixed = nearest(w)
      if (fixed) w = fixed
    }
    out.push(w)
    const key = w.replace(/-/g, '')
    if (SYN[w]) out.push(...SYN[w].split(' '))
    else if (SYN[key]) out.push(...SYN[key].split(' '))
  }
  return [...new Set(out.map(stem))]
}

/**
 * Produce a plain-text digest of ALL site content, used to ground the
 * server-side AI assistant. This is the ONLY source the assistant may answer
 * from - see netlify/functions/chat.js.
 */
export function getKnowledgeText() {
  return getKnowledgeEntries()
    .map((e) => (e.text ? `[${e.page}] ${e.title}: ${e.text}` : `[${e.page}] ${e.title}`))
    .join('\n')
}

/** Deduped, plain array of site entries - used by the serverless AI function
 *  for per-question retrieval (so it sends only relevant content). */
export function getKnowledgeEntries() {
  const seen = new Set()
  const out = []
  for (const e of INDEX) {
    const text = (e.text || '').replace(/\s+/g, ' ').trim()
    const key = e.title + '|' + text
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ title: e.title, page: e.page, path: e.path, text })
  }
  return out
}

export function searchKB(query) {
  const qt = tokens(query)
  if (!qt.length) return []
  const scored = []
  for (const e of INDEX) {
    let sc = 0
    for (const w of qt) {
      if (e._t.has(w)) sc += 3
      if (e._p.has(w)) sc += 2
      if (e._x.has(w)) sc += 1
    }
    if (sc > 0) scored.push({ e, sc })
  }
  scored.sort((a, b) => b.sc - a.sc)
  const seen = new Set()
  const out = []
  for (const { e } of scored) {
    const k = e.title + e.path
    if (seen.has(k)) continue
    seen.add(k)
    out.push(e)
    if (out.length >= 5) break
  }
  return out
}
