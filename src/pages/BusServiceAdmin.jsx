import { useEffect, useState } from 'react'
import {
  AlertTriangle, Bus, Check, Edit3, LogOut, MapPin, Plus, RefreshCw,
  Settings, Trash2, X, Clock, ShieldCheck, Users, Calendar, ArrowRight, ExternalLink
} from 'lucide-react'

const api = async (path, options = {}) => {
  const response = await fetch(`/bus-service-api${path}`, {
    credentials: 'same-origin',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    ...options,
  })
  const data = response.status === 204 ? null : await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data?.error || 'Request failed')
  return data
}

const labels = {
  routes: 'Route',
  trips: 'Departure',
  stops: 'Pickup Point',
  announcements: 'Passenger Notice',
  settings: 'Settings',
  users: 'Team Member',
}

const workflow = {
  dashboard: {
    step: 'Operations overview',
    title: 'Today at a glance',
    text: 'Monitor service availability, departures, published schedules and passenger notices from one place.',
  },
  routes: {
    step: 'Main corridors',
    title: 'Shuttle Routes',
    text: 'Configure primary routes connecting emirates (e.g. Dubai, Sharjah, Ajman, Umm Al Quwain) to RAK Airport.',
  },
  trips: {
    step: 'Timetable',
    title: 'Departures & Schedules',
    text: 'Manage individual departures, timings, and stops. Click "Pickup times" on any trip to adjust stop sequences.',
  },
  stops: {
    step: 'Pickup points',
    title: 'Bus Stops & Stations',
    text: 'Manage distinct pickup and drop-off locations across the UAE. These stops are reused across schedules.',
  },
  announcements: {
    step: 'Passenger notices',
    title: 'Service Alerts & Status',
    text: 'Broadcast real-time operational status (Operational, Delayed, Suspended) and publish time-bound passenger alerts.',
  },
  settings: {
    step: 'System configuration',
    title: 'Service Settings',
    text: 'Control overall shuttle service availability, contact hotline numbers, and passenger eligibility policies.',
  },
  users: {
    step: 'Access management',
    title: 'Operations Team',
    text: 'Grant access to authorized staff. Super Admins can publish schedules and manage access; Editors can maintain drafts.',
  },
}

const blank = {
  routes: { name: '', description: '', direction: 'To Airport', isActive: true, publicationStatus: 'Published', sortOrder: 0 },
  trips: { routeId: '', tripName: '', operatingDays: ['Daily'], airportArrivalTime: '20:00', isActive: true, isPublished: true, sortOrder: 0 },
  stops: { name: '', locationDetails: '', isActive: true },
  announcements: { title: '', message: '', type: 'Information', isActive: true, startDate: '', endDate: '' },
  users: { fullName: '', username: '', email: '', role: 'Editor', password: '', isActive: true },
}

function formTime(value) {
  if (!value) return ''
  const match = String(value).match(/(?:T|^)([01]\d|2[0-3]):([0-5]\d)/)
  return match ? `${match[1]}:${match[2]}` : String(value).slice(0, 5)
}

function formatDisplayTime(value) {
  if (!value) return '—'
  const clean = formTime(value)
  if (!clean) return '—'
  const [h, m] = clean.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hr = h % 12 || 12
  return `${hr}:${String(m).padStart(2, '0')} ${suffix}`
}

function formDays(value) {
  if (Array.isArray(value)) return value
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return value ? [value] : ['Daily']
  }
}

const control = 'w-full rounded-xl border border-brand-100 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500'

