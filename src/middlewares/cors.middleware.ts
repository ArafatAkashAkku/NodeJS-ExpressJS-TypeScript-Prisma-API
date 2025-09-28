import { CorsOptions } from 'cors';
import { appCORSAllowedUrls, isDevelopment } from '../utilities/app.utilities';

// Define the allowed origins for CORS
// This can be set in the environment variables for flexibility
const allowedOrigins = appCORSAllowedUrls.split(',').map(
  (url) => url.trim(),
) || ['*'];

// Define the CORS options
// This configuration allows requests from the specified origins
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      // Allow non-browser requests like curl or Postman
      if (isDevelopment) console.log(`CORS request from ${origin} allowed`); // Log allowed requests
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      if (isDevelopment) console.log(`CORS request from ${origin} allowed`); // Log allowed requests
      return callback(null, true);
    } else {
      if (isDevelopment) console.log(`CORS request from ${origin} rejected`); // Log rejected requests
      return callback(new Error('Not allowed by CORS'));
    }
  },
  // Allow credentials to be sent with requests
  // This is necessary for cookies, authorization headers, or TLS client certificates
  credentials: true,
  // Specify the HTTP methods that are allowed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  // Expose headers that can be accessed by the client
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  // Set the status code for successful OPTIONS requests
  optionsSuccessStatus: 200, // for legacy browsers
  // Preflight request handling
  preflightContinue: false,
  // Cache preflight response
  maxAge: 86400, // Cache preflight response for 24 hours
  // Note: The `maxAge` option is not supported by all browsers, but it can help reduce the number of preflight requests
};

export default corsOptions;
