import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function sendContactNotification(data: ContactEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'TRXSolar <noreply@yourdomain.com>', // Update with your verified domain
      to: ['admin@yourdomain.com'], // Update with your admin email
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
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'TRXSolar <noreply@yourdomain.com>', // Update with your verified domain
      to: [data.email],
      subject: 'Thank you for contacting TRXSolar',
      html: `
        <h2>Thank you for contacting TRXSolar</h2>
        <p>Dear ${data.name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Best regards,<br>TRXSolar Team</p>
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
