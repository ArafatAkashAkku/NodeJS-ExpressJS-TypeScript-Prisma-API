import { Request, Response, NextFunction } from 'express';
import { isDevelopment } from '../utilities/app.utilities';

// Extend Express Request interface to include 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const SENSITIVE_FIELDS = [
  'password',
  'token',
  'authorization',
  'secret',
  'apiKey',
  'apikey',
  'accessToken',
];

function sanitize(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  const clone: any = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
      clone[key] = '***';
    } else {
      clone[key] = typeof obj[key] === 'object' ? sanitize(obj[key]) : obj[key];
    }
  }
  return clone;
}

// Very simple device type detection based on user-agent keywords
function detectDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/mobile|iphone|ipod|android.*mobile|windows phone/.test(ua))
    return 'Mobile';
  if (/tablet|ipad|android(?!.*mobile)/.test(ua)) return 'Tablet';
  return 'Desktop';
}

// Extend the Request interface to include a 'user' property
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const uaString = req.headers['user-agent'] || '';
    const deviceType = detectDeviceType(uaString);

    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      path: req.path,
      status: res.statusCode,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      protocol: req.protocol,
      hostname: req.hostname,
      httpVersion: req.httpVersion,
      headers: {
        referer: req.headers['referer'],
        origin: req.headers['origin'],
        language: req.headers['accept-language'],
        'user-agent': uaString,
      },
      userAgent: {
        raw: uaString,
        device: deviceType,
      },
      query: sanitize(req.query),
      params: sanitize(req.params),
      cookies: sanitize(req.cookies),
      body: sanitize(req.body), // Assuming req.body exists and is an object
      user: req.user ? sanitize(req.user) : undefined,
      responseHeaders: res.getHeaders(),
      performance: {
        durationMs,
        memoryUsage: process.memoryUsage(),
      },
    };

    isDevelopment && console.log(JSON.stringify(log, null, 2));

    // Optionally, you can save this log to a file or database here
  });

  next();
};
