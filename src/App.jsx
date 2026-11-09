import { useLanguage } from './i18n/LanguageContext.jsx'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Chatbot from './components/Chatbot.jsx'
import Analytics from './components/Analytics.jsx'
import PageMeta from './components/PageMeta.jsx'
import ContentPage from './components/ContentPage.jsx'
import Home from './pages/Home.jsx'
import Flights from './pages/Flights.jsx'
import Map from './pages/Map.jsx'
import Legal from './pages/Legal.jsx'
import Contact from './pages/Contact.jsx'
import { pages } from './data/pages.js'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  const { t: tr, language } = useLanguage()
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <PageMeta />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >{tr("Skip to main content")}</a>
      <Navbar />
      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/map" element={<Map />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Legal doc="privacy" />} />
          <Route path="/by-laws" element={<Legal doc="bylaws" />} />
          {/* Data-driven content pages (Airport Home, Information, Business, Duty Free, Visitor Info, Careers) */}
          {Object.entries(pages).map(([slug, cfg]) => (
            <Route key={slug} path={`/${slug}`} element={<ContentPage cfg={cfg} />} />
          ))}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
      <Analytics />
    </div>
  )
}
