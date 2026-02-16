const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToDb } = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable trust proxy for rate limiting behind load balancers/proxies
app.set('trust proxy', 1);

// Middleware
app.use(express.json({ limit: '5mb' })); // Body limit is 5mb
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Security Headers
const helmet = require('helmet');
app.use(helmet());

// Cross-Origin Resource Sharing
const getAllowedOrigins = () => {
    if (process.env.NODE_ENV === 'production') {
        // Use environment variable for allowed origins in production
        if (process.env.ALLOWED_ORIGINS) {
            return process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
        }
        // Fallback to hardcoded production domains
        return [
            'https://loansarathi.com',
            'https://www.loansarathi.com',
            'https://smartsolutionsmumbai.com',
            'https://www.smartsolutionsmumbai.com',
            'https://smartmumbaisolutions.com',
            'https://www.smartmumbaisolutions.com'
        ];
    }
    return ['http://localhost:3000', 'http://localhost:3001'];
};

app.use(cors({
    origin: getAllowedOrigins(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Application-Source']
}));

// Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Data Sanitization against NoSQL query injection
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());

// Data Sanitization against XSS
const xss = require('xss-clean');
app.use(xss());

// Prevent Parameter Pollution
const hpp = require('hpp');
app.use(hpp());

// Serve static files from the Next.js public directory
// This allows the backend to serve images uploaded by the frontend
app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/uploads')));

// Routes
app.use('/api/gallery', require('./routes/gallery'));

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

// DB Connection and Server Start
let server;

connectToDb((err) => {
    if (err) {
        console.error('Failed to start server due to database connection error');
        process.exit(1);
    }
    
    server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Backend URL: http://localhost:${PORT}`);
    });
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received, shutting down gracefully...`);
    
    if (server) {
        server.close(() => {
            console.log('HTTP server closed');
        });
    }
    
    // MongoDB connection will be closed by db.js shutdown handler
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
