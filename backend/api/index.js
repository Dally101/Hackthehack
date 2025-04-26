const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const agentRoutes = require('./routes');
const apiRoutes = require('./routes/index');
const { setupAgentSystem } = require('../config');
const { errorHandler } = require('./middleware');

const app = express();

// Apply middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Initialize agent system
setupAgentSystem();

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Welcome to the Hackathon Management API',
    endpoints: {
      api: '/api',
      health: '/health',
      docs: '/api-docs'
    }
  });
});

// Apply routes - both agent routes and API routes
app.use('/api', agentRoutes);
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Custom error handling middleware
app.use(errorHandler);

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.url}`
  });
});

module.exports = app; 