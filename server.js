require('dotenv').config();
const indexRoutes = require('./routes/index');
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/connection');


// Import routes
const PORT = process.env.PORT || 3000;
const vaultRoutes = require('./routes/vault');

const app = express();


// Connect to database
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', indexRoutes);
app.use('/vault', vaultRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page not found. The page you are looking for does not exist.',
    error: null
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 50MB per file.'
    });
  }

  // Multer file count error
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files. Maximum 10 files per upload.'
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  
  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal server error'
    });
  } else {
    res.status(statusCode).render('error', {
      message: err.message || 'Something went wrong on our end.',
      error: process.env.NODE_ENV === 'development' ? err : null
    });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

const server = app.listen(PORT, () => {
  console.log(`
🚀 SecureShare Server Running!
📍 URL: http://localhost:${PORT}
🌟 Environment: ${process.env.NODE_ENV || 'development'}
💾 Database: MongoDB Atlas
🔒 Security: Enabled (Helmet, Rate Limiting)
📁 File Storage: GridFS
  `);
});

module.exports = app;