/**
 * Utility for safely loading environment variables
 * Provides fallbacks for missing values and helpful console warnings
 */
const fs = require('fs');
const path = require('path');

// Try to load the .env file
function loadEnvFile() {
  try {
    // Path to .env file (relative to project root)
    const envPath = path.resolve(process.cwd(), '.env');
    
    if (fs.existsSync(envPath)) {
      console.log('Found .env file, loading environment variables');
      
      // Read .env file content
      const envContent = fs.readFileSync(envPath, 'utf8');
      
      // Parse .env file content
      const envVars = envContent.split('\n').reduce((acc, line) => {
        // Skip comments and empty lines
        if (line.startsWith('#') || !line.trim()) {
          return acc;
        }
        
        // Split by first equals sign (handle values with = in them)
        const equalSignIndex = line.indexOf('=');
        if (equalSignIndex > 0) {
          const key = line.slice(0, equalSignIndex).trim();
          const value = line.slice(equalSignIndex + 1).trim();
          
          // Remove quotes if present
          const cleanValue = value.replace(/^['"](.*)['"]$/, '$1');
          
          // Set environment variable if not already set
          if (!process.env[key]) {
            process.env[key] = cleanValue;
          }
          
          // Add to accumulated object
          acc[key] = cleanValue;
        }
        
        return acc;
      }, {});
      
      console.log(`Loaded ${Object.keys(envVars).length} environment variables from .env file`);
      return envVars;
    } else {
      console.warn('No .env file found, using existing environment variables');
      return {};
    }
  } catch (error) {
    console.error('Error loading .env file:', error.message);
    return {};
  }
}

// Get an environment variable with fallback
function getEnv(key, defaultValue = '') {
  return process.env[key] || defaultValue;
}

// Check if a required environment variable is set
function requireEnv(key, fallbackValue = null) {
  const value = process.env[key] || fallbackValue;
  
  if (!value && fallbackValue === null) {
    console.warn(`Required environment variable ${key} is not set!`);
  }
  
  return value;
}

// Get marketing-related environment variables
function getMarketingConfig() {
  return {
    mailchimp: {
      apiKey: getEnv('MAILCHIMP_API_KEY', 'demo-mailchimp-key'),
      serverPrefix: getEnv('MAILCHIMP_SERVER_PREFIX', 'us1'),
      listId: getEnv('MAILCHIMP_LIST_ID', 'demo-list-id')
    },
    hubspot: {
      apiKey: getEnv('HUBSPOT_API_KEY', 'demo-hubspot-key'),
      portalId: getEnv('HUBSPOT_PORTAL_ID', '1234567')
    },
    googleAnalytics: {
      trackingId: getEnv('GOOGLE_ANALYTICS_TRACKING_ID', 'UA-000000-01')
    }
  };
}

// Initialize environment
loadEnvFile();

module.exports = {
  getEnv,
  requireEnv,
  getMarketingConfig
}; 