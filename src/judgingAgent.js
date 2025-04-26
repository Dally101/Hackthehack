// Judging Agent for facilitating fair and efficient evaluation of projects
const BaseAgent = require('./baseAgent');
const { agentTypes } = require('./agentConfig');

class JudgingAgent extends BaseAgent {
  constructor() {
    super(agentTypes.JUDGING);
  }

  // Method to assign judges to projects based on expertise and preferences
  async assignJudgesToProjects(judges, projects) {
    const prompt = `
      Create an optimal judge assignment plan for the following hackathon:
      
      Judges: ${JSON.stringify(judges)}
      Projects: ${JSON.stringify(projects)}
      
      Generate a fair and balanced assignment plan that:
      1. Matches judges with projects aligned to their expertise
      2. Ensures each project receives evaluation from 3-5 judges
      3. Balances the judging workload across all judges
      4. Avoids potential conflicts of interest
      5. Considers judge preferences where possible
      
      Return a JSON object with:
      - assignments: array of {judgeId, projectIds} mappings
      - rationale: explanation for key assignment decisions
      - conflictResolutions: how any conflicts of interest were handled
    `;
    
    return this.generateResponse(prompt);
  }

  // Method to analyze and normalize judging scores
  async normalizeJudgingScores(scores, criteria) {
    const instructions = `
      Analyze and normalize the following judging scores for a hackathon:
      
      1. Identify any scoring inconsistencies or biases across judges
      2. Apply appropriate statistical normalization to ensure fair comparison
      3. Calculate normalized scores for each project across all criteria
      4. Generate a fair ranking based on normalized scores
      
      Consider:
      - Different judges may use different parts of the scoring range
      - Some criteria may have higher variance than others
      - Outlier scores should be identified and addressed appropriately
      
      Return a comprehensive analysis with:
      - normalizedScores: adjusted scores for each project
      - rankings: ordered list of projects based on normalized scores
      - confidenceMetrics: statistical confidence in the results
      - anomalyReport: any identified scoring anomalies
    `;
    
    return this.analyzeData({scores, criteria}, instructions);
  }

  // Method to generate detailed feedback for teams based on judge evaluations
  async generateTeamFeedback(projectId, judgingResults) {
    const prompt = `
      Create comprehensive feedback for a hackathon team based on judge evaluations:
      
      Project ID: ${projectId}
      Judging Results: ${JSON.stringify(judgingResults)}
      
      Synthesize the judges' comments and scores to provide:
      1. A summary of overall performance across all criteria
      2. Specific strengths highlighted by multiple judges
      3. Common areas for improvement
      4. Constructive suggestions for enhancing the project
      5. Comparative performance relative to other projects (if available)
      
      The feedback should be:
      - Constructive and encouraging
      - Specific and actionable
      - Balanced between positive aspects and improvement areas
      - Focused on helping the team grow and improve
      
      Format the feedback in clear sections with highlighted key points.
    `;
    
    return this.generateResponse(prompt);
  }

  // Method to identify potential award winners based on judging results
  async identifyAwardCandidates(judgingResults, awardCategories) {
    const prompt = `
      Based on the following judging results, identify the best candidates for each award category:
      
      Judging Results: ${JSON.stringify(judgingResults)}
      Award Categories: ${JSON.stringify(awardCategories)}
      
      For each award category:
      1. Identify the top 3 projects that best exemplify the award criteria
      2. Provide justification based on specific judging feedback and scores
      3. Highlight distinguishing factors for each candidate
      4. Recommend a winner with clear rationale
      
      Consider both quantitative scores and qualitative feedback in your analysis.
      Return a structured JSON response with recommendations for each award category,
      including runner-up candidates and specific supporting evidence from the judging data.
    `;
    
    return this.generateResponse(prompt);
  }
}

module.exports = JudgingAgent;
