// Registration Agent for handling participant registration and profile management
const BaseAgent = require('./baseAgent');
const { agentTypes } = require('./agentConfig');

class RegistrationAgent extends BaseAgent {
  constructor() {
    super(agentTypes.REGISTRATION);
  }

  // Method to validate user registration data
  async validateRegistrationData(userData) {
    const instructions = `
      Validate the following user registration data. Check for:
      1. Completeness of required fields (firstName, lastName, email, password)
      2. Email format validity
      3. Password strength (min 8 characters, mix of letters, numbers, special chars)
      4. Appropriate skill selections (if provided)
      
      Return a JSON object with:
      - isValid: boolean indicating if the data is valid
      - errors: array of specific error messages if invalid
      - suggestions: any suggestions for improving the profile
    `;
    
    const result = await this.analyzeData(userData, instructions);
    return result;
  }

  // Method to suggest skills based on user interests and background
  async suggestSkills(userInterests, userBackground) {
    const prompt = `
      Based on the following user interests and background, suggest relevant skills that would be valuable for hackathon participation:
      
      User Interests: ${JSON.stringify(userInterests)}
      User Background: ${JSON.stringify(userBackground)}
      
      Provide a list of 5-10 specific technical and non-technical skills that would complement this user's profile.
      Return the response as a JSON array of skill objects with 'name' and 'relevance' (high, medium, low) properties.
    `;
    
    return this.generateResponse(prompt);
  }

  // Method to generate personalized welcome message
  async generateWelcomeMessage(userData) {
    const prompt = `
      Create a personalized welcome message for a new hackathon platform user with the following profile:
      
      User Data: ${JSON.stringify(userData)}
      
      The message should:
      1. Welcome them by name
      2. Acknowledge their background/interests
      3. Provide 2-3 specific next steps based on their profile
      4. Be friendly and encouraging
      5. Be concise (max 150 words)
    `;
    
    return this.generateResponse(prompt);
  }

  // Method to provide profile completion recommendations
  async getProfileCompletionRecommendations(profile) {
    const prompt = `
      Analyze the following user profile for a hackathon platform and provide recommendations for completion:
      
      Profile: ${JSON.stringify(profile)}
      
      Identify:
      1. Missing information that would be valuable
      2. Areas that could be expanded with more detail
      3. Skills or interests that might be underrepresented
      
      Provide specific, actionable recommendations to help the user create a more complete profile that will
      enhance their hackathon experience and team matching potential.
    `;
    
    return this.generateResponse(prompt);
  }
}

module.exports = RegistrationAgent;
