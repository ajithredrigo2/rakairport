import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, QrCode, ParkingCircle, BadgeCheck, Info, ExternalLink, MapPin } from 'lucide-react'
import { PageHero, SectionHeading, Img } from './ui.jsx'

/* ---------------------------- section renderers ---------------------------- */

function Intro({ kicker, title, highlight, subtitle, paragraphs, image, link, links }) {
  const { t: tr, language } = useLanguage()
  if (!image && (!paragraphs || !paragraphs.length)) {
    return (
      <div className="container-x">
        <SectionHeading kicker={kicker} title={tr(title)} highlight={highlight} subtitle={subtitle} />
      </div>
    )
  }
  return (
    <div className="container-x">
      <SectionHeading kicker={kicker} title={tr(title)} highlight={highlight} subtitle={subtitle} />
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        {image && (
          <Img src={image} alt={tr(title)} className="animate-fade-up h-80 w-full rounded-3xl object-cover shadow-lg" />
        )}
        {paragraphs && (
          <div className="animate-fade-up space-y-5 text-[14.5px] leading-relaxed text-ink/60">
            {paragraphs.map((p, i) =>
              p && typeof p === 'object' && p.highlight ? (
                <div
                  key={i}
                  className="rounded-xl border-l-4 border-brand-500 bg-brand-50 px-4 py-3 text-[15px] font-semibold text-brand-800"
                >
                  {tr(p.text)}
                </div>
              ) : (
                <p key={i}>{tr(typeof p === 'string' ? p : p.text)}</p>
              ),
            )}
            {links && links.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-1">
                {links.map((l) => {
                  const Icon = l.icon || ExternalLink
                  return (
                    <a
                      key={l.label}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-700"
                    >
                      <Icon size={16} /> {tr(l.label)}
                    </a>
                  )
                })}
              </div>
            )}
            {!links && link && (
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-700"
              >
                {tr(link.label)} <ExternalLink size={15} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Feature({ icon: Icon, title, text, points, image, reverse }) {
  const { t: tr, language } = useLanguage()
  return (
    <article className="animate-fade-up grid items-stretch overflow-hidden rounded-[28px] bg-white shadow-[0_22px_65px_rgba(15,39,64,0.14)] ring-1 ring-brand-100/60 md:grid-cols-2">
      <div className={`relative h-56 overflow-hidden sm:h-64 md:h-auto md:min-h-0 ${reverse ? 'md:order-2' : ''}`}>
        <Img src={image} alt={tr(title)} className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className={`flex flex-col justify-center gap-4 p-9 sm:p-12 ${reverse ? 'md:order-1' : ''}`}>
        {Icon && (
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Icon size={24} />
          </span>
        )}
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">{tr(title)}</h2>
        <p className="max-w-md text-[14.5px] leading-relaxed text-ink/55">{tr(text)}</p>
        {points && (
          <ul className="mt-1 space-y-2.5">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[14px] font-medium text-ink/75">
                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-teal-accent" />
                {tr(p)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

function Cards({ kicker, title, highlight, subtitle, columns = 3, items, narrow }) {
  const { t: tr, language } = useLanguage()
  const cols = { 1: 'mx-auto max-w-2xl', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[columns]
  return (
    <div className="container-x">
      {title && <SectionHeading kicker={kicker} title={tr(title)} highlight={highlight} subtitle={subtitle} />}
      <div className={`grid gap-7 ${cols} ${narrow ? 'mx-auto max-w-3xl' : ''}`}>
        {items.map((it, i) => {
          const Icon = it.icon
          return (
            <article
              key={it.title}
              style={{ animationDelay: `${i * 0.08}s` }}
              className="animate-fade-up group overflow-hidden rounded-3xl bg-white shadow-[0_18px_55px_rgba(15,39,64,0.13)] ring-1 ring-brand-100/60 transition-all hover:-translate-y-1.5 hover:shadow-[0_30px_75px_rgba(19,120,212,0.24)]"
            >
              {it.image ? (
                <div className={`relative overflow-hidden ${it.imageAuto ? '' : it.imageTall ? 'h-64' : 'h-48'} ${it.imageContain || it.imageAuto ? 'bg-brand-50' : ''}`}>
                  <Img src={it.image} alt={tr(it.title)} className={`w-full ${it.imageAuto ? 'h-auto' : 'h-full'} ${it.imageContain ? 'object-contain' : 'object-cover'} ${it.imageTop ? 'object-top' : ''} transition-transform duration-700 ${it.imageContain || it.imageAuto ? '' : 'group-hover:scale-110'}`} />
                  {Icon && (
                    <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-brand-600 backdrop-blur">
                      <Icon size={18} />
                    </span>
                  )}
                </div>
              ) : (
                Icon && (
                  <div className="flex h-28 items-center justify-center bg-gradient-to-br from-brand-50 to-mist">
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-teal-accent text-white shadow-md transition-transform group-hover:scale-105">
                      <Icon size={28} />
                    </span>
                  </div>
                )
              )}
              <div className="p-6">
                {it.tag && <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">{tr(it.tag)}</span>}
                <h3 className="mt-1 font-display text-lg font-semibold text-ink">{tr(it.title)}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink/55">{tr(it.text)}</p>
                {it.points && (
                  <ul className={`mt-3 ${it.pointsCols === 2 ? 'grid gap-x-6 gap-y-1.5 sm:grid-cols-2' : 'space-y-1.5'}`}>
                    {it.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-[13px] font-medium text-ink/70">
                        <CheckCircle2 size={15} className="flex-shrink-0 text-teal-accent" /> {tr(p)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function Team({ kicker, title, highlight, subtitle, items }) {
  const { t: tr, language } = useLanguage()
  return (
    <div className="container-x">
      {title && <SectionHeading kicker={kicker} title={tr(title)} highlight={highlight} subtitle={subtitle} />}
      <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-7">
        {items.map((it, i) => (
          <article
            key={it.title}
            style={{ animationDelay: `${i * 0.08}s` }}
            className="animate-fade-up group flex w-full flex-col items-center rounded-3xl bg-white p-7 text-center shadow-[0_18px_55px_rgba(15,39,64,0.13)] ring-1 ring-brand-100/60 transition-all hover:-translate-y-1.5 hover:shadow-[0_30px_75px_rgba(19,120,212,0.24)] sm:w-[300px]"
          >
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-brand-400 to-teal-accent opacity-70 blur-[2px]" />
              <Img
                src={it.image}
                alt={tr(it.title)}
                w={300}
                h={300}
                className="relative h-32 w-32 rounded-full object-cover object-top ring-4 ring-white"
              />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold text-ink">{tr(it.title)}</h3>
            {it.tag && (
              <span className="mt-1.5 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-600">
                {tr(it.tag)}
              </span>
            )}
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink/55">{tr(it.text)}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function LinkList({ kicker, title, highlight, subtitle, groups }) {
  const { t: tr, language } = useLanguage()
  // Each card may contain one or more sub-sections (heading + links).
  const cards = groups.map((g) => (g.sections ? g.sections : [{ heading: g.heading, links: g.links }]))
  return (
    <div className="container-x">
      {title && <SectionHeading kicker={kicker} title={tr(title)} highlight={highlight} subtitle={subtitle} />}
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-center gap-7">
        {cards.map((sections, ci) => (
          <div
            key={ci}
            style={{ animationDelay: `${ci * 0.06}s` }}
            className="animate-fade-up w-full rounded-3xl bg-white p-6 shadow-[0_18px_55px_rgba(15,39,64,0.13)] ring-1 ring-brand-100/60 sm:w-[340px]"
          >
            {sections.map((sec, si) => (
              <div key={sec.heading} className={si > 0 ? 'mt-6' : ''}>
                <h3 className="mb-4 flex items-center gap-2 font-display text-[15px] font-semibold text-ink">
                  <span className="h-4 w-1 rounded-full bg-gradient-to-b from-brand-500 to-teal-accent" />
                  {tr(sec.heading)}
                </h3>
                <ul className="space-y-1">
                  {sec.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={`https://${l.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col rounded-xl px-3 py-2 transition-colors hover:bg-brand-50"
                      >
                        <span className="text-[13.5px] font-medium text-ink/80 group-hover:text-brand-600">{tr(l.label)}</span>
                        <span className="inline-flex items-center gap-1 text-[12px] text-brand-500">
                          <ExternalLink size={12} /> {tr(l.url)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function LinksGrid({ kicker, title, highlight, items, centered = false }) {
  const { t: tr, language } = useLanguage()
  return (
    <div className="container-x">
      {title && <SectionHeading kicker={kicker} title={tr(title)} highlight={highlight} />}
      <div className={`grid grid-cols-2 gap-4 ${centered ? 'mx-auto max-w-md' : 'sm:grid-cols-3 lg:grid-cols-6'}`}>
        {items.map(({ label, icon: Icon }, i) => (
          <button
            key={label}
            style={{ animationDelay: `${i * 0.05}s` }}
            className="animate-fade-up group flex flex-col items-center gap-3 rounded-2xl border border-brand-100 bg-mist p-6 text-center transition-all hover:-translate-y-1.5 hover:border-brand-300 hover:bg-brand-50 hover:shadow-lg hover:shadow-brand-100"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white text-brand-500 shadow-sm transition-colors group-hover:bg-brand-500 group-hover:text-white">
              <Icon size={22} />
            </span>
            <span className="text-[13px] font-semibold text-ink/80">{tr(label)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Stats({ items }) {
  const { t: tr, language } = useLanguage()
  return (
    <div className="container-x grid grid-cols-2 gap-8 lg:grid-cols-4">
      {items.map(({ num, label }, i) => (
        <div key={label} style={{ animationDelay: `${i * 0.1}s` }} className="animate-fade-up text-center">
          <div className="font-display text-4xl font-semibold text-white">{tr(num)}</div>
          <div className="mt-1.5 text-[13px] text-white/70">{tr(label)}</div>
        </div>
      ))}
    </div>
  )
}

function Pricing({ kicker, title, highlight, subtitle, rates, membership, note, ratesTitle }) {
  const { t: tr, language } = useLanguage()
  return (
    <div className="container-x">
      <SectionHeading kicker={kicker} title={tr(title)} highlight={highlight} subtitle={subtitle} />
      <div className={`grid gap-7 ${membership ? 'lg:grid-cols-2 lg:items-start' : 'mx-auto max-w-2xl'}`}>
        {/* Surface parking rate card */}
        {rates && (
          <div className="animate-fade-up overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(15,39,64,0.14)] ring-1 ring-brand-100/60">
            <div className="flex items-center gap-3 bg-gradient-to-r from-brand-700 to-brand-600 px-7 py-5 text-white">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
                <ParkingCircle size={22} />
              </span>
              <h3 className="font-display text-lg font-semibold">{tr(ratesTitle || 'Short-Term Parking')}</h3>
            </div>
            <ul className="divide-y divide-brand-50">
              {rates.map((r) => (
                <li key={r.label} className="flex items-center justify-between gap-4 px-7 py-4">
                  <span className="text-[13.5px] text-ink/70">{tr(r.label)}</span>
                  <span
                    className={`flex-shrink-0 rounded-full px-3 py-1 text-[13px] font-semibold ${
                      r.free ? 'bg-teal-accent/15 text-teal-accent' : 'bg-brand-50 text-brand-700'
                    }`}
                  >
                    {tr(r.value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Membership table card */}
        {membership && (
          <div className="animate-fade-up overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(15,39,64,0.14)] ring-1 ring-brand-100/60">
            <div className="flex items-center gap-3 bg-gradient-to-r from-brand-600 to-teal-accent px-7 py-5 text-white">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
                <BadgeCheck size={22} />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold">{tr(membership.title || 'Membership Rates')}</h3>
                {membership.subtitle && <p className="text-[12px] text-white/75">{tr(membership.subtitle)}</p>}
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-100 text-[11px] font-semibold uppercase tracking-wider text-ink/45">
                  <th className="px-7 py-3.5">{tr("Period")}</th>
                  <th className="px-7 py-3.5 text-right">{tr("AED")}</th>
                </tr>
              </thead>
              <tbody>
                {membership.rows.map((row) => (
                  <tr key={row.period} className="border-b border-brand-50 transition-colors last:border-0 hover:bg-brand-50/50">
                    <td className="px-7 py-4 text-[13.5px] font-semibold text-ink">{tr(row.period)}</td>
                    <td className="px-7 py-4 text-right text-[13.5px] font-semibold text-brand-700">{tr(row.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {membership.footnote && (
              <p className="bg-mist px-7 py-3 text-[11.5px] text-ink/45">{tr(membership.footnote)}</p>
            )}
          </div>
        )}
      </div>

      {note && (
        <div className="animate-fade-up mt-7 flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 px-6 py-4">
          <Info size={18} className="mt-0.5 flex-shrink-0 text-brand-600" />
          <p className="text-[13.5px] leading-relaxed text-ink/70">{tr(note)}</p>
        </div>
      )}
    </div>
  )
}

function MapEmbed({ kicker, title, highlight, subtitle, query, linkQuery, zoom = 16, label = 'Open in Maps', satellite = false }) {
  const { t: tr, language } = useLanguage()
  const t = satellite ? '&t=k' : ''
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(query)}${t}&z=${zoom}&hl=${language}&output=embed`
  const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(linkQuery || query)}`
  return (
    <div className="container-x">
      <SectionHeading kicker={kicker} title={tr(title)} highlight={highlight} subtitle={subtitle} />
      <div className="animate-fade-up relative overflow-hidden rounded-[28px] shadow-[0_24px_66px_rgba(15,39,64,0.16)] ring-1 ring-brand-100/60">
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[13px] font-semibold text-brand-700 shadow-lg backdrop-blur transition-transform hover:scale-[1.04]"
        >
          {tr(label)} <ExternalLink size={15} />
        </a>
        <iframe
          title={tr(title || 'Map')}
          src={embed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[420px] w-full border-0"
        />
      </div>
    </div>
  )
}

function MapCards({ kicker, title, highlight, subtitle, query, linkQuery, zoom = 13, label = 'Open in Google Maps', cards = [] }) {
  const { t: tr, language } = useLanguage()
  const [active, setActive] = useState(0)
  const card = cards[active] || {}
  // The active card drives the map: its own query (or its name) centers the embed
  // and drops a pin on that exact location.
  const mapQuery = card.query || query || 'Ras Al Khaimah, UAE'
  const mapZoom = card.zoom || zoom
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=${mapZoom}&hl=${language}&output=embed`
  const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.query || card.title || linkQuery || query)}`
  return (
    <div className="container-x">
      <SectionHeading kicker={kicker} title={tr(title)} highlight={highlight} subtitle={subtitle} />
      <div className="relative overflow-hidden rounded-[28px] shadow-[0_24px_66px_rgba(15,39,64,0.16)] ring-1 ring-brand-100/60">
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[13px] font-semibold text-brand-700 shadow-lg backdrop-blur transition-transform hover:scale-[1.04]"
        >
          {tr(label)} <ExternalLink size={15} />
        </a>
        <iframe
          key={mapQuery}
          title={tr(card.title || title || 'Map')}
          src={embed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[520px] w-full border-0"
        />
        {/* legibility gradient behind the cards */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-ink/50 via-ink/10 to-transparent" />
        {/* clickable location cards - selecting one shows it on the map */}
        <div className="absolute inset-x-0 bottom-0 flex snap-x gap-4 overflow-x-auto p-4 sm:p-5">
          {cards.map((c, i) => {
            const on = i === active
            return (
              <article
                key={c.title}
                role="button"
                tabIndex={0}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActive(i)
                  }
                }}
                className={`pointer-events-auto w-60 flex-shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl bg-white shadow-[0_20px_46px_rgba(15,39,64,0.30)] transition-all hover:-translate-y-1 ${
                  on ? '-translate-y-1 ring-2 ring-brand-500' : 'ring-1 ring-black/5'
                }`}
              >
                <div className="relative h-28 overflow-hidden">
                  <Img src={c.image} alt={tr(c.title)} className="h-full w-full object-cover" />
                  <span
                    className={`absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full shadow backdrop-blur transition-colors ${
                      on ? 'bg-brand-600 text-white' : 'bg-white/90 text-brand-600'
                    }`}
                  >
                    <MapPin size={14} />
                  </span>
                </div>
                <div className="p-3.5">
                  <h3 className="font-display text-[15px] font-semibold leading-tight text-ink">{tr(c.title)}</h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                    {c.facts.map((f) => {
                      const Icon = f.icon
                      return (
                        <span key={f.text} className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink/70">
                          <Icon size={14} className="text-brand-500" /> {tr(f.text)}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function QR({ kicker, title, highlight, text, points, image, caption }) {
  const { t: tr, language } = useLanguage()
  return (
    <div className="container-x">
      <div className="grid items-center gap-10 overflow-hidden rounded-[32px] bg-white p-8 shadow-[0_22px_65px_rgba(15,39,64,0.14)] ring-1 ring-brand-100/60 sm:p-12 lg:grid-cols-[1fr_auto]">
        <div>
          {kicker && (
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-600">
              {tr(kicker)}
            </span>
          )}
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">
            {tr(title)} {highlight && <span className="text-brand-500">{tr(highlight)}</span>}
          </h2>
          {text && <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink/55">{tr(text)}</p>}
          {points && (
            <ul className="mt-5 space-y-2.5">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[14px] font-medium text-ink/75">
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-teal-accent" />
                  {tr(p)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mx-auto flex flex-col items-center">
          <div className="rounded-[28px] bg-gradient-to-br from-brand-600 via-brand-500 to-teal-accent p-3 shadow-[0_26px_64px_rgba(19,120,212,0.30)]">
            <div className="rounded-2xl bg-white p-4">
              <img
                src={image}
                alt={tr(caption || 'QR code')}
                width={220}
                height={220}
                className="h-[220px] w-[220px] object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling.style.display = 'flex'
                }}
              />
              <div className="hidden h-[220px] w-[220px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-200 text-center text-[12px] text-ink/45">
                <QrCode size={40} className="text-brand-300" />{tr("QR image not found")}</div>
            </div>
          </div>
          {caption && <p className="mt-4 text-center text-[12.5px] font-medium text-ink/55">{tr(caption)}</p>}
        </div>
      </div>
    </div>
  )
}

function ActionCards({ items = [] }) {
  const { t: tr, language } = useLanguage()
  return (
    <div className="container-x">
      <div className="mx-auto grid max-w-5xl gap-7 md:grid-cols-2">
        {items.map((it) => {
          const external = /^https?:/.test(it.to) || /\.pdf($|\?)/i.test(it.to)
          const btnClass =
            'mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-7 py-3 text-[14px] font-semibold text-brand-700 shadow-lg transition-transform hover:scale-[1.04]'
          return (
            <div
              key={it.title}
              className="animate-fade-up relative flex flex-col overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-700 via-brand-600 to-teal-accent p-9 text-white shadow-[0_22px_65px_rgba(19,120,212,0.22)]"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <h3 className="relative font-display text-xl font-semibold">{tr(it.title)}</h3>
              {it.text && <p className="relative mt-2 flex-1 text-[14px] leading-relaxed text-white/80">{tr(it.text)}</p>}
              {external ? (
                <a href={it.to} target="_blank" rel="noreferrer" className={btnClass}>
                  {tr(it.buttonLabel)} <ArrowRight size={16} />
                </a>
              ) : (
                <Link to={it.to} className={btnClass}>
                  {tr(it.buttonLabel)} <ArrowRight size={16} />
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CTA({ title, text, buttonLabel = 'Connect', to = '/' }) {
  const { t: tr, language } = useLanguage()
  const external = /^https?:/.test(to) || /\.pdf($|\?)/i.test(to)
  const btnClass =
    'relative mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[14px] font-semibold text-brand-700 shadow-lg transition-transform hover:scale-[1.04]'
  return (
    <div className="container-x">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-brand-700 via-brand-600 to-teal-accent px-8 py-14 text-center text-white sm:px-16">
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <h2 className="relative mx-auto max-w-2xl font-display text-2xl font-semibold sm:text-3xl">{tr(title)}</h2>
        {text && (
          <p className="relative mx-auto mt-3 max-w-xl text-[14.5px] text-white/80">
            {Array.isArray(text)
              ? text.map((line, i) => (
                  <span key={i} className="block">
                    {tr(line)}
                  </span>
                ))
              : tr(text)}
          </p>
        )}
        {external ? (
          <a href={to} target="_blank" rel="noreferrer" className={btnClass}>
            {tr(buttonLabel)} <ArrowRight size={16} />
          </a>
        ) : (
          <Link to={to} className={btnClass}>
            {tr(buttonLabel)} <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  )
}

/* ------------------------------ page wrapper ------------------------------ */

const BG = { white: 'bg-white', mist: 'bg-gradient-to-b from-brand-200 to-brand-50', brand: 'bg-gradient-to-r from-brand-700 to-brand-500' }

export default function ContentPage({ cfg }) {
  const { t: tr, language } = useLanguage()
  return (
    <>
      <PageHero {...cfg.hero} />
      {cfg.sections.map((s, i) => {
        const bg = s.bg || (i % 2 === 0 ? 'white' : 'mist')
        return (
          <section key={i} className={`${BG[bg]} py-20`}>
            {s.type === 'intro' && <Intro {...s} />}
            {s.type === 'cards' && <Cards {...s} />}
            {s.type === 'team' && <Team {...s} />}
            {s.type === 'links' && <LinksGrid {...s} />}
            {s.type === 'linklist' && <LinkList {...s} />}
            {s.type === 'stats' && <Stats {...s} />}
            {s.type === 'cta' && <CTA {...s} />}
            {s.type === 'actions' && <ActionCards {...s} />}
            {s.type === 'qr' && <QR {...s} />}
            {s.type === 'pricing' && <Pricing {...s} />}
            {s.type === 'map' && <MapEmbed {...s} />}
            {s.type === 'mapcards' && <MapCards {...s} />}
            {s.type === 'features' && (
              <div className="container-x space-y-8">
                {s.items.map((f, fi) => (
                  <Feature key={f.title} {...f} reverse={fi % 2 === 1} />
                ))}
              </div>
            )}
          </section>
        )
      })}
    </>
  )
}
