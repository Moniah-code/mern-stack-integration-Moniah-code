// server.js - Main server file for the MERN blog application
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const connectDB = require('./config/db');
const { errorHandler } = require('./utils/errorHandler');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Import routes
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');

// Initialize Express app
const app = express();

// CORS configuration - must come before other middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3003'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW,
  max: config.RATE_LIMIT_MAX
});
app.use('/api/', limiter);

// General middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, config.UPLOAD_PATH)));

// Logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
const apiRouter = express.Router();
apiRouter.use('/posts', postRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/auth', authRoutes);

// Mount API routes
app.use('/api/v1', apiRouter); // Using explicit path for clarity

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'MERN Blog API',
    version: config.API_VERSION,
    status: 'running'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(config.PORT, () => {
      console.log(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Promise Rejection:', err);
      server.close(() => process.exit(1));
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      console.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.info('Process terminated.');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer(); 