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
    const { name, description, price, image_url, category, specifications } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Product name is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO products (name, description, price, image_url, category, specifications)
      VALUES (${name}, ${description || null}, ${price || null}, ${image_url || null}, ${category || null}, ${JSON.stringify(specifications) || null})
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
