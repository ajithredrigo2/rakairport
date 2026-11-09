import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translate } from './translate.js'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'rakia-language'
// Temporary launch setting: retain the localisation work, but serve English only.
export const TRANSLATION_ENABLED = false

function savedLanguage() {
  if (!TRANSLATION_ENABLED) return 'en'
  try { return localStorage.getItem(STORAGE_KEY) === 'ar' ? 'ar' : 'en' }
  catch { return 'en' }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(savedLanguage)
  const value = useMemo(() => ({
    language,
    setLanguage(next) {
      if (!TRANSLATION_ENABLED) return
      if (next !== 'en' && next !== 'ar') return
      setLanguageState(next)
      try { localStorage.setItem(STORAGE_KEY, next) } catch { /* Storage may be disabled. */ }
    },
    t: text => translate(text, language),
  }), [language])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage requires LanguageProvider')
  return value
}
