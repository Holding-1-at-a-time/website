import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const robotsContent = `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /_next/
Disallow: /node_modules/
Disallow: /.git/
Disallow: /*.json$
Disallow: /sitemap.xml

Sitemap: https://1detailatatime.com/sitemap.xml
`.trim()

  return new Response(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
