import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Product } from '@/lib/types';

// Public GET endpoint - no auth required
export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
    `;

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

      // Parse specs object from database
      let specsObj = {};
      try {
        specsObj = typeof p.specs === 'string' ? JSON.parse(p.specs) : (p.specs || {});
      } catch (e) {
        console.error('Error parsing specs:', e);
        specsObj = {};
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

    return NextResponse.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
