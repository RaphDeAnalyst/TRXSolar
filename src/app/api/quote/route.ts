import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { sendQuoteRequestNotification, sendQuoteRequestConfirmation, QuoteRequestData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, projectType, timeframe, address, notes, conditionalFields } = body;

    // Validate required fields
    if (!name || !email || !phone || !projectType || !timeframe || !address) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate project type
    if (!['residential', 'commercial', 'off-grid'].includes(projectType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project type' },
        { status: 400 }
      );
    }

    let contactId = null;

    // Try to save to database if configured
    if (process.env.POSTGRES_URL) {
      try {
        // Save as a contact with structured message
        let conditionalFieldsText = '';
        if (conditionalFields?.residential) {
          conditionalFieldsText = `
Room Count: ${conditionalFields.residential.roomCount || 'Not specified'}
Essential Items: ${conditionalFields.residential.essentials?.join(', ') || 'None selected'}`;
        } else if (conditionalFields?.commercial) {
          conditionalFieldsText = `
Establishment Size: ${conditionalFields.commercial.establishmentSize || 'Not specified'}
Primary Goal: ${conditionalFields.commercial.primaryGoal || 'Not specified'}`;
        } else if (conditionalFields?.offGrid?.locationDescription) {
          conditionalFieldsText = `
Location Description: ${conditionalFields.offGrid.locationDescription}`;
        }

        const message = `QUOTE REQUEST
Project Type: ${projectType}
Installation Timeframe: ${timeframe}
Installation Address: ${address}${conditionalFieldsText}
${notes ? `\nAdditional Notes:\n${notes}` : ''}`;

        const result = await sql`
          INSERT INTO contacts (name, email, phone, message, status)
          VALUES (${name}, ${email}, ${phone}, ${message}, 'new')
          RETURNING id
        `;
        contactId = result.rows[0].id;
      } catch (dbError) {
        console.warn('Database not available, continuing without saving:', dbError);
      }
    } else {
      console.log('Database not configured. Quote request data:', {
        name,
        email,
        phone,
        projectType,
        timeframe,
        address,
        notes
      });
    }

    // Prepare quote request data for email
    const quoteData: QuoteRequestData = {
      name,
      email,
      phone,
      projectType: projectType as 'residential' | 'commercial' | 'off-grid',
      timeframe,
      address,
      notes: notes || undefined,
      conditionalFields: conditionalFields || undefined
    };

    // Try to send notification emails (non-blocking)
    try {
      await Promise.all([
        sendQuoteRequestNotification(quoteData),
        sendQuoteRequestConfirmation(quoteData)
      ]);
    } catch (emailError) {
      console.warn('Email service error (non-blocking):', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Quote request submitted successfully',
      id: contactId
    });
  } catch (error) {
    console.error('Quote request error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}
