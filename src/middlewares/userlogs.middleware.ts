import { Request, Response, NextFunction } from 'express';
import { isDevelopment } from '../utilities/app.utilities';
// import prisma from '../prisma';

const SENSITIVE_FIELDS = [
  'password',
  'token',
  'authorization',
  'secret',
  'apiKey',
  'apikey',
  'accessToken',
];

/* eslint-disable @typescript-eslint/no-explicit-any */
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

  res.on('finish', async () => {
    const durationMs = Date.now() - start;
    const uaString = req.headers['user-agent'] || '';
    const deviceType = detectDeviceType(uaString);

    const log = {
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
      responseHeaders: res.getHeaders(),
      performance: {
        durationMs,
        memoryUsage: { ...process.memoryUsage() },
      },
      success: res.statusCode >= 200 && res.statusCode < 400,
      message:
        res.statusMessage ||
        (res.statusCode >= 200 && res.statusCode < 400
          ? 'Success Request'
          : 'Error Request'),
    };

    if (isDevelopment) console.log(JSON.stringify(log, null, 2));
    // await prisma.logs.create({
    //   data: {
    //     method: log.method,
    //     url: log.url,
    //     path: log.path,
    //     status: log.status,
    //     ip: Array.isArray(log.ip) ? log.ip.join(', ') : log.ip,
    //     protocol: log.protocol,
    //     hostname: log.hostname,
    //     httpVersion: log.httpVersion,
    //     headers: log.headers,
    //     userAgent: log.userAgent,
    //     query: log.query,
    //     params: log.params,
    //     cookies: log.cookies,
    //     body: log.body,
    //     responseHeaders: log.responseHeaders,
    //     performance: {
    //       durationMs: log.performance.durationMs,
    //       memoryUsage: { ...log.performance.memoryUsage },
    //     },
    //     success: log.success,
    //     message: log.message,
    //   },
    // });
  });

  next();
};
