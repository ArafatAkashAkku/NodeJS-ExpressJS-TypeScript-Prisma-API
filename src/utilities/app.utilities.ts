import dotenv from 'dotenv';
dotenv.config();

// Trim and sanitize
const appType = process.env.APP_TYPE?.trim().toLowerCase() || '';

// sanitized value
export const isProduction = appType === 'production';

export const isDevelopment = appType === 'development';
