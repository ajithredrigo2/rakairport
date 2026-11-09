import { useLanguage } from '../i18n/LanguageContext.jsx'
/**
 * Brand logo. Uses the official RAK mark.
 * Drop the exact official file at `public/logo.png` to use it verbatim -  * the code prefers it and falls back to the vector `public/logo.svg`.
 */
export default function Logo({ light = false }) {
  const { t: tr, language } = useLanguage()
  return (
    <div className="flex max-w-[calc(100vw-5.5rem)] items-center gap-3 sm:max-w-none">
      <img
        src="/RAKIA-logo.png"
        alt={tr("Ras Al Khaimah International Airport")}
        className="h-10 w-auto flex-shrink-0 sm:h-11"
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = '/logo.svg'
        }}
      />
      <div className="min-w-0 leading-tight">
        <div className={`truncate font-display text-[13px] font-semibold tracking-wide ${light ? 'text-white' : 'text-ink'}`}>{tr("RAS AL KHAIMAH")}</div>
        <div className={`truncate text-[10px] font-medium tracking-[0.18em] ${light ? 'text-white/70' : 'text-brand-600'}`}>{tr("INTERNATIONAL AIRPORT")}</div>
      </div>
    </div>
  )
}
