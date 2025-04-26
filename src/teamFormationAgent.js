// Team Formation Agent for matching participants and forming balanced teams
const BaseAgent = require('./baseAgent');
const { agentTypes } = require('./agentConfig');

class TeamFormationAgent extends BaseAgent {
  constructor() {
    super(agentTypes.TEAM_FORMATION);
  }

  // Method to suggest potential team members based on user skills and interests
  async suggestTeamMembers(userData, availableParticipants) {
    const prompt = `
      Based on the following user profile and available participants, suggest optimal team members:
      
      User Profile: ${JSON.stringify(userData)}
      Available Participants: ${JSON.stringify(availableParticipants)}
      
      Analyze the user's skills and interests, then identify 3-5 participants who would form a complementary team.
      For each suggested team member, explain why they would be a good fit, highlighting complementary skills
      and shared interests. Return the response as a JSON array of participant objects with 'id', 'name', 
      'matchScore' (0-100), and 'reasonForMatch' properties.
    `;
    
    return this.generateResponse(prompt);
  }

  // Method to analyze team composition and provide balance assessment
  async analyzeTeamBalance(teamMembers) {
    const instructions = `
      Analyze the following team composition for a hackathon:
      
      1. Evaluate the overall skill coverage across technical domains (frontend, backend, data, design, etc.)
      2. Identify any skill gaps or redundancies
      3. Assess the diversity of experience levels
      4. Evaluate the complementarity of member interests
      
      Provide a comprehensive analysis with:
      - Overall team balance score (0-100)
      - Strengths of the current composition
      - Areas that need improvement
      - Specific recommendations for additional skills that would benefit the team
    `;
    
    return this.analyzeData(teamMembers, instructions);
  }

  // Method to generate team formation recommendations for a hackathon
  async generateTeamFormationPlan(participants, hackathonDetails) {
    const prompt = `
      Create an optimal team formation plan for the following hackathon:
      
      Hackathon Details: ${JSON.stringify(hackathonDetails)}
      Participants: ${JSON.stringify(participants)}
      
      Based on participant skills, interests, and experience levels, create a plan that:
      1. Groups participants into balanced teams (${hackathonDetails.teamSize || '3-5'} members per team)
      2. Ensures each team has a diverse skill set covering necessary technical domains
      3. Considers participant preferences and interests
      4. Maximizes the potential for successful collaboration
      
      Return a JSON object with an array of proposed teams, each containing member IDs, a team skill assessment,
      and a confidence score for the team's potential success.
    `;
    
    return this.generateResponse(prompt);
  }

  // Method to provide team role suggestions
  async suggestTeamRoles(teamMembers) {
    const prompt = `
      Based on the following team member profiles, suggest optimal roles for each member:
      
      Team Members: ${JSON.stringify(teamMembers)}
      
      For each team member, recommend:
      1. Primary role based on their strongest skills
      2. Secondary roles they could support
      3. Specific responsibilities they could take on
      
      Consider both technical roles (frontend developer, data scientist, etc.) and project roles
      (team lead, project manager, UX researcher, etc.). Provide justification for each recommendation.
      
      Return a JSON object with recommendations for each team member, indexed by member ID.
    `;
    
    return this.generateResponse(prompt);
  }
}

module.exports = TeamFormationAgent;
