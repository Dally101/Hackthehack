// Base Agent class for Azure OpenAI integration
const { OpenAIClient } = require('@azure/openai');
const { createAzureCredential, azureConfig } = require('./agentConfig');

class BaseAgent {
  constructor(agentType) {
    this.type = agentType;
    this.name = agentType.name;
    this.description = agentType.description;
    this.systemPrompt = agentType.systemPrompt;
    this.client = null;
    this.initialize();
  }

  // Initialize the Azure OpenAI client
  initialize() {
    try {
      const credential = createAzureCredential();
      this.client = new OpenAIClient(azureConfig.endpoint, credential);
      console.log(`${this.name} initialized successfully`);
    } catch (error) {
      console.error(`Error initializing ${this.name}:`, error);
      throw error;
    }
  }

  // Method to generate responses using Azure OpenAI
  async generateResponse(userPrompt, options = {}) {
    if (!this.client) {
      throw new Error(`${this.name} is not properly initialized`);
    }

    try {
      const messages = [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      // Add conversation history if provided
      if (options.conversationHistory && Array.isArray(options.conversationHistory)) {
        messages.splice(1, 0, ...options.conversationHistory);
      }

      const deploymentName = options.deploymentName || azureConfig.deploymentName;
      const temperature = options.temperature || 0.7;
      const maxTokens = options.maxTokens || 800;

      const response = await this.client.getChatCompletions(
        deploymentName,
        messages,
        {
          temperature,
          maxTokens,
          topP: options.topP || 0.95,
          frequencyPenalty: options.frequencyPenalty || 0,
          presencePenalty: options.presencePenalty || 0
        }
      );

      if (response.choices && response.choices.length > 0) {
        return {
          content: response.choices[0].message.content,
          usage: response.usage,
          success: true
        };
      } else {
        throw new Error('No response generated');
      }
    } catch (error) {
      console.error(`Error generating response from ${this.name}:`, error);
      return {
        content: null,
        error: error.message,
        success: false
      };
    }
  }

  // Method to analyze data with specific instructions
  async analyzeData(data, instructions, options = {}) {
    const prompt = `
      Please analyze the following data according to these instructions:
      
      Instructions: ${instructions}
      
      Data: ${JSON.stringify(data)}
      
      Provide your analysis in a structured format.
    `;
    
    return this.generateResponse(prompt, options);
  }

  // Method to provide recommendations based on user data
  async provideRecommendations(userData, context, options = {}) {
    const prompt = `
      Based on the following user data and context, provide personalized recommendations:
      
      User Data: ${JSON.stringify(userData)}
      
      Context: ${context}
      
      Provide specific, actionable recommendations that would be most helpful in this situation.
    `;
    
    return this.generateResponse(prompt, options);
  }
}

module.exports = BaseAgent;
