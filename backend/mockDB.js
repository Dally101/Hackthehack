/**
 * Mock Database for testing without MongoDB
 * Provides basic CRUD operations with in-memory storage
 */

// In-memory storage
const store = {
  users: [],
  hackathons: [],
  teams: [],
  projects: [],
  submissions: []
};

// Counter for IDs
const counters = {
  users: 0,
  hackathons: 0,
  teams: 0,
  projects: 0,
  submissions: 0
};

// Helper to generate IDs
const generateId = (collection) => {
  counters[collection]++;
  return counters[collection].toString();
};

// Mock MongoDB operations
const mockDB = {
  // Find all documents in a collection
  find: async (collection, query = {}) => {
    if (!store[collection]) {
      return [];
    }
    
    // Very basic query matching
    if (Object.keys(query).length === 0) {
      return [...store[collection]];
    }
    
    return store[collection].filter(item => {
      return Object.keys(query).every(key => {
        // Support for exact match only
        return item[key] === query[key];
      });
    });
  },
  
  // Find one document
  findOne: async (collection, query = {}) => {
    if (!store[collection]) {
      return null;
    }
    
    return store[collection].find(item => {
      return Object.keys(query).every(key => {
        return item[key] === query[key];
      });
    }) || null;
  },
  
  // Find by ID
  findById: async (collection, id) => {
    if (!store[collection]) {
      return null;
    }
    
    return store[collection].find(item => item._id === id) || null;
  },
  
  // Create a document
  create: async (collection, data) => {
    if (!store[collection]) {
      store[collection] = [];
    }
    
    const newItem = {
      ...data,
      _id: generateId(collection),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    store[collection].push(newItem);
    return newItem;
  },
  
  // Update a document
  update: async (collection, id, data) => {
    if (!store[collection]) {
      return null;
    }
    
    const index = store[collection].findIndex(item => item._id === id);
    if (index === -1) {
      return null;
    }
    
    const updatedItem = {
      ...store[collection][index],
      ...data,
      updatedAt: new Date()
    };
    
    store[collection][index] = updatedItem;
    return updatedItem;
  },
  
  // Delete a document
  delete: async (collection, id) => {
    if (!store[collection]) {
      return false;
    }
    
    const index = store[collection].findIndex(item => item._id === id);
    if (index === -1) {
      return false;
    }
    
    store[collection].splice(index, 1);
    return true;
  },
  
  // Clear a collection or all collections
  clear: async (collection = null) => {
    if (collection) {
      if (store[collection]) {
        store[collection] = [];
        counters[collection] = 0;
      }
    } else {
      Object.keys(store).forEach(key => {
        store[key] = [];
        counters[key] = 0;
      });
    }
    return true;
  }
};

// Add some initial data for testing
mockDB.create('users', {
  name: 'Admin User',
  email: 'admin@example.com',
  password: '$2a$10$eDIL4ZFsYC2oRSVNa5WDFuIjrqmgLOkLl4TIWjzOoK/B8.QQP90i.',  // hashed 'password123'
  role: 'admin'
});

mockDB.create('users', {
  name: 'Test User',
  email: 'user@example.com',
  password: '$2a$10$eDIL4ZFsYC2oRSVNa5WDFuIjrqmgLOkLl4TIWjzOoK/B8.QQP90i.',  // hashed 'password123'
  role: 'user'
});

mockDB.create('hackathons', {
  title: 'AI Innovation Challenge',
  description: 'Build AI-powered solutions to address real-world problems.',
  startDate: new Date('2023-07-15'),
  endDate: new Date('2023-07-17'),
  location: 'Virtual',
  status: 'upcoming'
});

console.log('Mock database initialized with test data');

module.exports = mockDB; 