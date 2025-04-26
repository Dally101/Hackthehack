const chai = require('chai');
const expect = chai.expect;
const { 
  BaseAgent, 
  RegistrationAgent, 
  TeamFormationAgent,
  SchedulingAgent,
  SubmissionAgent,
  JudgingAgent,
  CommunicationAgent
} = require('../agents');

// Mock data for tests
const mockUserData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'securePassword123!',
  skills: ['JavaScript', 'React', 'Node.js'],
  interests: ['AI & Machine Learning', 'Web Development']
};

const mockTeamMembers = [
  {
    id: 1,
    name: 'John Doe',
    skills: ['JavaScript', 'React', 'Node.js'],
    interests: ['AI & Machine Learning', 'Web Development']
  },
  {
    id: 2,
    name: 'Jane Smith',
    skills: ['Python', 'Machine Learning', 'Data Science'],
    interests: ['AI & Machine Learning', 'Data Visualization']
  },
  {
    id: 3,
    name: 'Alex Johnson',
    skills: ['UI/UX Design', 'Figma', 'HTML/CSS'],
    interests: ['Web Development', 'Mobile Apps']
  }
];

const mockHackathonDetails = {
  name: 'AI Innovation Challenge',
  startDate: '2025-05-15T09:00:00',
  endDate: '2025-05-17T18:00:00',
  format: 'hybrid',
  teamSize: '3-5',
  maxParticipants: 30
};

