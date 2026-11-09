import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, X, Send, Sparkles, ArrowRight } from 'lucide-react'
import { searchKB } from '../data/knowledge.js'

const QUICK = [
  'Parking rates',
  'Flight information',
  'Cargo documents',
  'Duty Free',
  'Hotels in RAK',
  'Free bus service',
  'Contact details',
]

/* Build a reply from the site's own content. */
function respond(q) {
  const ql = q.toLowerCase().trim()
  if (/\b(hi|hello|hey|salam|assalam|marhaba)\b/.test(ql)) {
    return {
      text: "Hello! I'm Rakia, your RAK Airport assistant. Ask me about flights, parking, cargo, duty free, hotels, transport, contacts and more.",
      chips: QUICK,
    }
  }
  if (/\b(thanks|thank you|shukran|thx)\b/.test(ql)) {
    return { text: "You're welcome! Is there anything else I can help you with?", chips: QUICK }
  }
  const res = searchKB(q)
  if (!res.length) {
    return {
      text: "I couldn't find that on the site. Try asking about parking, flights, cargo, duty free, hotels, transport, VIP handling, careers or contact details.",
      chips: QUICK,
    }
  }
  const top = res[0]
  const answer = top.text && top.text.length > 3 ? top.text : `You'll find this on the ${top.page} page.`
  return {
    text: answer,
    link: { to: top.path, label: `Open ${top.page}` },
    chips: res.slice(1, 4).map((e) => ({ label: e.title.length > 30 ? e.title.slice(0, 28) + '…' : e.title, q: e.title })),
  }
}

/* Ask the AI assistant through a server-side Node or Netlify endpoint. Provider
   credentials are never part of the static bundle. */
// The production IIS site reverse-proxies this same-origin endpoint to the
// private Node chat service. If unavailable, the assistant falls back to
// on-site search and never blocks the visitor.
const AI_ENDPOINTS = [
  '/chat',
  '/.netlify/functions/chat',
].filter(Boolean)

async function askAI(history) {
  for (const url of AI_ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      if (res.status === 404) continue // endpoint not on this host - try the next
      if (!res.ok) return null // reachable but errored (e.g. no key) → use fallback
      const data = await res.json()
      const text = (data.text || '').trim()
      return text || null
    } catch {
      // network error on this endpoint - try the next one
    }
  }
  return null
}

function Chip({ chip, onPick }) {
  const { t: tr, language } = useLanguage()
  const c = typeof chip === 'string' ? { label: chip, q: chip } : chip
  return (
    <button
      onClick={() => onPick(c.q)}
      className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-[12px] font-medium text-brand-700 transition-colors hover:bg-brand-50"
    >
      {tr(c.label)}
    </button>
  )
}

function Bubble({ m, onPick }) {
  const { t: tr, language } = useLanguage()
  if (m.from === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-r from-brand-600 to-brand-500 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white shadow">
          {m.text}
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-[13.5px] leading-relaxed text-ink/80 shadow ring-1 ring-brand-100/70">
        {tr(m.text)}
        {m.link && (
          <Link
            to={m.link.to}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-[12px] font-semibold text-brand-700 transition-colors hover:bg-brand-100"
          >
            {tr(m.link.label)} <ArrowRight size={13} />
          </Link>
        )}
      </div>
      {m.chips && m.chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {m.chips.map((c, i) => (
            <Chip key={i} chip={c} onPick={onPick} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Chatbot() {
  const { t: tr, language } = useLanguage()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState([
    {
      from: 'bot',
      text: "Hi! I'm Rakia 🤖 your RAK Airport assistant. Ask me anything about the airport - flights, parking, cargo, duty free, hotels, transport or contacts.",
      chips: QUICK,
    },
  ])
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, open, typing])

  const send = async (text) => {
    const q = (text ?? input).trim()
    if (!q || typing) return
    setInput('')
    const history = [...msgs, { from: 'user', text: q }]
    setMsgs(history)
    setTyping(true)

    // Try the AI assistant first (answers only from this site's content).
    const aiText = await askAI(history.map((m) => ({ from: m.from, text: m.text })))
    setTyping(false)

    if (aiText) {
      const rel = searchKB(q)[0]
      setMsgs((m) => [
        ...m,
        { from: 'bot', text: aiText, link: rel ? { to: rel.path, label: `Open ${rel.page}` } : undefined, chips: QUICK },
      ])
    } else {
      // Fallback: on-site smart search (works with no API key / plain vite dev).
      setMsgs((m) => [...m, { from: 'bot', ...respond(q) }])
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={tr(open ? 'Close assistant' : 'Open assistant')}
        className="fixed bottom-5 right-5 z-[120] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-teal-accent text-white shadow-[0_12px_34px_rgba(19,120,212,0.45)] transition-transform hover:scale-105"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Panel */}
      {open && (
        <div className="animate-drop-in fixed bottom-24 right-5 z-[120] flex h-[70vh] max-h-[560px] w-[92vw] max-w-[380px] flex-col overflow-hidden rounded-3xl bg-mist shadow-[0_30px_80px_rgba(15,39,64,0.35)] ring-1 ring-brand-100">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-brand-700 to-brand-600 px-4 py-3.5 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Sparkles size={20} />
            </span>
            <div className="leading-tight">
              <div className="font-display text-[15px] font-semibold">{tr("Rakia")}</div>
              <div className="flex items-center gap-1.5 text-[11.5px] text-white/75">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>{tr("Online · answers from this site")}</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <Bubble key={i} m={m} onPick={send} />
            ))}
            {typing && (
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white px-3.5 py-3 shadow ring-1 ring-brand-100/70 w-fit">
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" />
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="flex items-center gap-2 border-t border-brand-100 bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tr("Ask about the airport…")}
              className="min-w-0 flex-1 rounded-full bg-mist px-4 py-2.5 text-[13.5px] text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <button
              type="submit"
              aria-label={tr("Send")}
              className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-gradient-to-r from-brand-600 to-brand-500 text-white transition-transform hover:scale-105"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