function Field({ label, required, children }) {
  return (
    <label className="block text-sm font-semibold text-ink">
      <span>{label} {required && <span className="text-red-500">*</span>}</span>
      <span className="mt-1.5 block font-normal">{children}</span>
    </label>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Login Component
 * ───────────────────────────────────────────────────────────────────────── */
function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
      onLogin()
    } catch (err) {
      setError(err.message === 'invalid_credentials' ? 'The username or password is incorrect.' : 'Unable to sign in. Please verify your connection.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md py-16">
      <form onSubmit={submit} className="rounded-[28px] bg-white p-8 shadow-xl ring-1 ring-brand-100">
        <div className="flex items-center justify-between">
          <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
            Operations Portal
          </span>
          <span className="flex items-center gap-1.5 text-xs text-ink/50">
            <ShieldCheck size={14} className="text-teal-accent" /> Secure Access
          </span>
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">Bus Service Administration</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">
          Sign in to manage passenger bus routes, departures, pickup timings, and service notifications.
        </p>

        {error && (
          <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <Field label="Username" required>
            <input
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={control}
              placeholder="Enter your username"
            />
          </Field>
          <Field label="Password" required>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={control}
            />
          </Field>
        </div>

        <button
          disabled={busy}
          className="mt-6 w-full rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-brand-700 disabled:opacity-60"
        >
          {busy ? 'Verifying access…' : 'Sign In Securely'}
        </button>
      </form>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * StopTimings Modal Component
 * ───────────────────────────────────────────────────────────────────────── */
function StopTimings({ trip, onClose, onRefresh }) {
  const [stops, setStops] = useState([])
  const [timings, setTimings] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  const tripId = trip.Id || trip.id

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [allStops, current] = await Promise.all([
        api('/admin/stops'),
        api(`/admin/trips/${tripId}/stops`),
      ])
      setStops(Array.isArray(allStops) ? allStops : [])
      setTimings(Array.isArray(current) ? current : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [tripId])

  const addRow = () => {
    setTimings((items) => [
      ...items,
      {
        tempId: crypto.randomUUID(),
        TripId: tripId,
        StopId: stops[0]?.Id || stops[0]?.id || '',
        StopOrder: items.length + 1,
        ArrivalTime: '16:00',
        WaitingMinutes: 10,
        DepartureTime: '16:10',
      },
    ])
  }

  const updateRow = (index, key, val) => {
    setTimings((items) =>
      items.map((row, i) => (i === index ? { ...row, [key]: val } : row))
    )
  }

  const saveRow = async (item) => {
    setError('')
    setSuccess('')
    try {
      const id = item.Id || item.id
      const payload = {
        tripId,
        stopId: item.StopId || item.stopId,
        stopOrder: Number(item.StopOrder ?? item.stopOrder) || 1,
        arrivalTime: formTime(item.ArrivalTime ?? item.arrivalTime),
        departureTime: formTime(item.DepartureTime ?? item.departureTime),
        waitingMinutes: Number(item.WaitingMinutes ?? item.waitingMinutes) || 0,
      }
      if (!payload.stopId) throw new Error('Please select a pickup stop')
      if (!payload.arrivalTime || !payload.departureTime) throw new Error('Arrival and departure times are required')

      await api(`/admin/trip-stops${id ? `/${id}` : ''}`, {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      })
      setSuccess('Stop timing saved successfully')
      setTimeout(() => setSuccess(''), 3000)
      await load()
      if (onRefresh) onRefresh()
    } catch (err) {
      setError(err.message.replaceAll('_', ' '))
    }
  }

  const deleteRow = async (item, index) => {
    const id = item.Id || item.id
    if (!id) {
      setTimings((items) => items.filter((_, i) => i !== index))
      return
    }
    if (confirm('Remove this stop from the trip timetable?')) {
      try {
        await api(`/admin/trip-stops/${id}`, { method: 'DELETE' })
        setSuccess('Stop removed')
        setTimeout(() => setSuccess(''), 2500)
        await load()
        if (onRefresh) onRefresh()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[125] grid place-items-center bg-ink/60 p-4 backdrop-blur-xs">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-brand-100 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Timetable Sequence</span>
            <h2 className="font-display text-2xl font-bold text-ink">
              Pickup Stops & Timings
            </h2>
            <p className="mt-0.5 text-sm text-ink/60">
              Trip: <span className="font-semibold text-brand-700">{trip.TripName || trip.tripName}</span> · RAK Airport arrival{' '}
              <span className="font-semibold">{formatDisplayTime(trip.AirportArrivalTime || trip.airportArrivalTime)}</span>
            </p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-ink/60 hover:bg-brand-50" aria-label="Close">
            <X size={22} />
          </button>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {success && <p className="mt-4 rounded-xl bg-teal-accent/15 p-3 text-sm text-teal-800">{success}</p>}

        {loading ? (
          <div className="py-12 text-center text-sm text-ink/50">Loading trip stops…</div>
        ) : (
          <div className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="border-b border-brand-100 bg-brand-50/50 text-xs font-semibold uppercase tracking-wider text-ink/50">
                  <tr>
                    <th className="px-3 py-3 w-16">Seq</th>
                    <th className="px-3 py-3">Pickup Location</th>
                    <th className="px-3 py-3 w-32">Arrival</th>
                    <th className="px-3 py-3 w-28">Wait (min)</th>
                    <th className="px-3 py-3 w-32">Departure</th>
                    <th className="px-3 py-3 w-24 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {timings.map((item, idx) => (
                    <tr key={item.Id || item.id || item.tempId} className="hover:bg-brand-50/30">
                      <td className="px-3 py-2.5">
                        <input
                          type="number"
                          min="1"
                          value={item.StopOrder ?? item.stopOrder ?? idx + 1}
                          onChange={(e) => updateRow(idx, 'StopOrder', Number(e.target.value))}
                          className="w-14 rounded-lg border border-brand-100 px-2 py-1.5 text-center font-medium"
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <select
                          value={item.StopId ?? item.stopId ?? ''}
                          onChange={(e) => updateRow(idx, 'StopId', e.target.value)}
                          className="w-full rounded-lg border border-brand-100 bg-white px-3 py-1.5 font-medium text-ink"
                        >
                          <option value="">Select pickup point</option>
                          {stops.map((s) => (
                            <option key={s.Id || s.id} value={s.Id || s.id}>
                              {s.Name || s.name} {s.LocationDetails ? `(${s.LocationDetails})` : ''}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2.5">
                        <input
                          type="time"
                          value={formTime(item.ArrivalTime ?? item.arrivalTime)}
                          onChange={(e) => updateRow(idx, 'ArrivalTime', e.target.value)}
                          className="rounded-lg border border-brand-100 px-2.5 py-1.5 font-mono text-xs"
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <input
                          type="number"
                          min="0"
                          max="240"
                          value={item.WaitingMinutes ?? item.waitingMinutes ?? 10}
                          onChange={(e) => updateRow(idx, 'WaitingMinutes', Number(e.target.value))}
                          className="w-18 rounded-lg border border-brand-100 px-2 py-1.5 text-center font-mono text-xs"
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <input
                          type="time"
                          value={formTime(item.DepartureTime ?? item.departureTime)}
                          onChange={(e) => updateRow(idx, 'DepartureTime', e.target.value)}
                          className="rounded-lg border border-brand-100 px-2.5 py-1.5 font-mono text-xs"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => saveRow(item)}
                          className="mr-1.5 rounded-lg bg-brand-50 p-1.5 text-brand-700 hover:bg-brand-100 transition"
                          title="Save stop timing"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => deleteRow(item, idx)}
                          className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition"
                          title="Remove stop"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!timings.length && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-ink/50">
                        No pickup stops configured for this trip yet. Click "+ Add Stop" below.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 pt-4">
              <button
                type="button"
                onClick={addRow}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 transition"
              >
                <Plus size={16} /> Add Stop Timing
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-brand-100 px-5 py-2.5 text-sm font-semibold text-ink/75 hover:bg-brand-50 transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Generic Entity Editor Modal (Route, Trip, Stop, Announcement, User)
 * ───────────────────────────────────────────────────────────────────────── */
function EntityEditor({ type, initial, routes, onClose, onSaved }) {
  const [value, setValue] = useState({ ...initial })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const id = value.Id || value.id
  const update = (key, val) => setValue((v) => ({ ...v, [key]: val }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api(`/admin/${type}${id ? `/${id}` : ''}`, {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(value),
      })
      onSaved()
    } catch (err) {
      setError(err.message.replaceAll('_', ' '))
    } finally {
      setSaving(false)
    }
  }

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Daily']
  const selectedDays = formDays(value.operatingDays ?? value.OperatingDays)

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-ink/50 p-4 backdrop-blur-xs">
      <form
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-center justify-between border-b border-brand-100 pb-3">
          <h2 className="font-display text-2xl font-bold text-ink">
            {id ? 'Edit' : 'Add'} {labels[type] || type}
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-ink/60 hover:bg-brand-50">
            <X size={20} />
          </button>
        </div>

        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div className="mt-6 space-y-4">
          {type === 'routes' && (
            <>
              <Field label="Route Name" required>
                <input
                  required
                  placeholder="e.g. Route 1"
                  value={value.name ?? value.Name ?? ''}
                  onChange={(e) => update('name', e.target.value)}
                  className={control}
                />
              </Field>
              <Field label="Corridor Description" required>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Dubai Al Quoz → Dubai Deira → Umm Al Quwain → RAK Airport"
                  value={value.description ?? value.Description ?? ''}
                  onChange={(e) => update('description', e.target.value)}
                  className={control}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Direction">
                  <select
                    value={value.direction ?? value.Direction ?? 'To Airport'}
                    onChange={(e) => update('direction', e.target.value)}
                    className={control}
                  >
                    <option value="To Airport">To Airport</option>
                    <option value="From Airport">From Airport</option>
                  </select>
                </Field>
                <Field label="Sort Order">
                  <input
                    type="number"
                    min="0"
                    value={value.sortOrder ?? value.SortOrder ?? 0}
                    onChange={(e) => update('sortOrder', Number(e.target.value))}
                    className={control}
                  />
                </Field>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value.isActive ?? value.IsActive ?? true}
                    onChange={(e) => update('isActive', e.target.checked)}
                    className="h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(value.publicationStatus ?? value.PublicationStatus) === 'Published'}
                    onChange={(e) => update('publicationStatus', e.target.checked ? 'Published' : 'Draft')}
                    className="h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                  />
                  Published on public website
                </label>
              </div>
            </>
          )}

          {type === 'trips' && (
            <>
              <Field label="Assigned Route" required>
                <select
                  required
                  value={value.routeId ?? value.RouteId ?? ''}
                  onChange={(e) => update('routeId', e.target.value)}
                  className={control}
                >
                  <option value="">Select route</option>
                  {routes.map((r) => (
                    <option key={r.Id || r.id} value={r.Id || r.id}>
                      {r.Name || r.name} ({r.Direction || 'To Airport'})
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Departure / Trip Name" required>
                  <input
                    required
                    placeholder="e.g. First Trip"
                    value={value.tripName ?? value.TripName ?? ''}
                    onChange={(e) => update('tripName', e.target.value)}
                    className={control}
                  />
                </Field>
                <Field label="Estimated Airport Arrival" required>
                  <input
                    required
                    type="time"
                    value={formTime(value.airportArrivalTime ?? value.AirportArrivalTime)}
                    onChange={(e) => update('airportArrivalTime', e.target.value)}
                    className={control}
                  />
                </Field>
              </div>
              <div>
                <span className="block text-sm font-semibold text-ink mb-1.5">Operating Days</span>
                <div className="flex flex-wrap gap-2">
                  {daysList.map((day) => {
                    const isChecked = day === 'Daily' ? selectedDays.includes('Daily') : selectedDays.includes(day)
                    return (
                      <label key={day} className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              update('operatingDays', day === 'Daily' ? ['Daily'] : [...selectedDays.filter((d) => d !== 'Daily'), day])
                            } else {
                              update('operatingDays', selectedDays.filter((d) => d !== day))
                            }
                          }}
                        />
                        {day}
                      </label>
                    )
                  })}
                </div>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value.isActive ?? value.IsActive ?? true}
                    onChange={(e) => update('isActive', e.target.checked)}
                    className="h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value.isPublished ?? value.IsPublished ?? true}
                    onChange={(e) => update('isPublished', e.target.checked)}
                    className="h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                  />
                  Published on public timetable
                </label>
              </div>
            </>
          )}

          {type === 'stops' && (
            <>
              <Field label="Pickup Location Name" required>
                <input
                  required
                  placeholder="e.g. Dubai Al Quoz"
                  value={value.name ?? value.Name ?? ''}
                  onChange={(e) => update('name', e.target.value)}
                  className={control}
                />
              </Field>
              <Field label="Location / Landmark Details">
                <input
                  placeholder="e.g. Near Metro Station / Opposite City Centre"
                  value={value.locationDetails ?? value.LocationDetails ?? ''}
                  onChange={(e) => update('locationDetails', e.target.value)}
                  className={control}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={value.isActive ?? value.IsActive ?? true}
                  onChange={(e) => update('isActive', e.target.checked)}
                  className="h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                />
                Active Stop
              </label>
            </>
          )}

          {type === 'announcements' && (
            <>
              <Field label="Alert Title" required>
                <input
                  required
                  placeholder="e.g. Holiday Shuttle Schedule"
                  value={value.title ?? value.Title ?? ''}
                  onChange={(e) => update('title', e.target.value)}
                  className={control}
                />
              </Field>
              <Field label="Notice Content" required>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Additional morning services added to accommodate peak travel."
                  value={value.message ?? value.Message ?? ''}
                  onChange={(e) => update('message', e.target.value)}
                  className={control}
                />
              </Field>
              <Field label="Notice Severity Type">
                <select
                  value={value.type ?? value.Type ?? 'Information'}
                  onChange={(e) => update('type', e.target.value)}
                  className={control}
                >
                  <option value="Information">Information (Blue)</option>
                  <option value="Warning">Warning (Amber)</option>
                  <option value="Service Suspension">Service Suspension (Red)</option>
                </select>
              </Field>
              <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={value.isActive ?? value.IsActive ?? true}
                  onChange={(e) => update('isActive', e.target.checked)}
                  className="h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                />
                Publish this alert immediately on passenger portal
              </label>
            </>
          )}

          {type === 'users' && (
            <>
              <Field label="Full Name" required>
                <input
                  required
                  placeholder="e.g. Sarah Al Zaabi"
                  value={value.fullName ?? value.FullName ?? ''}
                  onChange={(e) => update('fullName', e.target.value)}
                  className={control}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Username" required>
                  <input
                    required
                    readOnly={!!id}
                    minLength="3"
                    pattern="[A-Za-z0-9._-]+"
                    value={value.username ?? value.Username ?? ''}
                    onChange={(e) => update('username', e.target.value)}
                    className={control}
                  />
                </Field>
                <Field label="Role">
                  <select
                    value={value.role ?? value.Role ?? 'Editor'}
                    onChange={(e) => update('role', e.target.value)}
                    className={control}
                  >
                    <option value="Editor">Editor</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </Field>
              </div>
              <Field label="Email Address">
                <input
                  type="email"
                  value={value.email ?? value.Email ?? ''}
                  onChange={(e) => update('email', e.target.value)}
                  className={control}
                />
              </Field>
              <Field label={id ? 'New Password (leave blank to keep current)' : 'Password (minimum 12 characters)'}>
                <input
                  required={!id}
                  type="password"
                  minLength={!id ? 12 : undefined}
                  value={value.password ?? ''}
                  onChange={(e) => update('password', e.target.value)}
                  className={control}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={value.isActive ?? value.IsActive ?? true}
                  onChange={(e) => update('isActive', e.target.checked)}
                  className="h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                />
                Account Active
              </label>
            </>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-brand-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-ink/70 hover:bg-brand-50 transition"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
          >
            <Check size={16} />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Schedule Workspace (Full Route + Trips + Stops Batch Builder)
 * ───────────────────────────────────────────────────────────────────────── */
function ScheduleWorkspace({ routes, onCancel, onSaved }) {
  const freshTrip = (num = 1) => ({
    name: `Trip ${num}`,
    number: `SH-0${num}`,
    operatingDays: ['Daily'],
    airportArrivalTime: num === 1 ? '20:00' : '22:45',
    remarks: '',
    stops: [
      { order: 1, name: 'Dubai Al Quoz', details: 'Pickup station', arrivalTime: '16:20', waitingMinutes: 10, departureTime: '16:30' },
      { order: 2, name: 'Dubai Deira', details: 'City Centre stop', arrivalTime: '17:30', waitingMinutes: 10, departureTime: '17:40' },
      { order: 3, name: 'Umm Al Quwain', details: 'Mall of UAQ', arrivalTime: '18:50', waitingMinutes: 10, departureTime: '19:00' },
    ],
  })

  const [newRoute, setNewRoute] = useState(true)
  const [value, setValue] = useState({
    route: {
      name: 'New Express Route',
      number: 'SH-03',
      description: 'Dubai → Sharjah → Ajman → RAK Airport',
      direction: 'To Airport',
      startingLocation: 'Dubai',
      finalDestination: 'RAK Airport',
      operatingDays: ['Daily'],
      returnEnabled: true,
      returnNotes: 'Return shuttle operates following flight arrivals.',
    },
    trips: [freshTrip(1)],
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const route = value.route
  const setRoute = (k, v) => setValue((prev) => ({ ...prev, route: { ...prev.route, [k]: v } }))
  const updateTrip = (i, k, v) => setValue((prev) => ({ ...prev, trips: prev.trips.map((t, idx) => (idx === i ? { ...t, [k]: v } : t)) }))
  const updateStop = (ti, si, k, v) => setValue((prev) => ({
    ...prev,
    trips: prev.trips.map((t, idx) =>
      idx === ti ? { ...t, stops: t.stops.map((s, sidx) => (sidx === si ? { ...s, [k]: v } : s)) } : t
    ),
  }))

  const save = async (publish = true) => {
    setSaving(true)
    setError('')
    try {
      await api('/admin/schedules', {
        method: 'POST',
        body: JSON.stringify({ ...value, publish }),
      })
      onSaved()
    } catch (err) {
      setError(err.message.replaceAll('_', ' '))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Full Route Builder</span>
          <h2 className="font-display text-3xl font-bold text-ink">Build Route & Multi-Trip Schedule</h2>
          <p className="text-sm text-ink/60">Configure the route corridor, multiple daily departures, and pickup station timings at once.</p>
        </div>
        <button onClick={onCancel} className="rounded-xl border border-brand-100 bg-white px-4 py-2 text-sm font-semibold text-ink/75 hover:bg-brand-50">
          Back to Timetable
        </button>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-3.5 text-sm text-red-700">{error}</p>}

      <section className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <h3 className="font-display text-xl font-bold text-ink">1. Route Corridor Information</h3>
        <div className="mt-4 flex gap-4 text-sm font-medium">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={newRoute} onChange={() => setNewRoute(true)} /> Create new corridor
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={!newRoute} onChange={() => setNewRoute(false)} /> Extend existing route
          </label>
        </div>

        {!newRoute ? (
          <select
            className={`${control} mt-4`}
            onChange={(e) => {
              const chosen = routes.find((r) => (r.Id || r.id) === e.target.value)
              if (chosen) {
                setValue((v) => ({
                  ...v,
                  route: {
                    ...v.route,
                    id: chosen.Id || chosen.id,
                    name: chosen.Name || chosen.name,
                    description: chosen.Description || '',
                    direction: chosen.Direction || 'To Airport',
                  },
                }))
              }
            }}
          >
            <option value="">Select existing route corridor</option>
            {routes.map((r) => (
              <option key={r.Id || r.id} value={r.Id || r.id}>
                {r.Name || r.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Route Name" required>
              <input value={route.name} onChange={(e) => setRoute('name', e.target.value)} className={control} />
            </Field>
            <Field label="Route Code / Number">
              <input value={route.number} onChange={(e) => setRoute('number', e.target.value)} className={control} />
            </Field>
            <Field label="Starting Station">
              <input value={route.startingLocation} onChange={(e) => setRoute('startingLocation', e.target.value)} className={control} />
            </Field>
            <Field label="Final Destination">
              <input value={route.finalDestination} onChange={(e) => setRoute('finalDestination', e.target.value)} className={control} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Corridor Description" required>
                <input value={route.description} onChange={(e) => setRoute('description', e.target.value)} className={control} />
              </Field>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-ink">2. Departures & Pickup Timetable</h3>
            <p className="text-xs text-ink/55">Configure departure runs, arrival time at RAK Airport, and each stop along the way.</p>
          </div>
          <button
            onClick={() => setValue((v) => ({ ...v, trips: [...v.trips, freshTrip(v.trips.length + 1)] }))}
            className="rounded-xl bg-brand-50 px-3.5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
          >
            + Add Departure
          </button>
        </div>

        {value.trips.map((trip, ti) => (
          <div key={ti} className="mt-5 rounded-2xl border border-brand-100 bg-brand-50/40 p-5">
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Departure Name">
                <input value={trip.name} onChange={(e) => updateTrip(ti, 'name', e.target.value)} className={control} />
              </Field>
              <Field label="Estimated Airport Arrival" required>
                <input type="time" value={trip.airportArrivalTime} onChange={(e) => updateTrip(ti, 'airportArrivalTime', e.target.value)} className={control} />
              </Field>
              <Field label="Trip Code">
                <input value={trip.number} onChange={(e) => updateTrip(ti, 'number', e.target.value)} className={control} />
              </Field>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[650px] text-xs">
                <thead>
                  <tr className="border-b border-brand-100 text-left font-semibold text-ink/50 uppercase">
                    <th className="py-2 w-14">Order</th>
                    <th className="py-2">Pickup Location</th>
                    <th className="py-2 w-28">Arrival</th>
                    <th className="py-2 w-20">Wait</th>
                    <th className="py-2 w-28">Departure</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100/50">
                  {trip.stops.map((stop, si) => (
                    <tr key={si}>
                      <td className="py-1.5">
                        <input
                          type="number"
                          value={stop.order}
                          onChange={(e) => updateStop(ti, si, 'order', Number(e.target.value))}
                          className="w-12 rounded border border-brand-100 px-1 py-1 text-center font-bold"
                        />
                      </td>
                      <td className="py-1.5">
                        <input
                          value={stop.name}
                          onChange={(e) => updateStop(ti, si, 'name', e.target.value)}
                          className="w-full rounded border border-brand-100 px-2 py-1 font-medium"
                          placeholder="Pickup Point"
                        />
                      </td>
                      <td className="py-1.5">
                        <input
                          type="time"
                          value={stop.arrivalTime}
                          onChange={(e) => updateStop(ti, si, 'arrivalTime', e.target.value)}
                          className="rounded border border-brand-100 px-1.5 py-1"
                        />
                      </td>
                      <td className="py-1.5">
                        <input
                          type="number"
                          value={stop.waitingMinutes}
                          onChange={(e) => updateStop(ti, si, 'waitingMinutes', Number(e.target.value))}
                          className="w-14 rounded border border-brand-100 px-1 py-1 text-center"
                        />
                      </td>
                      <td className="py-1.5">
                        <input
                          type="time"
                          value={stop.departureTime}
                          onChange={(e) => updateStop(ti, si, 'departureTime', e.target.value)}
                          className="rounded border border-brand-100 px-1.5 py-1"
                        />
                      </td>
                      <td className="py-1.5 text-right">
                        <button
                          type="button"
                          onClick={() => updateTrip(ti, 'stops', trip.stops.filter((_, idx) => idx !== si))}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() =>
                updateTrip(ti, 'stops', [
                  ...trip.stops,
                  { order: trip.stops.length + 1, name: '', details: '', arrivalTime: '17:00', waitingMinutes: 10, departureTime: '17:10' },
                ])
              }
              className="mt-3 text-xs font-semibold text-brand-700 hover:underline"
            >
              + Add Pickup Stop to this Departure
            </button>
          </div>
        ))}
      </section>

      <div className="sticky bottom-4 flex flex-wrap justify-end gap-3 rounded-2xl bg-ink p-4 shadow-xl">
        <button onClick={onCancel} className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20">
          Cancel
        </button>
        <button
          disabled={saving}
          onClick={() => save(false)}
          className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-50"
        >
          Save as Draft
        </button>
        <button
          disabled={saving}
          onClick={() => save(true)}
          className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-700"
        >
          {saving ? 'Publishing…' : 'Publish to Live Website'}
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Service Status & Passenger Alerts Panel
 * ───────────────────────────────────────────────────────────────────────── */
function ServiceStatusPanel({ user, onSaved }) {
  const [value, setValue] = useState({
    status: 'Operational',
    publicMessage: '',
    expectedRestorationAt: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api('/admin/service-status')
      .then((item) =>
        setValue({
          status: item.Status || 'Operational',
          publicMessage: item.PublicMessage || '',
          expectedRestorationAt: item.ExpectedRestorationAt ? String(item.ExpectedRestorationAt).slice(0, 16) : '',
        })
      )
      .catch(() => {})
  }, [])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api('/admin/service-status', {
        method: 'PUT',
        body: JSON.stringify(value),
      })
      setSuccess('Service status updated successfully')
      setTimeout(() => setSuccess(''), 3000)
      if (onSaved) onSaved()
    } catch (err) {
      setError(err.message.replaceAll('_', ' '))
    } finally {
      setSaving(false)
    }
  }

  const isSuperAdmin = user?.role === 'Super Admin'

  return (
    <form onSubmit={save} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-100 pb-3">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">Operational Service Status</h3>
          <p className="text-xs text-ink/55">This status appears on the passenger shuttle timetable page.</p>
        </div>
        {!isSuperAdmin && (
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            View only (Super Admin required to alter)
          </span>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-3 text-sm text-teal-700 font-medium">{success}</p>}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Current Status">
          <select
            disabled={!isSuperAdmin}
            value={value.status}
            onChange={(e) => setValue({ ...value, status: e.target.value })}
            className={control}
          >
            <option value="Operational">Operational (Normal Service)</option>
            <option value="Delayed">Delayed (Heavy Traffic / Weather)</option>
            <option value="Suspended">Suspended (Temporary Pause)</option>
            <option value="Maintenance">Maintenance (Fleet Inspection)</option>
          </select>
        </Field>

        <Field label="Expected Restoration Time (Optional)">
          <input
            disabled={!isSuperAdmin}
            type="datetime-local"
            value={value.expectedRestorationAt}
            onChange={(e) => setValue({ ...value, expectedRestorationAt: e.target.value })}
            className={control}
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Passenger Information Banner Message">
            <input
              disabled={!isSuperAdmin}
              placeholder="e.g. All complimentary shuttle services are running on schedule."
              value={value.publicMessage}
              onChange={(e) => setValue({ ...value, publicMessage: e.target.value })}
              className={control}
            />
          </Field>
        </div>
      </div>

      {isSuperAdmin && (
        <div className="mt-4 flex justify-end">
          <button
            disabled={saving}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? 'Updating…' : 'Update Live Service Status'}
          </button>
        </div>
      )}
    </form>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Service Settings Panel
 * ───────────────────────────────────────────────────────────────────────── */
function ServiceSettingsPanel({ onSaved }) {
  const [settings, setSettings] = useState({
    serviceEnabled: true,
    contactNumber: '800 1700',
    eligibilityMessage: '',
    returnJourneyMessage: '',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api('/admin/settings').then((data) => {
      if (data) {
        setSettings({
          serviceEnabled: data.ServiceEnabled !== false,
          contactNumber: data.ContactNumber || '800 1700',
          eligibilityMessage: data.EligibilityMessage || '',
          returnJourneyMessage: data.ReturnJourneyMessage || '',
        })
      }
    }).catch(() => {})
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      await api('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      })
      setMsg('Settings saved successfully')
      setTimeout(() => setMsg(''), 3000)
      if (onSaved) onSaved()
    } catch (err) {
      setMsg(`Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
      <h3 className="font-display text-xl font-bold text-ink">Shuttle Service Policy & Contact Configuration</h3>
      <p className="mt-1 text-xs text-ink/55">Global controls for complimentary shuttle operations and customer support.</p>

      {msg && <p className="mt-4 rounded-xl bg-brand-50 p-3 text-sm font-medium text-brand-800">{msg}</p>}

      <div className="mt-6 space-y-4">
        <label className="flex items-center gap-3 p-3.5 rounded-xl border border-brand-100 bg-brand-50/40 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.serviceEnabled}
            onChange={(e) => setSettings({ ...settings, serviceEnabled: e.target.checked })}
            className="h-5 w-5 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
          />
          <div>
            <span className="font-semibold text-ink">Enable Complimentary Shuttle Service</span>
            <p className="text-xs text-ink/60">When unchecked, the public schedule displays a temporary service suspension notice.</p>
          </div>
        </label>

        <Field label="Airport Helpline Contact Number" required>
          <input
            value={settings.contactNumber}
            onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
            className={control}
            placeholder="800 1700"
          />
        </Field>

        <Field label="Passenger Ticket Eligibility Policy">
          <textarea
            rows={2}
            value={settings.eligibilityMessage}
            onChange={(e) => setSettings({ ...settings, eligibilityMessage: e.target.value })}
            className={control}
          />
        </Field>

        <Field label="Return Shuttle Service Guidance Note">
          <textarea
            rows={2}
            value={settings.returnJourneyMessage}
            onChange={(e) => setSettings({ ...settings, returnJourneyMessage: e.target.value })}
            className={control}
          />
        </Field>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          disabled={saving}
          className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save System Settings'}
        </button>
      </div>
    </form>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Dashboard Panel Component
 * ───────────────────────────────────────────────────────────────────────── */
function DashboardPanel({ overview, onNavigate }) {
  const status = overview?.serviceStatus?.Status || 'Operational'
  const upcoming = overview?.routes || []

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Current Service', status, status === 'Operational' ? 'text-teal-600' : 'text-amber-600'],
          ['Active Departures', overview?.totals?.activeTrips ?? 0, 'text-brand-700'],
          ['Corridors / Routes', overview?.totals?.routes ?? 0, 'text-brand-700'],
          ['Pickup Points', overview?.totals?.stops ?? 0, 'text-brand-700'],
        ].map(([label, value, col]) => (
          <div key={label} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">{label}</p>
            <p className={`mt-2 font-display text-2xl font-bold ${col}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-brand-100 pb-3">
          <h3 className="font-display text-lg font-bold text-ink">Corridors & Timetable Overview</h3>
          <button
            onClick={() => onNavigate('trips')}
            className="text-xs font-semibold text-brand-600 hover:text-brand-800"
          >
            Manage Timetable →
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {upcoming.length ? (
            upcoming.map((route) => (
              <div
                key={route.Id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-50/60 p-4 transition hover:bg-brand-50"
              >
                <div>
                  <h4 className="font-semibold text-ink">{route.Name}</h4>
                  <p className="text-xs text-ink/60">
                    Direction: <span className="font-medium text-brand-700">{route.Direction}</span> · Status:{' '}
                    <span className="font-medium text-teal-700">{route.PublicationStatus}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink/70 shadow-2xs">
                    {formatDisplayTime(route.DepartureTime)} first pickup → {formatDisplayTime(route.AirportArrivalTime)} arrival
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-sm text-ink/50">No published routes yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Main BusServiceAdmin Page Component
 * ───────────────────────────────────────────────────────────────────────── */
export default function BusServiceAdmin() {
  const [user, setUser] = useState(null)
  const [overview, setOverview] = useState(null)
  const [tab, setTab] = useState('dashboard')
  const [records, setRecords] = useState([])
  const [routes, setRoutes] = useState([])
  const [error, setError] = useState('')
  const [editor, setEditor] = useState(null)
  const [timingTrip, setTimingTrip] = useState(null)
  const [scheduleEditor, setScheduleEditor] = useState(false)
  const [filterRoute, setFilterRoute] = useState('')

  const load = async (section = tab) => {
    setError('')
    try {
      const summary = await api('/admin/dashboard').catch(() => api('/admin/overview'))
      setOverview(summary)

      const routeItems = await api('/admin/routes')
      setRoutes(Array.isArray(routeItems) ? routeItems : [])

      if (section !== 'dashboard' && section !== 'settings') {
        const items = await api(`/admin/${section}`)
        setRecords(Array.isArray(items) ? items : [])
      } else {
        setRecords([])
      }
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    api('/auth/session')
      .then((data) => setUser(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (user) load(tab)
  }, [user, tab])

  const remove = async (item) => {
    const id = item.Id || item.id
    if (!confirm('Are you sure you want to permanently delete this item?')) return
    try {
      await api(`/admin/${tab}/${id}`, { method: 'DELETE' })
      load(tab)
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user) {
    return (
      <main className="min-h-[85vh] bg-gradient-to-b from-brand-100 to-white">
        <div className="container-x">
          <Login onLogin={() => api('/auth/session').then(setUser)} />
        </div>
      </main>
    )
  }

  if (scheduleEditor) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-brand-100 to-white py-10">
        <div className="container-x">
          <ScheduleWorkspace
            routes={routes}
            onCancel={() => setScheduleEditor(false)}
            onSaved={() => {
              setScheduleEditor(false)
              load('trips')
            }}
          />
        </div>
      </main>
    )
  }

  const summary = overview?.totals
  const displayRecords = filterRoute
    ? records.filter((r) => r.RouteId === filterRoute || r.routeId === filterRoute)
    : records

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-100 to-white py-10">
      <div className="container-x">
        {/* Header Bar */}
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-brand-100 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
                <Bus size={14} /> Shuttle Operations Control
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700">
                Logged in as {user.fullName || user.user} ({user.role})
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
              Bus Schedule Manager
            </h1>
            <p className="mt-1 text-sm text-ink/60">
              Manage live published timetables, stops, departures, service alerts, and access controls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/bus-service"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100 hover:bg-brand-50 transition"
            >
              <ExternalLink size={15} />
              View Live Passenger Timetable
            </a>
            <button
              onClick={async () => {
                await api('/auth/logout', { method: 'POST' })
                setUser(null)
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ink/90"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Layout: Sidebar Nav + Main Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-brand-100">
              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[.18em] text-ink/40">
                Navigation
              </p>
              <nav className="space-y-1">
                {[
                  ['dashboard', 'Dashboard', Bus],
                  ['routes', 'Routes & Corridors', ArrowRight],
                  ['trips', 'Departures Timetable', Clock],
                  ['stops', 'Pickup Stations', MapPin],
                  ['announcements', 'Service Alerts', AlertTriangle],
                  ['settings', 'Service Settings', Settings],
                  ['users', 'Team Access', Users],
                ].map(([key, label, Icon]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => {
                      setTab(key)
                      setFilterRoute('')
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                      tab === key
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-ink/65 hover:bg-brand-50 hover:text-ink'
                    }`}
                  >
                    <Icon size={16} className={tab === key ? 'text-white' : 'text-brand-500'} />
                    {label}
                  </button>
                ))}
              </nav>

              <div className="mt-6 border-t border-brand-100 pt-4">
                <button
                  type="button"
                  onClick={() => load(tab)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-brand-700 hover:underline"
                >
                  <RefreshCw size={14} /> Refresh Data
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4 text-xs leading-relaxed text-ink/70">
              <b className="block text-brand-800 mb-1">Operational Flow</b>
              1. Add routes & stops.
              <br />
              2. Add departures or click "Pickup times" to adjust schedule stops.
              <br />
              3. Check live passenger timetable.
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="min-w-0 space-y-6">
            {/* Context Heading */}
            <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                    {workflow[tab]?.step || 'Management'}
                  </span>
                  <h2 className="mt-0.5 font-display text-2xl font-bold text-ink">
                    {workflow[tab]?.title || labels[tab]}
                  </h2>
                  <p className="mt-1 text-sm text-ink/60">{workflow[tab]?.text}</p>
                </div>

                {tab === 'trips' && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setScheduleEditor(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-white px-3.5 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50 transition"
                    >
                      Build Full Route Schedule
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditor({ ...blank.trips })}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                    >
                      <Plus size={16} /> Add Departure
                    </button>
                  </div>
                )}

                {['routes', 'stops', 'announcements', 'users'].includes(tab) && (
                  <button
                    type="button"
                    onClick={() => setEditor({ ...blank[tab] })}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                  >
                    <Plus size={16} /> Add {labels[tab]}
                  </button>
                )}
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 p-3.5 text-sm text-red-700">
                <AlertTriangle className="mr-1.5 inline" size={16} />
                {error}
              </p>
            )}

            {/* TAB: Dashboard */}
            {tab === 'dashboard' && <DashboardPanel overview={overview} onNavigate={setTab} />}

            {/* TAB: Settings */}
            {tab === 'settings' && <ServiceSettingsPanel onSaved={() => load('settings')} />}

            {/* TAB: Announcements with Service Status on top */}
            {tab === 'announcements' && <ServiceStatusPanel user={user} onSaved={() => load('announcements')} />}

            {/* TAB: Entity Lists (routes, trips, stops, announcements, users) */}
            {tab !== 'dashboard' && tab !== 'settings' && (
              <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-xs">
                {/* Optional Filter for Departures */}
                {tab === 'trips' && routes.length > 0 && (
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-xs font-semibold text-ink/60">Filter by corridor:</span>
                    <select
                      value={filterRoute}
                      onChange={(e) => setFilterRoute(e.target.value)}
                      className="rounded-lg border border-brand-100 bg-white px-3 py-1.5 text-xs font-medium text-ink outline-none"
                    >
                      <option value="">All Corridors ({records.length} departures)</option>
                      {routes.map((r) => (
                        <option key={r.Id || r.id} value={r.Id || r.id}>
                          {r.Name || r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-semibold text-ink/50 pb-2">
                  <span>{displayRecords.length} record{displayRecords.length === 1 ? '' : 's'} found</span>
                </div>

                <div className="divide-y divide-brand-50">
                  {displayRecords.map((item) => {
                    const isPublished = item.PublicationStatus === 'Published' || item.IsPublished === true || item.isPublished === true
                    const isActive = item.IsActive !== false && item.isActive !== false

                    return (
                      <article
                        key={item.Id || item.id}
                        className="flex flex-col gap-4 py-4 transition sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-base font-semibold text-ink">
                              {item.Name || item.TripName || item.Title || item.FullName || item.Username}
                            </h3>
                            {item.RouteName && (
                              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                                {item.RouteName}
                              </span>
                            )}
                            {item.Role && (
                              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
                                {item.Role}
                              </span>
                            )}
                            {item.Type && (
                              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                                {item.Type}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs text-ink/60 leading-relaxed">
                            {item.Description ||
                              item.LocationDetails ||
                              item.Message ||
                              (tab === 'trips'
                                ? `Arrival at RAK Airport: ${formatDisplayTime(item.AirportArrivalTime || item.airportArrivalTime)} · Operating: ${formDays(item.OperatingDays).join(', ')}`
                                : item.Email || 'No additional details')}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              isPublished || (tab === 'users' && isActive)
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {tab === 'users'
                              ? isActive
                                ? 'Active'
                                : 'Disabled'
                              : isPublished
                              ? 'Published'
                              : 'Draft'}
                          </span>

                          {tab === 'trips' && (
                            <button
                              type="button"
                              onClick={() => setTimingTrip({ ...item })}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-accent/15 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-accent/25 transition"
                            >
                              <MapPin size={14} />
                              Pickup times
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setEditor({ ...item })}
                            className="inline-flex items-center gap-1 rounded-lg border border-brand-100 bg-white px-2.5 py-1.5 text-xs font-semibold text-ink/75 hover:bg-brand-50 transition"
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => remove(item)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-100 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </article>
                    )
                  })}

                  {!displayRecords.length && (
                    <div className="rounded-2xl border border-dashed border-brand-100 p-8 text-center text-sm text-ink/50">
                      No records found in this section. Click the "+ Add" button above to create one.
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Modals */}
      {editor && (
        <EntityEditor
          type={tab}
          initial={editor}
          routes={routes}
          onClose={() => setEditor(null)}
          onSaved={() => {
            setEditor(null)
            load(tab)
          }}
        />
      )}

      {timingTrip && (
        <StopTimings
          trip={timingTrip}
          onClose={() => setTimingTrip(null)}
          onRefresh={() => load(tab)}
        />
      )}
    </main>
  )
}
