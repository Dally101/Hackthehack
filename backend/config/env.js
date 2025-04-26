// Environment configuration for the application
// Uses environment variables with defaults for development
const { getEnv, requireEnv, getMarketingConfig } = require('../utils/envLoader');

module.exports = {
  // Server configuration
  PORT: getEnv('PORT', 5000),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  
  // Azure OpenAI configuration - these values will use mock agents when not set
  AZURE_OPENAI: {
    apiKey: getEnv('AZURE_OPENAI_API_KEY', 'sk-test-key'),
    endpoint: getEnv('AZURE_OPENAI_ENDPOINT', 'https://example.openai.azure.com/'),
    deploymentName: getEnv('AZURE_OPENAI_DEPLOYMENT_NAME', 'gpt-4')
  },
  
  // Marketing configurations from .env
  MARKETING: getMarketingConfig(),
  
  // MongoDB configuration
  MONGODB_URI: getEnv('MONGODB_URI', 'mongodb://localhost:27017/hackathon-management'),
  USE_MONGODB: getEnv('USE_MONGODB') === 'true',
  
  // JWT configuration for authentication
  JWT_SECRET: requireEnv('JWT_SECRET', 'development-secret-key-change-in-production'),
  JWT_EXPIRY: getEnv('JWT_EXPIRY', '24h'),
  
  // CORS configuration
  CORS_ORIGIN: getEnv('CORS_ORIGIN', 'http://localhost:3001'),
  
  // Feature flags
  FEATURES: {
    USE_MOCK_AGENTS: getEnv('USE_MOCK_AGENTS', 'true') === 'true',
    ENABLE_LOGGING: getEnv('ENABLE_LOGGING', 'true') === 'true'
  }
}; 