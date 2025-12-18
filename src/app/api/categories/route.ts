import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET all categories (public endpoint)
export async function GET() {
  try {
    const result = await sql`
      SELECT
        id,
        slug,
        name,
        description,
        icon_url,
        category_code,
        display_order
      FROM categories
      ORDER BY display_order ASC
    `;

    const response = NextResponse.json({
      success: true,
      categories: result.rows
    });

    // Set cache headers for edge caching (1 hour)
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    );

    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
