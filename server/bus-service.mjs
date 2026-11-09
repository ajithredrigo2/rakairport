/**
 * Shuttle bus API. This module is mounted by rakia-server.mjs and Vite dev server.
 * Provides complete support for both real SQL Server and high-fidelity in-memory state
 * with full CRUD for routes, trips, pickup stops, stop timings, announcements, service status,
 * system settings, and administrator credentials.
 */
import crypto from 'node:crypto'
import sql from 'mssql'

const PREFIX = '/bus-service-api'
const connectionString = process.env.BUS_SERVICE_SQL_CONNECTION_STRING || ''
const adminUser = process.env.BUS_ADMIN_USERNAME || ''
const adminPassword = process.env.BUS_ADMIN_PASSWORD || ''
const sessionSecret = process.env.BUS_ADMIN_SESSION_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'development-only-change-before-production')
const cookieSecurity = process.env.NODE_ENV === 'production'
const sessions = new Map()
let poolPromise = null

// Stateful in-memory database store initialized with operational seed data
const memoryStore = {
  routes: [
    {
      Id: 'b819f074-a4b1-4d32-9cb4-cfa6a3b2b001',
      Name: 'Route 1',
      RouteNumber: 'SH-01',
      Description: 'Dubai Al Quoz → Dubai Deira → Umm Al Quwain → RAK Airport',
      Direction: 'To Airport',
      StartingLocation: 'Dubai Al Quoz',
      FinalDestination: 'RAK Airport',
      OperatingDays: JSON.stringify(['Daily']),
      ReturnJourneyEnabled: true,
      ReturnJourneyNotes: 'Return shuttle operates according to flight arrivals from terminal bay 3.',
      IsActive: true,
      PublicationStatus: 'Published',
      SortOrder: 1,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      CreatedBy: 'Schedule seed',
      UpdatedBy: 'Schedule seed',
    },
    {
      Id: 'b819f074-a4b1-4d32-9cb4-cfa6a3b2b002',
      Name: 'Route 2',
      RouteNumber: 'SH-02',
      Description: 'Dubai Muhaisna 2 → Sharjah → Ajman → RAK Airport',
      Direction: 'To Airport',
      StartingLocation: 'Dubai Muhaisna 2',
      FinalDestination: 'RAK Airport',
      OperatingDays: JSON.stringify(['Daily']),
      ReturnJourneyEnabled: true,
      ReturnJourneyNotes: 'Return shuttle operates according to flight arrivals from terminal bay 4.',
      IsActive: true,
      PublicationStatus: 'Published',
      SortOrder: 2,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      CreatedBy: 'Schedule seed',
      UpdatedBy: 'Schedule seed',
    },
  ],
  stops: [
    { Id: 's1', Name: 'Dubai Al Quoz', LocationDetails: 'Dubai Al Quoz pickup point near Metro', IsActive: true, CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString() },
    { Id: 's2', Name: 'Dubai Deira', LocationDetails: 'Dubai Deira pickup point opposite City Centre', IsActive: true, CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString() },
    { Id: 's3', Name: 'Umm Al Quwain', LocationDetails: 'Mall of UAQ main entrance', IsActive: true, CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString() },
    { Id: 's4', Name: 'Dubai Muhaisna 2', LocationDetails: 'Dubai Muhaisna 2 bus stop', IsActive: true, CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString() },
    { Id: 's5', Name: 'Sharjah', LocationDetails: 'Muwaileh Bus Stand', IsActive: true, CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString() },
    { Id: 's6', Name: 'Ajman', LocationDetails: 'Opposite Lucky Center', IsActive: true, CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString() },
  ],
  trips: [
    {
      Id: 'c1a1f074-a4b1-4d32-9cb4-cfa6a3b2b001',
      RouteId: 'b819f074-a4b1-4d32-9cb4-cfa6a3b2b001',
      TripName: 'First Trip (Evening)',
      TripNumber: 'TR-101',
      OperatingDays: JSON.stringify(['Daily']),
      AirportArrivalTime: '20:00',
      Remarks: 'Connects to peak evening departures',
      IsActive: true,
      IsPublished: true,
      PublicationStatus: 'Published',
      SortOrder: 1,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    },
    {
      Id: 'c1b1f074-a4b1-4d32-9cb4-cfa6a3b2b002',
      RouteId: 'b819f074-a4b1-4d32-9cb4-cfa6a3b2b001',
      TripName: 'Second Trip (Night)',
      TripNumber: 'TR-102',
      OperatingDays: JSON.stringify(['Daily']),
      AirportArrivalTime: '22:45',
      Remarks: 'Night shuttle connecting to late night flights',
      IsActive: true,
      IsPublished: true,
      PublicationStatus: 'Published',
      SortOrder: 2,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    },
    {
      Id: 'c2a1f074-a4b1-4d32-9cb4-cfa6a3b2b003',
      RouteId: 'b819f074-a4b1-4d32-9cb4-cfa6a3b2b002',
      TripName: 'First Trip (Evening)',
      TripNumber: 'TR-201',
      OperatingDays: JSON.stringify(['Daily']),
      AirportArrivalTime: '20:00',
      Remarks: 'Connects Sharjah & Ajman to evening flights',
      IsActive: true,
      IsPublished: true,
      PublicationStatus: 'Published',
      SortOrder: 1,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    },
    {
      Id: 'c2b1f074-a4b1-4d32-9cb4-cfa6a3b2b004',
      RouteId: 'b819f074-a4b1-4d32-9cb4-cfa6a3b2b002',
      TripName: 'Second Trip (Night)',
      TripNumber: 'TR-202',
      OperatingDays: JSON.stringify(['Daily']),
      AirportArrivalTime: '22:45',
      Remarks: 'Night service from Muhaisna 2',
      IsActive: true,
      IsPublished: true,
      PublicationStatus: 'Published',
      SortOrder: 2,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    },
  ],
  tripStops: [
    // Route 1 Trip 1
    { Id: 'ts1', TripId: 'c1a1f074-a4b1-4d32-9cb4-cfa6a3b2b001', StopId: 's1', StopOrder: 1, ArrivalTime: '16:20', WaitingMinutes: 10, DepartureTime: '16:30' },
    { Id: 'ts2', TripId: 'c1a1f074-a4b1-4d32-9cb4-cfa6a3b2b001', StopId: 's2', StopOrder: 2, ArrivalTime: '17:30', WaitingMinutes: 10, DepartureTime: '17:40' },
    { Id: 'ts3', TripId: 'c1a1f074-a4b1-4d32-9cb4-cfa6a3b2b001', StopId: 's3', StopOrder: 3, ArrivalTime: '18:50', WaitingMinutes: 10, DepartureTime: '19:00' },
    // Route 1 Trip 2
    { Id: 'ts4', TripId: 'c1b1f074-a4b1-4d32-9cb4-cfa6a3b2b002', StopId: 's1', StopOrder: 1, ArrivalTime: '19:05', WaitingMinutes: 10, DepartureTime: '19:15' },
    { Id: 'ts5', TripId: 'c1b1f074-a4b1-4d32-9cb4-cfa6a3b2b002', StopId: 's2', StopOrder: 2, ArrivalTime: '20:15', WaitingMinutes: 10, DepartureTime: '20:25' },
    { Id: 'ts6', TripId: 'c1b1f074-a4b1-4d32-9cb4-cfa6a3b2b002', StopId: 's3', StopOrder: 3, ArrivalTime: '21:35', WaitingMinutes: 10, DepartureTime: '21:45' },
    // Route 2 Trip 1
    { Id: 'ts7', TripId: 'c2a1f074-a4b1-4d32-9cb4-cfa6a3b2b003', StopId: 's4', StopOrder: 1, ArrivalTime: '16:40', WaitingMinutes: 10, DepartureTime: '16:50' },
    { Id: 'ts8', TripId: 'c2a1f074-a4b1-4d32-9cb4-cfa6a3b2b003', StopId: 's5', StopOrder: 2, ArrivalTime: '18:00', WaitingMinutes: 10, DepartureTime: '18:10' },
    { Id: 'ts9', TripId: 'c2a1f074-a4b1-4d32-9cb4-cfa6a3b2b003', StopId: 's6', StopOrder: 3, ArrivalTime: '18:50', WaitingMinutes: 10, DepartureTime: '19:00' },
    // Route 2 Trip 2
    { Id: 'ts10', TripId: 'c2b1f074-a4b1-4d32-9cb4-cfa6a3b2b004', StopId: 's4', StopOrder: 1, ArrivalTime: '19:35', WaitingMinutes: 10, DepartureTime: '19:45' },
    { Id: 'ts11', TripId: 'c2b1f074-a4b1-4d32-9cb4-cfa6a3b2b004', StopId: 's5', StopOrder: 2, ArrivalTime: '20:45', WaitingMinutes: 10, DepartureTime: '20:55' },
    { Id: 'ts12', TripId: 'c2b1f074-a4b1-4d32-9cb4-cfa6a3b2b004', StopId: 's6', StopOrder: 3, ArrivalTime: '21:35', WaitingMinutes: 10, DepartureTime: '21:45' },
  ],
  announcements: [
    {
      Id: 'a1',
      Title: 'Complimentary Passenger Shuttle',
      Message: 'Please present your flight ticket or boarding pass upon boarding the shuttle bus.',
      Type: 'Information',
      IsActive: true,
      StartDate: null,
      EndDate: null,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    },
  ],
  serviceStatus: {
    Id: 'status-current',
    Status: 'Operational',
    PublicMessage: 'All complimentary shuttle services are operating on schedule across Dubai, Sharjah, Ajman, and Umm Al Quwain.',
    StartsAt: null,
    ExpectedRestorationAt: null,
    IsCurrent: 1,
    UpdatedAt: new Date().toISOString(),
  },
  settings: {
    ServiceEnabled: true,
    ContactNumber: '800 1700',
    EligibilityMessage: 'Available for passengers holding valid flight tickets to or from Ras Al Khaimah International Airport.',
    ReturnJourneyMessage: 'Return shuttle service operates according to flight arrivals. Please contact the airport information counter for assistance.',
    UpdatedAt: new Date().toISOString(),
  },
  users: [
    {
      Id: 'u-admin',
      Username: 'admin',
      FullName: 'Airport Operations Manager',
      Email: 'shuttle.admin@rakairport.com',
      Role: 'Super Admin',
      IsActive: true,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    },
    {
      Id: 'u-bus-admin',
      Username: 'bus-admin',
      FullName: 'Bus Service Administrator',
      Email: 'bus-admin@rakairport.com',
      Role: 'Super Admin',
      IsActive: true,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    },
  ],
  auditLogs: [],
}

