import rateLimit from 'express-rate-limit';

// Rate Limiter (100 requests per 15 minutes)
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },

  standardHeaders: true,
  legacyHeaders: false,
});
