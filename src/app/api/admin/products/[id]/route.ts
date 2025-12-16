import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth';
import { revalidateProductCache, revalidateAllProductCaches } from '@/lib/cache';
import { revalidateProductSitemap } from '@/lib/sitemap-utils';

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const result = await sql`
      SELECT * FROM products WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, brand, description, price, image, image_url, category, specifications, specs, featured, media } = body;

    // Use media if available, otherwise fall back to image/image_url
    const finalImage = image || image_url || (media && media[0]?.url) || null;
    const finalSpecs = specs || specifications || {};
    const finalMedia = media || [];

    const result = await sql`
      UPDATE products
      SET
        name = ${name},
        brand = ${brand || null},
        description = ${description || null},
        price = ${price || null},
        image = ${finalImage},
        category = ${category || null},
        specs = ${JSON.stringify(finalSpecs)},
        featured = ${featured || false},
        media = ${JSON.stringify(finalMedia)}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // PHASE 3: Revalidate caches and sitemap after product update
    await revalidateProductCache(category, featured);
    await revalidateProductSitemap();

    console.log('[Admin API] Product updated, caches invalidated, and sitemap updated:', id);

    return NextResponse.json({
      success: true,
      product: result.rows[0],
      message: 'Product updated and caches refreshed'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;

    // Fetch product before deletion to get category/featured status for cache invalidation
    const productResult = await sql`
      SELECT category, featured FROM products WHERE id = ${id}
    `;

    const product = productResult.rows[0];

    const result = await sql`
      DELETE FROM products WHERE id = ${id}
      RETURNING id
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // PHASE 3: Revalidate caches and sitemap after product deletion
    if (product) {
      await revalidateProductCache(product.category, product.featured);
    } else {
      // If we couldn't get product info, revalidate everything to be safe
      await revalidateAllProductCaches();
    }
    await revalidateProductSitemap();

    console.log('[Admin API] Product deleted, caches invalidated, and sitemap updated:', id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully and caches updated'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