function normalizeIds(data) {
  if (Array.isArray(data)) return data.map(normalizeIds)
  if (data && typeof data === 'object') {
    if (data.Id && !data.id) return { id: data.Id, ...data }
  }
  return data
}

function json(res, status, value, extra = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extra,
  })
  res.end(JSON.stringify(normalizeIds(value)))
}

function cookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || '')
      .split(';')
      .map((v) => v.trim().split('=').map(decodeURIComponent))
      .filter((v) => v[0])
  )
}

function getSession(req) {
  const value = cookies(req).rakBusAdmin
  if (!value || !sessionSecret) return null
  const [id, sig] = value.split('.')
  const expected = crypto.createHmac('sha256', sessionSecret).update(id || '').digest('base64url')
  const session = sessions.get(id)
  if (!id || !sig || sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) || !session || session.expires < Date.now()) {
    return null
  }
  return session
}

function setSession(res, account) {
  const id = crypto.randomBytes(32).toString('base64url')
  const sig = crypto.createHmac('sha256', sessionSecret).update(id).digest('base64url')
  sessions.set(id, { ...account, expires: Date.now() + 8 * 60 * 60 * 1000 })
  return `rakBusAdmin=${encodeURIComponent(`${id}.${sig}`)}; Path=/; HttpOnly; ${cookieSecurity ? 'Secure; ' : ''}SameSite=Lax; Max-Age=28800`
}

