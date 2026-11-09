import { Languages } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()
  const next = language === 'en' ? 'ar' : 'en'
  return (
    <button
      type="button"
      onClick={() => setLanguage(next)}
      aria-label={next === 'ar' ? 'Switch to Arabic — العربية' : 'Switch to English'}
      lang={next}
      dir={next === 'ar' ? 'rtl' : 'ltr'}
      className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-2 text-[13px] font-semibold text-brand-700 transition-colors hover:bg-brand-50"
    >
      <Languages size={17} aria-hidden="true" />
      {next === 'ar' ? 'العربية' : 'English'}
    </button>
  )
}
