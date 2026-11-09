import { useLanguage } from '../i18n/LanguageContext.jsx'
import {
  Phone, Mail, Printer, MapPin, Building2, Radio, Smartphone, Navigation, ArrowRight,
  Plane, MessageSquare,
} from 'lucide-react'
import { SectionHeading, PageHero } from '../components/ui.jsx'
import { img } from '../data/images.js'

const facts = [
  { icon: MapPin, label: 'Location', value: 'Ras Al Khaimah, United Arab Emirates' },
  { icon: Mail, label: 'P.O. Box', value: '501, Ras Al Khaimah' },
  { icon: Navigation, label: 'Coordinates', value: "25°36'48\"N, 55°56'20\"E" },
]

const contactRows = [
  { icon: Phone, label: 'Telephone', value: '+971 7 2075200', href: 'tel:+97172075200' },
  { icon: Printer, label: 'Fax', value: '+971 7 2448199' },
  { icon: Mail, label: 'Email', value: 'info@rakairport.com', href: 'mailto:info@rakairport.com' },
]

const airportInfo = [
  { icon: Phone, label: 'Telephone', value: '+971 7 2075208', href: 'tel:+97172075208' },
  { icon: Radio, label: 'AFTN', value: 'OMRKYAYX' },
  { icon: MessageSquare, label: 'Complaints / Suggestions', value: 'feedback@rakairport.com', href: 'mailto:feedback@rakairport.com' },
]

export default function Contact() {
  const { t: tr, language } = useLanguage()
  return (
    <>
      {/* Hero */}
      <PageHero
        image={img.contactHero}
        badge="Get in touch"
        title={tr("Contact Us")}
        subtitle="Get in touch with the main office at Ras Al Khaimah International Airport."
      />

      {/* Main office + airport details */}
      <section className="bg-gradient-to-b from-brand-200 to-brand-50 py-20">
        <div className="container-x">
          <SectionHeading
            kicker="Get in touch"
            title={tr("Ras Al Khaimah")}
            highlight="International Airport"
            subtitle="Tap a number to call or the address to email us directly."
          />

          <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-3 lg:items-stretch">
            {/* Main Office card */}
            <article className="animate-fade-up flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_22px_65px_rgba(15,39,64,0.15)] ring-1 ring-brand-100/60">
              <div className="flex items-center gap-3 bg-gradient-to-r from-brand-700 to-brand-600 px-7 py-5 text-white">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
                  <Building2 size={22} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{tr("Information Desk")}</h3>
                  <p className="text-[12px] text-white/70">{tr("General enquiries")}</p>
                </div>
              </div>
              <ul className="flex flex-1 flex-col divide-y divide-brand-50 px-7">
                {contactRows.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-center gap-3.5 py-4">
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">{tr(label)}</div>
                      {href ? (
                        <a href={href} className="text-[14px] font-medium text-ink transition-colors hover:text-brand-600">
                          {tr(value)}
                        </a>
                      ) : (
                        <div className="text-[14px] font-medium text-ink">{tr(value)}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            {/* Airport Information card */}
            <article className="animate-fade-up flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_22px_65px_rgba(15,39,64,0.15)] ring-1 ring-brand-100/60">
              <div className="flex items-center gap-3 bg-gradient-to-r from-brand-600 to-teal-accent px-7 py-5 text-white">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
                  <Plane size={22} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{tr("Airport Information")}</h3>
                  <p className="text-[12px] text-white/70">{tr("Key contact details")}</p>
                </div>
              </div>
              <ul className="flex flex-1 flex-col divide-y divide-brand-50 px-7">
                {airportInfo.map(({ icon: Icon, label, value, href }) => (
                  <li key={label + value} className="flex items-center gap-3.5 py-4">
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">{tr(label)}</div>
                      {href ? (
                        <a href={href} className="text-[14px] font-medium text-ink transition-colors hover:text-brand-600">
                          {tr(value)}
                        </a>
                      ) : (
                        <div className="text-[14px] font-medium text-ink">{tr(value)}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            {/* Airport details card */}
            <article className="animate-fade-up flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_22px_65px_rgba(15,39,64,0.15)] ring-1 ring-brand-100/60">
              <div className="flex items-center gap-3 bg-gradient-to-r from-brand-700 to-brand-600 px-7 py-5 text-white">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
                  <MapPin size={22} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{tr("Airport Details")}</h3>
                  <p className="text-[12px] text-white/70">{tr("Location & coordinates")}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-7">
              <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-teal-accent text-white">
                      <Icon size={18} />
                    </span>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">{tr(label)}</div>
                      <div className="text-[13.5px] font-medium leading-snug text-ink">{tr(value)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=25.6133,55.9389"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 px-5 py-2.5 text-[13px] font-semibold text-brand-700 transition-colors hover:bg-brand-100"
              >{tr("Open in Maps ")}<ArrowRight size={15} />
              </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Mobile apps */}
      <section className="bg-white py-16">
        <div className="container-x">
          <div className="flex flex-col items-center gap-6 rounded-[28px] bg-gradient-to-r from-brand-700 via-brand-600 to-teal-accent px-8 py-12 text-center text-white">
            <Smartphone size={34} />
            <div>
              <h2 className="font-display text-2xl font-semibold">{tr("Get the RAK Airport app")}</h2>
              <p className="mt-2 text-[14px] text-white/80">{tr("Live flight info, services and updates in your pocket.")}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://play.google.com/store/apps/details?id=ae.rak.rakairport" target="_blank" rel="noreferrer"
                 className="rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-brand-700 transition-transform hover:scale-[1.04]">{tr("▸ Google Play")}</a>
              <a href="https://itunes.apple.com/ca/app/rakairport/id767227588?mt=8" target="_blank" rel="noreferrer"
                 className="rounded-full bg-white/15 px-6 py-3 text-[13px] font-semibold text-white ring-1 ring-white/40 backdrop-blur transition-transform hover:scale-[1.04]">{tr("App Store")}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
