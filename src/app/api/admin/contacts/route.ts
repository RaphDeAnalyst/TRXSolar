import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth';

// GET all contacts
export async function GET(request: NextRequest) {
  console.log('📞 [API] GET /api/admin/contacts - Request received');
  console.log('📞 [API] Timestamp:', new Date().toISOString());

  const authHeader = request.headers.get('authorization');
  console.log('📞 [API] Auth header present:', !!authHeader);

  // Debug environment variables
  console.log('📞 [API] Environment check:');
  console.log('  - ADMIN_PASSWORD set:', !!process.env.ADMIN_PASSWORD);
  console.log('  - NEXT_PUBLIC_ADMIN_PASSWORD set:', !!process.env.NEXT_PUBLIC_ADMIN_PASSWORD);

  if (!checkAdminAuth(request)) {
    console.error('📞 [API] Authentication failed');
    return unauthorizedResponse();
  }

  console.log('📞 [API] Authentication successful, querying database...');

  try {
    // Test database connection first
    console.log('📞 [API] Testing database connection...');

    const result = await sql`
      SELECT id, name, email, phone, message, status, created_at
      FROM contacts
      ORDER BY created_at DESC
    `;

    console.log(`📞 [API] ✅ Successfully fetched ${result.rows.length} contacts from database`);
    console.log('📞 [API] First 2 contacts:', JSON.stringify(result.rows.slice(0, 2), null, 2));

    // Validate data structure
    if (result.rows.length > 0) {
      const firstContact = result.rows[0];
      console.log('📞 [API] Data validation:');
      console.log('  - Has id:', !!firstContact.id);
      console.log('  - Has name:', !!firstContact.name);
      console.log('  - Has email:', !!firstContact.email);
      console.log('  - Has created_at:', !!firstContact.created_at);
      console.log('  - created_at type:', typeof firstContact.created_at);
    }

    return NextResponse.json({
      success: true,
      contacts: result.rows,
      count: result.rows.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('📞 [API] ❌ Database error fetching contacts:', error);
    console.error('📞 [API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch contacts',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
