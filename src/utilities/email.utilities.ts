import { sendEmail } from '../configs/nodemailer.config';
import { isDevelopment } from './app.utilities';

export const sampleEmailTemplate = async (to: string, name: string) => {
  const subject = `Welcome to Your App, ${name}!`;
  const html = `
    <h1>Hello ${name},</h1>
    <p>Welcome to <strong>Your App</strong>. We're glad to have you!</p>
    <p>Get started by visiting your dashboard.</p>
  `;
  try {
    await sendEmail({ to, subject, html });
    isDevelopment && console.log('Welcome email sent');
  } catch (err) {
    isDevelopment && console.log('Failed to send welcome email:', err);
  }
};
