import { azureConfig, hasValidCredentials } from '../config/agentConfig';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

interface ConversationContext {
  conversationHistory?: ChatMessage[];
  userContext?: Record<string, any>;
}

// Azure OpenAI API client
export class AzureOpenAIClient {
  private apiKey: string;
  private endpoint: string;
  private apiVersion: string;
  private deploymentName: string;

  constructor() {
    if (!hasValidCredentials) {
      throw new Error('Azure OpenAI credentials are not properly configured');
    }
    
    this.apiKey = azureConfig.apiKey || '';
    this.endpoint = azureConfig.endpoint || '';
    this.apiVersion = azureConfig.apiVersion || '';
    this.deploymentName = azureConfig.deploymentName || '';
  }

  private buildUrl(): string {
    return `${this.endpoint}/openai/deployments/${this.deploymentName}/chat/completions?api-version=${this.apiVersion}`;
  }

  private async makeRequest(messages: ChatMessage[], options: ChatCompletionOptions = {}) {
    const url = this.buildUrl();
    
    const requestBody = {
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 800,
      top_p: options.topP ?? 0.95,
      stream: false,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Azure OpenAI API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Azure OpenAI API:', error);
      throw error;
    }
  }

  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    context: ConversationContext = {},
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history if available
    if (context.conversationHistory && context.conversationHistory.length > 0) {
      messages.push(...context.conversationHistory);
    }

    // Add user context as a system message if available
    if (context.userContext && Object.keys(context.userContext).length > 0) {
      const contextStr = JSON.stringify(context.userContext);
      messages.push({
        role: 'system',
        content: `Additional context: ${contextStr}`,
      });
    }

    // Add the current user prompt
    messages.push({ role: 'user', content: userPrompt });

    return this.makeRequest(messages, options);
  }
}

// Create a singleton instance
export const azureOpenAIClient = hasValidCredentials ? new AzureOpenAIClient() : null;

export default azureOpenAIClient; 