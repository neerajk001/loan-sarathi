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
app.use(express.json({ limit: '10kb' })); // Body limit is 10kb

// Security Headers
const helmet = require('helmet');
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://loansarathi.com', 'https://www.loansarathi.com', 'https://smartsolutionsmumbai.com']
        : ['http://localhost:3000'],
    credentials: true
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
connectToDb((err) => {
    if (!err) {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
});
