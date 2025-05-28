import { Server } from 'socket.io';
import { isDevelopment } from '../utilities/app.utilities';

// Initialize Socket.IO server
// This function initializes the Socket.IO server and handles events
export const initSocket = (io: Server) => {
  io.on('connection', (socket) => {
    if (isDevelopment) console.log('New socket connection:', socket.id);

    // Handle incoming messages with validation
    socket.on('message', (msg) => {
      if (typeof msg === 'string' && msg.trim().length > 0) {
        if (isDevelopment) console.log('Message received:', msg);
        io.emit('message', msg); // Broadcast the message to all connected clients
      } else {
        if (isDevelopment) console.log('Invalid message:', msg);
        socket.emit('error', 'Invalid message');
      }
    });

    //Handle private message
    socket.on('privateMessage', (msg, recipientId) => {
      if (typeof msg === 'string' && msg.trim().length > 0) {
        if (isDevelopment) console.log('Private message received:', msg);
        socket.to(recipientId).emit('privateMessage', msg);
      } else {
        if (isDevelopment) console.log('Invalid private message:', msg);
        socket.emit('error', 'Invalid private message');
      }
    });

    // Handle typing event
    socket.on('typing', (isTyping) => {
      if (isDevelopment) console.log(`${socket.id} is typing: ${isTyping}`);
      socket.broadcast.emit('typing', isTyping);
    });

    // Handle custom error event
    socket.on('error', (err) => {
      if (isDevelopment) console.log('Socket error:', err);
    });

    // Handle room join
    socket.on('joinRoom', (room) => {
      if (isDevelopment) console.log(`${socket.id} joined room: ${room}`);
      socket.join(room);
    });

    // Handle room leave
    socket.on('leaveRoom', (room) => {
      if (isDevelopment) console.log(`${socket.id} left room: ${room}`);
      socket.leave(room);
    });

    // Handle custom event
    socket.onAny((event, ...args) => {
      if (isDevelopment) console.log(`Received event: ${event}`, args);
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
      if (isDevelopment) console.log('Socket disconnected:', socket.id);
    });
  });

  // Graceful shutdown when server shuts down
  process.on('SIGINT', () => {
    if (isDevelopment) console.log('Server is shutting down...');
    io.close(() => {
      if (isDevelopment) console.log('Socket server closed');
      process.exit(0);
    });
  });
};
