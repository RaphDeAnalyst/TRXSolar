import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth';

// GET all products
export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const result = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      products: result.rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { id, name, brand, description, price, image, image_url, category, specifications, specs, featured, media } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Product name is required' },
        { status: 400 }
      );
    }

    // Use media if available, otherwise fall back to image/image_url
    const finalImage = image_url || image || (media && media[0]?.url) || null;
    const finalSpecs = specs || specifications || {};
    const finalMedia = media || [];

    const result = await sql`
      INSERT INTO products (id, name, brand, description, price, image, category, specs, featured, media)
      VALUES (
        ${id || name.toLowerCase().replace(/\s+/g, '-')},
        ${name},
        ${brand || null},
        ${description || null},
        ${price || null},
        ${finalImage},
        ${category || null},
        ${JSON.stringify(finalSpecs)},
        ${featured || false},
        ${JSON.stringify(finalMedia)}
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
