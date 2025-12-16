import { NextResponse } from 'next/server';
import productsData from '@/data/products.json';
import { Product } from '@/lib/types';

// Helper function to fetch products from database
async function fetchDatabaseProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products?fields=card`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      return data.products || [];
    }
  } catch (error) {
    console.error('Failed to fetch products from database for sitemap:', error);
  }

  return [];
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vcsolar.shop';

  // Get products from JSON
  const jsonProducts: Product[] = [];
  Object.values(productsData).forEach((categoryProducts) => {
    jsonProducts.push(...(categoryProducts as Product[]));
  });

  // Get products from database
  const dbProducts = await fetchDatabaseProducts();

  // Combine all products
  const allProducts = [...jsonProducts, ...dbProducts];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allProducts
  .map(
    (product) => `  <url>
    <loc>${baseUrl}/products/${product.id}</loc>
    <lastmod>${product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800', // 30 minutes cache
    },
  });
}
