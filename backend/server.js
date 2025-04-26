require('dotenv').config();
const app = require('./api');
const mongoose = require('mongoose');
const mockDB = require('./mockDB');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon-management';

// Check if MongoDB should be used
const USE_MONGODB = process.env.USE_MONGODB === 'true';

if (USE_MONGODB) {
  // Connect to MongoDB
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      startServer();
    })
    .catch(err => {
      console.error('Failed to connect to MongoDB', err);
      process.exit(1);
    });
} else {
  console.log('Using in-memory mock database');
  // Initialize mock database
  startServer();
}

function startServer() {
  // Start the server
  app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
    console.log(`API accessible at http://localhost:${PORT}/`);
  });
}

// Handle unexpected errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
}); 