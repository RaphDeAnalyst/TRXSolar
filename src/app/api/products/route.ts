import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Product } from '@/lib/types';

// Field projections for different use cases (currently using SELECT * for all queries)
// TODO: Implement field-specific queries for better performance
// const FIELD_PROJECTIONS = {
//   card: 'id, name, brand, category, price, image, featured, created_at, media',
//   full: '*',
//   featured: 'id, name, brand, category, price, image, featured, created_at, media'
// };

// Public GET endpoint - no auth required
export async function GET(request: Request) {
  const requestStartTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);

    // Query parameters
    const fieldType = (searchParams.get('fields') as 'card' | 'full' | 'featured') || 'card';
    const idsParam = searchParams.get('ids');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset') || '0';

    console.log('[API /products] Query params:', {
      fieldType,
      idsParam,
      category,
      featured,
      limit,
      offset
    });

    console.log('[API /products] Building query...');

    // Execute the query using Vercel Postgres tagged template
    const queryStartTime = Date.now();
    let result;

    // Build dynamic query based on filters
    // Note: We need to handle different filter combinations
    if (idsParam) {
      // Filter by specific IDs (wishlist use case)
      const requestedIds = idsParam.split(',').map(id => id.trim()).filter(Boolean);
      console.log('[API /products] Filtering by IDs (raw):', requestedIds);

      // For array queries with @vercel/postgres, we need to handle it differently
      // Fetch all products and filter in memory for now (acceptable for small datasets)
      const allProducts = await sql`SELECT * FROM products`;

      // Match against both numeric IDs and string IDs (converted to string)
      result = {
        ...allProducts,
        rows: allProducts.rows.filter((p: any) => {
          const productId = p.id?.toString();
          return requestedIds.includes(productId);
        })
      };

      console.log('[API /products] Found', result.rows.length, 'matching products');
    } else if (category && featured === 'true') {
      console.log('[API /products] Filtering by category and featured');
      result = await sql`
        SELECT *
        FROM products
        WHERE category = ${category} AND featured = true
        ORDER BY created_at DESC
      `;
    } else if (category) {
      console.log('[API /products] Filtering by category:', category);
      result = await sql`
        SELECT *
        FROM products
        WHERE category = ${category}
        ORDER BY created_at DESC
      `;
    } else if (featured === 'true') {
      console.log('[API /products] Filtering by featured');
      result = await sql`
        SELECT *
        FROM products
        WHERE featured = true
        ORDER BY created_at DESC
      `;
    } else {
      console.log('[API /products] Fetching all products');
      result = await sql`
        SELECT *
        FROM products
        ORDER BY created_at DESC
      `;
    }

    // Apply pagination if needed (do this in-memory for now since limit/offset with tagged templates is complex)
    if (limit || offset !== '0') {
      const limitNum = limit ? parseInt(limit) : result.rows.length;
      const offsetNum = parseInt(offset);
      result.rows = result.rows.slice(offsetNum, offsetNum + limitNum);
    }

    const queryDuration = Date.now() - queryStartTime;

    console.log(`[API /products] Found ${result.rows.length} products in ${queryDuration}ms`);

    // Transform database products to Product type
    const products: Product[] = result.rows.map((p: any) => {
      // Parse media array from database
      let mediaArray = [];
      try {
        mediaArray = typeof p.media === 'string' ? JSON.parse(p.media) : (Array.isArray(p.media) ? p.media : []);
      } catch (e) {
        console.error('Error parsing media:', e);
        mediaArray = [];
      }

      // Parse specs object
      let specsObj = {};
      if (p.specs) {
        try {
          specsObj = typeof p.specs === 'string' ? JSON.parse(p.specs) : (p.specs || {});
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

    const totalDuration = Date.now() - requestStartTime;
    console.log(`[API /products] ✅ Successfully transformed ${products.length} products in ${totalDuration}ms`);

    const response = NextResponse.json({
      success: true,
      products: products,
      count: products.length,
      _performance: {
        query_ms: queryDuration,
        total_ms: totalDuration
      }
    });

    // PHASE 3: Add edge caching headers
    // Cache for 1 hour (3600 seconds) at the edge
    // s-maxage: cache at CDN/edge for 1 hour
    // stale-while-revalidate: serve stale content while revalidating for 24 hours
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    );

    // Add cache tags for targeted revalidation
    let cacheTags = ['products'];
    if (category) cacheTags.push(`category-${category}`);
    if (featured === 'true') cacheTags.push('featured-products');

    response.headers.set('Cache-Tag', cacheTags.join(','));

    // Add Vary header for different query parameters
    response.headers.set('Vary', 'Accept-Encoding');

    // Add performance header for browser DevTools
    response.headers.set(
      'Server-Timing',
      `db;dur=${queryDuration}, total;dur=${totalDuration}`
    );

    console.log('[API /products] Response headers:', {
      'Cache-Control': response.headers.get('Cache-Control'),
      'Cache-Tag': response.headers.get('Cache-Tag')
    });

    return response;
  } catch (error) {
    console.error('[API /products] ❌ Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
