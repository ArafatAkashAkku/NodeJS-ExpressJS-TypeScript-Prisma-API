import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { initSocket } from './sockets';
import cluster from 'cluster';
import os from 'os';
import {
  appBackendUrl,
  isDevelopment,
  isProduction,
} from './utilities/app.utilities';
import app from './app';

// Load environment variables from .env file
dotenv.config();

// Validate environment variables
const PORT = process.env.APP_PORT || 5000;

// Create the HTTP server
const server = http.createServer(app);

const allowedOrigins = process.env.APP_CORS_ALLOWED_URLS?.split(',').map(
  (url) => url.trim(),
) || ['*'];
// Initialize WebSocket server with validation and restrictions
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Set from environment or fallback to '*'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Restrict allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Restrict headers
    credentials: true, // Enable credentials for secure connections
  },
  transports: ['websocket', 'polling'], // Use WebSockets for better performance
  pingInterval: 25000, // Ping clients every 25 seconds to ensure connection
  pingTimeout: 60000, // Disconnect clients if they don't respond in 60 seconds
  maxHttpBufferSize: 1e8, // Set max buffer size for HTTP requests (100 MB)
});

// Initialize sockets and handle connections
initSocket(io);

// Use cluster module to create worker processes for better performance
// This allows the server to take advantage of multi-core systems
const numCPUs = os.cpus().length;

// Check if the app is running in production mode
if (isProduction && cluster.isPrimary) {
  console.log(`👑 [Production] Master ${process.pid} is running`);

  // Spawn workers based on CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for worker exit events and restart them
  // This ensures that if a worker crashes, a new one is spawned
  cluster.on('exit', (worker) => {
    console.warn(`⚠️ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // start server
  server.listen(PORT, () => {
    if (isDevelopment) {
      console.log(`Server is running on port http://localhost:${PORT}`);
    } else {
      console.log(`Server is running on ${appBackendUrl}`);
    }
  });
}
