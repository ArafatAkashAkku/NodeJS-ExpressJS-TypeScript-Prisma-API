import { sendEmail } from '../configs/nodemailer.config';
import { isDevelopment, appName, appFrontendDomainUrl } from './app.utilities';
import prisma from '../prisma';

export const validateEmail = (
  email: string,
): { isValid: boolean; sanitizedEmail: string } => {
  const sanitizedEmail = email.trim().toLowerCase();
  const popularEmailDomains = [
    'gmail.com',
    'yahoo.com',
    'ymail.com',
    'hotmail.com',
    'outlook.com',
    'live.com',
    'aol.com',
    'zoho.com',
    'protonmail.com',
    'yandex.com',
    'gmx.com',
    'mail.com',
    'icloud.com',
    'msn.com',
    'me.com',
    'mac.com',
    'fastmail.com',
    'mail.ru',
    'inbox.com',
    'rocketmail.com',
  ];

  const sanitizedEmailDomain = sanitizedEmail.split('@')[1];
  const isValid = popularEmailDomains.includes(sanitizedEmailDomain);

  if (isDevelopment) {
    console.log(isValid ? 'Valid email domain\n' : 'Invalid email domain\n');
  }

  return { isValid, sanitizedEmail };
};

export const sampleEmailTemplate = async (to: string, name: string) => {
  const subject = `Welcome to Your App, ${name}!`;
  const html = `
    <h1>Hello ${name},</h1>
    <p>Welcome to <strong>Your App</strong>. We're glad to have you!</p>
    <p>Get started by visiting your dashboard.</p>
  `;
  try {
    await sendEmail({ to, subject, html });
    if (isDevelopment) console.log('Welcome email sent');
  } catch (err) {
    if (isDevelopment) console.log('Some error occured\n', err);
  }
};

export const userCreateOnSubscribing = async (
  to: string,
  name: string,
  password: string,
  subdomain: string,
) => {
  const subject = 'Thanks for subscribing! Your account is ready';
  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <h2 style="color: #333;">Hello ${name},</h2>
      <p style="font-size: 16px; color: #555;">Your account has been successfully created and is now live!</p>
      
      <div style="margin-top: 20px; padding: 15px; background-color: #f1f5f9; border-left: 4px solid #6366f1; border-radius: 6px;">
        <p style="margin: 0; font-size: 15px;"><strong>Email:</strong> ${to}</p>
        <p style="margin: 0; font-size: 15px;"><strong>Password:</strong> ${password}</p>
      </div>

      <p style="margin-top: 20px; font-size: 16px; color: #555;">
        You can log in and start using your dashboard by clicking the button below:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href=${subdomain + '.' + appFrontendDomainUrl} style="background-color: #4f46e5; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Go to Login
        </a>
      </div>

      <p style="font-size: 14px; color: #888;">If you didn't request this account, please ignore this email.</p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />

      <p style="font-size: 13px; color: #aaa; text-align: center;">
        &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
      </p>
    </div>
  </div>
`;

  try {
    await sendEmail({ to, subject, html });
    if (isDevelopment) console.log('User creation on subscribing email sent');
  } catch (err) {
    if (isDevelopment) console.log('Some error occured\n', err);
  }
};

export const userAccountVerificationEmail = async (
  to: string,
  verificationToken: string,
  verificationOtp: string,
  subdomain: string | undefined,
) => {
  const subject = 'Your account is ready to use';
  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <h2 style="color: #333;">Hello Super Admin,</h2>
      <p style="font-size: 16px; color: #555;">Your account has been successfully created and is now live!</p>

    <p style="font-size: 16px; color: #555;">
      Please click the button below to verify your account:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      ${
        subdomain
          ? `
      <a href=${subdomain + '.' + appFrontendDomainUrl + '/verify-account?token=' + verificationToken + '&otp=' + verificationOtp} style="background-color: #4f46e5; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Verify Account
      </a>
      `
          : `
      <a href=${appFrontendDomainUrl + '/verify-account?token=' + verificationToken + '&otp=' + verificationOtp} style="background-color: #4f46e5; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Verify Account
      </a>
      `
      }
    </div>

    <p style="font-size: 16px; color: #555;">
      If you didn't request this account, please ignore this email.
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />

    <p style="font-size: 13px; color: #aaa; text-align: center;">
      &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
  `;
  try {
    const email = await sendEmail({ to, subject, html });
    if (email) {
      await prisma.emails.create({
        data: {
          email: to,
          subject,
          body: html,
        },
      });
    }
    if (isDevelopment) console.log('User account verification email sent');
  } catch (err) {
    if (isDevelopment) console.log('Some error occured\n', err);
  }
};

export const userForgotPasswordEmail = async (
  to: string,
  resetPasswordToken: string,
  resetPasswordOtp: string,
) => {
  const subject = 'Reset your password';
  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <h2 style="color: #333;">Hello Super Admin,</h2>
      <p style="font-size: 16px; color: #555;">Your password has been successfully reset!</p>

    <p style="font-size: 16px; color: #555;">
      Please click the button below to reset your password:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href=${appFrontendDomainUrl + '/reset-password?token=' + resetPasswordToken + '&otp=' + resetPasswordOtp} style="background-color: #4f46e5; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Reset Password
      </a>
    </div>

    <p style="font-size: 16px; color: #555;">
      If you didn't request this account, please ignore this email.
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />

    <p style="font-size: 13px; color: #aaa; text-align: center;">
      &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
    </p>
  </div>
</div>
      `;
  try {
    await sendEmail({ to, subject, html });
    if (isDevelopment) console.log('User reset password email sent');
  } catch (err) {
    if (isDevelopment) console.log('Some error occured\n', err);
  }
};
