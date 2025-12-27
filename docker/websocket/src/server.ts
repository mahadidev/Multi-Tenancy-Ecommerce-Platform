import dotenv from 'dotenv';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { createClient, RedisClientType } from 'redis';
import jwt from 'jsonwebtoken';

dotenv.config();

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    role?: string;
    store_id?: string;
    [key: string]: any;
  };
}

interface MessageData {
  room: string;
  message: string;
  type?: string;
}

interface NotificationData {
  id: string;
  room: string;
  message: string;
  type: string;
  sender: string;
  timestamp: string;
}

const PORT = process.env.PORT || 6001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      port: PORT
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:3000", "http://localhost:8000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Redis clients for pub/sub
let redisSubscriber: RedisClientType | null = null;
let redisPublisher: RedisClientType | null = null;

const initializeRedis = async (): Promise<void> => {
  if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
    try {
      redisSubscriber = createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
      });

      redisPublisher = createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
      });

      redisSubscriber.on('connect', () => {
        console.log('✅ Connected to Redis subscriber');
      });

      redisPublisher.on('connect', () => {
        console.log('✅ Connected to Redis publisher');
      });

      await redisSubscriber.connect();
      await redisPublisher.connect();

      // Set up Redis subscription for future features
      await redisSubscriber.subscribe('cholo-gori:notifications', (message) => {
        const notification: NotificationData = JSON.parse(message);
        io.to(notification.room).emit('notification', notification);
      });

    } catch (error) {
      console.warn('⚠️  Redis connection failed, running without Redis:', error);
    }
  }
};

// Authentication middleware
const authenticateSocket = async (socket: AuthenticatedSocket, next: (err?: Error) => void): Promise<void> => {
  try {
    const token = socket.handshake.auth.token || 
                  socket.handshake.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    // Allow guest connections for development
    if (token === 'guest-token' || NODE_ENV === 'development') {
      socket.user = { 
        id: 'guest', 
        role: 'guest',
        store_id: undefined
      };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    socket.user = decoded;
    next();
  } catch (error) {
    console.log('Authentication failed:', error);
    next(new Error('Invalid authentication token'));
  }
};

// Apply authentication middleware
io.use(authenticateSocket);

// Socket connection handling
io.on('connection', (socket: AuthenticatedSocket) => {
  console.log(`🔌 User connected: ${socket.user?.id || 'guest'} (${socket.id})`);

  // Join user-specific room
  if (socket.user?.id && socket.user.id !== 'guest') {
    socket.join(`user_${socket.user.id}`);
    console.log(`👤 User ${socket.user.id} joined their private room`);
  }

  // Join store-specific room if user belongs to a store
  if (socket.user?.store_id) {
    socket.join(`store_${socket.user.store_id}`);
    console.log(`🏪 User ${socket.user.id} joined store room ${socket.user.store_id}`);
  }

  // Handle joining custom rooms
  socket.on('join-room', (roomName: string) => {
    socket.join(roomName);
    console.log(`📝 Socket ${socket.id} joined room: ${roomName}`);
    socket.emit('joined-room', { room: roomName });
  });

  // Handle leaving rooms
  socket.on('leave-room', (roomName: string) => {
    socket.leave(roomName);
    console.log(`📝 Socket ${socket.id} left room: ${roomName}`);
    socket.emit('left-room', { room: roomName });
  });

  // Handle real-time messaging
  socket.on('send-message', (data: MessageData) => {
    const { room, message, type = 'message' } = data;
    
    if (room && socket.user) {
      const messageData: NotificationData = {
        id: Date.now().toString(),
        room,
        message,
        type,
        sender: socket.user.id,
        timestamp: new Date().toISOString()
      };

      io.to(room).emit('new-message', messageData);

      // Publish to Redis for multi-server scaling
      if (redisPublisher) {
        redisPublisher.publish('cholo-gori:messages', JSON.stringify(messageData));
      }
    } else {
      socket.emit('error', { message: 'Room name and authentication required' });
    }
  });

  // Handle order status updates (for future e-commerce features)
  socket.on('order-status-update', (data: { orderId: string; status: string; storeId?: string }) => {
    const { orderId, status, storeId } = data;
    
    if (storeId) {
      io.to(`store_${storeId}`).emit('order-updated', {
        orderId,
        status,
        timestamp: new Date().toISOString()
      });
    }

    if (socket.user?.id) {
      io.to(`user_${socket.user.id}`).emit('order-updated', {
        orderId,
        status,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle real-time stock updates (for inventory management)
  socket.on('stock-update', (data: { productId: string; quantity: number; storeId?: string }) => {
    const { productId, quantity, storeId } = data;
    
    if (storeId) {
      io.to(`store_${storeId}`).emit('stock-updated', {
        productId,
        quantity,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle notification acknowledgments
  socket.on('mark-notification-read', (notificationId: string) => {
    socket.emit('notification-marked-read', { 
      notificationId,
      userId: socket.user?.id
    });
  });

  // Handle customer support chat (future feature)
  socket.on('support-message', (data: { message: string; userId: string }) => {
    const { message, userId } = data;
    
    // Send to support staff room
    io.to('support-staff').emit('new-support-message', {
      message,
      userId,
      timestamp: new Date().toISOString(),
      socketId: socket.id
    });

    // Send confirmation to user
    io.to(`user_${userId}`).emit('support-message-received', {
      timestamp: new Date().toISOString()
    });
  });

  // Handle disconnect
  socket.on('disconnect', (reason) => {
    console.log(`🔌 User disconnected: ${socket.user?.id || 'guest'} (${socket.id}) - ${reason}`);
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`❌ Socket error for ${socket.id}:`, error);
  });
});

// Helper functions for external use
export const broadcastToRoom = (room: string, event: string, data: any): void => {
  io.to(room).emit(event, data);
};

export const broadcastToUser = (userId: string, event: string, data: any): void => {
  io.to(`user_${userId}`).emit(event, data);
};

export const broadcastToStore = (storeId: string, event: string, data: any): void => {
  io.to(`store_${storeId}`).emit(event, data);
};

export const sendNotification = (userId: string, notification: {
  title: string;
  message: string;
  type: string;
}): void => {
  broadcastToUser(userId, 'notification', {
    ...notification,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  });
};

// Global error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(async () => {
    if (redisSubscriber) await redisSubscriber.quit();
    if (redisPublisher) await redisPublisher.quit();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  server.close(async () => {
    if (redisSubscriber) await redisSubscriber.quit();
    if (redisPublisher) await redisPublisher.quit();
    process.exit(0);
  });
});

// Start server
const startServer = async (): Promise<void> => {
  await initializeRedis();
  
  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 WebSocket Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 WebSocket URL: ws://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Export for potential module use
export { io };