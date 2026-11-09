import { useLanguage } from '../i18n/LanguageContext.jsx'
import { Link } from 'react-router-dom'
import { useRef, useEffect, useState, Fragment } from 'react'
import {
  Plane, Building2, Building, Bus, Tag, ChevronDown, Clock, Map, BadgeCheck,
  DoorOpen, ArrowRight, ShieldCheck, Luggage, Sparkles,
  Palette, Mountain, MapPin, ParkingCircle, Ban, ShoppingBag,
  PlaneTakeoff, PlaneLanding, QrCode, CheckCircle2, Check, Gift, Star, Coffee, Users, Crown,
} from 'lucide-react'
import { SectionHeading, Img } from '../components/ui.jsx'
import { img } from '../data/images.js'
import { statusClass, isCompleted, sortDeparturesForDisplay } from '../data/flights.js'
import { useFlights } from '../hooks/useFlights.js'

const heroButtons = [
  { label: 'Flight Info', icon: Plane, to: '/flights' },
  { label: 'Hotels', icon: Building2, href: 'https://visitrasalkhaimah.com/plan-your-trip/accommodations/' },
  { label: 'Free Bus', icon: Bus, to: '/bus-service' },
  { label: 'Learn more about Ras Al Khaimah and its Ruler', icon: Crown, href: 'https://www.saudbinsaqr.ae/' },
]

const quickLinks = {
  arrival: [
    { label: 'Live Arrival Times', icon: PlaneLanding, to: '/flights?type=arrival' },
    { label: 'Maps', icon: Map, to: '/map' },
    { label: 'Baggage Rules', icon: Luggage, to: '/luggage-checkin' },
    { label: 'Parking Guide', icon: ParkingCircle, to: '/parking' },
    { label: 'Leaving the Airport', icon: DoorOpen, to: '/public-transport' },
  ],
  departure: [
    { label: 'Live Departure Times', icon: PlaneTakeoff, to: '/flights?type=departure' },
    { label: 'Maps', icon: Map, to: '/map' },
    { label: 'Check-in Information', icon: BadgeCheck, to: '/flights' },
    { label: 'Duty Free', icon: ShoppingBag, to: '/duty-free' },
    { label: 'Baggage & Security Rules', icon: ShieldCheck, to: '/luggage-checkin' },
    { label: 'Cafes & Bars', icon: Coffee, to: '/cafes-bars' },
    { label: 'Parking Guide', icon: ParkingCircle, to: '/parking' },
    { label: 'Facilities & Services', icon: Building, to: '/facilities' },
  ],
}

const rakCards = [
  {
    icon: Palette,
    title: 'Art & Culture',
    text: "Ras Al Khaimah's art and culture combine rich Emirati heritage with modern creativity.",
    image: img.artCulture,
  },
  {
    icon: Mountain,
    title: 'RAK Tourism',
    text: 'Stunning landscapes, rich heritage, and unique adventure experiences await you.',
    image: img.rakTourism,
  },
  {
    icon: Sparkles,
    title: 'Experience at RAK',
    text: 'An emerging destination combining adventure, relaxation, and authentic Emirati heritage.',
    image: img.experienceRak,
  },
]