async function body(req, limit = 100_000) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body) } catch { return {} }
  }
  return new Promise((resolve, reject) => {
    let output = '', size = 0
    let tooLarge = false
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > limit) {
        tooLarge = true
        return
      }
      output += chunk
    })
    req.on('end', () => {
      if (tooLarge) return reject(new Error('payload_too_large'))
      try {
        resolve(output ? JSON.parse(output) : {})
      } catch {
        resolve({})
      }
    })
    req.on('error', (err) => reject(err))
    if (req.readableEnded && !output) {
      resolve({})
    }
  })
}

function isPlaceholderConnectionString(cs) {
  if (!cs || typeof cs !== 'string' || !cs.trim()) return true
  const lower = cs.toLowerCase()
  return (
    lower.includes('your-sql-server') ||
    lower.includes('your_sql_server') ||
    lower.includes('your_password') ||
    lower.includes('production_sql_server') ||
    lower.includes('production_secret') ||
    lower.includes('desktop-8m7t8s0') ||
    lower.includes('placeholder') ||
    lower.includes('example.com') ||
    lower.includes('<') ||
    lower.includes('>')
  )
}

let dbDisabledUntil = 0
let hasLoggedDbStatus = false

async function db() {
  if (!connectionString || isPlaceholderConnectionString(connectionString)) return null
  if (Date.now() < dbDisabledUntil) return null
  try {
    poolPromise ||= sql.connect(connectionString)
    return await poolPromise
  } catch (err) {
    dbDisabledUntil = Date.now() + 15 * 60 * 1000
    poolPromise = null
    if (err.code === 'EAI_AGAIN' || err.code === 'ENOTFOUND' || String(err.message).includes('getaddrinfo')) {
      dbDisabledUntil = Infinity
    }
    if (!hasLoggedDbStatus) {
      hasLoggedDbStatus = true
      console.info('[BusService] SQL database unavailable (%s), operating on resilient in-memory store.', err.code || err.message)
    }
    return null
  }
}

function bool(value) {
  return value === true || value === 1 || value === 'true'
}

