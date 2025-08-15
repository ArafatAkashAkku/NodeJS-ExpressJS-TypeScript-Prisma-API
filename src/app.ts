import express, { Application, Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import statusMonitor from 'express-status-monitor';
import './cron/autorequest.cron';
import corsOptions from './middlewares/cors.middleware';
import { rateLimiter } from './middlewares/ratelimiter.middleware';
import { requestLogger } from './middlewares/userlogs.middleware';
import demoRouter from './routes/demo.routes';
import { appCookieSecret } from './utilities/app.utilities';

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app: Application = express();
const API_START = '/api/v1';

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(appCookieSecret));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: [
        "'self'",
        'https://cdnjs.cloudflare.com',
        "'sha256-smeKlzoBksVYJbpIwiP/yNzhQLzmXzVRkIh1Wvvydz4='",
      ],
      // Include other directives as needed (e.g., styleSrc, imgSrc)
    },
  }),
);
app.use(rateLimiter);
app.use(requestLogger);
app.use(statusMonitor({ path: API_START + '/status' }));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// APIs
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Welcome to the API World!' });
  return; // prevent further execution
});

app.use(API_START + '/demo', demoRouter);

export default app;
