const express = require('express');
const { asyncHandler, ErrorResponse } = require('../middleware');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @route    GET /api/example
 * @desc     Get example data
 * @access   Public
 */
router.get('/', asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Example public endpoint'
    }
  });
}));

/**
 * @route    GET /api/example/protected
 * @desc     Get protected example data
 * @access   Private
 */
router.get('/protected', protect, asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Protected endpoint data',
      user: req.user
    }
  });
}));

/**
 * @route    GET /api/example/admin
 * @desc     Get admin-only example data
 * @access   Private (Admin only)
 */
router.get('/admin', protect, authorize('admin'), asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Admin endpoint data',
      user: req.user
    }
  });
}));

/**
 * @route    GET /api/example/error
 * @desc     Test error handling
 * @access   Public
 */
router.get('/error', asyncHandler(async (req, res, next) => {
  // Simulate a database error
  const simulateError = req.query.type || 'general';
  
  if (simulateError === 'not-found') {
    return next(new ErrorResponse('Resource not found', 404));
  } else if (simulateError === 'validation') {
    return next(new ErrorResponse('Validation failed', 400));
  } else if (simulateError === 'auth') {
    return next(new ErrorResponse('Not authorized', 401));
  } else if (simulateError === 'server') {
    throw new Error('Internal server error');
  }
  
  res.status(200).json({
    success: true,
    message: 'No error occurred'
  });
}));

module.exports = router; 