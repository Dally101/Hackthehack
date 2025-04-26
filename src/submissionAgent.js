// Submission Agent for processing project submissions and providing feedback
const BaseAgent = require('./baseAgent');
const { agentTypes } = require('./agentConfig');

class SubmissionAgent extends BaseAgent {
  constructor() {
    super(agentTypes.SUBMISSION);
  }

  // Method to validate project submission completeness
  async validateSubmission(submission, requirements) {
    const instructions = `
      Validate the following hackathon project submission against the requirements:
      
      1. Check for completeness of all required components
      2. Verify that all submission formats match requirements
      3. Assess whether the submission content addresses the hackathon challenge
      4. Identify any missing or incomplete elements
      
      Return a JSON object with:
      - isValid: boolean indicating if the submission meets all requirements
      - completenessScore: numerical score (0-100) indicating overall completeness
      - missingElements: array of any missing required elements
      - improvementSuggestions: specific recommendations to improve the submission
    `;
    
    const result = await this.analyzeData({submission, requirements}, instructions);
    return result;
  }

  // Method to generate AI feedback on project submissions
  async generateSubmissionFeedback(submission, hackathonCriteria) {
    const prompt = `
      Provide detailed feedback on the following hackathon project submission:
      
      Project Submission: ${JSON.stringify(submission)}
      Evaluation Criteria: ${JSON.stringify(hackathonCriteria)}
      
      Generate comprehensive feedback that:
      1. Highlights the strengths of the project
      2. Identifies areas for improvement
      3. Provides specific, actionable suggestions
      4. Evaluates how well the project addresses the hackathon challenge
      5. Assesses technical implementation, innovation, and presentation
      
      The feedback should be constructive, specific, and helpful for the team to improve their project.
      Structure the feedback in clear sections with an overall assessment summary at the beginning.
    `;
    
    return this.generateResponse(prompt);
  }

  // Method to suggest improvements for project presentation
  async suggestPresentationImprovements(presentationMaterials) {
    const prompt = `
      Review the following hackathon project presentation materials and suggest improvements:
      
      Presentation Materials: ${JSON.stringify(presentationMaterials)}
      
      Provide specific recommendations to enhance:
      1. The clarity of the problem statement and solution explanation
      2. The demonstration of technical implementation
      3. The presentation of unique value proposition
      4. The visual design and organization of slides/materials
      5. The overall narrative and flow
      
      For each area, provide 2-3 specific, actionable suggestions that would strengthen the presentation.
      Focus on helping the team effectively communicate their project's value and technical merit to judges.
    `;
    
    return this.generateResponse(prompt);
  }

  // Method to prepare submission summary for judges
  async prepareJudgingSummary(submission) {
    const prompt = `
      Create a concise summary of the following hackathon project submission for judges:
      
      Project Submission: ${JSON.stringify(submission)}
      
      Generate a comprehensive yet concise summary that includes:
      1. Project name and team information
      2. Core problem being addressed
      3. Key features and technical implementation
      4. Unique aspects and innovations
      5. Potential impact and applications
      
      The summary should be objective, highlighting the most important aspects judges should focus on,
      without evaluative judgments. Format the summary in a structured way that makes it easy for judges
      to quickly understand the project's essence. Maximum length: 300 words.
    `;
    
    return this.generateResponse(prompt);
  }
}

module.exports = SubmissionAgent;
