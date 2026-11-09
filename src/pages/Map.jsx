import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useState } from 'react'
import {
  PlaneTakeoff, PlaneLanding, Luggage, ShieldCheck, BadgeCheck, ShoppingBag,
  Star, Landmark, Info, Coffee, DoorOpen, Wine, ExternalLink,
} from 'lucide-react'
import { PageHero, SectionHeading } from '../components/ui.jsx'

const levels = [
  {
    id: 'departures',
    label: 'Departures',
    icon: PlaneTakeoff,
    mapQuery: '25.615460170927, 55.942687279191354',
    zones: [
      { icon: Info, name: 'Information Desk', tag: 'Entrance' },
      { icon: Coffee, name: 'Cafe Check-In Zone', tag: 'Landside' },
      { icon: BadgeCheck, name: 'Check-in Counters', tag: '1-10' },
      { icon: ShoppingBag, name: 'Duty Free', tag: 'Airside' },
      { icon: Coffee, name: 'Cafe Boarding Zone', tag: 'Airside' },
      { icon: Wine, name: 'Bar', tag: 'Airside' },
      { icon: Star, name: 'Premium Lounge', tag: 'Gate 5' },
      { icon: Landmark, name: 'Prayer Rooms', tag: 'Airside' },
      { icon: PlaneTakeoff, name: 'Boarding Gates', tag: '1-5' },
    ],
  },
  {
    id: 'arrivals',
    label: 'Arrivals',
    icon: PlaneLanding,
    mapQuery: '25.61645702779705, 55.9425886251129',
    zones: [
      { icon: PlaneLanding, name: 'Arrival Gates', tag: 'Airside' },
      { icon: BadgeCheck, name: 'Passport Control', tag: 'Central' },
      { icon: Luggage, name: 'Baggage Claim', tag: 'Belt 1-2' },
      { icon: ShieldCheck, name: 'Customs', tag: 'Green / Red' },
      { icon: Coffee, name: 'Café & Kiosks', tag: 'Landside' },
      { icon: DoorOpen, name: 'Exit & Transport', tag: 'Forecourt' },
    ],
  },
]

export default function Map() {
  const { t: tr, language } = useLanguage()
  const [level, setLevel] = useState('departures')
  const current = levels.find((l) => l.id === level)

  return (
    <>
      <PageHero
        image="/Terminal-Map-hero.jpg"
        badge="At RAK"
        title={tr("Terminal Map")}
        subtitle="Find your way around Ras Al Khaimah International Airport, level by level."
      />

      <section className="bg-gradient-to-b from-brand-200 to-brand-50 py-20">
        <div className="container-x">
          <SectionHeading
            kicker="Find your way"
            title={tr("Explore the")}
            highlight="terminal"
            subtitle="Switch between levels to see check-in, security, gates, dining and services."
          />

          {/* Level tabs */}
          <div className="mx-auto mb-10 flex w-fit gap-2 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-brand-100">
            {levels.map((l) => {
              const Icon = l.icon
              const on = level === l.id
              return (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all ${
                    on ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow' : 'text-ink/60 hover:text-brand-600'
                  }`}
                >
                  <Icon size={17} />
                  {tr(l.label)}
                </button>
              )
            })}
          </div>

          {/* Map schematic */}
          <div className="relative overflow-hidden rounded-[32px] border border-brand-100 bg-white p-5 shadow-[0_26px_72px_rgba(15,39,64,0.15)] sm:p-8">
            {/* runway / strip decoration */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-400 via-teal-accent to-brand-500" />
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-brand-500">
                <current.icon size={16} /> {tr(current.label)}
              </div>
              <div className="text-[12px] text-ink/40">{tr("Tap a zone for its location")}</div>
            </div>

            <div key={level} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
              {current.zones.map((z, i) => {
                const Icon = z.icon
                return (
                  <div
                    key={z.name}
                    style={{ animationDelay: `${i * 0.04}s` }}
                    className="animate-fade-up group flex items-center gap-3.5 rounded-2xl border border-brand-100 bg-mist p-4 transition-all hover:-translate-y-1 hover:border-brand-300 hover:bg-brand-50 hover:shadow-lg hover:shadow-brand-100"
                  >
                    <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-sm transition-colors group-hover:bg-brand-500 group-hover:text-white">
                      <Icon size={20} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-semibold text-ink">{tr(z.name)}</div>
                      <div className="text-[11.5px] text-ink/45">{tr(z.tag)}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pinpoint location map for the selected level */}
            <div key={`${level}-map`} className="animate-fade-up mt-6 overflow-hidden rounded-2xl ring-1 ring-brand-100">
              <div className="flex items-center justify-between bg-mist px-4 py-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">
                  {tr(current.label)}{tr(" · Map location")}</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(current.mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-600 hover:underline"
                >{tr("Open in Maps ")}<ExternalLink size={12} />
                </a>
              </div>
              <iframe
                title={tr(`${current.label} location`)}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(current.mapQuery)}&z=18&hl=en&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[320px] w-full border-0"
              />
            </div>
          </div>

          <p className="mt-5 text-center text-[12px] text-ink/40">{tr("Schematic overview for guidance. Signage in the terminal shows exact directions.")}</p>
        </div>
      </section>
    </>
  )
}
