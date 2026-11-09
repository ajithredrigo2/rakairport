import { useLanguage } from '../i18n/LanguageContext.jsx'
/** Small shared presentational components used across pages. */

/** Image with a guaranteed fallback so the layout never looks broken. */
export function Img({ src, alt = '', className = '', w = 900, h = 600, eager = false }) {
  const { t: tr, language } = useLanguage()
  return (
    <img
      src={src}
      alt={tr(alt)}
      loading={eager ? 'eager' : 'lazy'}
      className={className}
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.src = '/About-RAK-Airport-hero.jpg'
      }}
    />
  )
}

export function SectionHeading({ kicker, title, highlight, subtitle, center = true }) {
  const { t: tr, language } = useLanguage()
  return (
    <div className={`${center ? 'mx-auto max-w-2xl text-center' : ''} mb-10`}>
      {kicker && (
        <span className="mb-3 inline-block rounded-full bg-brand-50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-600">
          {tr(kicker)}
        </span>
      )}
      {(title || highlight) && (
        <h2 className="font-display text-2xl font-semibold capitalize tracking-tight text-ink sm:text-[28px]">
          {tr(title)} {highlight && <span className="text-brand-500">{tr(highlight)}</span>}
        </h2>
      )}
      {subtitle && <p className="mt-3 text-[14px] leading-relaxed text-ink/55">{tr(subtitle)}</p>}
    </div>
  )
}

export function PageHero({ image, title, subtitle, badge }) {
  const { t: tr, language } = useLanguage()
  return (
    <section className="relative isolate overflow-hidden">
      <Img src={image} alt={tr(title)} eager w={1920} h={900} className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/50 to-ink/20" />
      <div className="pointer-events-none absolute -right-24 top-1/2 -z-10 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="container-x flex min-h-[clamp(360px,48vh,540px)] flex-col justify-center py-20">
        {badge && (
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[12px] font-medium text-white backdrop-blur animate-fade-up">
            {tr(badge)}
          </span>
        )}
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl animate-fade-up">
          {tr(title)}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/80 animate-fade-up">
            {tr(subtitle)}
          </p>
        )}
      </div>
    </section>
  )
}
