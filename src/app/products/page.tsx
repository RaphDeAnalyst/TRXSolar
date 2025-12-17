import { Suspense } from 'react';
import { sql } from '@/lib/db';
import { Product, ProductCategory } from '@/lib/types';
import ProductsPageClient from './ProductsPageClient';

async function fetchProducts(): Promise<Product[]> {
  try {
    console.log('[Products Page] Fetching from database...');

    const result = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
    `;

    console.log(`[Products Page] Found ${result.rows.length} products`);

    // Transform database products to Product type (same logic as API route)
    const products: Product[] = result.rows.map((p: any) => {
      // Parse media array
      let mediaArray = [];
      try {
        mediaArray = typeof p.media === 'string'
          ? JSON.parse(p.media)
          : (Array.isArray(p.media) ? p.media : []);
      } catch (e) {
        console.error('Error parsing media:', e);
        mediaArray = [];
      }

      // Parse specs object
      let specsObj = {};
      if (p.specs) {
        try {
          specsObj = typeof p.specs === 'string'
            ? JSON.parse(p.specs)
            : (p.specs || {});
        } catch (e) {
          console.error('Error parsing specs:', e);
          specsObj = {};
        }
      }

      return {
        id: p.id?.toString() || `db-${p.name}`,
        name: p.name,
        brand: p.brand || 'Unknown',
        category: p.category || 'solar-panels',
        price: parseFloat(p.price) || 0,
        image: p.image || (mediaArray[0]?.url) || '/images/placeholder.jpg',
        media: mediaArray,
        description: p.description || '',
        specs: specsObj,
        featured: p.featured || false,
        createdAt: p.created_at
      };
    });

    return products;
  } catch (error) {
    console.error('[Products Page] Database error:', error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await searchParams (Next.js 15 requirement)
  const params = await searchParams;
  const initialCategory = (params.category as ProductCategory) || null;

  // Fetch products server-side
  const dbProducts = await fetchProducts();

  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Loading products...</p>
      </div>
    }>
      <ProductsPageClient
        initialProducts={dbProducts}
        initialCategory={initialCategory}
      />
    </Suspense>
  );
}
