/**
 * Rakia AI server — standalone Node.js (no dependencies, Node 18+).
 *
 * Hosts the RAK Airport assistant AI endpoint on YOUR OWN server (e.g. the
 * Jenkins host / any VM). The website (hosted elsewhere) calls this over HTTP.
 * Strictly grounded in this site's content (site-knowledge.json), using free Groq.
 *
 * Run:
 *   GROQ_API_KEY=gsk_xxx PORT=3001 node rakia-server.mjs
 *   (site-knowledge.json must sit next to this file)
 *
 * Health:       GET  http://127.0.0.1:3001/health (local process check only)
 * Chat:         POST http://host:3001/chat   { "messages": [{ "from": "user", "text": "..." }] }
 *
 * The GROQ_API_KEY stays on the server; it is never sent to the browser.
 * Put this behind your reverse proxy (nginx) or a subdomain, ideally over HTTPS.
 */
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || '127.0.0.1'
const KEY = process.env.GROQ_API_KEY || ''
const GEMINI_KEY = process.env.GEMINI_API_KEY || ''
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || 'https://www.rakairport.com'
const GROQ_MODEL = 'llama-3.3-70b-versatile'
const GEMINI_MODEL = 'gemini-2.0-flash'
const MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES || 24_000)
const MAX_MESSAGE_CHARS = Number(process.env.MAX_MESSAGE_CHARS || 2_000)
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000)
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 20)
const RATE_LIMIT_MAX_BUCKETS = Number(process.env.RATE_LIMIT_MAX_BUCKETS || 10_000)
const TRUST_PROXY = process.env.TRUST_PROXY === 'true'

const kb = JSON.parse(readFileSync(resolve(here, 'site-knowledge.json'), 'utf8'))
const SITE_ENTRIES = kb.entries
const SYN = kb.syn

const RULES = `You are Rakia, the official virtual assistant for Ras Al Khaimah International Airport (RAK). If asked your name, say you are Rakia.

Answer the visitor's question using ONLY the RAK Airport website information provided below.
Rules:
- Use ONLY the information between <site> and </site>. Do NOT use outside knowledge.
- If the answer is not in the site information, say: "I'm sorry, I don't have that information on the website. You can contact the airport at +971 7 2075200 or info@rakairport.com." Do not guess or make up details.
- Be concise, friendly and helpful. Prefer 1-4 short sentences.
- Give exact figures (rates, phone numbers, times) exactly as written in the site information.
- Only answer questions about Ras Al Khaimah International Airport, its services, and travel/visitor info covered on the site. Politely decline unrelated topics.`

/* ---- Retrieval (whole-word + synonym + typo correction) ---- */
const STOP = new Set('a an the of to for in on at is are be do i we you my me our your it this that with and or how what which when where who can could would should need want about get from please tell show give any some'.split(' '))
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9\s+&-]/g, ' ')
const stem = (w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w)
function wordSet(s) {
  const set = new Set()
  for (const w of norm(s).split(/\s+/)) {
    if (!w || w.length < 2) continue
    set.add(w); set.add(stem(w))
  }
  return set
}
const ENTRIES = SITE_ENTRIES.map((e) => ({ ...e, _t: wordSet(e.title), _x: wordSet(e.text), _p: wordSet(e.page) }))
const VOCAB = new Set()
for (const e of ENTRIES) for (const s of [e._t, e._x, e._p]) for (const w of s) VOCAB.add(w)
for (const k of Object.keys(SYN)) { VOCAB.add(k); for (const w of SYN[k].split(' ')) VOCAB.add(w) }

function lev(a, b) {
  const m = a.length, n = b.length
  if (Math.abs(m - n) > 2) return 3
  const dp = Array.from({ length: m + 1 }, (_, i) => i)
  for (let j = 1; j <= n; j++) {
    let prev = dp[0]; dp[0] = j
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i]
      dp[i] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[i], dp[i - 1])
      prev = tmp
    }
  }
  return dp[m]
}
function nearest(w) {
  if (w.length < 4) return null
  const maxD = w.length <= 5 ? 1 : 2
  let best = null, bestD = maxD + 1
  for (const v of VOCAB) {
    if (v.length < 3 || v[0] !== w[0] || Math.abs(v.length - w.length) > maxD) continue
    const d = lev(w, v)
    if (d < bestD) { bestD = d; best = v; if (d === 1) break }
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
function retrieve(query, limit = 14) {
  const qt = tokens(query)
  if (!qt.length) return []
  const scored = []
  for (const e of ENTRIES) {
    let sc = 0
    for (const w of qt) {
      if (e._t.has(w)) sc += 3
      if (e._p.has(w)) sc += 2
      if (e._x.has(w)) sc += 1
    }
    if (sc > 0) scored.push({ e, sc })
  }
  scored.sort((a, b) => b.sc - a.sc)
  return scored.slice(0, limit).map(({ e }) => e)
}
function buildContext(query) {
  const hits = retrieve(query)
  const contact = SITE_ENTRIES.find((e) => e.path === '/contact')
  if (contact && !hits.some((h) => h.path === '/contact')) hits.push(contact)
  return hits.map((e) => (e.text ? `[${e.page}] ${e.title}: ${e.text}` : `[${e.page}] ${e.title}`)).join('\n')
}

async function askGroq(system, turns) {
  const messages = [
    { role: 'system', content: system },
    ...turns.map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text })),
  ]
  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model: GROQ_MODEL, messages, temperature: 0.2, max_tokens: 500 }),
  })
  if (!resp.ok) throw new Error('groq ' + resp.status + ' ' + (await resp.text().catch(() => '')))
  const data = await resp.json()
  return (data?.choices?.[0]?.message?.content || '').trim()
}

