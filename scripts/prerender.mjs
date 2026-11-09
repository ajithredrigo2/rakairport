import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pages } from '../src/data/pages.js'
import { render } from '../dist-ssr/entry-server.js'

const origin = 'https://www.rakairport.com'
const siteName = 'Ras Al Khaimah International Airport'
const defaultDescription = 'Official website of Ras Al Khaimah International Airport. Find flight information, airport services, parking and travel guidance.'
const fixedPages = {
  '/': { title: siteName, description: defaultDescription, image: '/About-RAK-Airport-hero.jpg' },
  '/flights': { title: 'Flight Information', description: 'Live arrivals and departures at Ras Al Khaimah International Airport.', image: '/flights-hero.jpg' },
  '/map': { title: 'Terminal Map', description: 'Explore the terminal map, airport facilities, gates, services and passenger amenities.', image: '/Terminal-Map-hero.jpg' },
  '/contact': { title: 'Contact Us', description: 'Contact Ras Al Khaimah International Airport for passenger, airline and general enquiries.', image: '/about-airport-apron.png' },
  '/privacy': { title: 'Privacy Policy', description: 'Read the Ras Al Khaimah International Airport privacy policy.', image: '/privacy-hero.jpg' },
  '/by-laws': { title: 'By-laws and Conditions of Use', description: 'Read the conditions governing use of the Ras Al Khaimah International Airport website and facilities.', image: '/by-laws-hero.jpg' },
}
const paths = [...new Set([...Object.keys(fixedPages), ...Object.keys(pages).map((slug) => `/${slug}`)])].sort()
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

function metadata(pathname) {
  if (fixedPages[pathname]) return fixedPages[pathname]
  const page = pages[pathname.slice(1)]
  return { title: page.hero.title, description: page.hero.subtitle || defaultDescription, image: page.hero.image || '/About-RAK-Airport-hero.jpg' }
}

function inject(document, pathname, markup) {
  const meta = metadata(pathname)
  const title = `${meta.title} | ${siteName}`
  const url = `${origin}${pathname === '/' ? '/' : pathname}`
  const image = meta.image.startsWith('http') ? meta.image : `${origin}${meta.image}`
  const head = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
  ].join('')
  return document
    .replace(/<title>[\s\S]*?<\/title>/, head)
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
}

const clientIndex = resolve('dist/index.html')
if (!existsSync(clientIndex)) throw new Error('Client build is missing: run Vite before prerendering.')
const shell = readFileSync(clientIndex, 'utf8')

for (const pathname of paths) {
  const destination = pathname === '/' ? clientIndex : resolve('dist', pathname.slice(1), 'index.html')
  if (pathname !== '/') mkdirSync(resolve(destination, '..'), { recursive: true })
  writeFileSync(destination, inject(shell, pathname, render(pathname)))
}

console.log(`prerender: wrote ${paths.length} public route${paths.length === 1 ? '' : 's'}`)
