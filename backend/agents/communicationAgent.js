// Communication Agent for managing notifications, updates, and stakeholder communication
const BaseAgent = require('./baseAgent');
const { agentTypes } = require('../config/agentConfig');

class CommunicationAgent extends BaseAgent {
  constructor() {
    super(agentTypes.COMMUNICATION);
  }

  // Method to generate personalized notifications for different stakeholders
  async generateNotification(eventType, recipientData, eventData) {
    const prompt = `
      Create a personalized notification for the following situation:
      
      Event Type: ${eventType}
      Recipient: ${JSON.stringify(recipientData)}
      Event Details: ${JSON.stringify(eventData)}
      
      Generate a notification that:
      1. Is personalized to the recipient's role (participant, organizer, sponsor, mentor)
      2. Clearly communicates the essential information about the event
      3. Includes any necessary action items or next steps
      4. Is concise and easy to understand
      5. Uses an appropriate tone for the event type
      
      Return a JSON object with:
      - subject: A clear, concise subject line
      - message: The body of the notification
      - priority: Suggested priority level (high, medium, low)
      - suggestedDeliveryChannel: Recommended channel (email, push, in-app, SMS)
    `;
    
    return this.generateResponse(prompt);
  }

  // Method to generate event updates and announcements
  async createEventAnnouncement(eventUpdate, audienceType) {
    const prompt = `
      Create an announcement for the following hackathon event update:
      
      Event Update: ${JSON.stringify(eventUpdate)}
      Audience Type: ${audienceType} (participants, sponsors, mentors, judges, or all)
      
      Generate an announcement that:
      1. Clearly communicates the update or new information
      2. Is tailored to the specific audience's interests and needs
      3. Maintains an appropriate tone (informative, exciting, urgent, etc.)
      4. Includes all necessary details without overwhelming
      5. Ends with clear next steps or calls to action if applicable
      
      The announcement should be professional yet engaging, and formatted for easy readability.
    `;
    
    return this.generateResponse(prompt);
  }

  // Method to answer common questions about the hackathon
  async answerQuestion(question, hackathonDetails, userContext) {
    const prompt = `
      Answer the following question about a hackathon:
      
      Question: "${question}"
      Hackathon Details: ${JSON.stringify(hackathonDetails)}
      User Context: ${JSON.stringify(userContext)}
      
      Provide a response that:
      1. Directly answers the question with accurate information
      2. Is personalized to the user's role and context
      3. Provides additional helpful context where appropriate
      4. Is concise and easy to understand
      5. Includes links or references to relevant resources if applicable
      
      If the question cannot be fully answered with the available information, acknowledge this
      and provide the best possible guidance with what is known.
    `;
    
    return this.generateResponse(prompt);
  }

  // Method to generate comprehensive event summary reports
  async generateEventSummary(eventData, audienceType) {
    const prompt = `
      Create a comprehensive summary of the following hackathon event:
      
      Event Data: ${JSON.stringify(eventData)}
      Audience Type: ${audienceType} (participants, sponsors, organizers)
      
      Generate a summary that includes:
      1. Key statistics and metrics (participation, submissions, etc.)
      2. Highlights and notable achievements
      3. Challenges or issues encountered
      4. Feedback and testimonials
      5. Next steps or follow-up information
      
      Tailor the content to the specific audience type, focusing on aspects most relevant to them.
      Format the summary in a clear, structured way with appropriate sections and highlights.
      For sponsors, emphasize ROI and impact metrics. For participants, focus on outcomes and learning.
      For organizers, include more detailed operational insights.
    `;
    
    return this.generateResponse(prompt);
  }
}

module.exports = CommunicationAgent; 