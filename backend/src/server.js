const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const { MEDIA_ROOT } = require('./config/constants');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://upha.vercel.app',
    FRONTEND_URL,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static Media Serving
console.log(`[Media] Serving media files from: ${MEDIA_ROOT}`);
app.use('/media', express.static(MEDIA_ROOT));

// Root Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    framework: 'Node.js Express + SQLite3 (MVC)',
    version: '1.0.0',
    api_base: '/api',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', apiRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found on Node backend.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 UPHA Node.js Backend running on http://127.0.0.1:${PORT}`);
  console.log(`📁 Media root: ${MEDIA_ROOT}`);
  console.log(`💾 SQLite Database connected`);
  console.log(`=======================================================`);
});

module.exports = app;
