import { useLanguage } from '../i18n/LanguageContext.jsx'
import { Link } from 'react-router-dom'
import { Instagram, Linkedin } from 'lucide-react'

const cols = [
  {
    title: 'Airport',
    items: [
      { label: 'Management Team', to: '/management' },
      { label: 'Mission & Vision', to: '/mission' },
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Flight Information', to: '/flights' },
    ],
  },
  {
    title: 'Airport Information',
    items: [
      { label: 'Operating Rules & Regulations', to: '/operations' },
      { label: 'Facilities & Services', to: '/facilities' },
      { label: 'Parking', to: '/parking' },
      { label: 'Cargo Facilities', to: '/cargo' },
      { label: 'Public Transport', to: '/public-transport' },
      { label: 'Free Shuttle Bus', to: '/bus-service' },
      { label: 'Location Map', to: '/map' },
    ],
  },
  {
    title: 'Business',
    items: [
      { label: 'Business Opportunities', to: '/business' },
      { label: 'Advertising', to: '/advertising' },
      { label: 'Retail Space', to: '/retail-space' },
      { label: 'Office Space', to: '/office-space' },
      { label: 'Corporate Aviation', to: '/corporate-aviation' },
      { label: 'Operators', to: '/operators' },
    ],
  },
  {
    title: 'Visitor Information',
    items: [
      { label: 'Luggage & Check-In', to: '/luggage-checkin' },
      { label: 'Hotels in RAK', to: '/hotels' },
      { label: 'RAK Duty Free', to: '/duty-free' },
      { label: 'Free Wi-Fi & Internet', to: '/wifi' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
]

const legal = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'By-laws & Conditions of Use', to: '/by-laws' },
  { label: 'Privacy Policy', to: '/privacy' },
]

export default function Footer() {
  const { t: tr, language } = useLanguage()
  return (
    <footer className="bg-ink text-white">
      <div className="container-x grid gap-10 py-14 lg:grid-cols-[280px_1fr] lg:items-start">
        <div>
          <Link to="/" className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white p-1.5 shadow-sm">
              <img
                src="/RAKIA-logo.png"
                alt={tr("Ras Al Khaimah International Airport")}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = '/logo.svg'
                }}
              />
            </div>
            <div className="font-display text-sm font-semibold leading-tight">{tr("Ras Al Khaimah")}<br />
              <span className="text-white/60">{tr("International Airport")}</span>
            </div>
          </Link>
          <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-white/55">{tr("Your gateway to the world. Connecting RAK with global destinations through seamless, world-class travel experiences.")}</p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://www.instagram.com/rakairport"
              target="_blank"
              rel="noreferrer"
              aria-label={tr("RAK Airport on Instagram")}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-brand-500 hover:text-white"
            >
              <Instagram size={17} />
            </a>
            <a
              href="https://www.linkedin.com/company/rakairport"
              target="_blank"
              rel="noreferrer"
              aria-label={tr("RAK Airport on LinkedIn")}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-brand-500 hover:text-white"
            >
              <Linkedin size={17} />
            </a>
          </div>
        </div>

        {/* Equal-width nav columns, independent of the brand column's width */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-300">
                {tr(col.title)}
              </h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-[13px] text-white/55 transition-colors hover:text-white hover:underline hover:underline-offset-4"
                    >
                      {tr(item.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12px] text-white/45">
            <span>{tr("© 2026 RAK Airport")}</span>
            {legal.map((l) => (
              <span key={l.label} className="flex items-center gap-2">
                <span className="text-white/25">{tr("·")}</span>
                <Link to={l.to} className="transition-colors hover:text-white/80">
                  {tr(l.label)}
                </Link>
              </span>
            ))}
          </p>
          <p className="text-[12px] text-white/45">{tr("Ras Al Khaimah, United Arab Emirates")}</p>
        </div>
      </div>
    </footer>
  )
}
