// Agent factory module for creating agent instances
const { agentTypes } = require('../config/agentConfig');
const BaseAgent = require('./baseAgent');
const MockAgent = require('./mockAgent');

// Always use mock agents for demonstration purposes
const useMockAgents = true;

console.log(`Using ${useMockAgents ? 'MOCK' : 'REAL'} agents for AI functionality`);

// Factory function to create an agent instance by type
function createAgent(agentTypeName) {
  try {
    // Find the agent type config
    const agentTypeConfig = Object.values(agentTypes).find(type => type.name === agentTypeName);
    
    if (!agentTypeConfig) {
      console.error(`Unknown agent type: ${agentTypeName}`);
      // Fallback to communication agent if type not found
      return new MockAgent(agentTypes.COMMUNICATION);
    }
    
    // Always use mock agents for demo purposes
    return new MockAgent(agentTypeConfig);
  } catch (error) {
    console.error(`Error creating agent ${agentTypeName}:`, error);
    // Return a communication agent as fallback
    return new MockAgent(agentTypes.COMMUNICATION);
  }
}

module.exports = {
  createAgent,
  agentTypes
}; 