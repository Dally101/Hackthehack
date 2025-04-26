const express = require('express');
const authRoutes = require('./auth');
const exampleRoutes = require('./example');

const router = express.Router();

// Mount routers
router.use('/auth', authRoutes);
router.use('/example', exampleRoutes);

module.exports = router; 