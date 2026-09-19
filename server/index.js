require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database (with fail-safe fallback)
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'MemoryMap AI Backend',
    mode: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY ? 'LIVE_LLM' : 'HEURISTIC_AI_FALLBACK',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`
======================================================
🚀 MemoryMap Backend Server Running
📍 URL: http://localhost:${PORT}
🧠 AI Mode: ${process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY ? 'LIVE LLM API' : 'HEURISTIC AI FALLBACK (Presentation Safe)'}
======================================================
  `);
});
