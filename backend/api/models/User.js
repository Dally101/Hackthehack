const mongoose = require('mongoose');
const mockDB = require('../../mockDB');

// Define the User schema for MongoDB
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: true // Include password by default (can be excluded in queries)
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'organizer'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a hybrid model that works with both MongoDB and the mock database
const useMongoDB = process.env.USE_MONGODB === 'true';

// If MongoDB is enabled, use the Mongoose model
const MongooseUser = useMongoDB ? mongoose.model('User', UserSchema) : null;

// Create a hybrid User model
const User = {
  // Find one user
  findOne: async (query, projection) => {
    if (useMongoDB) {
      return MongooseUser.findOne(query, projection);
    } else {
      // For the mock DB, handle select('+password') situation
      return mockDB.findOne('users', query);
    }
  },
  
  // Find by ID
  findById: async (id, projection) => {
    if (useMongoDB) {
      return MongooseUser.findById(id, projection);
    } else {
      return mockDB.findById('users', id);
    }
  },
  
  // Create a new user
  create: async (userData) => {
    if (useMongoDB) {
      return MongooseUser.create(userData);
    } else {
      return mockDB.create('users', userData);
    }
  }
};

module.exports = User; 