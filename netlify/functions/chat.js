/**
 * RAK Airport AI assistant - serverless (Netlify Function).
 *
 * Answers visitor questions using a FREE LLM API, strictly grounded in this
 * website's own content. For each question it retrieves only the RELEVANT site
 * entries (keyword + synonym match) and sends just those - so it stays fast and
 * well within free-tier token limits. If the answer isn't in the site content,
 * the assistant says so and gives the airport contact.
 *
 * Providers (set whichever free key you have; server-side only):
 *   - GROQ_API_KEY    → Groq. Key: https://console.groq.com/keys  (gsk_...)
 *   - GEMINI_API_KEY  → Google Gemini. Key: https://aistudio.google.com/apikey  (AIza...)
 * If both are set, Groq is used. If neither is set (or the API errors), the
 * client falls back to on-site search - nothing breaks.
 *
 * Local: put the key in a .env file and run `netlify dev`.
 * Deploy: Netlify → Site settings → Environment variables.
 */
import { SITE_ENTRIES, SYN } from './_site-knowledge.js'

const GROQ_MODEL = 'llama-3.3-70b-versatile'
const GEMINI_MODEL = 'gemini-2.0-flash'
const MAX_BODY_BYTES = 24_000
const MAX_MESSAGE_CHARS = 2_000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 20
const requestBuckets = new Map()

const RULES = `You are Rakia, the official virtual assistant for Ras Al Khaimah International Airport (RAK). If asked your name, say you are Rakia.

Answer the visitor's question using ONLY the RAK Airport website information provided below.
Rules:
- Use ONLY the information between <site> and </site>. Do NOT use outside knowledge.
- If the answer is not in the site information, say: "I'm sorry, I don't have that information on the website. You can contact the airport at +971 7 2075200 or info@rakairport.com." Do not guess or make up details.
- Be concise, friendly and helpful. Prefer 1-4 short sentences.
- Give exact figures (rates, phone numbers, times) exactly as written in the site information.
- Only answer questions about Ras Al Khaimah International Airport, its services, and travel/visitor info covered on the site. Politely decline unrelated topics.`

/* ---- Lightweight retrieval (whole-word + synonym + stem scoring) ---- */
const STOP = new Set('a an the of to for in on at is are be do i we you my me our your it this that with and or how what which when where who can could would should need want about get from please tell show give any some'.split(' '))
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9\s+&-]/g, ' ')
const stem = (w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w)
function wordSet(s) {
  const set = new Set()
  for (const w of norm(s).split(/\s+/)) {
    if (!w || w.length < 2) continue
    set.add(w)
    set.add(stem(w))
  }
  return set
}
// Pre-compute word sets once per cold start.
const ENTRIES = SITE_ENTRIES.map((e) => ({ ...e, _t: wordSet(e.title), _x: wordSet(e.text), _p: wordSet(e.page) }))

// Vocabulary of every word used on the site (+ synonym words) for typo correction.
const VOCAB = new Set()
for (const e of ENTRIES) for (const s of [e._t, e._x, e._p]) for (const w of s) VOCAB.add(w)
for (const k of Object.keys(SYN)) { VOCAB.add(k); for (const w of SYN[k].split(' ')) VOCAB.add(w) }

// Bounded Levenshtein edit distance (returns 3 once it's clearly too far).
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

// Find the closest real site word to a mistyped token (e.g. "lugage" -> "luggage").
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
    // If the word isn't known and isn't a synonym key, try to typo-correct it.
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
  // Always include the contact entry so the bot can offer it.
  const contact = SITE_ENTRIES.find((e) => e.path === '/contact')
  if (contact && !hits.some((h) => h.path === '/contact')) hits.push(contact)
  const lines = hits.map((e) => (e.text ? `[${e.page}] ${e.title}: ${e.text}` : `[${e.page}] ${e.title}`))
  return lines.join('\n')
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  // Netlify supplies this header; do not trust client-controlled X-Forwarded-For.
  const ip = req.headers.get('x-nf-client-connection-ip') || 'unknown'
  if (isRateLimited(ip)) return json({ error: 'rate_limited' }, 429, { 'retry-after': '60' })

  const length = Number(req.headers.get('content-length') || 0)
  if (length > MAX_BODY_BYTES) return json({ error: 'payload_too_large' }, 413)

  let messages
  try {
    const raw = await req.text()
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: 'payload_too_large' }, 413)
    const parsed = JSON.parse(raw)
    messages = parsed?.messages
  } catch {
    return json({ error: 'bad_request' }, 400)
  }
  if (!Array.isArray(messages) || messages.length === 0) return json({ error: 'bad_request' }, 400)

  const turns = messages
    .slice(-8)
    .filter((m) => m && m.from === 'user' && typeof m.text === 'string' && m.text.trim())
    .slice(-4)
  if (!turns.length) return json({ error: 'bad_request' }, 400)
  if (turns.some((m) => m.text.length > MAX_MESSAGE_CHARS)) return json({ error: 'message_too_large' }, 413)

  const groqKey = process.env.GROQ_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY
  if (!groqKey && !geminiKey) return json({ error: 'not_configured' }, 503)

  // Retrieve context from the latest user question (plus previous one for follow-ups).
  const lastUser = [...turns].reverse().find((m) => m.from === 'user')?.text || turns[turns.length - 1].text
  const system = `${RULES}\n\n<site>\n${buildContext(lastUser)}\n</site>`

  try {
    const text = groqKey ? await askGroq(groqKey, system, turns) : await askGemini(geminiKey, system, turns)
    if (!text) return json({ error: 'empty' }, 502)
    return json({ text })
  } catch (err) {
    console.error('chat function error', err)
    return json({ error: 'server_error' }, 500)
  }
}

/* ---- Groq (OpenAI-compatible) ---- */
async function askGroq(key, system, turns) {
  const messages = [
    { role: 'system', content: system },
    ...turns.map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text })),
  ]
  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: GROQ_MODEL, messages, temperature: 0.2, max_tokens: 500 }),
  })
  if (!resp.ok) {
    console.error('Groq error', resp.status, await resp.text().catch(() => ''))
    throw new Error('groq_upstream')
  }
  const data = await resp.json()
  return (data?.choices?.[0]?.message?.content || '').trim()
}

/* ---- Google Gemini ---- */
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
  if (!resp.ok) {
    console.error('Gemini error', resp.status, await resp.text().catch(() => ''))
    throw new Error('gemini_upstream')
  }
  const data = await resp.json()
  return (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim()
}

function isRateLimited(ip) {
  const now = Date.now()
  // Bound memory if a flood uses many distinct addresses. This is only an
  // instance-level backstop; production should also apply Netlify/WAF limits.
  if (requestBuckets.size > 10_000) requestBuckets.clear()
  const bucket = requestBuckets.get(ip)
  if (!bucket || now - bucket.started >= RATE_LIMIT_WINDOW_MS) {
    requestBuckets.set(ip, { started: now, count: 1 })
    return false
  }
  bucket.count += 1
  return bucket.count > RATE_LIMIT_MAX
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...extraHeaders } })
}
