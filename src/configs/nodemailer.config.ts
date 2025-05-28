import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { isDevelopment, isProduction } from '../utilities/app.utilities';

// Create transporter
export const transporter = nodemailer.createTransport({
  host: process.env.APP_SMTP_HOST, // e.g., smtp.gmail.com
  port: Number(process.env.APP_SMTP_PORT) || 587,
  secure: Number(process.env.APP_SMTP_PORT) === 465, // true for port 465, false otherwise
  auth: {
    user: process.env.APP_SMTP_USER,
    pass: process.env.APP_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: isProduction, // Use true in production if you have valid certs
  },
  pool: true,
  rateLimit: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  logger: isDevelopment, // Log in development mode
  debug: isDevelopment, // Enable debug output in development mode
  dkim:
    isProduction && process.env.APP_DKIM_PRIVATE_KEY
      ? {
          domainName: process.env.APP_DOMAIN,
          keySelector: 'default',
          privateKey: process.env.APP_DKIM_PRIVATE_KEY,
        }
      : undefined,
} as SMTPTransport.Options);

// Optional: Verify connection on startup
transporter.verify((error) => {
  if (error) {
    if (isDevelopment) console.log('Email server connection error:', error);
    return;
  } else {
    if (isDevelopment) console.log('Email server is ready to send messages');
    return;
  }
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
  attachments?: {
    filename: string;
    path: string;
    contentType?: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  cc,
  bcc,
  replyTo,
  attachments,
}: SendEmailOptions) => {
  // Validate required fields
  if (!to || !subject || !html) {
    if (isDevelopment)
      console.log('Missing required email fields: to, subject, or html');
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.APP_SMTP_USER}>`,
      to,
      subject,
      html,
      text,
      cc,
      bcc,
      replyTo,
      attachments,
    });

    if (isDevelopment) console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    if (isDevelopment) console.log('Email sending failed:', error);
    return;
  }
};
