import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://1detailatatime.com';
  
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

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-services.xml
Sitemap: ${baseUrl}/sitemap-pages.xml

# Crawl-delay for better server performance
Crawl-delay: 1
`.trim();

  return new NextResponse(robotsContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
