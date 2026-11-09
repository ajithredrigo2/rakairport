import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useState, useRef, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  PlaneLanding, PlaneTakeoff, ArrowRight, Info, Bus, Building,
  Wifi, PackageSearch, ParkingCircle, Search, X,
} from 'lucide-react'
import { PageHero, SectionHeading, Img } from '../components/ui.jsx'
import { statusClass, sortDeparturesForDisplay } from '../data/flights.js'
import { useFlights } from '../hooks/useFlights.js'

const boards = [
  {
    id: 'arrival',
    icon: PlaneLanding,
    title: 'Arrival',
    text: 'Explore all incoming flights and stay informed with real-time arrival updates.',
    image: '/arrival.jpg',
  },
  {
    id: 'departure',
    icon: PlaneTakeoff,
    title: 'Departure',
    text: 'Check the latest departure schedules and track flights as they take off.',
    image: '/departure.jpg',
  },
]

const usefulLinks = [
  { label: 'Transport', icon: Bus, to: '/public-transport' },
  { label: 'Facilities', icon: Building, to: '/facilities' },
  { label: 'Wifi Access', icon: Wifi, to: '/wifi' },
  { label: 'Lost and Found', icon: PackageSearch, to: '/contact' },
  { label: 'Parking', icon: ParkingCircle, to: '/parking' },
]

