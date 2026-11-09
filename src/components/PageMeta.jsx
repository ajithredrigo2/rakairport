import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { pages } from '../data/pages.js'

const SITE_NAME = 'Ras Al Khaimah International Airport'
const ORIGIN = 'https://www.rakairport.com'
const DEFAULT_DESCRIPTION = 'Official website of Ras Al Khaimah International Airport. Find flight information, airport services, parking and travel guidance.'
const fixedPages = {
  '/': { title: 'Ras Al Khaimah International Airport', description: DEFAULT_DESCRIPTION, image: '/About-RAK-Airport-hero.jpg' },
  '/flights': { title: 'Flight Information', description: 'Live arrivals and departures at Ras Al Khaimah International Airport.', image: '/flights-hero.jpg' },
  '/map': { title: 'Terminal Map', description: 'Explore the terminal map, airport facilities, gates, services and passenger amenities.', image: '/Terminal-Map-hero.jpg' },
  '/contact': { title: 'Contact Us', description: 'Contact Ras Al Khaimah International Airport for passenger, airline and general enquiries.', image: '/about-airport-apron.png' },
  '/privacy': { title: 'Privacy Policy', description: 'Read the Ras Al Khaimah International Airport privacy policy.', image: '/privacy-hero.jpg' },
  '/by-laws': { title: 'By-laws and Conditions of Use', description: 'Read the conditions governing use of the Ras Al Khaimah International Airport website and facilities.', image: '/by-laws-hero.jpg' },
}

function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function getMeta(pathname) {
  if (fixedPages[pathname]) return fixedPages[pathname]
  const page = pages[pathname.slice(1)]
  if (!page?.hero) return fixedPages['/']
  return {
    title: page.hero.title,
    description: page.hero.subtitle || DEFAULT_DESCRIPTION,
    image: page.hero.image || '/About-RAK-Airport-hero.jpg',
  }
}

/** Keeps the SPA's document metadata accurate for each public route. */
export default function PageMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = getMeta(pathname)
    const title = `${meta.title} | ${SITE_NAME}`
    const canonicalUrl = `${ORIGIN}${pathname === '/' ? '/' : pathname}`
    const image = meta.image.startsWith('http') ? meta.image : `${ORIGIN}${meta.image}`

    document.title = title
    upsertMeta('name', 'description', meta.description)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', meta.description)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:url', canonicalUrl)
    upsertMeta('property', 'og:image', image)
    upsertMeta('name', 'twitter:card', 'summary_large_image')

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)
  }, [pathname])

  return null
}
