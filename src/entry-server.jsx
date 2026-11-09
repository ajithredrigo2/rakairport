import { renderToString } from 'react-dom/server'
// React Router 7 exposes StaticRouter from its main package. This project uses
// the v6-compatible declarative APIs, which remain supported by v7.
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'

/** Renders public routes to HTML during the production build for crawlers. */
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <LanguageProvider><App /></LanguageProvider>
    </StaticRouter>,
  )
}
