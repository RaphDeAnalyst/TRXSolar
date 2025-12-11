import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Test 1: Check if products table exists and its structure
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'products'
      ORDER BY ordinal_position;
    `;

    // Test 2: Count products in database
    const productCount = await sql`
      SELECT COUNT(*) as count FROM products;
    `;

    // Test 3: Try to fetch a few products
    const sampleProducts = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
      LIMIT 3;
    `;

    // Test 4: Check environment variables
    const hasPostgresUrl = !!process.env.POSTGRES_URL;
    const hasPrismaUrl = !!process.env.POSTGRES_PRISMA_URL;

    return NextResponse.json({
      success: true,
      tests: {
        tableStructure: tableInfo.rows,
        productCount: productCount.rows[0]?.count || 0,
        sampleProducts: sampleProducts.rows,
        environment: {
          POSTGRES_URL: hasPostgresUrl ? 'Set' : 'Not set',
          POSTGRES_PRISMA_URL: hasPrismaUrl ? 'Set' : 'Not set',
        }
      }
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
