import { NextRequest } from 'next/server'
import { services } from '@/lib/data'

export async function GET(request: NextRequest) {
  const baseUrl = 'https://1detailatatime.com'
  const currentDate = new Date().toISOString().split('T')[0]
  
  // Generate sitemap XML
  const urls = [
    // Static pages
    {
      url: baseUrl,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      url: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8',
    },
    {
      url: `${baseUrl}/services`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9',
    },
    {
      url: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.9',
    },
    {
      url: `${baseUrl}/booking`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
    },
    // Service pages
    ...services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ]

  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemapXML, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
