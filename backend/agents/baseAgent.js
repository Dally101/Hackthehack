/**
 * Base Agent class that provides common functionality for all agent types
 */
class BaseAgent {
  constructor(agentConfig) {
    this.name = agentConfig.name;
    this.description = agentConfig.description;
    this.systemPrompt = agentConfig.systemPrompt;
    console.log(`Initializing ${this.name}`);
  }

  /**
   * Generate a response to a user prompt
   * This method should be implemented by all agent types
   * @param {string} prompt - The user's prompt or question
   * @param {object} context - Additional context for the conversation
   * @returns {Promise<object>} - The generated response
   */
  async generateResponse(prompt, context = {}) {
    throw new Error('Method generateResponse() must be implemented by derived classes');
  }

  /**
   * Validate agent input before processing
   * @param {string} input - The input to validate
   * @returns {boolean} - Whether the input is valid
   */
  validateInput(input) {
    if (!input || typeof input !== 'string' || input.trim() === '') {
      return false;
    }
    return true;
  }

  /**
   * Process conversation history to provide context for the agent
   * @param {Array} history - Array of conversation messages
   * @returns {string} - Formatted conversation history
   */
  formatConversationHistory(history = []) {
    if (!Array.isArray(history) || history.length === 0) {
      return '';
    }

    return history
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');
  }

  /**
   * Extract key information from a prompt
   * @param {string} prompt - The user's prompt
   * @returns {object} - Extracted entities and intent
   */
  extractKeyInfo(prompt) {
    // Basic intent detection (in a real implementation, this would be more sophisticated)
    const lowercasePrompt = prompt.toLowerCase();
    
    const intents = {
      question: lowercasePrompt.includes('?') || 
                lowercasePrompt.includes('how') || 
                lowercasePrompt.includes('what') || 
                lowercasePrompt.includes('why'),
      request: lowercasePrompt.includes('please') || 
               lowercasePrompt.includes('could you') || 
               lowercasePrompt.includes('can you'),
      greeting: lowercasePrompt.includes('hello') || 
                lowercasePrompt.includes('hi') || 
                lowercasePrompt.includes('hey'),
      farewell: lowercasePrompt.includes('bye') || 
                lowercasePrompt.includes('goodbye') || 
                lowercasePrompt.includes('see you')
    };
    
    return {
      intent: Object.entries(intents).find(([_, value]) => value)?.[0] || 'other',
      length: prompt.length,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create a standardized response object
   * @param {string} content - The response content
   * @param {object} metadata - Additional metadata
   * @returns {object} - Standardized response
   */
  createResponse(content, metadata = {}) {
    return {
      content,
      metadata: {
        agent: this.name,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };
  }
}

module.exports = BaseAgent; 