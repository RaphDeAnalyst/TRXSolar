import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build');

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface QuoteRequestData {
  name: string;
  email: string;
  phone: string;
  projectType: 'residential' | 'commercial' | 'off-grid';
  timeframe: string;
  address: string;
  notes?: string;
}

export async function sendContactNotification(data: ContactEmailData) {
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy_key_for_build') {
    console.warn('Resend API key not configured. Skipping email notification.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'VCSolar Contact System <noreply@vcsolar.shop>',
      to: ['sales@vcsolar.shop'],
      subject: `NEW GENERAL INQUIRY | ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 20px 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
            .info-badge { background-color: #e0e7ff; border-left: 4px solid #6366f1; padding: 12px 16px; margin: 20px; border-radius: 4px; }
            .info-badge-title { font-size: 16px; font-weight: 600; color: #4338ca; margin: 0 0 4px 0; }
            .content { padding: 24px; }
            .data-block { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin: 16px 0; }
            .data-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .data-row:last-child { border-bottom: none; }
            .data-label { font-weight: 600; color: #6b7280; min-width: 100px; }
            .data-value { color: #1f2937; flex: 1; }
            .message-block { background-color: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 6px; padding: 16px; margin: 16px 0; }
            .message-label { font-weight: 600; color: #0c4a6e; margin-bottom: 8px; }
            .message-text { color: #1f2937; white-space: pre-wrap; line-height: 1.6; }
            .footer { background-color: #f9fafb; padding: 16px 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
            .timestamp { color: #9ca3af; font-size: 13px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 General Website Inquiry Received</h1>
            </div>

            <div class="info-badge">
              <p class="info-badge-title">ℹ️ New Contact Message</p>
              <p style="margin: 0; color: #4338ca; font-size: 14px;">A general inquiry has been submitted through the website contact form.</p>
            </div>

            <div class="content">
              <h3 style="color: #6366f1; margin: 0 0 16px 0; font-size: 16px;">Contact Information</h3>

              <div class="data-block">
                <div class="data-row">
                  <div class="data-label">Name</div>
                  <div class="data-value"><strong>${data.name}</strong></div>
                </div>
                <div class="data-row">
                  <div class="data-label">Email</div>
                  <div class="data-value"><a href="mailto:${data.email}" style="color: #6366f1; text-decoration: none;">${data.email}</a></div>
                </div>
                ${data.phone ? `
                <div class="data-row">
                  <div class="data-label">Phone</div>
                  <div class="data-value"><a href="tel:${data.phone}" style="color: #6366f1; text-decoration: none;">${data.phone}</a></div>
                </div>
                ` : ''}
              </div>

              <h3 style="color: #6366f1; margin: 24px 0 12px 0; font-size: 16px;">Message Content</h3>

              <div class="message-block">
                <div class="message-label">Customer Message:</div>
                <div class="message-text">${data.message.replace(/\n/g, '<br>')}</div>
              </div>

              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 6px; padding: 12px 16px; margin-top: 20px;">
                <p style="margin: 0; font-weight: 600; color: #065f46; font-size: 14px;">💡 Suggested Action:</p>
                <p style="margin: 8px 0 0 0; color: #065f46; font-size: 13px;">Respond to this inquiry within 1 business day to maintain excellent customer service standards.</p>
              </div>

              <p class="timestamp">📅 Received: ${new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>

            <div class="footer">
              <p style="margin: 0; font-weight: 600;">VCSolar Contact Management</p>
              <p style="margin: 4px 0 0 0;">Automated notification from vcsolar.shop</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      throw error;
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error sending contact notification:', error);
    return { success: false, error };
  }
}

export async function sendContactConfirmation(data: ContactEmailData) {
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy_key_for_build') {
    console.warn('Resend API key not configured. Skipping confirmation email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'VCSolar <noreply@vcsolar.shop>',
      to: [data.email],
      subject: 'VCSolar: We Have Received Your Message',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 28px 24px; text-align: center; }
            .logo { font-size: 28px; font-weight: 700; margin: 0 0 6px 0; }
            .tagline { margin: 0; opacity: 0.95; font-size: 14px; }
            .content { padding: 32px 24px; }
            .greeting { font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 16px 0; }
            .confirmation-box { background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border-left: 4px solid #6366f1; border-radius: 6px; padding: 18px; margin: 24px 0; }
            .confirmation-box h3 { margin: 0 0 10px 0; color: #3730a3; font-size: 17px; }
            .message-display { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin: 20px 0; }
            .message-display h4 { margin: 0 0 12px 0; color: #4b5563; font-size: 14px; font-weight: 600; }
            .message-content { color: #1f2937; line-height: 1.7; white-space: pre-wrap; font-size: 15px; padding: 12px; background-color: #ffffff; border-radius: 4px; border-left: 3px solid #6366f1; }
            .next-steps { background-color: #ecfdf5; border-left: 4px solid #10b981; border-radius: 6px; padding: 18px; margin: 24px 0; }
            .next-steps h3 { margin: 0 0 12px 0; color: #065f46; font-size: 17px; }
            .next-steps ul { margin: 8px 0 0 0; padding-left: 24px; color: #065f46; }
            .next-steps li { margin-bottom: 8px; line-height: 1.5; }
            .contact-info { background-color: #fef3c7; border-radius: 6px; padding: 16px; margin: 24px 0; text-align: center; }
            .contact-info p { margin: 6px 0; color: #92400e; font-size: 14px; }
            .contact-info a { color: #6366f1; text-decoration: none; font-weight: 600; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #e5e7eb; }
            .footer p { margin: 6px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <p class="logo">⚡ VCSolar</p>
              <p class="tagline">Clean Energy Solutions for Your Future</p>
            </div>

            <div class="content">
              <p class="greeting">Hello ${data.name.split(' ')[0]},</p>

              <p>Thank you for reaching out to VCSolar! We appreciate your interest in our solar energy solutions.</p>

              <div class="confirmation-box">
                <h3>✅ Message Received Successfully</h3>
                <p style="margin: 0; color: #3730a3;">Your inquiry has been forwarded to the appropriate department and is now in our system.</p>
              </div>

              <div class="message-display">
                <h4>📝 Your Message to Us:</h4>
                <div class="message-content">${data.message.replace(/\n/g, '<br>')}</div>
              </div>

              <div class="next-steps">
                <h3>🔔 What Happens Next?</h3>
                <ul style="margin: 8px 0 0 0; padding-left: 24px;">
                  <li><strong>Review Process:</strong> Your message has been forwarded to the appropriate department for review.</li>
                  <li><strong>Response Timeline:</strong> We aim to respond to all general inquiries within <strong>1 business day</strong>.</li>
                  <li><strong>Direct Contact:</strong> A member of our team will reach out to you via email${data.phone ? ' or phone' : ''} to address your inquiry.</li>
                </ul>
              </div>

              <p style="margin-top: 24px; color: #4b5563;">If you have an urgent matter or additional questions in the meantime, please feel free to contact us directly using the information below.</p>

              <div class="contact-info">
                <p><strong>📧 Email:</strong> <a href="mailto:sales@vcsolar.shop">sales@vcsolar.shop</a></p>
                ${data.phone ? `<p><strong>📞 Phone:</strong> We'll call you at ${data.phone}</p>` : ''}
                <p><strong>🌐 Website:</strong> <a href="https://vcsolar.shop">vcsolar.shop</a></p>
              </div>

              <p style="margin-top: 28px; color: #6b7280; font-size: 14px;">We're committed to providing you with exceptional service and helping you make the switch to clean, renewable solar energy.</p>

              <p style="margin-top: 20px; font-weight: 600; color: #1f2937;">Best regards,<br><span style="color: #6366f1;">The VCSolar Team</span></p>
            </div>

            <div class="footer">
              <p><strong>VCSolar</strong> | Solar Energy Solutions</p>
              <p>Email: <a href="mailto:sales@vcsolar.shop" style="color: #6366f1; text-decoration: none;">sales@vcsolar.shop</a> | Website: <a href="https://vcsolar.shop" style="color: #6366f1; text-decoration: none;">vcsolar.shop</a></p>
              <p style="margin-top: 12px; font-size: 11px; color: #9ca3af;">
                This is an automated confirmation sent to ${data.email}<br>
                © ${new Date().getFullYear()} VCSolar. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      throw error;
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error sending contact confirmation:', error);
    return { success: false, error };
  }
}

