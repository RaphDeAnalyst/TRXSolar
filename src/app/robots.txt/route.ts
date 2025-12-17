import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vcsolar.shop';

  const robotsTxt = `# Robots.txt for VCSolar
# https://vcsolar.shop

User-agent: *
Allow: /

# Explicitly allow API routes for search engines to verify data sources
Allow: /api/products
Allow: /api/products?fields=card

# Allow Next.js static assets
Allow: /_next/static/

# Disallow admin routes for security
Disallow: /admin
Disallow: /api/admin/

# Disallow other API routes (allow only products API)
Disallow: /api/contact
Disallow: /api/quote
Disallow: /api/test-db
Disallow: /api/test-products
Disallow: /api/init-db

# Disallow saved items (user-specific)
Disallow: /saved-items

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24 hours
    },
  });
}