// City photos from Wikimedia Commons (stable direct URLs).
const wiki = (file, w = 240) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`

const destinations = [
  { name: 'Mumbai', country: 'India', image: wiki('Mumbai 03-2016 30 Gateway of India.jpg') },
  { name: 'Lucknow', country: 'India', image: wiki('Rumi Darwaza, Lucknow.jpg') },
  { name: 'Hyderabad', country: 'India', image: wiki('Charminar Hyderabad 1.jpg') },
  { name: 'Calicut', country: 'India', image: wiki('Kozhikode beach (59223).jpg') },
  { name: 'Cochin', country: 'India', image: wiki('Kochi chinese fishing-net-20080215-01a.jpg') },
  { name: 'Islamabad', country: 'Pakistan', image: wiki('Islamabad,Faisal mosque.jpg') },
  { name: 'Peshawar', country: 'Pakistan', image: wiki('Mohabbat Khan Mosque, Peshawar.jpg') },
  { name: 'Cairo', country: 'Egypt', image: wiki('All Gizah Pyramids.jpg') },
  { name: 'Jeddah', country: 'Saudi Arabia', image: wiki('Jeddah Corniche at night.jpg') },
  { name: 'Katowice', country: 'Poland', image: wiki('Katowice - Spodek by night.jpg') },
  { name: 'Moscow', country: 'Russia', image: wiki("Saint Basil's Cathedral (Moscow, 2004).jpg") },
  { name: 'Prague', country: 'Czechia', image: wiki('Prague Charles Bridge 2021 11.jpg') },
  { name: 'Lahore', country: 'Pakistan', image: wiki('Badshahi Mosque (Lahore).jpg') },
  { name: 'Warsaw', country: 'Poland', image: wiki('Warsaw 07-13 img07 Old town.jpg') },
]

const stats = [
  { num: '1M+', label: 'Annual passengers' },
  { num: '30+', label: 'Destinations' },
  { num: '15+', label: 'Airlines' },
  { num: '24/7', label: 'Airport operations' },
]

export default function Home() {
  const { t: tr, language } = useLanguage()
  const [mode, setMode] = useState('arrival') // controls Quick Links
  const [modeOpen, setModeOpen] = useState(false) // Quick Links dropdown
  const [boardMode, setBoardMode] = useState('departure') // controls the live flight board
  const modeRef = useRef(null)
  const videoRef = useRef(null)

  // close the Arrival/Departure dropdown when clicking outside
  useEffect(() => {
    const onDoc = (e) => {
      if (modeRef.current && !modeRef.current.contains(e.target)) setModeOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true // React doesn't reliably set this; force it so autoplay isn't blocked
    v.playbackRate = 0.5 // play the timelapse at half speed for a calmer motion
    // Honour users who prefer reduced motion - keep the static poster instead
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      v.pause?.()
      return
    }
    v.play?.().catch(() => {})
  }, [])

  const links = quickLinks[mode]

  // Live-board derived values for the spotlight panel
  const { flights: board, loading: boardLoading, error: boardError } = useFlights(boardMode)
  const displayBoard = boardMode === 'departure' ? sortDeparturesForDisplay(board) : board
  // The board is time-ordered and includes flights that have already landed or
  // departed, so "next" is the first one still to happen.
  const nextFlight = board.find((f) => !isCompleted(f)) ?? board[0] ?? null

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {/* Airport background video. No poster image - a dark brand wash sits behind it while it buffers. */}
        <div className="absolute inset-0 -z-10 bg-ink" />
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        >
          <source src="/home-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ink/75 via-ink/35 to-brand-900/40" />
        <div className="container-x flex min-h-[clamp(440px,64vh,640px)] flex-col justify-center py-24">
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[12px] font-medium text-white backdrop-blur animate-fade-up">
            <MapPin size={14} />{tr(" Ras Al Khaimah, United Arab Emirates")}</span>
          <h1 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl animate-fade-up">{tr("Welcome to ")}<span className="bg-gradient-to-r from-brand-300 to-teal-accent bg-clip-text text-transparent">{tr("Ras Al Khaimah International Airport")}</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/80 animate-fade-up">{tr("Your gateway to the world. Discover seamless travel, world-class services, and the natural beauty of Ras Al Khaimah.")}</p>

          <div className="mt-9 flex flex-wrap gap-3 animate-fade-up">
            {heroButtons.map(({ label, icon: Icon, to, href }) => {
              const cls =
                'group flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-[13px] font-semibold text-ink shadow-lg shadow-ink/10 transition-all hover:-translate-y-0.5 hover:bg-white'
              const inner = (
                <>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <Icon size={15} />
                  </span>
                  {tr(label)}
                </>
              )
              return href ? (
                <a key={label} href={href} target="_blank" rel="noreferrer" className={cls}>
                  {tr(inner)}
                </a>
              ) : (
                <Link key={label} to={to} className={cls}>
                  {tr(inner)}
                </Link>
              )
            })}
          </div>

          {/* Feature badges */}
          <div className="mt-7 flex flex-wrap gap-2.5 animate-fade-up">
            {[
              {
                icon: Clock,
                text: '10 min to RAK City Centre',
                href: 'https://www.google.com/maps/dir/Ras+Al+Khaimah+International+Airport,+Al+Mathloothah+-+Ras+Al+Khaimah/My+City+Center+Al+Dhait,+Al+Dhait+-+%D8%A7%D9%84%D8%B8%D9%8A%D8%AA+%D8%A7%D9%84%D8%AC%D9%86%D9%88%D8%A8%D9%8A+-+Ras+Al+Khaimah%E2%80%AD/@25.6739514,55.8594058,12z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x3ef5dbf9ab06b443:0x9486d43c9f0f8ea0!2m2!1d55.9399711!2d25.6120004!1m5!1m1!1s0x3ef675c5018c9957:0x69c64e541d3cd924!2m2!1d55.9196256!2d25.7283533!3e0',
              },
              { icon: ParkingCircle, text: 'Parking Available at Airport', href: 'https://pay.parkonic.com/' },
            ].map(({ icon: Icon, text, href, to }) => {
              const cls =
                'inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[12.5px] font-medium text-white backdrop-blur'
              const inner = (
                <>
                  <Icon size={15} className="text-brand-300" /> {tr(text)}
                </>
              )
              return href ? (
                <a
                  key={text}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${cls} transition-colors hover:bg-white/20`}
                >
                  {tr(inner)}
                </a>
              ) : to ? (
                <Link key={text} to={to} className={`${cls} transition-colors hover:bg-white/20`}>
                  {tr(inner)}
                </Link>
              ) : (
                <span key={text} className={cls}>
                  {tr(inner)}
                </span>
              )
            })}
          </div>
        </div>

      </section>

      {/* QUICK LINKS */}
      <section className="bg-gradient-to-b from-brand-200 to-brand-50 pt-14 pb-16">
        <div className="container-x">
          {/* Arrival / Departure tabs */}
          <div className="mb-6 flex justify-center">
            <div
              role="group"
              aria-label={tr("Show arrival or departure quick links")}
              className="inline-flex rounded-full bg-white p-1.5 shadow-[0_10px_30px_rgba(15,39,64,0.12)] ring-1 ring-brand-100"
            >
              {[
                { id: 'arrival', label: 'Arrival', icon: PlaneLanding },
                { id: 'departure', label: 'Departure', icon: PlaneTakeoff },
              ].map(({ id, label, icon: Icon }) => {
                const active = mode === id
                return (
                  <button
                    key={id}
                    onClick={() => setMode(id)}
                    aria-pressed={active}
                    className={`flex w-36 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-semibold transition-all ${
                      active
                        ? 'bg-gradient-to-r from-brand-600 to-teal-accent text-white shadow'
                        : 'text-ink/55 hover:text-brand-600'
                    }`}
                  >
                    <Icon size={16} className={active ? 'text-white' : 'text-brand-400'} /> {tr(label)}
                  </button>
                )
              })}
            </div>
          </div>
          <SectionHeading
            title={tr("Quick")}
            highlight="Links"
          />
          {/* key={mode} re-triggers the entrance animation when the toggle switches.
              Grid of wide quick-link boxes (icon left, label right). */}
          <div key={mode} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {links.map(({ label, icon: Icon, to }, i) => (
              <Fragment key={label}>
                <Link
                  to={to}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  className="animate-fade-up group flex w-full items-center gap-3.5 rounded-2xl border border-brand-100 bg-white px-5 py-5 shadow-[0_12px_38px_rgba(15,39,64,0.12)] transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100"
                >
                  <Icon size={24} className="flex-shrink-0 text-brand-500 transition-colors group-hover:text-brand-600" />
                  <span className="text-[12.5px] font-semibold uppercase leading-snug tracking-wide text-ink/70 transition-colors group-hover:text-brand-600">
                    {tr(label)}
                  </span>
                </Link>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE FLIGHTS PREVIEW */}
      <section className="bg-white py-16">
        <div className="container-x">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-600 ring-1 ring-brand-100">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>{tr("Live now")}</span>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{tr("Today’s ")}<span className="text-brand-500">{tr(boardMode === 'arrival' ? 'Arrivals' : 'Departures')}</span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Board's own Arrival / Departure selector */}
              <div
                role="group"
                aria-label={tr("Show arrivals or departures")}
                className="inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-brand-100"
              >
                {[
                  { id: 'arrival', label: 'Arrivals', icon: PlaneLanding },
                  { id: 'departure', label: 'Departures', icon: PlaneTakeoff },
                ].map(({ id, label, icon: Icon }) => {
                  const active = boardMode === id
                  return (
                    <button
                      key={id}
                      onClick={() => setBoardMode(id)}
                      aria-pressed={active}
                      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold transition-all ${
                        active
                          ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow'
                          : 'text-ink/55 hover:text-brand-600'
                      }`}
                    >
                      <Icon size={14} /> {tr(label)}
                    </button>
                  )
                })}
              </div>
              <Link to="/flights" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-transform hover:scale-[1.03]">{tr("View full board ")}<ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch">
            <div key={boardMode} className="animate-fade-up max-w-full overflow-x-auto rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,39,64,0.14)] ring-1 ring-brand-100/60">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-brand-100 text-[11px] font-semibold uppercase tracking-wider text-ink/45">
                    <th className="px-5 py-4">{tr("Flight No")}</th>
                    <th className="px-5 py-4">{tr(boardMode === 'arrival' ? 'From' : 'To')}</th>
                    <th className="px-5 py-4">{tr("Sched.")}</th>
                    <th className="hidden px-5 py-4 sm:table-cell">{tr("Est.")}</th>
                    <th className="px-5 py-4">{tr("Status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {displayBoard.slice(0, 5).map((r) => (
                    <tr key={`${r.flight}-${r.sch}`} className="border-b border-brand-50 transition-colors last:border-0 hover:bg-brand-50/50">
                      <td className="px-5 py-4 text-[13px] font-bold text-ink">{tr(r.flight)}</td>
                      <td className="px-5 py-4 text-[13px] font-semibold text-ink">{tr(r.city)}</td>
                      <td className="px-5 py-4 text-[13px] text-ink/70">{tr(r.sch)}</td>
                      <td className={`hidden px-5 py-4 text-[13px] sm:table-cell ${r.est && r.est !== r.sch ? 'text-amber-600 font-medium' : 'text-ink/70'}`}>{r.est ?? '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-block rounded-full px-3 py-1 text-[11.5px] font-semibold ${statusClass(r.status)}`}>{tr(r.status)}</span>
                      </td>
                    </tr>
                  ))}
                  {boardLoading && board.length === 0 && (
                    [0, 1, 2, 3, 4].map((i) => (
                      <tr key={`skeleton-${i}`} className="border-b border-brand-50 last:border-0">
                        <td colSpan={5} className="px-5 py-4">
                          <div className="h-4 w-full animate-pulse rounded bg-brand-50" />
                        </td>
                      </tr>
                    ))
                  )}
            {!boardLoading && displayBoard.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-[13px] text-ink/45">
                        {tr(boardError
                          ? 'Live flight information is temporarily unavailable.'
                          : `No ${boardMode === 'arrival' ? 'arrivals' : 'departures'} scheduled right now.`)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Spotlight panel - next flight + quick stats */}
            <aside key={boardMode + '-side'} className="animate-fade-up flex flex-col gap-4 lg:self-start">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-teal-accent p-6 text-white shadow-[0_20px_60px_rgba(19,120,212,0.30)]">
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">{tr("Next ")}{tr(boardMode === 'arrival' ? 'arrival' : 'departure')}
                  </span>
                  {boardMode === 'arrival' ? (
                    <PlaneLanding size={20} className="text-white/80" />
                  ) : (
                    <PlaneTakeoff size={20} className="text-white/80" />
                  )}
                </div>
                {nextFlight ? (
                  <>
                    <div className="mt-4 font-display text-3xl font-semibold">{tr(nextFlight.flight)}</div>
                    <div className="mt-1 text-[14px] text-white/85">
                      {tr(boardMode === 'arrival' ? 'From' : 'To')} <span className="font-semibold">{tr(nextFlight.city)}</span>
                    </div>
                    <div className="mt-6 flex items-end gap-6">
                      <div>
                        <div className="text-[11px] text-white/60">{tr("Scheduled")}</div>
                        <div className="font-display text-xl font-semibold">{tr(nextFlight.sch)}</div>
                      </div>
                      {nextFlight.est && nextFlight.est !== nextFlight.sch && (
                        <div>
                          <div className="text-[11px] text-white/60">{tr("Estimated")}</div>
                          <div className="font-display text-xl font-semibold">{tr(nextFlight.est)}</div>
                        </div>
                      )}
                      <span className="ml-auto rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold backdrop-blur">
                        {tr(nextFlight.status)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 text-[14px] text-white/75">
                    {tr(boardLoading ? 'Loading live flights…' : 'No upcoming flights to show.')}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>


      {/* DESTINATIONS - dual opposing marquee rows */}
      <section className="bg-gradient-to-b from-brand-200 to-brand-50 py-14">
        <div className="container-x">
          <SectionHeading
            kicker="Direct flights"
            title={tr("Explore cities we are")}
            highlight="flying to"
            subtitle="Destinations Served from Ras Al Khaimah International Airport"
          />
        </div>
        {/* Keep the moving track LTR even while the page is Arabic.  CSS
            transforms follow the element's writing direction; without this,
            the RTL track starts outside the viewport and leaves a large gap. */}
        <div dir="ltr" className="marquee-pause relative space-y-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]">
          {[
            { items: destinations.slice(0, 7), anim: 'animate-marquee' },
            { items: destinations.slice(7), anim: 'animate-marquee-reverse' },
          ].map((row, ri) => (
            <div key={ri} className={`flex w-max gap-7 ${row.anim}`}>
              {/* Exactly two identical sets make the 50% transform land on the
                  same visual frame, producing an uninterrupted loop. */}
              {[...row.items, ...row.items].map(({ name, country, image }, i) => (
                <div
                  key={name + i}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                  className="group relative h-[120px] w-[170px] flex-shrink-0 overflow-hidden rounded-2xl shadow-[0_18px_46px_rgba(15,39,64,0.18)] ring-1 ring-white/40 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_24px_58px_rgba(19,120,212,0.34)]"
                >
                  <Img
                    src={image}
                    alt={tr(name)}
                    w={460}
                    h={240}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                  <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-brand-600 backdrop-blur">
                    <Plane size={11} />{tr(" Direct")}</span>
                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    <div className="font-display text-[15px] font-semibold leading-tight text-white drop-shadow-sm">{tr(name)}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-white/75">
                      <MapPin size={11} className="text-brand-300" /> {tr(country)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="container-x mt-5 text-center text-[12.5px] text-ink/45">{tr("30+ destinations served from Ras Al Khaimah International Airport")}</p>
      </section>

      {/* FREE BUS SERVICE QR */}
      <section className="bg-gradient-to-b from-brand-200 to-brand-50 py-20">
        <div className="container-x">
          <div className="grid items-center gap-10 overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-700 via-brand-600 to-teal-accent p-8 text-white shadow-[0_26px_72px_rgba(19,120,212,0.30)] sm:p-12 lg:grid-cols-[1fr_auto]">
            <div>
              <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[12px] font-medium backdrop-blur">
                <Bus size={14} />{tr(" Free Airport Bus Service")}</span>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{tr("Scan for bus service details")}</h2>
              <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-white/80">{tr("Point your phone camera at the QR code to view the full airport free bus service schedule, stops and timings across the UAE.")}</p>
              <ul className="mt-5 space-y-2.5">
                {['Live routes & timings', 'Six stops across four emirates', 'Complimentary for all passengers'].map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-[14px] font-medium text-white/90">
                    <CheckCircle2 size={18} className="flex-shrink-0 text-white" /> {tr(p)}
                  </li>
                ))}
              </ul>
              <Link
                to="/bus-service"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-semibold text-brand-700 shadow-lg transition-transform hover:scale-[1.04]"
              >{tr("View bus service ")}<ArrowRight size={16} />
              </Link>
            </div>
            <div className="mx-auto flex flex-col items-center">
              <div className="rounded-2xl bg-white p-4 shadow-xl">
                <img
                  src="/airport-bus-qr.png"
                  alt={tr("QR code for airport free bus service details")}
                  width={200}
                  height={200}
                  className="h-[200px] w-[200px] object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling.style.display = 'flex'
                  }}
                />
                <div className="hidden h-[200px] w-[200px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-200 text-center text-[12px] text-ink/45">
                  <QrCode size={40} className="text-brand-300" />{tr("QR image not found")}</div>
              </div>
              <p className="mt-3 text-center text-[12.5px] font-medium text-white/80">{tr("Scan for bus service details")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gradient-to-r from-brand-700 to-brand-500">
        <div className="container-x grid grid-cols-2 gap-8 py-14 lg:grid-cols-4">
          {stats.map(({ num, label }, i) => (
            <div key={label} style={{ animationDelay: `${i * 0.1}s` }} className="animate-fade-up text-center">
              <div className="font-display text-4xl font-semibold text-white">{tr(num)}</div>
              <div className="mt-1.5 text-[13px] text-white/70">{tr(label)}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
