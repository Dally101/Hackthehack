# Error Handling Middleware

This directory contains middleware functions designed to simplify error handling in Express applications.

## Contents

- `async.js`: An async handler wrapper to eliminate try/catch blocks
- `error.js`: Global error handling middleware and custom ErrorResponse class
- `auth.js`: Authentication and authorization middleware
- `index.js`: Central export for all middleware

## Usage

### AsyncHandler

The `asyncHandler` middleware wraps async controller functions to eliminate the need for try/catch blocks in each route handler:

```javascript
const { asyncHandler } = require('../middleware');

// Without asyncHandler
router.get('/', async (req, res, next) => {
  try {
    // Your async code here
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// With asyncHandler
router.get('/', asyncHandler(async (req, res, next) => {
  // Your async code here - no try/catch needed!
  res.status(200).json({ success: true, data: result });
}));
```

### ErrorResponse

The `ErrorResponse` class allows for consistent error objects with status codes:

```javascript
const { ErrorResponse } = require('../middleware');

// Create and pass a custom error to next()
if (!user) {
  return next(new ErrorResponse('User not found', 404));
}
```

### Error Handler

The global error handler middleware provides consistent error responses:

```javascript
// In your main app.js
const { errorHandler } = require('./middleware');

// Apply routes first
app.use('/api', routes);

// Apply error handler after all routes
app.use(errorHandler);
```

### Authentication Middleware

The authentication middleware includes:

- `protect`: Verifies JWT and attaches user to request
- `authorize`: Restricts routes based on user roles

```javascript
const { protect, authorize } = require('../middleware/auth');

// Protected route (requires authentication)
router.get('/profile', protect, asyncHandler(async (req, res) => {
  // req.user is available here
  res.status(200).json({ success: true, data: req.user });
}));

// Role-based protection (admin only)
router.delete('/users/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  // Only admins can reach this point
  res.status(200).json({ success: true, message: 'User deleted' });
}));
```

## Error Types

The error handler automatically detects common MongoDB/Mongoose errors:

- CastError (Invalid ID): 404 Not Found
- Duplicate Key (Code 11000): 400 Bad Request
- Validation Error: 400 Bad Request
- Other errors: 500 Server Error

Each error response follows this format:

```json
{
  "success": false,
  "error": "Error message"
}
``` 