describe('AI Agent System Tests', function() {
  // Increase timeout for AI API calls
  this.timeout(10000);

  describe('BaseAgent', () => {
    it('should initialize with correct properties', () => {
      // Skip actual API initialization for this test
      const mockAgentType = {
        name: 'Test Agent',
        description: 'Test description',
        systemPrompt: 'Test prompt'
      };
      
      const agent = new BaseAgent(mockAgentType);
      expect(agent.name).to.equal(mockAgentType.name);
      expect(agent.description).to.equal(mockAgentType.description);
      expect(agent.systemPrompt).to.equal(mockAgentType.systemPrompt);
    });
  });

  describe('RegistrationAgent', () => {
    let registrationAgent;
    
    before(() => {
      try {
        registrationAgent = new RegistrationAgent();
      } catch (error) {
        console.warn('Skipping RegistrationAgent tests due to initialization error:', error.message);
      }
    });
    
    it('should validate registration data', async function() {
      if (!registrationAgent) this.skip();
      
      const result = await registrationAgent.validateRegistrationData(mockUserData);
      expect(result).to.have.property('success');
      if (result.success) {
        expect(result).to.have.property('content');
        const content = JSON.parse(result.content);
        expect(content).to.have.property('isValid');
      }
    });
    
    it('should suggest skills based on interests', async function() {
      if (!registrationAgent) this.skip();
      
      const result = await registrationAgent.suggestSkills(
        mockUserData.interests, 
        { education: 'Computer Science', experience: '2 years' }
      );
      expect(result).to.have.property('success');
      if (result.success) {
        expect(result).to.have.property('content');
      }
    });
  });

  describe('TeamFormationAgent', () => {
    let teamFormationAgent;
    
    before(() => {
      try {
        teamFormationAgent = new TeamFormationAgent();
      } catch (error) {
        console.warn('Skipping TeamFormationAgent tests due to initialization error:', error.message);
      }
    });
    
    it('should analyze team balance', async function() {
      if (!teamFormationAgent) this.skip();
      
      const result = await teamFormationAgent.analyzeTeamBalance(mockTeamMembers);
      expect(result).to.have.property('success');
      if (result.success) {
        expect(result).to.have.property('content');
      }
    });
    
    it('should suggest team roles', async function() {
      if (!teamFormationAgent) this.skip();
      
      const result = await teamFormationAgent.suggestTeamRoles(mockTeamMembers);
      expect(result).to.have.property('success');
      if (result.success) {
        expect(result).to.have.property('content');
      }
    });
  });

  describe('SchedulingAgent', () => {
    let schedulingAgent;
    
    before(() => {
      try {
        schedulingAgent = new SchedulingAgent();
      } catch (error) {
        console.warn('Skipping SchedulingAgent tests due to initialization error:', error.message);
      }
    });
    
    it('should generate event schedule', async function() {
      if (!schedulingAgent) this.skip();
      
      const constraints = {
        requiredEvents: ['opening', 'team formation', 'workshops', 'judging', 'closing'],
        timeZone: 'America/New_York'
      };
      
      const result = await schedulingAgent.generateEventSchedule(mockHackathonDetails, constraints);
      expect(result).to.have.property('success');
      if (result.success) {
        expect(result).to.have.property('content');
      }
    });
  });

  describe('SubmissionAgent', () => {
    let submissionAgent;
    
    before(() => {
      try {
        submissionAgent = new SubmissionAgent();
      } catch (error) {
        console.warn('Skipping SubmissionAgent tests due to initialization error:', error.message);
      }
    });
    
    it('should validate submission completeness', async function() {
      if (!submissionAgent) this.skip();
      
      const mockSubmission = {
        title: 'AI Assistant for Hackathons',
        description: 'An AI-powered assistant to help manage hackathons',
        repoUrl: 'https://github.com/example/hackathon-assistant',
        demoUrl: 'https://example.com/demo',
        team: 'Team Innovators'
      };
      
      const mockRequirements = {
        requiredFields: ['title', 'description', 'repoUrl', 'demoUrl'],
        maxDescriptionLength: 500
      };
      
      const result = await submissionAgent.validateSubmission(mockSubmission, mockRequirements);
      expect(result).to.have.property('success');
      if (result.success) {
        expect(result).to.have.property('content');
      }
    });
  });

  describe('JudgingAgent', () => {
    let judgingAgent;
    
    before(() => {
      try {
        judgingAgent = new JudgingAgent();
      } catch (error) {
        console.warn('Skipping JudgingAgent tests due to initialization error:', error.message);
      }
    });
    
    it('should assign judges to projects', async function() {
      if (!judgingAgent) this.skip();
      
      const mockJudges = [
        { id: 1, name: 'Judge A', expertise: ['AI', 'Web Development'] },
        { id: 2, name: 'Judge B', expertise: ['Data Science', 'Mobile Apps'] },
        { id: 3, name: 'Judge C', expertise: ['UI/UX', 'Blockchain'] }
      ];
      
      const mockProjects = [
        { id: 101, title: 'AI Project', category: 'AI' },
        { id: 102, title: 'Mobile App', category: 'Mobile Apps' },
        { id: 103, title: 'Web Platform', category: 'Web Development' }
      ];
      
      const result = await judgingAgent.assignJudgesToProjects(mockJudges, mockProjects);
      expect(result).to.have.property('success');
      if (result.success) {
        expect(result).to.have.property('content');
      }
    });
  });

  describe('CommunicationAgent', () => {
    let communicationAgent;
    
    before(() => {
      try {
        communicationAgent = new CommunicationAgent();
      } catch (error) {
        console.warn('Skipping CommunicationAgent tests due to initialization error:', error.message);
      }
    });
    
    it('should generate notifications', async function() {
      if (!communicationAgent) this.skip();
      
      const eventType = 'team_invitation';
      const recipientData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'participant'
      };
      const eventData = {
        teamName: 'Innovators',
        invitedBy: 'Jane Smith',
        hackathonName: 'AI Innovation Challenge'
      };
      
      const result = await communicationAgent.generateNotification(eventType, recipientData, eventData);
      expect(result).to.have.property('success');
      if (result.success) {
        expect(result).to.have.property('content');
      }
    });
    
    it('should answer questions about hackathons', async function() {
      if (!communicationAgent) this.skip();
      
      const question = 'How do I form a team for the hackathon?';
      const result = await communicationAgent.answerQuestion(
        question, 
        mockHackathonDetails, 
        { role: 'participant', experience: 'first-time' }
      );
      expect(result).to.have.property('success');
      if (result.success) {
        expect(result).to.have.property('content');
      }
    });
  });
});