async function askGemini(key, system, turns) {
  const contents = turns.map((m) => ({ role: m.from === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }))
  while (contents.length && contents[0].role !== 'user') contents.shift()
  if (!contents.length) throw new Error('bad_request')

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents,
        generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
      }),
    },
  )
  if (!resp.ok) throw new Error('gemini ' + resp.status + ' ' + (await resp.text().catch(() => '')))
  const data = await resp.json()
  return (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim()
}

function localFallbackReply(query) {
  const hits = retrieve(query, 3)
  if (hits.length && hits[0].text) {
    return hits[0].text
  }
  return "I'm sorry, I don't have that information on the website. You can contact the airport at +971 7 2075200 or info@rakairport.com."
}

/* ---- HTTP server ---- */
function getCors(req) {
  const origin = req?.headers?.origin || ALLOW_ORIGIN
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}
const send = (res, status, obj, req) =>
  res.writeHead(status, { 'Content-Type': 'application/json', ...getCors(req) }).end(JSON.stringify(obj))

const requestBuckets = new Map()
let lastBucketSweep = 0
function clientIp(req) {
  if (TRUST_PROXY) {
    const forwarded = req.headers['x-forwarded-for']
    if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0].trim()
  }
  return req.socket.remoteAddress || 'unknown'
}
function isRateLimited(req) {
  const now = Date.now()
  if (now - lastBucketSweep >= RATE_LIMIT_WINDOW_MS || requestBuckets.size >= RATE_LIMIT_MAX_BUCKETS) {
    for (const [key, value] of requestBuckets) {
      if (now - value.started >= RATE_LIMIT_WINDOW_MS) requestBuckets.delete(key)
    }
    while (requestBuckets.size >= RATE_LIMIT_MAX_BUCKETS) requestBuckets.delete(requestBuckets.keys().next().value)
    lastBucketSweep = now
  }
  const ip = clientIp(req)
  const bucket = requestBuckets.get(ip)
  if (!bucket || now - bucket.started >= RATE_LIMIT_WINDOW_MS) {
    requestBuckets.set(ip, { started: now, count: 1 })
    return false
  }
  bucket.count += 1
  return bucket.count > RATE_LIMIT_MAX
}
function hasAllowedOrigin(req) {
  const origin = req.headers.origin
  if (!origin) return true
  if (origin === ALLOW_ORIGIN) return true
  if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.endsWith('.run.app') || origin.endsWith('.aistudio.google')) return true
  return process.env.NODE_ENV !== 'production'
}

export async function handleRakiaRequest(req, res, url = new URL(req.url, 'http://' + (req.headers.host || 'localhost:3000'))) {
  if (req.method === 'GET' && url.pathname === '/health') {
    send(res, 200, { ok: true }, req)
    return true
  }
  if (url.pathname !== '/chat' && url.pathname !== '/.netlify/functions/chat') {
    send(res, 404, { error: 'not_found' }, req)
    return true
  }
  if (!hasAllowedOrigin(req)) {
    send(res, 403, { error: 'origin_not_allowed' }, req)
    return true
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204, getCors(req)).end()
    return true
  }

  if (req.method !== 'POST') {
    send(res, 405, { error: 'method_not_allowed' }, req)
    return true
  }
  if (isRateLimited(req)) {
    res.writeHead(429, { 'Retry-After': '60', ...getCors(req) }).end(JSON.stringify({ error: 'rate_limited' }))
    return true
  }
  if (Number(req.headers['content-length']) > MAX_BODY_BYTES) {
    send(res, 413, { error: 'payload_too_large' }, req)
    return true
  }

  let body = ''
  let bodyBytes = 0
  let bodyTooLarge = false
  req.on('data', (c) => {
    bodyBytes += c.length
    if (bodyBytes > MAX_BODY_BYTES) return void (bodyTooLarge = true)
    body += c
  })
  req.on('end', async () => {
    if (bodyTooLarge) return send(res, 413, { error: 'payload_too_large' }, req)
    let messages
    try { ({ messages } = JSON.parse(body)) } catch { return send(res, 400, { error: 'bad_request' }, req) }
    if (!Array.isArray(messages) || !messages.length) return send(res, 400, { error: 'bad_request' }, req)
    const turns = messages.slice(-8)
      .filter((m) => m && m.from === 'user' && typeof m.text === 'string' && m.text.trim())
      .slice(-4)
    if (!turns.length) return send(res, 400, { error: 'bad_request' }, req)
    if (turns.some((m) => m.text.length > MAX_MESSAGE_CHARS)) return send(res, 413, { error: 'message_too_large' }, req)
    const lastUser = [...turns].reverse().find((m) => m.from === 'user')?.text || turns[turns.length - 1].text
    const system = `${RULES}\n\n<site>\n${buildContext(lastUser)}\n</site>`
    try {
      let text = ''
      if (KEY) {
        text = await askGroq(system, turns)
      } else if (GEMINI_KEY) {
        text = await askGemini(GEMINI_KEY, system, turns)
      } else {
        text = localFallbackReply(lastUser)
      }
      if (!text) text = localFallbackReply(lastUser)
      send(res, 200, { text }, req)
    } catch (err) {
      console.error('chat error:', err.message)
      const text = localFallbackReply(lastUser)
      send(res, 200, { text }, req)
    }
  })
  return true
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  createServer((req, res) => {
    handleRakiaRequest(req, res)
  }).listen(PORT, HOST, () => {
    console.log(`Rakia AI server on ${HOST}:${PORT} (Groq: ${KEY ? 'set' : 'none'}, Gemini: ${GEMINI_KEY ? 'set' : 'none'})`)
  })
}
