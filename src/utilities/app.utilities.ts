import dotenv from 'dotenv';
dotenv.config();

const appType = process.env.APP_TYPE?.trim().toLowerCase() || 'development';

export const isProduction = appType === 'production';

export const isDevelopment = appType === 'development';

export const appName = process.env.APP_NAME?.trim() || 'Example App';

export const appFrontendDomainUrl =
  process.env.APP_FRONTEND_DOMAIN_URL?.trim().toLowerCase() || 'example.com';

export const appBackendUrl =
  process.env.APP_BACKEND_URL?.trim().toLowerCase() || 'https://example.com';

export const appJwtSecret = process.env.APP_JWT_SECRET?.trim() || 'example';

export const appJwtExpiration = process.env.APP_JWT_EXPIRATION?.trim() || '1h';

export const appCryptoSecretKey =
  process.env.APP_CRYPTO_SECRET_KEY?.trim() || 'example';

export const appSMTPHost =
  process.env.APP_SMTP_HOST?.trim() || 'smtp.example.com';

export const appSMTPPort = process.env.APP_SMTP_PORT?.trim() || '587';

export const appSMTPUser =
  process.env.APP_SMTP_USER?.trim() || 'example@example.com';

export const appSMTPPass = process.env.APP_SMTP_PASS?.trim() || 'password';

export const appDkimPrivateKey =
  process.env.APP_DKIM_PRIVATE_KEY?.trim() || 'example';

export const appDomain = process.env.APP_DOMAIN?.trim() || 'example.com';

export const appCookieSecret =
  process.env.APP_COOKIE_SECRET?.trim() || 'example';
