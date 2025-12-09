import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { sendContactNotification, sendContactConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to database
    const result = await sql`
      INSERT INTO contacts (name, email, phone, message, status)
      VALUES (${name}, ${email}, ${phone || null}, ${message}, 'new')
      RETURNING id
    `;

    // Send notification emails
    await Promise.all([
      sendContactNotification({ name, email, phone, message }),
      sendContactConfirmation({ name, email, phone, message })
    ]);

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await sql`
      SELECT id, name, email, phone, message, status, created_at
      FROM contacts
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      contacts: result.rows
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
