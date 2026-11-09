// Maps the FIDS API's vocabulary onto the UI's. Live data is fetched by
// useFlights.js; this module only translates one shape into the other.

export const statusStyle = {
  'On Time': 'bg-emerald-50 text-emerald-600',
  Boarding: 'bg-brand-50 text-brand-600',
  Delayed: 'bg-amber-50 text-amber-600',
  Landed: 'bg-slate-100 text-slate-500',
  Departed: 'bg-slate-100 text-slate-500',
  Scheduled: 'bg-violet-50 text-violet-600',
  Cancelled: 'bg-rose-50 text-rose-600',
}

// The API emits ~22 status labels (see statusMap in the API's index.js); the
// palette above has 7 tones. Anything unlisted falls back to Scheduled.
const STATUS_TONE = {
  'arrived': 'Landed',
  'landed': 'Landed',
  'now landing': 'Landed',
  'departed': 'Departed',
  'delayed': 'Delayed',
  'weather delay': 'Delayed',
  'holding': 'Delayed',
  'canceled': 'Cancelled',
  'cancelled': 'Cancelled',
  'boarding': 'Boarding',
  'final call': 'Boarding',
  'gate open': 'Boarding',
  'gate closed': 'Boarding',
  'at gate': 'Boarding',
  'check in': 'Boarding',
  'on time': 'On Time',
}

const AIRLINE_NAMES = {
  '6E': 'IndiGo',
  G9: 'Air Arabia',
  IX: 'Air India Express',
  PK: 'Pakistan Intl',
  SG: 'SpiceJet',
  FZ: 'flydubai',
  AI: 'Air India',
  UK: 'Vistara',
}

export const statusTone = (status) => STATUS_TONE[String(status ?? '').toLowerCase()] ?? 'Scheduled'

export const statusClass = (status) => statusStyle[statusTone(status)]

// The API shouts ("ON TIME", "ARRIVED"); the board reads better in title case.
const titleCase = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

// The FIDS API can provide the carrier code separately ("IX" + "332") or
// already joined ("6E1496"). Always present one familiar flight identifier.
const spaceFlightNo = (flightNo, airlineCode) => {
  const no = String(flightNo ?? '').trim()
  const code = String(airlineCode ?? '').trim()
  if (!no) return ''
  if (code && no.toUpperCase().startsWith(code.toUpperCase()) && no.length > code.length) {
    return `${no.slice(0, code.length)} ${no.slice(code.length).trim()}`
  }
  return code ? `${code} ${no}` : no
}

/** One API flight -> the shape the board and spotlight render. */
export function normalizeFlight(f) {
  const status = titleCase(f.Status)
  return {
    flight: spaceFlightNo(f.FlightNo, f.Airline),
    airline: AIRLINE_NAMES[f.Airline] ?? f.Airline ?? '',
    city: f.City ?? f.Airport ?? '',
    iata: f.IATA ?? '',
    // Scheduled/Estimated are newer API fields; Time is the long-standing one.
    sch: f.Scheduled ?? f.Time ?? '--:--',
    est: f.Estimated ?? null,
    date: f.Date ?? '',
    status,
    tone: statusTone(f.Status),
  }
}

/** Landed/Departed/Cancelled flights are done — never the "next" flight. */
export const isCompleted = (f) => ['Landed', 'Departed', 'Cancelled'].includes(f.tone)

// Departure boards should lead with flights passengers can act on right now.
// Keep the API's original order within each group.
const DEPARTURE_STATUS_ORDER = {
  'check in': 0,
  'check-in': 0,
  'on time': 1,
  departed: 2,
}

export function sortDeparturesForDisplay(flights) {
  return flights
    .map((flight, index) => ({ flight, index }))
    .sort((a, b) => {
      const aRank = DEPARTURE_STATUS_ORDER[String(a.flight.status ?? '').toLowerCase()] ?? 3
      const bRank = DEPARTURE_STATUS_ORDER[String(b.flight.status ?? '').toLowerCase()] ?? 3
      return aRank - bRank || a.index - b.index
    })
    .map(({ flight }) => flight)
}
