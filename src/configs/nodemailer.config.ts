import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
  appName,
  appSMTPHost,
  appSMTPPass,
  appSMTPPort,
  appSMTPUser,
  isDevelopment,
  isProduction,
} from '../utilities/app.utilities';

// Create transporter
export const transporter = nodemailer.createTransport({
  host: appSMTPHost,
  port: Number(appSMTPPort),
  secure: Number(appSMTPPort) === 465, // true for port 465, false otherwise
  auth: {
    user: appSMTPUser,
    pass: appSMTPPass,
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
} as SMTPTransport.Options);

// Verify connection on startup
// eslint-disable-next-line @typescript-eslint/no-explicit-any
transporter.verify((error: any) => {
  if (error) {
    if (isDevelopment) console.log('Email server connection error', error);
    return;
  } else {
    if (isDevelopment) console.log('Email server is ready to send messages');
    return;
  }
});

// Send email
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

// Send email
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
    return; // prevent further execution
  }

  try {
    const info = await transporter.sendMail({
      from: `"${appName}" - <${appSMTPUser}>`,
      to,
      subject,
      html,
      text,
      cc,
      bcc,
      replyTo,
      attachments,
    });

    if (isDevelopment) console.log('Email sent successfully', info);
    return info;
  } 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    if (isDevelopment) console.log('Email sending failed', error);
    return; // prevent further execution
  }
};
