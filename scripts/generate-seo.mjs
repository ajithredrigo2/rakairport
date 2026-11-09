import { writeFileSync, existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pages } from '../src/data/pages.js'

const origin = 'https://www.rakairport.com'
const staticPaths = ['/', '/flights', '/map', '/contact', '/privacy', '/by-laws']
const paths = [...new Set([...staticPaths, ...Object.keys(pages).map((slug) => `/${slug}`)])].sort()
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')}\n</urlset>\n`
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`

function writeIfChanged(file, content) {
  if (!existsSync(file) || readFileSync(file, 'utf8') !== content) writeFileSync(file, content)
}

writeIfChanged(resolve('public/sitemap.xml'), sitemap)
writeIfChanged(resolve('public/robots.txt'), robots)