function FlightBoard({ type, onClose }) {
  const { t: tr, language } = useLanguage()
  const { flights: rows, loading, error } = useFlights(type)
  const isArr = type === 'arrival'
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const filtered = q
    ? rows.filter(
        (r) =>
          r.city.toLowerCase().includes(q) ||
          r.flight.toLowerCase().includes(q) ||
          r.airline.toLowerCase().includes(q) ||
          r.iata.toLowerCase().includes(q),
      )
    : rows
  const displayRows = isArr ? filtered : sortDeparturesForDisplay(filtered)

  return (
    <div className="animate-fade-up mt-12 overflow-hidden rounded-[28px] bg-white shadow-[0_26px_72px_rgba(15,39,64,0.16)] ring-1 ring-brand-100/70">
      {/* header */}
      <div className="flex flex-col gap-4 border-b border-brand-100/70 bg-gradient-to-r from-brand-700 to-brand-500 px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
            {isArr ? <PlaneLanding size={22} /> : <PlaneTakeoff size={22} />}
          </span>
          <div>
            <div className="flex items-center gap-2 font-display text-xl font-semibold">{tr("Live ")}{tr(isArr ? 'Arrivals' : 'Departures')}
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
            </div>
            <div className="text-[12px] text-white/70">{tr("Ras Al Khaimah International Airport · today")}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-2 backdrop-blur">
            <Search size={15} className="text-white/70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr("Search city or flight")}
              className="w-40 bg-transparent text-[13px] text-white placeholder:text-white/60 focus:outline-none"
            />
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25" aria-label={tr("Close")}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-brand-100 text-[11px] font-semibold uppercase tracking-wider text-ink/45">
              <th className="px-5 py-4">{tr("Flight No")}</th>
              <th className="px-5 py-4">{tr("Airline")}</th>
              <th className="px-5 py-4">{tr(isArr ? 'From' : 'To')}</th>
              <th className="px-5 py-4">{tr("Sch.")}</th>
              <th className="px-5 py-4">{tr("Est.")}</th>
              <th className="px-5 py-4">{tr("Date")}</th>
              <th className="px-5 py-4">{tr("Status")}</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((r) => (
              <tr key={`${r.flight}-${r.sch}`} className="border-b border-brand-50 transition-colors last:border-0 hover:bg-brand-50/50">
                <td className="px-5 py-4 text-[13px] font-bold text-ink">{tr(r.flight)}</td>
                <td className="px-5 py-4 text-[13px] text-ink/70">{tr(r.airline)}</td>
                <td className="px-5 py-4 text-[13px] font-semibold text-ink">{tr(r.city)}</td>
                <td className="px-5 py-4 text-[13px] text-ink/70">{tr(r.sch)}</td>
                <td className={`px-5 py-4 text-[13px] font-medium ${r.est && r.est !== r.sch ? 'text-amber-600' : 'text-ink/70'}`}>{r.est ?? '—'}</td>
                <td className="px-5 py-4 text-[13px] text-ink/70">{tr(r.date)}</td>
                <td className="px-5 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-[11.5px] font-semibold ${statusClass(r.status)}`}>{tr(r.status)}</span>
                </td>
              </tr>
            ))}
            {loading && rows.length === 0 && (
              [0, 1, 2, 3, 4].map((i) => (
                <tr key={`skeleton-${i}`} className="border-b border-brand-50 last:border-0">
                  <td colSpan={7} className="px-5 py-4">
                    <div className="h-4 w-full animate-pulse rounded bg-brand-50" />
                  </td>
                </tr>
              ))
            )}
            {!loading && displayRows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-[13px] text-ink/45">
                  {tr(error
                    ? 'Live flight information is temporarily unavailable.'
                    : query
                      ? `No flights match “${query}”.`
                      : `No ${isArr ? 'arrivals' : 'departures'} scheduled right now.`)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-mist px-6 py-3 text-[11.5px] text-ink/40">{tr("Live schedules, refreshed every minute. Times in Gulf Standard Time (GST).")}</div>
    </div>
  )
}

export default function Flights() {
  const { t: tr, language } = useLanguage()
  const [active, setActive] = useState(null)
  const boardRef = useRef(null)
  const [searchParams] = useSearchParams()

  const select = (id) => {
    setActive(id)
    setTimeout(() => boardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  // Deep-link support: /flights?type=arrival or /flights?type=departure
  // opens straight to that board (used by the home page quick links). Reruns
  // whenever the query param changes, not just on first mount, so switching
  // quick links while already on this page still shows the right box + title.
  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'arrival' || type === 'departure') select(type)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <>
      <PageHero
        image="/flights-hero.jpg"
        badge="Fly with RAK"
        title={tr("Flight Information")}
        subtitle="Stay updated on live flight departures and arrivals."
      />

      {/* Arrival / Departure cards */}
      <section className="bg-gradient-to-b from-brand-200 to-brand-50 py-20">
        <div className="container-x">
          <div className="grid gap-8 md:grid-cols-2">
            {boards.map(({ id, icon: Icon, title, text, image }, i) => (
              <button
                key={id}
                onClick={() => select(id)}
                style={{ animationDelay: `${i * 0.12}s` }}
                className={`animate-fade-up group block overflow-hidden rounded-[28px] bg-white text-center shadow-[0_22px_65px_rgba(15,39,64,0.15)] ring-1 transition-all hover:-translate-y-1.5 hover:shadow-[0_32px_76px_rgba(19,120,212,0.26)] ${
                  active === id ? 'ring-2 ring-brand-500' : 'ring-brand-100/60'
                }`}
              >
                <div className="relative h-64 overflow-hidden">
                  <Img src={image} alt={tr(title)} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
                </div>
                <div className="px-8 pb-9">
                  <span className="mx-auto grid h-14 w-14 -translate-y-7 place-items-center rounded-2xl bg-white text-brand-600 shadow-lg ring-1 ring-brand-100">
                    <Icon size={26} />
                  </span>
                  <h3 className="-mt-2 font-display text-2xl font-semibold tracking-wide text-ink">{tr(title)}</h3>
                  <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-ink/55">{tr(text)}</p>
                  <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-9 py-3 text-[14px] font-semibold text-white shadow-md transition-transform group-hover:scale-[1.04]">
                    {tr(active === id ? 'Showing below' : `View ${title}s`)} <ArrowRight size={16} />
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div ref={boardRef}>
            {active && <FlightBoard type={active} onClose={() => setActive(null)} />}
          </div>
        </div>
      </section>

      {/* Useful links */}
      <section className="bg-white py-20">
        <div className="container-x">
          <SectionHeading kicker="Plan your visit" title={tr("Useful")} highlight="Links" />
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4">
            {usefulLinks.map(({ label, icon: Icon, to }, i) => (
              <Link
                key={label}
                to={to}
                style={{ animationDelay: `${i * 0.05}s` }}
                className="animate-fade-up group flex w-[150px] flex-col items-center gap-3 rounded-2xl border border-brand-100 bg-mist p-6 text-center transition-all hover:-translate-y-1.5 hover:border-brand-300 hover:bg-brand-50 hover:shadow-lg hover:shadow-brand-100"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white text-brand-500 shadow-sm transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <Icon size={22} />
                </span>
                <span className="text-[13px] font-semibold text-ink/80">{tr(label)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
