import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth';
import { revalidateCategoryCache, revalidateAllProductCaches } from '@/lib/cache';

// GET single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!checkAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const { slug } = await params;

    const result = await sql`
      SELECT
        c.*,
        COUNT(p.id)::integer as product_count
      FROM categories c
      LEFT JOIN products p ON c.slug = p.category
      WHERE c.slug = ${slug}
      GROUP BY c.id
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!checkAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const { name, description, icon_url, category_code } = body;

    // Prevent slug modification (immutable for SEO)
    // Slug changes would break product category references and URLs

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Validate and normalize category_code if provided
    let finalCategoryCode = null;
    if (category_code !== undefined) {
      if (category_code && category_code.trim()) {
        const normalizedCode = category_code.trim().toUpperCase();

        // Validate format: 2-4 uppercase letters
        if (!/^[A-Z]{2,4}$/.test(normalizedCode)) {
          return NextResponse.json({
            success: false,
            error: 'Category code must be 2-4 uppercase letters (e.g., SP, INV, FLLI)'
          }, { status: 400 });
        }

        // Check for duplicate category_code (excluding current category)
        const existingCode = await sql`
          SELECT id FROM categories WHERE category_code = ${normalizedCode} AND slug != ${slug}
        `;

        if (existingCode.rows.length > 0) {
          return NextResponse.json({
            success: false,
            error: 'Category code already exists. Please choose a unique code.'
          }, { status: 409 });
        }

        finalCategoryCode = normalizedCode;
      }
      // If category_code is empty string, set to null to allow removal
    }

    const result = await sql`
      UPDATE categories
      SET
        name = ${name},
        description = ${description || null},
        icon_url = ${icon_url || null},
        category_code = ${finalCategoryCode},
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ${slug}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Revalidate category cache
    await revalidateCategoryCache(slug);

    console.log('[Admin API] Category updated:', slug);

    return NextResponse.json({
      success: true,
      category: result.rows[0],
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!checkAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const { slug } = await params;

    // Check if category has products (deletion protection)
    const productCount = await sql`
      SELECT COUNT(*)::integer as count FROM products WHERE category = ${slug}
    `;

    const count = productCount.rows[0].count;

    if (count > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete category with attached products',
        product_count: count,
        details: `Please reassign or delete the ${count} product${count === 1 ? '' : 's'} in this category first`
      }, { status: 409 });
    }

    // Delete category
    const result = await sql`
      DELETE FROM categories WHERE slug = ${slug}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Normalize display_order after deletion (remove gaps)
    await sql`
      WITH ordered_categories AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY display_order) as new_order
        FROM categories
      )
      UPDATE categories
      SET display_order = ordered_categories.new_order
      FROM ordered_categories
      WHERE categories.id = ordered_categories.id
    `;

    // Revalidate all caches (major change)
    await revalidateAllProductCaches();
    await revalidateCategoryCache();

    console.log('[Admin API] Category deleted and display order normalized:', slug);

    return NextResponse.json({
      success: true,
      category: result.rows[0],
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
