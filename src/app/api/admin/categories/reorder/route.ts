import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth';
import { revalidateCategoryCache } from '@/lib/cache';

// POST reorder categories
export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { order } = body;

    if (!order || !Array.isArray(order)) {
      return NextResponse.json(
        { success: false, error: 'Order array is required' },
        { status: 400 }
      );
    }

    // Batch update all display_order values
    // order should be array of { slug: string, display_order: number }
    for (const item of order) {
      await sql`
        UPDATE categories
        SET display_order = ${item.display_order}
        WHERE slug = ${item.slug}
      `;
    }

    // Revalidate category cache
    await revalidateCategoryCache();

    console.log('[Admin API] Categories reordered:', order.length, 'categories');

    return NextResponse.json({
      success: true,
      message: 'Categories reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder categories' },
      { status: 500 }
    );
  }
}
