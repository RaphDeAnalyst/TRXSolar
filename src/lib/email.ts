import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build');

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function sendContactNotification(data: ContactEmailData) {
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy_key_for_build') {
    console.warn('Resend API key not configured. Skipping email notification.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'VCSolar <noreply@vcsolar.shop>',
      to: ['sales@vcsolar.shop'],
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
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
      subject: 'Thank you for contacting VCSolar',
      html: `
        <h2>Thank you for contacting VCSolar</h2>
        <p>Dear ${data.name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Best regards,<br>VCSolar Team</p>
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
