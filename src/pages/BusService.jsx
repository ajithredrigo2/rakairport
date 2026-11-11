import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Bus, CalendarDays, CheckCircle2, ChevronDown, Clock3, MapPin, Phone, Route as RouteIcon, Shield, Download, ExternalLink } from 'lucide-react'
import { Img, PageHero, SectionHeading } from '../components/ui.jsx'

const time = (value) => {
  if (!value) return '—'
  const [hour, minute] = value.slice(0, 5).split(':').map(Number)
  const suffix = hour >= 12 ? 'PM' : 'AM'; const h = hour % 12 || 12
  return `${h}:${String(minute).padStart(2, '0')} ${suffix}`
}
const getSchedule = async () => {
  const response = await fetch('/bus-service-api/public')
  if (!response.ok) throw new Error(response.status === 503 ? 'The live timetable is being configured. Please check back shortly.' : 'The timetable is temporarily unavailable.')
  return response.json()
}

function TripSchedule({ trip }) {
  if (!trip) return null
  const stops = Array.isArray(trip.stops) ? trip.stops : []
  const daysText = Array.isArray(trip.operatingDays) ? trip.operatingDays.join(', ') : 'Daily'

  return <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 bg-brand-50/70 px-5 py-4">
      <div><h3 className="font-display text-lg font-semibold text-ink">{trip.name}</h3><p className="mt-0.5 text-xs font-medium text-ink/55">{daysText}</p></div>
      <span className="rounded-full bg-teal-accent/15 px-3 py-1.5 text-xs font-semibold text-teal-accent">Airport arrival {time(trip.airportArrivalTime)}</span>
    </div>
    <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[650px] text-left"><thead className="text-[11px] uppercase tracking-wider text-ink/45"><tr><th className="px-5 py-3">Stop</th><th className="px-5 py-3">Pickup details</th><th className="px-5 py-3">Arrival</th><th className="px-5 py-3">Waiting</th><th className="px-5 py-3">Departure</th></tr></thead><tbody>{stops.map((stop) => <tr key={stop.id || stop.name} className="border-t border-brand-50 text-sm"><td className="px-5 py-4 font-semibold text-ink"><span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-brand-50 text-xs text-brand-600">{stop.order}</span>{stop.name}</td><td className="px-5 py-4 text-ink/60">{stop.details || 'Pickup point'}</td><td className="px-5 py-4 font-medium text-ink/75">{time(stop.arrivalTime)}</td><td className="px-5 py-4 text-ink/60">{stop.waitingMinutes} min</td><td className="px-5 py-4 font-semibold text-brand-700">{time(stop.departureTime)}</td></tr>)}</tbody></table></div>
    <div className="space-y-0 md:hidden">{stops.map((stop) => <div key={stop.id || stop.name} className="border-t border-brand-50 p-4"><div className="flex gap-3"><span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600">{stop.order}</span><div className="min-w-0"><h4 className="font-semibold text-ink">{stop.name}</h4><p className="mt-0.5 text-sm text-ink/55">{stop.details || 'Pickup point'}</p><div className="mt-3 grid grid-cols-3 gap-2 text-xs"><span><b className="block text-ink/45">Arrival</b>{time(stop.arrivalTime)}</span><span><b className="block text-ink/45">Wait</b>{stop.waitingMinutes} min</span><span><b className="block text-ink/45">Departure</b>{time(stop.departureTime)}</span></div></div></div></div>)}</div>
  </div>
}

export default function BusService() {
  const [schedule, setSchedule] = useState(null), [error, setError] = useState(''), [routeId, setRouteId] = useState(''), [tripId, setTripId] = useState('')
  useEffect(() => { let alive = true; getSchedule().then((data) => { if (alive) { setSchedule(data); setRouteId(data.routes[0]?.id || ''); setTripId(data.routes[0]?.trips[0]?.id || '') } }).catch((err) => alive && setError(err.message)); return () => { alive = false } }, [])
  const route = useMemo(() => schedule?.routes.find((r) => r.id === routeId) || schedule?.routes[0], [schedule, routeId])
  const trip = useMemo(() => route?.trips.find((t) => t.id === tripId) || route?.trips[0], [route, tripId])
  const selectRoute = (id) => { setRouteId(id); const r = schedule.routes.find((item) => item.id === id); setTripId(r?.trips[0]?.id || '') }
  return <>
    <PageHero image="/Airport-Free-Bus-Service-hero.jpg" badge="Dedicated Shuttle Service" title="Free Shuttle Bus Service" subtitle="Travel conveniently to and from Ras Al Khaimah International Airport with our dedicated complimentary shuttle bus service." />
    <section className="bg-white py-20"><div className="container-x"><article className="grid items-stretch overflow-hidden rounded-[28px] bg-white shadow-[0_22px_65px_rgba(15,39,64,0.14)] ring-1 ring-brand-100/60 md:grid-cols-2"><div className="relative h-56 overflow-hidden sm:h-64 md:h-auto md:min-h-0"><Img src="/free-shuttle-bus.jpg" alt="RAK Airport free shuttle bus" className="absolute inset-0 h-full w-full object-cover" eager/></div><div className="flex flex-col justify-center gap-4 p-9 sm:p-12"><span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600"><Bus size={24}/></span><h2 className="font-display text-2xl font-semibold tracking-tight text-ink">Travel comfortably, for free</h2><p className="max-w-md text-[14.5px] leading-relaxed text-ink/55">A complimentary shuttle bus connects Ras Al Khaimah International Airport to major locations across the UAE — seamless, comfortable transit for passengers, with schedules aligned to flight times.</p><ul className="mt-1 space-y-2.5">{['No cost to passengers','Air-conditioned coaches','Schedules aligned with flights'].map((item) => <li key={item} className="flex items-start gap-2.5 text-[14px] font-medium text-ink/75"><CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-teal-accent"/>{item}</li>)}</ul></div></article></div></section>
    <section className="bg-gradient-to-b from-brand-200 to-brand-50 py-20"><div className="container-x"><SectionHeading kicker="Routes & stops" title="Where the shuttle" highlight="goes" subtitle="Six stops across four emirates." /><div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">{[
      { name: 'Dubai', details: 'Three stops: Deira, Al Quoz and Muhaisnah.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dubai%20skyline%202015.jpg?width=800' },
      { name: 'Sharjah', details: 'Muwaileh Bus Stand.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sharjah%20Corniche.jpg?width=800' },
      { name: 'Ajman', details: 'Opposite Lucky Center.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ajman.jpg?width=800' },
      { name: 'Umm Al Quwain', details: 'Mall of UAQ.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Umm%20Al%20Quwain%20Fort.jpg?width=800' },
    ].map((place) => <article key={place.name} className="group overflow-hidden rounded-3xl bg-white shadow-[0_18px_55px_rgba(15,39,64,0.13)] ring-1 ring-brand-100/60 transition-all hover:-translate-y-1.5 hover:shadow-[0_30px_75px_rgba(19,120,212,0.24)]"><div className="relative h-48 overflow-hidden"><Img src={place.image} alt={place.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"/><span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-brand-600 backdrop-blur"><MapPin size={18}/></span></div><div className="p-6"><h3 className="mt-1 font-display text-lg font-semibold text-ink">{place.name}</h3><p className="mt-2 text-[13.5px] leading-relaxed text-ink/55">{place.details}</p></div></article>)}</div></div></section>
    <section id="schedule-guide" className="bg-white py-20 scroll-mt-24">
      <div className="container-x">
        <SectionHeading kicker="Schedule & routes" title="Shuttle Bus" highlight="Schedule Guide" subtitle="Passenger pick-up locations, departure timings, and return drop points across the UAE." />
        <div className="animate-fade-up overflow-hidden rounded-[32px] bg-white p-4 shadow-[0_24px_66px_rgba(15,39,64,0.14)] ring-1 ring-brand-100/60 sm:p-6 lg:p-8">
          <div className="relative group overflow-hidden rounded-2xl bg-brand-50/50 ring-1 ring-brand-100/70">
            <img
              src="/assets/aistudio/RAK_Shuttle_Bus.png"
              alt="Ras Al Khaimah Airport Free Shuttle Bus Service Guide & Schedule"
              className="w-full h-auto object-contain rounded-2xl"
              loading="lazy"
            />
            <div className="absolute top-4 right-4 flex flex-wrap items-center gap-2">
              <a
                href="/assets/aistudio/RAK_Shuttle_Bus.png"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-[13px] font-semibold text-brand-700 shadow-md backdrop-blur transition hover:bg-white hover:scale-105"
              >
                <ExternalLink size={14} /> Open Full Size
              </a>
              <a
                href="/assets/aistudio/RAK_Shuttle_Bus.png"
                download="RAK_Shuttle_Bus.png"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-[13px] font-semibold text-white shadow-md transition hover:bg-brand-700 hover:scale-105"
              >
                <Download size={14} /> Download Guide
              </a>
            </div>
          </div>
          <p className="mt-4 text-center text-[13px] font-medium text-ink/60">
            Free shuttle bus service is arranged for passengers holding valid flight tickets from/to RAK Airport. For assistance, call 800 1700.
          </p>
        </div>
      </div>
    </section>
    <section className="bg-mist py-20"><div className="container-x"><SectionHeading kicker="Live schedule" title="Shuttle Bus" highlight="Timetable" subtitle="View current pickup locations, departure times and estimated arrival at Ras Al Khaimah International Airport." />
      {error && <div role="alert" className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900"><AlertTriangle className="mr-2 inline" size={18}/>{error}</div>}
      {!schedule && !error && <div className="mx-auto max-w-3xl animate-pulse rounded-3xl bg-brand-50 p-14 text-center text-brand-600">Loading current shuttle timetable…</div>}
      {schedule && (
        <div className="mx-auto max-w-5xl">
          {schedule.serviceStatus?.Status && schedule.serviceStatus.Status !== 'Operational' && <div role="status" className="mb-7 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900"><AlertTriangle className="mt-0.5 flex-none"/><div><b>Shuttle service: {schedule.serviceStatus.Status}</b><p className="mt-1 text-sm">{schedule.serviceStatus.PublicMessage || 'Please check with the airport before travelling.'}</p></div></div>}
          {schedule.announcement && <div role="status" className="mb-7 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900"><AlertTriangle className="mt-0.5 flex-none"/><div><b>{schedule.announcement.Title}</b><p className="mt-1 text-sm">{schedule.announcement.Message}</p></div></div>}
          {!schedule.serviceEnabled && <div className="mb-7 rounded-2xl bg-red-50 p-5 text-sm font-medium text-red-800">Shuttle service is temporarily suspended. Please contact the airport for assistance.</div>}
          {schedule.routes.length === 0 ? (
            <div className="rounded-2xl bg-brand-50 p-8 text-center text-ink/60">No published shuttle trips are currently available.</div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2">{schedule.routes.map((r) => {
                const firstTrip = r.trips?.[0]
                const days = Array.isArray(firstTrip?.operatingDays) ? firstTrip.operatingDays.join(', ') : 'Daily'
                const firstStopName = firstTrip?.stops?.[0]?.name ? `${firstTrip.stops[0].name} to RAK Airport` : 'RAK Airport Service'
                return (
                  <button key={r.id} type="button" onClick={() => selectRoute(r.id)} className={`rounded-2xl border p-5 text-left transition ${route?.id === r.id ? 'border-brand-500 bg-brand-600 text-white shadow-lg' : 'border-brand-100 bg-white text-ink hover:border-brand-300'}`}>
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-75"><RouteIcon size={15}/>{r.name}</span>
                    <h3 className="mt-2 font-display text-lg font-semibold">{r.description}</h3>
                    <p className="mt-2 text-sm opacity-75">{days} · {firstStopName}</p>
                  </button>
                )
              })}</div>
              {route && <div className="mt-8"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-2xl font-semibold text-ink">{route.name}</h2><p className="mt-1 text-sm text-ink/55">{route.direction}</p></div><div className="flex rounded-xl bg-brand-50 p-1">{(route.trips || []).map((item) => <button key={item.id} onClick={() => setTripId(item.id)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${trip?.id === item.id ? 'bg-white text-brand-700 shadow-sm' : 'text-ink/55'}`}>{item.name}</button>)}</div></div>{trip && <TripSchedule trip={trip}/>}</div>}
            </>
          )}
        </div>
      )}
    </div></section>
    <section className="bg-gradient-to-b from-brand-100 to-brand-50 py-20"><div className="container-x grid gap-7 lg:grid-cols-2"><div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-brand-100"><CalendarDays className="text-brand-500"/><h2 className="mt-4 font-display text-2xl font-semibold text-ink">Return Shuttle Service</h2><p className="mt-3 leading-relaxed text-ink/60">{schedule?.returnJourneyMessage || 'Return shuttle service operates according to flight arrivals. Please contact the airport for assistance.'}</p><div className="mt-5 flex items-center gap-2 text-sm font-medium text-ink/70"><MapPin size={17} className="text-brand-500"/>Drop-off locations follow the selected route in reverse order.</div></div><div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-brand-100"><Clock3 className="text-brand-500"/><h2 className="mt-4 font-display text-2xl font-semibold text-ink">Important information</h2><ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/65"><li>• Complimentary shuttle service is available for eligible flight passengers.</li><li>• A valid flight ticket to or from RAK Airport is required.</li><li>• Please be at your pickup location before the scheduled departure time.</li><li>• Timings may change based on operational requirements.</li></ul></div></div></section>
    <section className="bg-white py-16">
      <div className="container-x text-center">
        <Phone className="mx-auto text-brand-500"/>
        <h2 className="mt-4 font-display text-2xl font-semibold text-ink">Need Assistance?</h2>
        <p className="mt-2 text-ink/60">Airport Call Center: <b>800 1700</b></p>
        <a href="tel:8001700" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-700">
          <Phone size={16}/>Call Now
        </a>
        <div className="mt-12 border-t border-brand-100 pt-8 text-center">
          <p className="mb-4 inline-flex items-center gap-2 text-xs text-ink/50"><Shield size={14} className="text-brand-500" />Shuttle Dispatch &amp; Operations Team</p>
          <div><Link to="/admin/bus-service" className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
            Operations Panel Login <span aria-hidden="true">&rarr;</span>
          </Link></div>
        </div>
      </div>
    </section>
  </>
}
