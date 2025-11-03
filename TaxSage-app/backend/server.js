const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// --- Import Route Files ---
const authRoutes = require('./routes/auth.routes.js');
const caAuthRoutes = require('./routes/ca.auth.routes.js');
const caRoutes = require('./routes/ca.routes.js');
const taxRoutes = require('./routes/tax.routes.js');

// Load environment variables from .env file
dotenv.config();

const app = express();

// --- Enhanced CORS Configuration ---
app.use(cors({
    origin: process.env.FRONTEND_URL, // Your frontend URL from environment
    credentials: true, // Allow cookies if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: '10mb' })); // Increase payload limit if needed
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- Security Middleware ---
// Add security headers
app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
});

// --- Database Connection with Enhanced Error Handling ---
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Add connection options for better stability
            // useNewUrlParser: true, // No longer needed in Mongoose 6+
            // useUnifiedTopology: true, // No longer needed in Mongoose 6+
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle MongoDB connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        
        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });
        
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

// --- Request Logging Middleware ---
app.use((req, res, next) => {
    // Don't log health checks in production to reduce noise
    if (process.env.NODE_ENV === 'production' && req.path === '/health') {
        return next();
    }
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// --- API Routes ---
app.use('/api/auth', authRoutes); 
app.use('/api/ca/auth', caAuthRoutes);
app.use('/api/ca', caRoutes);
app.use('/api/tax', taxRoutes);

// --- Basic Route ---
app.get('/', (req, res) => {
    res.json({ 
        message: 'TaxSage API is running...',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// --- Health Check Route ---
// This is great for deployment platforms to know your app is live
app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
        status: 'OK',
        database: dbStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// --- 404 Handler for undefined routes ---
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// --- Global Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }
    
    // Default error
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// --- Handle Unhandled Promise Rejections ---
process.on('unhandledRejection', (err, promise) => {
    console.log('Unhandled Promise Rejection:', err);
    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});

// --- Handle Uncaught Exceptions ---
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err);
    process.exit(1);
});

// --- Server Listener ---
const PORT = process.env.PORT || 5001;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode on http://${HOST}:${PORT}`);
    console.log(`Database: MongoDB ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

module.exports = app; // For testing purposes