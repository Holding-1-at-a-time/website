import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/private/',
        '/_next/',
        '/node_modules/',
        '/.git/',
        '/*.json$',
        '/sitemap.xml'
      ],
    },
    sitemap: 'https://1detailatatime.com/sitemap.xml',
  }
}