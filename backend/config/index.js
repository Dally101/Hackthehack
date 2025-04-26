const env = require('./env');
const agentConfig = require('./agentConfig');

// Setup agent system
function setupAgentSystem() {
  console.log('Agent system setup initialized');
  // This would normally initialize the agent system
  // but for testing purposes, we'll just log a message
  return true;
}

module.exports = {
  env,
  agentConfig,
  setupAgentSystem
}; 