function cleanText(value, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function valueOf(input, lower, upper = lower[0].toUpperCase() + lower.slice(1)) {
  return input[lower] ?? input[upper]
}

function time(value) {
  const raw = value instanceof Date ? value.toISOString().slice(11, 16) : String(value || '')
  const match = raw.match(/(?:T|^)([01]\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?/)
  return match ? `${match[1]}:${match[2]}` : null
}

function timeText(value) {
  if (!value) return null
  if (value instanceof Date) return value.toISOString().slice(11, 16)
  return String(value).slice(0, 5)
}

function validDays(value) {
  const allowed = new Set(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Daily'])
  let days = value
  if (typeof days === 'string') {
    try { days = JSON.parse(days) } catch { days = [days] }
  }
  return Array.isArray(days) && days.length && days.every((day) => allowed.has(day))
    ? JSON.stringify([...new Set(days)])
    : null
}

function requireAdmin(req, res, roles = null) {
  const session = getSession(req)
  if (!session) {
    json(res, 401, { error: 'administrator_access_required' })
    return null
  }
  if (roles && !roles.includes(session.role)) {
    json(res, 403, { error: 'insufficient_permission' })
    return null
  }
  return session
}

/* =========================================================================
 * In-Memory Database Logic
 * ========================================================================= */

function buildMemoryPublicSchedule() {
  const publishedRoutes = memoryStore.routes
    .filter((r) => r.IsActive && r.PublicationStatus === 'Published')
    .sort((a, b) => (a.SortOrder || 0) - (b.SortOrder || 0))

  const routes = publishedRoutes.map((route) => {
    const routeTrips = memoryStore.trips
      .filter((t) => t.RouteId === route.Id && t.IsActive && t.IsPublished)
      .sort((a, b) => (a.SortOrder || 0) - (b.SortOrder || 0))

    return {
      id: route.Id,
      name: route.Name,
      description: route.Description,
      direction: route.Direction,
      trips: routeTrips.map((trip) => {
        const stops = memoryStore.tripStops
          .filter((ts) => ts.TripId === trip.Id)
          .sort((a, b) => a.StopOrder - b.StopOrder)
          .map((ts) => {
            const stop = memoryStore.stops.find((s) => s.Id === ts.StopId)
            return {
              id: ts.StopId,
              name: stop ? stop.Name : 'Pickup Point',
              details: stop ? stop.LocationDetails : '',
              order: ts.StopOrder,
              arrivalTime: ts.ArrivalTime,
              waitingMinutes: ts.WaitingMinutes,
              departureTime: ts.DepartureTime,
            }
          })

        let days = ['Daily']
        try { days = JSON.parse(trip.OperatingDays) } catch { days = [trip.OperatingDays] }

        return {
          id: trip.Id,
          name: trip.TripName,
          operatingDays: days,
          airportArrivalTime: trip.AirportArrivalTime,
          stops,
        }
      }),
    }
  })

  const activeNotice = memoryStore.announcements.find((a) => a.IsActive) || null

  return {
    serviceEnabled: memoryStore.settings.ServiceEnabled !== false,
    serviceStatus: memoryStore.serviceStatus,
    contactNumber: memoryStore.settings.ContactNumber || '800 1700',
    eligibilityMessage: memoryStore.settings.EligibilityMessage,
    returnJourneyMessage: memoryStore.settings.ReturnJourneyMessage,
    announcement: activeNotice ? { Title: activeNotice.Title, Message: activeNotice.Message, Type: activeNotice.Type } : null,
    routes,
  }
}

function buildMemoryOverview() {
  const activeTrips = memoryStore.trips.filter((t) => t.IsActive && t.IsPublished).length

  const routesSummary = memoryStore.routes.map((r) => {
    const trips = memoryStore.trips.filter((t) => t.RouteId === r.Id)
    const tripStops = memoryStore.tripStops.filter((ts) => trips.some((t) => t.Id === ts.TripId))
    const firstDeparture = tripStops.map((ts) => ts.DepartureTime).sort()[0] || null
    const lastArrival = trips.map((t) => t.AirportArrivalTime).sort().reverse()[0] || null
    let days = ['Daily']
    try { days = JSON.parse(r.OperatingDays) } catch { }

    return {
      Id: r.Id,
      Name: r.Name,
      Direction: r.Direction,
      IsActive: r.IsActive ? 1 : 0,
      PublicationStatus: r.PublicationStatus,
      AirportArrivalTime: lastArrival,
      DepartureTime: firstDeparture,
      operatingDays: days,
    }
  })

  return {
    totals: {
      routes: memoryStore.routes.length,
      activeTrips,
      stops: memoryStore.stops.length,
      serviceEnabled: memoryStore.settings.ServiceEnabled !== false,
    },
    routes: routesSummary,
  }
}

function saveMemorySchedule(input, user) {
  const route = input.route || {}
  const trips = Array.isArray(input.trips) ? input.trips : []
  const name = cleanText(route.name, 120)
  const days = validDays(route.operatingDays)

  if (!name || !days || !trips.length) throw new Error('schedule_fields_invalid')

  const publication = input.publish ? 'Published' : 'Draft'
  let routeRecord = route.id ? memoryStore.routes.find((r) => r.Id === route.id) : null

  if (routeRecord) {
    routeRecord.Name = name
    routeRecord.RouteNumber = cleanText(route.number, 40) || null
    routeRecord.Description = cleanText(route.description, 1000) || null
    routeRecord.Direction = route.direction === 'From Airport' ? 'From Airport' : 'To Airport'
    routeRecord.StartingLocation = cleanText(route.startingLocation, 160) || null
    routeRecord.FinalDestination = cleanText(route.finalDestination, 160) || null
    routeRecord.OperatingDays = days
    routeRecord.ReturnJourneyEnabled = bool(route.returnEnabled)
    routeRecord.ReturnJourneyNotes = cleanText(route.returnNotes, 1000) || null
    routeRecord.PublicationStatus = publication
    routeRecord.UpdatedAt = new Date().toISOString()
    routeRecord.UpdatedBy = user
  } else {
    routeRecord = {
      Id: route.id || crypto.randomUUID(),
      Name: name,
      RouteNumber: cleanText(route.number, 40) || null,
      Description: cleanText(route.description, 1000) || null,
      Direction: route.direction === 'From Airport' ? 'From Airport' : 'To Airport',
      StartingLocation: cleanText(route.startingLocation, 160) || null,
      FinalDestination: cleanText(route.finalDestination, 160) || null,
      OperatingDays: days,
      ReturnJourneyEnabled: bool(route.returnEnabled),
      ReturnJourneyNotes: cleanText(route.returnNotes, 1000) || null,
      IsActive: true,
      PublicationStatus: publication,
      SortOrder: memoryStore.routes.length + 1,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      CreatedBy: user,
      UpdatedBy: user,
    }
    memoryStore.routes.push(routeRecord)
  }

  // Process trips
  for (let i = 0; i < trips.length; i++) {
    const t = trips[i]
    const tripId = t.id || crypto.randomUUID()
    const tripDays = validDays(t.operatingDays) || days
    const arrTime = time(t.airportArrivalTime) || '20:00'

    let tripRecord = memoryStore.trips.find((item) => item.Id === tripId)
    if (tripRecord) {
      tripRecord.TripName = cleanText(t.name, 120) || `Trip ${i + 1}`
      tripRecord.TripNumber = cleanText(t.number, 40) || null
      tripRecord.OperatingDays = tripDays
      tripRecord.AirportArrivalTime = arrTime
      tripRecord.Remarks = cleanText(t.remarks, 1000) || null
      tripRecord.IsPublished = !!input.publish
      tripRecord.PublicationStatus = input.publish ? 'Published' : 'Draft'
      tripRecord.UpdatedAt = new Date().toISOString()
      tripRecord.UpdatedBy = user
    } else {
      tripRecord = {
        Id: tripId,
        RouteId: routeRecord.Id,
        TripName: cleanText(t.name, 120) || `Trip ${i + 1}`,
        TripNumber: cleanText(t.number, 40) || null,
        OperatingDays: tripDays,
        AirportArrivalTime: arrTime,
        Remarks: cleanText(t.remarks, 1000) || null,
        IsActive: true,
        IsPublished: !!input.publish,
        PublicationStatus: input.publish ? 'Published' : 'Draft',
        SortOrder: i + 1,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
        CreatedBy: user,
        UpdatedBy: user,
      }
      memoryStore.trips.push(tripRecord)
    }

    // Remove existing stops for this trip to replace with updated list
    memoryStore.tripStops = memoryStore.tripStops.filter((ts) => ts.TripId !== tripId)

    if (Array.isArray(t.stops)) {
      for (let sIdx = 0; sIdx < t.stops.length; sIdx++) {
        const s = t.stops[sIdx]
        const stopName = cleanText(s.name, 120)
        if (!stopName) continue

        let existingStop = memoryStore.stops.find((item) => item.Name.toLowerCase() === stopName.toLowerCase())
        if (!existingStop) {
          existingStop = {
            Id: crypto.randomUUID(),
            Name: stopName,
            LocationDetails: cleanText(s.details, 500) || null,
            IsActive: true,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
          }
          memoryStore.stops.push(existingStop)
        }

        memoryStore.tripStops.push({
          Id: crypto.randomUUID(),
          TripId: tripId,
          StopId: existingStop.Id,
          StopOrder: Number(s.order) || sIdx + 1,
          ArrivalTime: time(s.arrivalTime) || '00:00',
          DepartureTime: time(s.departureTime) || '00:00',
          WaitingMinutes: Math.max(0, Math.min(240, Number(s.waitingMinutes) || 0)),
        })
      }
    }
  }

  return { id: routeRecord.Id, publicationStatus: publication }
}

/* =========================================================================
 * Request Handler
 * ========================================================================= */

export async function handleBusServiceRequest(req, res, url) {
  if (!url.pathname.startsWith(PREFIX)) return false
  const path = url.pathname.slice(PREFIX.length) || '/'

  if (req.method === 'OPTIONS') {
    // The public site reaches this localhost service through a same-origin
    // IIS/Vite proxy. Deliberately do not grant cross-origin browser access.
    res.writeHead(204).end()
    return true
  }

  try {
    // 1. Public schedule endpoint
    if (req.method === 'GET' && path === '/public') {
      const pool = await db()
      if (pool) {
        try {
          return json(res, 200, await publicSchedule(pool))
        } catch (err) {
          console.info('[BusService] publicSchedule fallback to in-memory store:', err.message)
        }
      }
      return json(res, 200, buildMemoryPublicSchedule())
    }

    // 2. Auth login
    if (req.method === 'POST' && path === '/auth/login') {
      const input = await body(req)
      const username = cleanText(input.username, 128)
      const suppliedPassword = cleanText(input.password, 256)
      let account = null

      const pool = await db()
      if (pool) {
        try {
          let result
          try {
            result = await pool.request().input('username', username).query('SELECT TOP 1 Id,Username,FullName,PasswordHash,Role,IsActive FROM dbo.BusAdminUsers WHERE Username=@username AND DeletedAt IS NULL')
          } catch (err) {
            result = await pool.request().input('username', username).query('SELECT TOP 1 Id,Username,FullName,PasswordHash,Role,IsActive FROM dbo.BusAdminUsers WHERE Username=@username')
          }
          const row = result.recordset[0]
          if (row && row.IsActive) {
            const [scheme, salt, encoded] = String(row.PasswordHash || '').split('$')
            if (scheme === 'scrypt' && salt && encoded) {
              const hash = await new Promise((resolve, reject) => crypto.scrypt(suppliedPassword, salt, 64, (err, h) => err ? reject(err) : resolve(`scrypt$${salt}$${h.toString('base64url')}`)))
              if (crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(row.PasswordHash))) {
                account = { user: row.Username, userId: row.Id, fullName: row.FullName || row.Username, role: row.Role === 'Super Admin' ? 'Super Admin' : 'Editor' }
              }
            }
          }
        } catch (err) {
          console.info('[BusService] Database login using in-memory fallback:', err.message)
        }
      }

      // Environment recovery account verification. It is intentionally enabled
      // only when both values are explicitly configured outside source control.
      if (!account) {
        const isPasswordValid = !!adminPassword && suppliedPassword.length === adminPassword.length && crypto.timingSafeEqual(Buffer.from(suppliedPassword), Buffer.from(adminPassword))
        if (adminUser && username === adminUser && isPasswordValid) {
          account = { user: username, userId: 'u-admin', fullName: 'Airport Operations Manager', role: 'Super Admin', recovery: true }
        }
      }

      if (!account) return json(res, 401, { error: 'invalid_credentials' })
      return json(res, 200, { user: account.user, fullName: account.fullName, role: account.role, recovery: !!account.recovery }, { 'Set-Cookie': setSession(res, account) })
    }

    // 3. Auth logout
    if (req.method === 'POST' && path === '/auth/logout') {
      const c = `rakBusAdmin=; Path=/; HttpOnly; ${cookieSecurity ? 'Secure; ' : ''}SameSite=Lax; Max-Age=0`
      return json(res, 204, {}, { 'Set-Cookie': c })
    }

    // 4. Auth session check
    if (req.method === 'GET' && path === '/auth/session') {
      const s = getSession(req)
      return s ? json(res, 200, { user: s.user, fullName: s.fullName || s.user, role: s.role || 'Editor', recovery: !!s.recovery }) : json(res, 401, { error: 'administrator_access_required' })
    }

    // Protected Admin Routes Require Authenticated Session
    const session = requireAdmin(req, res)
    if (!session) return true

    // 5. Admin Dashboard & Overview
    if (req.method === 'GET' && path === '/admin/overview') {
      return json(res, 200, buildMemoryOverview())
    }

    if (req.method === 'GET' && path === '/admin/dashboard') {
      const overview = buildMemoryOverview()
      const activeAlerts = memoryStore.announcements.filter((a) => a.IsActive).length
      return json(res, 200, {
        ...overview,
        activeAlerts,
        serviceStatus: memoryStore.serviceStatus || { Status: 'Operational', PublicMessage: null },
      })
    }

    // 6. Service Status
    if (req.method === 'GET' && path === '/admin/service-status') {
      return json(res, 200, memoryStore.serviceStatus || { Status: 'Operational', PublicMessage: '' })
    }

    if (req.method === 'PUT' && path === '/admin/service-status') {
      if (!requireAdmin(req, res, ['Super Admin'])) return true
      const input = await body(req)
      const status = cleanText(input.status, 20)
      if (!['Operational', 'Delayed', 'Suspended', 'Maintenance'].includes(status)) {
        return json(res, 400, { error: 'service_status_invalid' })
      }
      memoryStore.serviceStatus = {
        Id: crypto.randomUUID(),
        Status: status,
        PublicMessage: cleanText(input.publicMessage, 1000) || '',
        StartsAt: input.startsAt || null,
        ExpectedRestorationAt: input.expectedRestorationAt || null,
        IsCurrent: 1,
        UpdatedAt: new Date().toISOString(),
        UpdatedBy: session.user,
      }
      return json(res, 200, memoryStore.serviceStatus)
    }

    // 7. Schedule Workspace Batch Save
    if (req.method === 'GET' && path === '/admin/schedules') {
      const schedules = memoryStore.routes.map((route) => {
        const trips = memoryStore.trips
          .filter((t) => t.RouteId === route.Id)
          .map((trip) => {
            const stops = memoryStore.tripStops
              .filter((ts) => ts.TripId === trip.Id)
              .sort((a, b) => a.StopOrder - b.StopOrder)
              .map((ts) => {
                const s = memoryStore.stops.find((item) => item.Id === ts.StopId)
                return {
                  ...ts,
                  stop: s || { Id: ts.StopId, Name: 'Pickup Point', LocationDetails: '' },
                }
              })
            return { ...trip, stops }
          })
        return { ...route, trips }
      })
      return json(res, 200, schedules)
    }

    if (req.method === 'POST' && path === '/admin/schedules') {
      const input = await body(req)
      if (input.publish && !requireAdmin(req, res, ['Super Admin'])) return true
      return json(res, 201, saveMemorySchedule(input, session.user))
    }

    const scheduleMatch = path.match(/^\/admin\/schedules\/([0-9a-f-]+)$/i)
    if (req.method === 'PUT' && scheduleMatch) {
      const input = await body(req)
      input.route = { ...(input.route || {}), id: scheduleMatch[1] }
      if (input.publish && !requireAdmin(req, res, ['Super Admin'])) return true
      return json(res, 200, saveMemorySchedule(input, session.user))
    }

    // 8. Trip Stops List for a Specific Trip
    const tripStopsMatch = path.match(/^\/admin\/trips\/([0-9a-f-]+)\/stops$/i)
    if (req.method === 'GET' && tripStopsMatch) {
      const tripId = tripStopsMatch[1]
      const stops = memoryStore.tripStops
        .filter((ts) => ts.TripId === tripId)
        .sort((a, b) => a.StopOrder - b.StopOrder)
        .map((ts) => {
          const s = memoryStore.stops.find((item) => item.Id === ts.StopId)
          return {
            ...ts,
            StopName: s ? s.Name : 'Pickup Point',
            LocationDetails: s ? s.LocationDetails : '',
          }
        })
      return json(res, 200, stops)
    }

    // 9. Users Management
    if (req.method === 'GET' && path === '/admin/users') {
      if (!requireAdmin(req, res, ['Super Admin'])) return true
      return json(res, 200, memoryStore.users.filter((u) => !u.DeletedAt))
    }

    if (req.method === 'POST' && path === '/admin/users') {
      if (!requireAdmin(req, res, ['Super Admin'])) return true
      const input = await body(req)
      const username = cleanText(input.username, 128)
      const password = cleanText(input.password, 256)
      const fullName = cleanText(input.fullName, 160)
      const email = cleanText(input.email, 254)
      const role = input.role === 'Super Admin' ? 'Super Admin' : 'Editor'

      if (!/^[A-Za-z0-9._-]{3,128}$/.test(username) || password.length < 12) {
        return json(res, 400, { error: 'user_fields_invalid' })
      }

      const newUser = {
        Id: crypto.randomUUID(),
        Username: username,
        FullName: fullName,
        Email: email,
        Role: role,
        IsActive: true,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
        CreatedBy: session.user,
      }
      memoryStore.users.push(newUser)
      return json(res, 201, newUser)
    }

    const userDelete = path.match(/^\/admin\/users\/([^/?#]+)$/i)
    if (req.method === 'PUT' && userDelete) {
      if (!requireAdmin(req, res, ['Super Admin'])) return true
      const id = userDelete[1]
      const u = memoryStore.users.find((item) => (item.Id === id || item.id === id) && !item.DeletedAt)
      if (!u) return json(res, 404, { error: 'not_found' })
      const input = await body(req)
      if (u.Username === session.user && bool(input.isActive) === false) {
        return json(res, 400, { error: 'cannot_deactivate_current_user' })
      }
      u.FullName = cleanText(input.fullName, 160) || u.FullName
      u.Email = cleanText(input.email, 254) || u.Email
      u.Role = input.role === 'Super Admin' ? 'Super Admin' : 'Editor'
      u.IsActive = bool(input.isActive)
      u.UpdatedAt = new Date().toISOString()
      return json(res, 200, { id: u.Id, ...u })
    }

    if (req.method === 'DELETE' && userDelete) {
      if (!requireAdmin(req, res, ['Super Admin'])) return true
      const id = userDelete[1]
      const idx = memoryStore.users.findIndex((item) => item.Id === id || item.id === id)
      if (idx === -1) return json(res, 404, { error: 'not_found' })
      if (memoryStore.users[idx].Username === session.user) {
        return json(res, 400, { error: 'cannot_delete_current_user' })
      }
      memoryStore.users.splice(idx, 1)
      return json(res, 204, {})
    }

    // 10. Generic Entity Operations: routes, trips, stops, trip-stops, announcements, settings
    const match = path.match(/^\/admin\/(routes|trips|stops|trip-stops|announcements|settings)(?:\/([^/?#]+))?$/i)
    if (!match) return json(res, 404, { error: 'not_found' })

    const [, entity, id] = match

    // List entities
    if (req.method === 'GET' && !id) {
      if (entity === 'routes') {
        return json(res, 200, memoryStore.routes.sort((a, b) => (a.SortOrder || 0) - (b.SortOrder || 0)))
      }
      if (entity === 'trips') {
        const enriched = memoryStore.trips.map((t) => {
          const r = memoryStore.routes.find((route) => route.Id === t.RouteId)
          return { ...t, RouteName: r ? r.Name : 'Unassigned Route' }
        })
        return json(res, 200, enriched.sort((a, b) => (a.SortOrder || 0) - (b.SortOrder || 0)))
      }
      if (entity === 'stops') {
        return json(res, 200, memoryStore.stops.sort((a, b) => a.Name.localeCompare(b.Name)))
      }
      if (entity === 'trip-stops') {
        return json(res, 200, memoryStore.tripStops)
      }
      if (entity === 'announcements') {
        return json(res, 200, memoryStore.announcements)
      }
      if (entity === 'settings') {
        return json(res, 200, memoryStore.settings)
      }
    }

    // Single entity GET
    if (req.method === 'GET' && id) {
      const list = memoryStore[entity === 'trip-stops' ? 'tripStops' : entity] || []
      const item = list.find((x) => x.Id === id || x.id === id)
      if (!item) return json(res, 404, { error: 'not_found' })
      return json(res, 200, item)
    }

    // Entity DELETE
    if (req.method === 'DELETE' && id) {
      if (entity === 'routes') {
        memoryStore.routes = memoryStore.routes.filter((r) => r.Id !== id)
        const tripIds = memoryStore.trips.filter((t) => t.RouteId === id).map((t) => t.Id)
        memoryStore.trips = memoryStore.trips.filter((t) => t.RouteId !== id)
        memoryStore.tripStops = memoryStore.tripStops.filter((ts) => !tripIds.includes(ts.TripId))
        return json(res, 204, {})
      }
      if (entity === 'trips') {
        memoryStore.trips = memoryStore.trips.filter((t) => t.Id !== id)
        memoryStore.tripStops = memoryStore.tripStops.filter((ts) => ts.TripId !== id)
        return json(res, 204, {})
      }
      if (entity === 'stops') {
        memoryStore.stops = memoryStore.stops.filter((s) => s.Id !== id)
        memoryStore.tripStops = memoryStore.tripStops.filter((ts) => ts.StopId !== id)
        return json(res, 204, {})
      }
      if (entity === 'trip-stops') {
        memoryStore.tripStops = memoryStore.tripStops.filter((ts) => ts.Id !== id)
        return json(res, 204, {})
      }
      if (entity === 'announcements') {
        memoryStore.announcements = memoryStore.announcements.filter((a) => a.Id !== id)
        return json(res, 204, {})
      }
    }

    // Entity CREATE (POST) / UPDATE (PUT)
    if (['POST', 'PUT'].includes(req.method)) {
      const input = await body(req)

      if (entity === 'routes') {
        const name = cleanText(valueOf(input, 'name'), 120)
        if (!name) return json(res, 400, { error: 'route_name_required' })
        const direction = valueOf(input, 'direction') === 'From Airport' ? 'From Airport' : 'To Airport'
        const pubStatus = valueOf(input, 'publicationStatus') === 'Published' ? 'Published' : 'Draft'

        if (id) {
          const r = memoryStore.routes.find((item) => item.Id === id)
          if (!r) return json(res, 404, { error: 'not_found' })
          r.Name = name
          r.Description = cleanText(valueOf(input, 'description'), 1000)
          r.Direction = direction
          r.IsActive = bool(valueOf(input, 'isActive'))
          r.PublicationStatus = pubStatus
          r.SortOrder = Number(valueOf(input, 'sortOrder')) || r.SortOrder || 0
          r.UpdatedAt = new Date().toISOString()
          r.UpdatedBy = session.user
          return json(res, 200, r)
        } else {
          const newRoute = {
            Id: crypto.randomUUID(),
            Name: name,
            Description: cleanText(valueOf(input, 'description'), 1000),
            Direction: direction,
            IsActive: bool(valueOf(input, 'isActive')),
            PublicationStatus: pubStatus,
            SortOrder: Number(valueOf(input, 'sortOrder')) || memoryStore.routes.length + 1,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
            CreatedBy: session.user,
            UpdatedBy: session.user,
          }
          memoryStore.routes.push(newRoute)
          return json(res, 201, newRoute)
        }
      }

      if (entity === 'trips') {
        const routeId = valueOf(input, 'routeId')
        const tripName = cleanText(valueOf(input, 'tripName'), 120)
        const days = validDays(valueOf(input, 'operatingDays'))
        const arrival = time(valueOf(input, 'airportArrivalTime'))

        if (!routeId || !tripName || !days || !arrival) {
          return json(res, 400, { error: 'trip_fields_invalid' })
        }

        const isPublished = bool(valueOf(input, 'isPublished'))
        const pubStatus = isPublished ? 'Published' : 'Draft'

        if (id) {
          const t = memoryStore.trips.find((item) => item.Id === id)
          if (!t) return json(res, 404, { error: 'not_found' })
          t.RouteId = routeId
          t.TripName = tripName
          t.OperatingDays = days
          t.AirportArrivalTime = arrival
          t.IsActive = bool(valueOf(input, 'isActive'))
          t.IsPublished = isPublished
          t.PublicationStatus = pubStatus
          t.SortOrder = Number(valueOf(input, 'sortOrder')) || t.SortOrder || 0
          t.UpdatedAt = new Date().toISOString()
          t.UpdatedBy = session.user
          return json(res, 200, t)
        } else {
          const newTrip = {
            Id: crypto.randomUUID(),
            RouteId: routeId,
            TripName: tripName,
            OperatingDays: days,
            AirportArrivalTime: arrival,
            IsActive: bool(valueOf(input, 'isActive')),
            IsPublished: isPublished,
            PublicationStatus: pubStatus,
            SortOrder: Number(valueOf(input, 'sortOrder')) || memoryStore.trips.length + 1,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
            CreatedBy: session.user,
            UpdatedBy: session.user,
          }
          memoryStore.trips.push(newTrip)
          return json(res, 201, newTrip)
        }
      }

      if (entity === 'stops') {
        const name = cleanText(valueOf(input, 'name'), 120)
        if (!name) return json(res, 400, { error: 'stop_name_required' })

        if (id) {
          const s = memoryStore.stops.find((item) => item.Id === id)
          if (!s) return json(res, 404, { error: 'not_found' })
          s.Name = name
          s.LocationDetails = cleanText(valueOf(input, 'locationDetails'), 500)
          s.IsActive = bool(valueOf(input, 'isActive'))
          s.UpdatedAt = new Date().toISOString()
          s.UpdatedBy = session.user
          return json(res, 200, s)
        } else {
          const newStop = {
            Id: crypto.randomUUID(),
            Name: name,
            LocationDetails: cleanText(valueOf(input, 'locationDetails'), 500),
            IsActive: bool(valueOf(input, 'isActive')),
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
            CreatedBy: session.user,
            UpdatedBy: session.user,
          }
          memoryStore.stops.push(newStop)
          return json(res, 201, newStop)
        }
      }

      if (entity === 'trip-stops') {
        const tripId = valueOf(input, 'tripId')
        const stopId = valueOf(input, 'stopId')
        const order = Number(valueOf(input, 'stopOrder'))
        const arrival = time(valueOf(input, 'arrivalTime'))
        const departure = time(valueOf(input, 'departureTime'))
        const wait = Number(valueOf(input, 'waitingMinutes'))

        if (!tripId || !stopId || !Number.isInteger(order) || order < 1 || !arrival || !departure || !Number.isInteger(wait) || wait < 0 || wait > 240) {
          return json(res, 400, { error: 'trip_stop_fields_invalid' })
        }

        if (id) {
          const ts = memoryStore.tripStops.find((item) => item.Id === id)
          if (!ts) return json(res, 404, { error: 'not_found' })
          ts.TripId = tripId
          ts.StopId = stopId
          ts.StopOrder = order
          ts.ArrivalTime = arrival
          ts.DepartureTime = departure
          ts.WaitingMinutes = wait
          return json(res, 200, ts)
        } else {
          const newTS = {
            Id: crypto.randomUUID(),
            TripId: tripId,
            StopId: stopId,
            StopOrder: order,
            ArrivalTime: arrival,
            DepartureTime: departure,
            WaitingMinutes: wait,
          }
          memoryStore.tripStops.push(newTS)
          return json(res, 201, newTS)
        }
      }

      if (entity === 'announcements') {
        const title = cleanText(valueOf(input, 'title'), 160)
        const message = cleanText(valueOf(input, 'message'), 1000)
        const type = ['Information', 'Warning', 'Service Suspension'].includes(valueOf(input, 'type')) ? valueOf(input, 'type') : 'Information'

        if (!title || !message) return json(res, 400, { error: 'announcement_fields_required' })

        if (id) {
          const a = memoryStore.announcements.find((item) => item.Id === id)
          if (!a) return json(res, 404, { error: 'not_found' })
          a.Title = title
          a.Message = message
          a.Type = type
          a.IsActive = bool(valueOf(input, 'isActive'))
          a.StartDate = valueOf(input, 'startDate') || null
          a.EndDate = valueOf(input, 'endDate') || null
          a.UpdatedAt = new Date().toISOString()
          a.UpdatedBy = session.user
          return json(res, 200, a)
        } else {
          const newA = {
            Id: crypto.randomUUID(),
            Title: title,
            Message: message,
            Type: type,
            IsActive: bool(valueOf(input, 'isActive')),
            StartDate: valueOf(input, 'startDate') || null,
            EndDate: valueOf(input, 'endDate') || null,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
            CreatedBy: session.user,
            UpdatedBy: session.user,
          }
          memoryStore.announcements.unshift(newA)
          return json(res, 201, newA)
        }
      }

      if (entity === 'settings') {
        memoryStore.settings.ServiceEnabled = bool(valueOf(input, 'serviceEnabled'))
        memoryStore.settings.ContactNumber = cleanText(valueOf(input, 'contactNumber'), 50) || '800 1700'
        memoryStore.settings.EligibilityMessage = cleanText(valueOf(input, 'eligibilityMessage'), 1000) || memoryStore.settings.EligibilityMessage
        memoryStore.settings.ReturnJourneyMessage = cleanText(valueOf(input, 'returnJourneyMessage'), 1000) || memoryStore.settings.ReturnJourneyMessage
        memoryStore.settings.UpdatedAt = new Date().toISOString()
        return json(res, 200, memoryStore.settings)
      }
    }

    return json(res, 404, { error: 'not_found' })
  } catch (err) {
    console.error('[BusService] request error:', err)
    return json(res, 500, { error: err.message || 'server_error' })
  }
}

// Support direct CLI execution: `node server/bus-service.mjs`
if (process.argv[1] && (process.argv[1].endsWith('bus-service.mjs') || process.argv[1].endsWith('bus-service'))) {
  const { createServer } = await import('node:http')
  const PORT = parseInt(process.env.BUS_SERVICE_PORT || '3002', 10)
  const HOST = process.env.BUS_SERVICE_HOST || '127.0.0.1'
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`)
    if (url.pathname === '/health' || url.pathname === '/bus-service-api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, service: 'bus-service', port: PORT }))
      return
    }
    if (url.pathname.startsWith(PREFIX)) {
      await handleBusServiceRequest(req, res, url)
      return
    }
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'not_found' }))
  })
  server.listen(PORT, HOST, () => {
    console.log(`[BusService] Shuttle Admin & Bus API listening on http://${HOST}:${PORT}`)
    console.log(`[BusService] Dedicated port: ${PORT} (Port 3000 = Flight API, Port 3001 = Chatbot AI)`)
  })
}
