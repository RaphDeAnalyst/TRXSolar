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
  conditionalFields?: {
    residential?: {
      roomCount: string;
      essentials: string[];
    };
    commercial?: {
      establishmentSize: string;
      primaryGoal: string;
    };
    offGrid?: {
      locationDescription: string;
    };
  };
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
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 3px 10px rgba(0,0,0,0.12); }
            .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 22px; font-weight: 600; letter-spacing: -0.3px; }
            .content { padding: 28px 24px; }
            .section { margin: 24px 0; }
            .section-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; padding-bottom: 6px; border-bottom: 2px solid #6366f1; display: flex; align-items: center; gap: 6px; }
            .data-grid { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; }
            .data-row { display: grid; grid-template-columns: 35% 65%; border-bottom: 1px solid #e2e8f0; }
            .data-row:last-child { border-bottom: none; }
            .data-label { padding: 12px 14px; background-color: #f1f5f9; font-weight: 600; color: #475569; font-size: 13px; }
            .data-value { padding: 12px 14px; color: #1e293b; font-size: 13px; }
            .data-value a { color: #6366f1; text-decoration: none; font-weight: 500; }
            .data-value a:hover { text-decoration: underline; }
            .message-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 12px 0; }
            .message-text { color: #1e293b; white-space: pre-wrap; line-height: 1.7; font-size: 14px; }
            .action-note { background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 6px; padding: 14px 16px; margin: 24px 0; }
            .action-note p { margin: 0; color: #065f46; font-size: 13px; line-height: 1.6; }
            .action-note strong { font-weight: 600; }
            .timestamp { text-align: center; padding: 12px; background-color: #f8fafc; border-radius: 6px; margin-top: 20px; color: #64748b; font-size: 12px; border: 1px solid #e2e8f0; }
            .footer { background-color: #0f172a; padding: 16px; text-align: center; color: #94a3b8; font-size: 11px; }
            .footer p { margin: 4px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline; vertical-align: middle; margin-right: 8px;">
                  <path d="M3 8L12 13L21 8M3 8L12 3L21 8M3 8V16L12 21M21 8V16L12 21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                General Website Inquiry
              </h1>
            </div>

            <div class="content">
              <div class="section">
                <h3 class="section-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#6366f1" stroke-width="2"/>
                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Contact Information
                </h3>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="data-label">Name</div>
                    <div class="data-value"><strong>${data.name}</strong></div>
                  </div>
                  <div class="data-row">
                    <div class="data-label">Email</div>
                    <div class="data-value"><a href="mailto:${data.email}">${data.email}</a></div>
                  </div>
                  ${data.phone ? `
                  <div class="data-row">
                    <div class="data-label">Phone</div>
                    <div class="data-value"><a href="tel:${data.phone}">${data.phone}</a></div>
                  </div>
                  ` : ''}
                </div>
              </div>

              <div class="section">
                <h3 class="section-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 8H17M7 12H17M7 16H13" stroke="#6366f1" stroke-width="2" stroke-linecap="round"/>
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#6366f1" stroke-width="2"/>
                  </svg>
                  Message
                </h3>
                <div class="message-box">
                  <div class="message-text">${data.message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>

              <div class="action-note">
                <p><strong>Action Required:</strong> Respond to this inquiry within 1 business day to maintain excellent customer service standards.</p>
              </div>

              <div class="timestamp">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline; vertical-align: middle; margin-right: 5px;">
                  <circle cx="12" cy="12" r="10" stroke="#64748b" stroke-width="2"/>
                  <path d="M12 6V12L16 14" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <strong>Received:</strong> ${new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              </div>
            </div>

            <div class="footer">
              <p>VCSolar Contact Management • vcsolar.shop</p>
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
      subject: 'We Have Received Your Message - VCSolar',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 3px 10px rgba(0,0,0,0.12); }
            .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 32px 24px; text-align: center; }
            .logo { font-size: 32px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -1px; }
            .tagline { margin: 0; opacity: 0.95; font-size: 14px; font-weight: 500; }
            .content { padding: 32px 28px; }
            .greeting { font-size: 20px; font-weight: 600; color: #0f172a; margin: 0 0 18px 0; }
            .intro-text { font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 26px; }
            .confirmation-banner { background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border-left: 5px solid #6366f1; border-radius: 8px; padding: 20px 22px; margin: 26px 0; }
            .confirmation-banner h3 { margin: 0 0 10px 0; color: #3730a3; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
            .confirmation-banner p { margin: 0; color: #4338ca; font-size: 14px; line-height: 1.6; }
            .message-section { margin: 28px 0; }
            .message-section h4 { margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 6px; }
            .message-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; }
            .message-text { color: #1e293b; white-space: pre-wrap; line-height: 1.7; font-size: 14px; }
            .timeline-section { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 5px solid #10b981; border-radius: 8px; padding: 20px 22px; margin: 28px 0; }
            .timeline-section h3 { margin: 0 0 14px 0; color: #065f46; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
            .timeline-section ul { margin: 0; padding-left: 22px; color: #047857; }
            .timeline-section li { margin-bottom: 10px; line-height: 1.6; font-size: 14px; }
            .timeline-section li:last-child { margin-bottom: 0; }
            .timeline-section strong { color: #065f46; font-weight: 600; }
            .contact-card { background-color: #fffbeb; border-radius: 8px; padding: 18px; margin: 28px 0; }
            .contact-card h4 { margin: 0 0 12px 0; color: #92400e; font-size: 15px; font-weight: 700; text-align: center; }
            .contact-card p { margin: 8px 0; color: #78350f; font-size: 14px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px; }
            .contact-card a { color: #6366f1; text-decoration: none; font-weight: 600; }
            .contact-card a:hover { text-decoration: underline; }
            .footer { background-color: #0f172a; padding: 24px; text-align: center; color: #94a3b8; font-size: 13px; }
            .footer p { margin: 6px 0; }
            .footer strong { color: #f1f5f9; }
            .footer a { color: #6366f1; text-decoration: none; font-weight: 500; }
            .footer a:hover { text-decoration: underline; }
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

              <p class="intro-text">Thank you for reaching out to VCSolar! We appreciate your interest in our solar energy solutions and look forward to assisting you.</p>

              <div class="confirmation-banner">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#10b981"/>
                    <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Message Received Successfully
                </h3>
                <p>Your inquiry has been forwarded to our team and is now in our system for review.</p>
              </div>

              <div class="message-section">
                <h4>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 8H17M7 12H17M7 16H13" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#0f172a" stroke-width="2"/>
                  </svg>
                  Your Message
                </h4>
                <div class="message-box">
                  <div class="message-text">${data.message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>

              <div class="timeline-section">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#065f46" stroke-width="2"/>
                    <path d="M12 6V12L16 14" stroke="#065f46" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  What Happens Next?
                </h3>
                <ul>
                  <li><strong>Response Timeline:</strong> We aim to respond to all general inquiries within <strong>1 business day</strong>.</li>
                  <li><strong>Team Review:</strong> Your message has been forwarded to the appropriate department for review and will be assigned to a specialist.</li>
                  <li><strong>Direct Contact:</strong> A member of our team will reach out to you via email${data.phone ? ' or phone' : ''} to address your inquiry and answer any questions.</li>
                </ul>
              </div>

              <p style="margin-top: 26px; color: #64748b; font-size: 14px; line-height: 1.7;">If you have an urgent matter or need immediate assistance, please feel free to contact us directly using the information below.</p>

              <div class="contact-card">
                <h4>Get in Touch</h4>
                <p>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#78350f" stroke-width="2"/>
                    <path d="M3 7L12 13L21 7" stroke="#78350f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <a href="mailto:sales@vcsolar.shop">sales@vcsolar.shop</a>
                </p>
                ${data.phone ? `<p>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="#78350f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <a href="tel:${data.phone}">${data.phone}</a>
                </p>` : ''}
                <p>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#78350f" stroke-width="2"/>
                    <path d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="#78350f" stroke-width="2"/>
                  </svg>
                  <a href="https://vcsolar.shop">vcsolar.shop</a>
                </p>
              </div>

              <p style="margin-top: 28px; color: #64748b; font-size: 14px; line-height: 1.7;">We're committed to providing you with exceptional service and helping you make the switch to clean, renewable solar energy.</p>

              <p style="margin-top: 24px; font-weight: 600; color: #0f172a; font-size: 15px;">Best regards,<br><span style="color: #6366f1;">The VCSolar Team</span></p>
            </div>

            <div class="footer">
              <p><strong>VCSolar</strong> | Solar Energy Solutions</p>
              <p>Email: <a href="mailto:sales@vcsolar.shop">sales@vcsolar.shop</a> • Website: <a href="https://vcsolar.shop">vcsolar.shop</a></p>
              <p style="margin-top: 14px; font-size: 11px; color: #64748b;">
                This confirmation was sent to ${data.email}<br>
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
      subject: `🔥 NEW HIGH-PRIORITY QUOTE REQUEST | ${projectTypeLabels[data.projectType]} | ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
            .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 28px 24px; text-align: center; border-bottom: 4px solid #7f1d1d; }
            .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { margin: 8px 0 0 0; font-size: 13px; opacity: 0.95; }
            .priority-alert { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 6px solid #f59e0b; padding: 20px 24px; margin: 0; }
            .priority-alert h2 { font-size: 19px; font-weight: 700; color: #92400e; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px; }
            .priority-alert p { margin: 0; color: #78350f; font-size: 15px; line-height: 1.5; }
            .content { padding: 28px 24px; }
            .priority-badge { display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 6px 16px; border-radius: 16px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3); }
            .section { margin: 28px 0; }
            .section-title { font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 3px solid #dc2626; display: flex; align-items: center; gap: 8px; }
            .data-grid { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
            .data-row { display: grid; grid-template-columns: 40% 60%; border-bottom: 1px solid #e2e8f0; }
            .data-row:last-child { border-bottom: none; }
            .data-label { padding: 14px 16px; background-color: #f1f5f9; font-weight: 600; color: #475569; font-size: 14px; }
            .data-value { padding: 14px 16px; color: #1e293b; font-size: 14px; }
            .data-value strong { color: #dc2626; font-weight: 700; }
            .data-value a { color: #dc2626; text-decoration: none; font-weight: 500; }
            .data-value a:hover { text-decoration: underline; }
            .action-box { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 6px solid #10b981; border-radius: 8px; padding: 20px 24px; margin: 28px 0; }
            .action-box h3 { margin: 0 0 12px 0; color: #065f46; font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
            .action-box p { margin: 0; color: #047857; font-size: 15px; line-height: 1.6; font-weight: 500; }
            .timestamp { background-color: #f8fafc; border-radius: 6px; padding: 12px 16px; margin-top: 24px; color: #64748b; font-size: 13px; text-align: center; border: 1px solid #e2e8f0; }
            .footer { background-color: #0f172a; padding: 24px; text-align: center; color: #94a3b8; font-size: 13px; }
            .footer p { margin: 6px 0; }
            .footer strong { color: #f1f5f9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚡ VCSolar Quote System</h1>
              <p>High-Priority Lead Management</p>
            </div>

            <div class="priority-alert">
              <h2>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#F59E0B"/>
                  <path d="M10 6V11M10 14H10.01" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
                HIGH-PRIORITY QUOTE REQUEST
              </h2>
              <p>A qualified solar lead has submitted a detailed quote request. <strong>Immediate action required within 24 hours.</strong></p>
            </div>

            <div class="content">
              <p style="margin-bottom: 20px;"><span class="priority-badge">🔥 High Priority</span></p>

              <div class="section">
                <h3 class="section-title">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 9C11.6569 9 13 7.65685 13 6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6C7 7.65685 8.34315 9 10 9Z" fill="#dc2626"/>
                    <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Client Contact
                </h3>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="data-label">Full Name</div>
                    <div class="data-value"><strong>${data.name}</strong></div>
                  </div>
                  <div class="data-row">
                    <div class="data-label">Email Address</div>
                    <div class="data-value"><a href="mailto:${data.email}">${data.email}</a></div>
                  </div>
                  <div class="data-row">
                    <div class="data-label">Phone Number</div>
                    <div class="data-value"><a href="tel:${data.phone}">${data.phone}</a></div>
                  </div>
                </div>
              </div>

              <div class="section">
                <h3 class="section-title">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 2C8.44772 2 8 2.44772 8 3C8 3.55228 8.44772 4 9 4H11C11.5523 4 12 3.55228 12 3C12 2.44772 11.5523 2 11 2H9Z" fill="#dc2626"/>
                    <path d="M4 5C4 3.89543 4.89543 3 6 3C6 4.65685 7.34315 6 9 6H11C12.6569 6 14 4.65685 14 3C15.1046 3 16 3.89543 16 5V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V5Z" fill="#dc2626" opacity="0.3"/>
                  </svg>
                  Project Details
                </h3>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="data-label">Project Type</div>
                    <div class="data-value"><strong>${projectTypeLabels[data.projectType]}</strong></div>
                  </div>
                  <div class="data-row">
                    <div class="data-label">Installation Address</div>
                    <div class="data-value">${data.address}</div>
                  </div>
                  <div class="data-row">
                    <div class="data-label">Timeframe</div>
                    <div class="data-value">${data.timeframe}</div>
                  </div>
                  ${data.conditionalFields?.residential ? `
                  <div class="data-row">
                    <div class="data-label">Room Count</div>
                    <div class="data-value"><strong>${data.conditionalFields.residential.roomCount}</strong></div>
                  </div>
                  <div class="data-row">
                    <div class="data-label">Essential Items (24/7)</div>
                    <div class="data-value">${data.conditionalFields.residential.essentials?.join(', ')}</div>
                  </div>
                  ` : ''}
                  ${data.conditionalFields?.commercial ? `
                  <div class="data-row">
                    <div class="data-label">Establishment Size</div>
                    <div class="data-value"><strong>${data.conditionalFields.commercial.establishmentSize}</strong></div>
                  </div>
                  <div class="data-row">
                    <div class="data-label">Primary Goal</div>
                    <div class="data-value">${data.conditionalFields.commercial.primaryGoal}</div>
                  </div>
                  ` : ''}
                  ${data.conditionalFields?.offGrid?.locationDescription ? `
                  <div class="data-row">
                    <div class="data-label">Location Description</div>
                    <div class="data-value" style="white-space: pre-wrap; line-height: 1.6;">${data.conditionalFields.offGrid.locationDescription}</div>
                  </div>
                  ` : ''}
                  ${data.notes ? `
                  <div class="data-row">
                    <div class="data-label">Project Notes</div>
                    <div class="data-value" style="white-space: pre-wrap; line-height: 1.6;">${data.notes}</div>
                  </div>
                  ` : ''}
                </div>
              </div>

              <div class="action-box">
                <h3>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 2C8.44772 2 8 2.44772 8 3C8 3.55228 8.44772 4 9 4H11C11.5523 4 12 3.55228 12 3C12 2.44772 11.5523 2 11 2H9Z" fill="#065f46"/>
                    <path d="M4 5C4 3.89543 4.89543 3 6 3C6 4.65685 7.34315 6 9 6H11C12.6569 6 14 4.65685 14 3C15.1046 3 16 3.89543 16 5V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V5Z" fill="#10b981" opacity="0.3"/>
                    <path d="M7 10L9 12L13 8" stroke="#065f46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Required Action
                </h3>
                <p><strong>Contact the client immediately</strong> to confirm project details and prepare the preliminary quote. Target response time: <strong>24 hours maximum</strong>.</p>
              </div>

              <div class="timestamp">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline; vertical-align: middle; margin-right: 6px;">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#64748b" stroke-width="1.5"/>
                  <path d="M10 6V10L13 13" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <strong>Submitted:</strong> ${new Date().toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </div>
            </div>

            <div class="footer">
              <p><strong>VCSolar Quote Management System</strong></p>
              <p>Automated notification • vcsolar.shop</p>
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
      subject: 'Your Custom Quote Request Has Been Received - VCSolar',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
            .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 36px 24px; text-align: center; }
            .logo { font-size: 36px; font-weight: 800; margin: 0 0 10px 0; letter-spacing: -1px; }
            .tagline { margin: 0; opacity: 0.95; font-size: 15px; font-weight: 500; }
            .content { padding: 36px 28px; }
            .greeting { font-size: 22px; font-weight: 600; color: #0f172a; margin: 0 0 20px 0; }
            .intro-text { font-size: 16px; color: #475569; line-height: 1.7; margin-bottom: 28px; }
            .confirmation-banner { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 6px solid #10b981; border-radius: 8px; padding: 24px; margin: 28px 0; }
            .confirmation-banner h2 { margin: 0 0 12px 0; color: #065f46; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
            .confirmation-banner p { margin: 0; color: #047857; font-size: 15px; line-height: 1.6; }
            .section { margin: 32px 0; }
            .section-header { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; padding-bottom: 10px; border-bottom: 3px solid #f97316; display: flex; align-items: center; gap: 8px; }
            .project-summary { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
            .summary-row { display: grid; grid-template-columns: 45% 55%; border-bottom: 1px solid #e2e8f0; }
            .summary-row:last-child { border-bottom: none; }
            .summary-label { padding: 14px 18px; background-color: #f1f5f9; font-weight: 600; color: #475569; font-size: 14px; }
            .summary-value { padding: 14px 18px; color: #1e293b; font-size: 14px; }
            .summary-value strong { color: #f97316; font-weight: 700; }
            .timeline-box { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-left: 6px solid #f59e0b; border-radius: 8px; padding: 24px; margin: 28px 0; }
            .timeline-box h3 { margin: 0 0 16px 0; color: #92400e; font-size: 19px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
            .timeline-box p { margin: 0 0 12px 0; color: #78350f; font-size: 15px; line-height: 1.7; }
            .timeline-box p:last-child { margin-bottom: 0; }
            .timeline-box strong { color: #92400e; font-weight: 700; }
            .cta-section { text-align: center; margin: 32px 0; padding: 24px; background-color: #fafafa; border-radius: 8px; }
            .cta-section p { margin: 0 0 16px 0; color: #475569; font-size: 15px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3); transition: transform 0.2s; }
            .footer { background-color: #0f172a; padding: 28px 24px; text-align: center; color: #94a3b8; font-size: 14px; }
            .footer p { margin: 8px 0; }
            .footer strong { color: #f1f5f9; }
            .footer a { color: #f97316; text-decoration: none; font-weight: 500; }
            .footer a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <p class="logo">⚡ VCSolar</p>
              <p class="tagline">Powering Your Future with Clean Solar Energy</p>
            </div>

            <div class="content">
              <p class="greeting">Hello ${data.name.split(' ')[0]},</p>

              <p class="intro-text">Thank you for choosing VCSolar! We're thrilled to help you transition to clean, renewable solar energy and look forward to designing the perfect solar solution for your needs.</p>

              <div class="confirmation-banner">
                <h2>
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#10b981"/>
                    <path d="M7 10L9 12L13 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Your Custom Quote Request Has Been Received
                </h2>
                <p>Our engineering team has received your detailed project request and is already beginning the review process to prepare your customized solar quote.</p>
              </div>

              <div class="section">
                <h3 class="section-header">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 2C8.44772 2 8 2.44772 8 3C8 3.55228 8.44772 4 9 4H11C11.5523 4 12 3.55228 12 3C12 2.44772 11.5523 2 11 2H9Z" fill="#f97316"/>
                    <path d="M4 5C4 3.89543 4.89543 3 6 3C6 4.65685 7.34315 6 9 6H11C12.6569 6 14 4.65685 14 3C15.1046 3 16 3.89543 16 5V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V5Z" fill="#f97316" opacity="0.3"/>
                  </svg>
                  Summary of Your Project Request
                </h3>
                <div class="project-summary">
                  <div class="summary-row">
                    <div class="summary-label">Project Type</div>
                    <div class="summary-value"><strong>${projectTypeLabels[data.projectType]}</strong></div>
                  </div>
                  <div class="summary-row">
                    <div class="summary-label">Installation Location</div>
                    <div class="summary-value">${data.address}</div>
                  </div>
                  <div class="summary-row">
                    <div class="summary-label">Preferred Timeframe</div>
                    <div class="summary-value">${data.timeframe}</div>
                  </div>
                  <div class="summary-row">
                    <div class="summary-label">Contact Email</div>
                    <div class="summary-value">${data.email}</div>
                  </div>
                  <div class="summary-row">
                    <div class="summary-label">Contact Phone</div>
                    <div class="summary-value">${data.phone}</div>
                  </div>
                  ${data.conditionalFields?.residential ? `
                  <div class="summary-row">
                    <div class="summary-label">Room Count</div>
                    <div class="summary-value"><strong>${data.conditionalFields.residential.roomCount}</strong></div>
                  </div>
                  <div class="summary-row">
                    <div class="summary-label">Essential Items (24/7)</div>
                    <div class="summary-value">${data.conditionalFields.residential.essentials?.join(', ')}</div>
                  </div>
                  ` : ''}
                  ${data.conditionalFields?.commercial ? `
                  <div class="summary-row">
                    <div class="summary-label">Establishment Size</div>
                    <div class="summary-value"><strong>${data.conditionalFields.commercial.establishmentSize}</strong></div>
                  </div>
                  <div class="summary-row">
                    <div class="summary-label">Primary Goal</div>
                    <div class="summary-value">${data.conditionalFields.commercial.primaryGoal}</div>
                  </div>
                  ` : ''}
                  ${data.conditionalFields?.offGrid?.locationDescription ? `
                  <div class="summary-row">
                    <div class="summary-label">Location Description</div>
                    <div class="summary-value" style="white-space: pre-wrap; line-height: 1.6;">${data.conditionalFields.offGrid.locationDescription}</div>
                  </div>
                  ` : ''}
                  ${data.notes ? `
                  <div class="summary-row">
                    <div class="summary-label">Project Notes</div>
                    <div class="summary-value" style="white-space: pre-wrap; line-height: 1.6;">${data.notes}</div>
                  </div>
                  ` : ''}
                </div>
              </div>

              <div class="timeline-box">
                <h3>
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#92400e" stroke-width="1.5"/>
                    <path d="M10 6V10L13 13" stroke="#92400e" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  What Happens Next?
                </h3>
                <p><strong>Response Timeline:</strong> Our engineering team will review your specifications and prepare your preliminary quote package. <strong>Expect your customized quote within 24-48 hours</strong> via email.</p>
                <p><strong>Personal Consultation:</strong> A solar specialist from our team will reach out to discuss your quote, answer questions, and help you understand your solar savings potential.</p>
                <p><strong>Site Assessment:</strong> If you choose to proceed, we'll schedule a professional on-site evaluation to finalize your installation plan and ensure optimal system performance.</p>
              </div>

              <div class="cta-section">
                <p>Have an urgent question or need to update your project details?</p>
                <a href="mailto:sales@vcsolar.shop" class="cta-button">Contact Our Team</a>
              </div>

              <p style="margin-top: 32px; color: #64748b; font-size: 14px; line-height: 1.7;">We're committed to providing you with exceptional service and helping you make an informed decision about your solar investment. Our team is excited to work with you on this journey toward clean, sustainable energy.</p>

              <p style="margin-top: 28px; font-weight: 600; color: #0f172a; font-size: 15px;">Best regards,<br><span style="color: #f97316;">The VCSolar Team</span></p>
            </div>

            <div class="footer">
              <p><strong>VCSolar</strong> | Solar Energy Solutions</p>
              <p>Email: <a href="mailto:sales@vcsolar.shop">sales@vcsolar.shop</a> • Website: <a href="https://vcsolar.shop">vcsolar.shop</a></p>
              <p style="margin-top: 16px; font-size: 12px; color: #64748b;">
                This confirmation was sent to ${data.email}<br>
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