// Quote Request Email Templates

export async function sendQuoteRequestNotification(data: QuoteRequestData) {
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy_key_for_build') {
    console.warn('Resend API key not configured. Skipping quote notification.');
    return { success: false, error: 'Email service not configured' };
  }

  const projectTypeLabels = {
    residential: 'Residential',
    commercial: 'Commercial',
    'off-grid': 'Off-Grid'
  };

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'VCSolar Quote System <noreply@vcsolar.shop>',
      to: ['sales@vcsolar.shop'],
      subject: `NEW HIGH-PRIORITY QUOTE REQUEST | ${projectTypeLabels[data.projectType]} | ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
            .alert { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px; }
            .alert-title { font-size: 18px; font-weight: 700; color: #92400e; margin: 0 0 8px 0; }
            .content { padding: 24px; }
            .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .info-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            .info-table td:first-child { font-weight: 600; color: #6b7280; width: 40%; }
            .info-table td:last-child { color: #1f2937; }
            .priority-badge { display: inline-block; background-color: #dc2626; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
            .timestamp { color: #9ca3af; font-size: 14px; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚡ VCSolar Quote System</h1>
            </div>

            <div class="alert">
              <p class="alert-title">⚠️ New Quote Request - Action Required ⚠️</p>
              <p style="margin: 0;">A high-priority quote request has been submitted and requires immediate attention.</p>
            </div>

            <div class="content">
              <p><span class="priority-badge">High Priority</span></p>

              <h2 style="color: #f97316; margin-top: 24px;">Customer Information</h2>
              <table class="info-table">
                <tr>
                  <td>Full Name</td>
                  <td><strong>${data.name}</strong></td>
                </tr>
                <tr>
                  <td>Email Address</td>
                  <td><a href="mailto:${data.email}" style="color: #f97316; text-decoration: none;">${data.email}</a></td>
                </tr>
                <tr>
                  <td>Phone Number</td>
                  <td><a href="tel:${data.phone}" style="color: #f97316; text-decoration: none;">${data.phone}</a></td>
                </tr>
              </table>

              <h2 style="color: #f97316; margin-top: 24px;">Project Details</h2>
              <table class="info-table">
                <tr>
                  <td>Project Type</td>
                  <td><strong style="color: #f97316;">${projectTypeLabels[data.projectType]}</strong></td>
                </tr>
                <tr>
                  <td>Installation Address</td>
                  <td>${data.address}</td>
                </tr>
                <tr>
                  <td>Installation Timeframe</td>
                  <td>${data.timeframe}</td>
                </tr>
                ${data.notes ? `
                <tr>
                  <td>Additional Notes</td>
                  <td style="white-space: pre-wrap;">${data.notes}</td>
                </tr>
                ` : ''}
              </table>

              <div style="background-color: #fef3c7; border-radius: 6px; padding: 16px; margin-top: 24px;">
                <p style="margin: 0; font-weight: 600; color: #92400e;">📋 Next Steps:</p>
                <ol style="margin: 8px 0 0 0; padding-left: 20px; color: #92400e;">
                  <li>Review project details and feasibility</li>
                  <li>Prepare preliminary quote within 24-48 hours</li>
                  <li>Contact customer via email or phone</li>
                  <li>Schedule site assessment if needed</li>
                </ol>
              </div>

              <p class="timestamp">📅 Submitted: ${new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>

            <div class="footer">
              <p style="margin: 0;">VCSolar Quote Management System</p>
              <p style="margin: 8px 0 0 0;">Powered by VCSolar.shop</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      throw error;
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error sending quote notification:', error);
    return { success: false, error };
  }
}

export async function sendQuoteRequestConfirmation(data: QuoteRequestData) {
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy_key_for_build') {
    console.warn('Resend API key not configured. Skipping quote confirmation.');
    return { success: false, error: 'Email service not configured' };
  }

  const projectTypeLabels = {
    residential: 'Residential Solar Installation',
    commercial: 'Commercial Solar Installation',
    'off-grid': 'Off-Grid Solar System'
  };

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'VCSolar <noreply@vcsolar.shop>',
      to: [data.email],
      subject: 'VCSolar: Your Custom Quote Request Has Been Received',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 32px 24px; text-align: center; }
            .logo { font-size: 32px; font-weight: 800; margin: 0 0 8px 0; }
            .tagline { margin: 0; opacity: 0.9; font-size: 14px; }
            .content { padding: 32px 24px; }
            .greeting { font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 16px 0; }
            .confirmation-box { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; border-radius: 6px; padding: 20px; margin: 24px 0; }
            .confirmation-box h3 { margin: 0 0 12px 0; color: #92400e; font-size: 18px; }
            .info-table { width: 100%; border-collapse: collapse; margin: 16px 0; background-color: #f9fafb; border-radius: 6px; overflow: hidden; }
            .info-table td { padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
            .info-table tr:last-child td { border-bottom: none; }
            .info-table td:first-child { font-weight: 600; color: #6b7280; width: 45%; }
            .info-table td:last-child { color: #1f2937; }
            .next-steps { background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 6px; padding: 20px; margin: 24px 0; }
            .next-steps h3 { margin: 0 0 12px 0; color: #065f46; font-size: 18px; }
            .next-steps ol { margin: 8px 0 0 0; padding-left: 20px; color: #065f46; }
            .next-steps li { margin-bottom: 8px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .footer { background-color: #f9fafb; padding: 24px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
            .footer p { margin: 8px 0; }
            .social-links { margin-top: 16px; }
            .social-links a { color: #f97316; text-decoration: none; margin: 0 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <p class="logo">⚡ VCSolar</p>
              <p class="tagline">Powering Your Future with Solar Energy</p>
            </div>

            <div class="content">
              <p class="greeting">Hello ${data.name.split(' ')[0]},</p>

              <p>Thank you for choosing VCSolar for your solar energy needs! We're excited to help you transition to clean, renewable energy.</p>

              <div class="confirmation-box">
                <h3>✅ Quote Request Confirmed</h3>
                <p style="margin: 0;">Your custom quote request has been successfully received and is being reviewed by our solar specialists.</p>
              </div>

              <h3 style="color: #f97316; margin: 24px 0 12px 0;">Your Submitted Information</h3>
              <table class="info-table">
                <tr>
                  <td>Project Type</td>
                  <td><strong>${projectTypeLabels[data.projectType]}</strong></td>
                </tr>
                <tr>
                  <td>Installation Address</td>
                  <td>${data.address}</td>
                </tr>
                <tr>
                  <td>Preferred Timeframe</td>
                  <td>${data.timeframe}</td>
                </tr>
                <tr>
                  <td>Contact Email</td>
                  <td>${data.email}</td>
                </tr>
                <tr>
                  <td>Contact Phone</td>
                  <td>${data.phone}</td>
                </tr>
                ${data.notes ? `
                <tr>
                  <td>Your Notes</td>
                  <td style="white-space: pre-wrap;">${data.notes}</td>
                </tr>
                ` : ''}
              </table>

              <div class="next-steps">
                <h3>🔆 What Happens Next?</h3>
                <ol style="margin: 8px 0 0 0; padding-left: 20px;">
                  <li><strong>Quote Preparation:</strong> Our team will review your request and prepare a customized solar quote tailored to your specific needs and location.</li>
                  <li><strong>Preliminary Quote:</strong> You'll receive a preliminary quote within <strong>24-48 hours</strong> via email.</li>
                  <li><strong>Personal Consultation:</strong> One of our solar specialists will contact you to discuss the quote details and answer any questions.</li>
                  <li><strong>Site Assessment:</strong> If you decide to proceed, we'll schedule a professional site assessment to finalize your installation plan.</li>
                </ol>
              </div>

              <p style="margin-top: 24px;">If you have any immediate questions or need to update your information, please don't hesitate to reach out to us.</p>

              <center>
                <a href="mailto:sales@vcsolar.shop" class="cta-button">Contact Our Team</a>
              </center>

              <p style="margin-top: 32px; color: #6b7280; font-size: 14px;">We appreciate your interest in solar energy and look forward to helping you save money while protecting the environment.</p>

              <p style="margin-top: 24px; font-weight: 600;">Warm regards,<br>The VCSolar Team</p>
            </div>

            <div class="footer">
              <p><strong>VCSolar</strong></p>
              <p>Email: <a href="mailto:sales@vcsolar.shop" style="color: #f97316; text-decoration: none;">sales@vcsolar.shop</a></p>
              <p>Website: <a href="https://vcsolar.shop" style="color: #f97316; text-decoration: none;">vcsolar.shop</a></p>

              <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
                This email was sent to ${data.email} in response to your quote request.<br>
                © ${new Date().getFullYear()} VCSolar. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      throw error;
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error sending quote confirmation:', error);
    return { success: false, error };
  }
}
