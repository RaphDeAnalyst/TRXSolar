import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth';
import { revalidateCategoryCache } from '@/lib/cache';

// GET all categories with product counts
export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    // Single query with JOIN to get product counts (avoid N+1)
    const result = await sql`
      SELECT
        c.*,
        COUNT(p.id)::integer as product_count
      FROM categories c
      LEFT JOIN products p ON c.slug = p.category
      GROUP BY c.id
      ORDER BY c.display_order ASC
    `;

    return NextResponse.json({
      success: true,
      categories: result.rows
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { name, slug, description, icon_url, category_code } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    const finalSlug = slug || name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Validate and normalize category_code if provided
    let finalCategoryCode = null;
    if (category_code && category_code.trim()) {
      const normalizedCode = category_code.trim().toUpperCase();

      // Validate format: 2-4 uppercase letters
      if (!/^[A-Z]{2,4}$/.test(normalizedCode)) {
        return NextResponse.json({
          success: false,
          error: 'Category code must be 2-4 uppercase letters (e.g., SP, INV, FLLI)'
        }, { status: 400 });
      }

      // Check for duplicate category_code
      const existingCode = await sql`
        SELECT id FROM categories WHERE category_code = ${normalizedCode}
      `;

      if (existingCode.rows.length > 0) {
        return NextResponse.json({
          success: false,
          error: 'Category code already exists. Please choose a unique code.'
        }, { status: 409 });
      }

      finalCategoryCode = normalizedCode;
    }

    // Check for duplicate slug
    const existingCategory = await sql`
      SELECT id FROM categories WHERE slug = ${finalSlug}
    `;

    if (existingCategory.rows.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Category slug already exists',
        suggestion: `${finalSlug}-${Date.now()}`
      }, { status: 409 });
    }

    // Get max display_order and increment
    const maxOrderResult = await sql`
      SELECT COALESCE(MAX(display_order), 0) as max_order FROM categories
    `;
    const nextOrder = maxOrderResult.rows[0].max_order + 1;

    // Insert new category
    const result = await sql`
      INSERT INTO categories (slug, name, description, icon_url, category_code, display_order)
      VALUES (
        ${finalSlug},
        ${name},
        ${description || null},
        ${icon_url || null},
        ${finalCategoryCode},
        ${nextOrder}
      )
      RETURNING *
    `;

    // Revalidate category cache
    await revalidateCategoryCache(finalSlug);

    console.log('[Admin API] Category created:', result.rows[0].slug);

    return NextResponse.json({
      success: true,
      category: result.rows[0],
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Error creating category:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create category',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
