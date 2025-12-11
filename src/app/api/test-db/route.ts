import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// Test database connection - NO AUTH REQUIRED for debugging
export async function GET() {
  console.log('🧪 [TEST-DB] Database test endpoint called');

  try {
    // Test 1: Check database connection
    console.log('🧪 [TEST-DB] Testing database connection...');
    const testQuery = await sql`SELECT NOW() as current_time`;
    console.log('🧪 [TEST-DB] ✅ Database connection successful');
    console.log('🧪 [TEST-DB] Current time from DB:', testQuery.rows[0]);

    // Test 2: Query contacts table
    console.log('🧪 [TEST-DB] Querying contacts table...');
    const contactsResult = await sql`
      SELECT id, name, email, phone, message, status, created_at
      FROM contacts
      ORDER BY created_at DESC
    `;

    console.log(`🧪 [TEST-DB] ✅ Found ${contactsResult.rows.length} contacts in database`);
    console.log('🧪 [TEST-DB] Sample data:', contactsResult.rows.slice(0, 3));

    // Test 3: Query products table
    console.log('🧪 [TEST-DB] Querying products table...');
    const productsResult = await sql`
      SELECT id, name, brand, category, price, created_at
      FROM products
      ORDER BY created_at DESC
      LIMIT 5
    `;

    console.log(`🧪 [TEST-DB] ✅ Found ${productsResult.rows.length} products in database`);

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        contacts: {
          count: contactsResult.rows.length,
          sample: contactsResult.rows.slice(0, 3)
        },
        products: {
          count: productsResult.rows.length,
          sample: productsResult.rows
        },
        timestamp: testQuery.rows[0]
      }
    });
  } catch (error) {
    console.error('🧪 [TEST-DB] ❌ Database error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
