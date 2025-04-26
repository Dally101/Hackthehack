const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./api/userRoutes');
const hackathonRoutes = require('./api/hackathonRoutes');
const teamRoutes = require('./api/teamRoutes');
const projectRoutes = require('./api/projectRoutes');
const agentRoutes = require('./api/agentRoutes');

// Mount routes
router.use('/users', userRoutes);
router.use('/hackathons', hackathonRoutes);
router.use('/teams', teamRoutes);
router.use('/projects', projectRoutes);
router.use('/agents', agentRoutes);

module.exports = router;
