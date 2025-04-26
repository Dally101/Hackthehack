import { agentTypes, hasValidCredentials } from '../config/agentConfig';
import { azureOpenAIClient } from './azureOpenAIService';

// Interfaces
export interface AgentResponse {
  content: string;
  agent: string;
}

export interface ConversationHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface AgentContext {
  conversationHistory?: ConversationHistoryItem[];
  userContext?: Record<string, any>;
}

// Agent service implementation
class AgentService {
  private mockDelayMs: number = 1000;
  private apiBaseUrl: string = '/api';

  // Get a response from the specified agent
  async getAgentResponse(
    agentType: string,
    prompt: string, 
    context: AgentContext = {}
  ): Promise<AgentResponse> {
    try {
      // Find the agent configuration
      const agent = Object.values(agentTypes).find(a => a.name === agentType);
      
      if (!agent) {
        throw new Error(`Unknown agent type: ${agentType}`);
      }
      
      try {
        // Try to call the backend API first
        const response = await this.callBackendAPI(agentType, prompt, context);
        return response;
      } catch (apiError) {
        console.warn('Backend API call failed, falling back to local implementation:', apiError);
        
        // If backend fails or is not available, use local implementation
        // If we have valid credentials and client, use Azure OpenAI
        if (hasValidCredentials && azureOpenAIClient) {
          // Convert conversation history format if it exists
          const formattedHistory = context.conversationHistory?.map(msg => ({
            role: msg.role,
            content: msg.content
          }));
          
          // Call the OpenAI API
          const content = await azureOpenAIClient.generateCompletion(
            agent.systemPrompt,
            prompt,
            {
              conversationHistory: formattedHistory,
              userContext: context.userContext
            }
          );
          
          return { 
            content,
            agent: agentType
          };
        } else {
          // Fallback to mock responses
          return this.getMockResponse(agentType, prompt);
        }
      }
    } catch (error) {
      console.error(`Error in agent service (${agentType}):`, error);
      throw error;
    }
  }
  
  // Call the backend API for agent responses
  private async callBackendAPI(agentType: string, prompt: string, context: AgentContext): Promise<AgentResponse> {
    const url = `${this.apiBaseUrl}/agent/${agentType}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        context
      })
    });
    
    if (!response.ok) {
      throw new Error(`Backend API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.response) {
      throw new Error('Invalid response format from backend API');
    }
    
    return {
      content: data.response,
      agent: agentType
    };
  }
  
  // Fallback mock response generator
  private async getMockResponse(agentType: string, prompt: string): Promise<AgentResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.mockDelayMs));
    
    let response = '';
    
    switch(agentType) {
      case 'Registration Agent':
        response = "I'm the Registration Agent. To register for a hackathon, go to the Hackathons page, select the event you're interested in, and click the Register button. You'll need to create an account first if you haven't already. Let me know if you need help with any specific part of the registration process!";
        break;
        
      case 'Team Formation Agent':
        response = "I'm the Team Formation Agent. Based on your skills and interests, I can suggest potential teammates for you. The ideal hackathon team has a mix of skills including frontend development, backend development, UI/UX design, and project management. You can also create your own team and invite others to join. Would you like me to suggest some potential teammates based on your profile?";
        break;
        
      case 'Scheduling Agent':
        response = "I'm the Scheduling Agent. The AI Innovation Challenge hackathon starts on May 15, 2025 and ends on May 17, 2025. Registration closes 48 hours before the event begins. Project submissions are due by 11:59 PM on the final day. Is there any specific schedule information you need?";
        break;
        
      case 'Submission Agent':
        response = "I'm the Submission Agent. For project submissions, you'll need to provide a project title, description, GitHub repository link, demo video or link, and presentation slides. Make sure to highlight the problem your project solves and the technologies used. The submission form will be available 24 hours before the deadline.";
        break;
        
      case 'Judging Agent':
        response = "I'm the Judging Agent. Projects will be judged based on innovation (30%), technical complexity (25%), user experience (25%), and presentation quality (20%). Each team will have 5 minutes to present their project followed by a 2-minute Q&A with the judges. Make sure to practice your presentation before the final day!";
        break;
        
      case 'Communication Agent':
      default:
        // Check prompt for common questions
        if (prompt.toLowerCase().includes('how to')) {
          response = "To get started, I recommend exploring the hackathon listings and choosing an event that matches your interests. Once registered, you can join or create a team, start planning your project, and prepare for the event. Our platform provides tools for team collaboration, project submission, and communication throughout the hackathon.";
        } else if (prompt.toLowerCase().includes('prize') || prompt.toLowerCase().includes('win')) {
          response = "Prizes vary by hackathon, but typically include cash rewards, product licenses, mentorship opportunities, and sometimes job interviews with sponsoring companies. Check the specific hackathon details page for prize information.";
        } else {
          response = "I'm here to help with any questions you have about the hackathon platform. You can ask about registration, team formation, scheduling, submissions, or judging. If you need specialized assistance, you can select a different agent above.";
        }
    }
    
    return { 
      content: response,
      agent: agentType
    };
  }
}

// Export a singleton instance
export const agentService = new AgentService();

export default agentService; 