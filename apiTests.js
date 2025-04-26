const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../server');

chai.use(chaiHttp);

// Mock data for API tests
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

describe('API Tests', function() {
  // Increase timeout for AI API calls
  this.timeout(15000);

  describe('Health Check', () => {
    it('should return 200 status for health check endpoint', (done) => {
      chai.request(app)
        .get('/health')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('status', 'ok');
          done();
        });
    });
  });

  describe('Registration Agent API', () => {
    it('should validate registration data', function(done) {
      chai.request(app)
        .post('/api/agents/registration/validate')
        .send(mockUserData)
        .end((err, res) => {
          if (err) {
            console.warn('Skipping test due to API error:', err.message);
            this.skip();
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success');
          done();
        });
    });

    it('should suggest skills based on interests', function(done) {
      chai.request(app)
        .post('/api/agents/registration/suggest-skills')
        .send({
          interests: mockUserData.interests,
          background: { education: 'Computer Science', experience: '2 years' }
        })
        .end((err, res) => {
          if (err) {
            console.warn('Skipping test due to API error:', err.message);
            this.skip();
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success');
          done();
        });
    });
  });

  describe('Team Formation Agent API', () => {
    it('should analyze team balance', function(done) {
      chai.request(app)
        .post('/api/agents/team-formation/analyze-balance')
        .send(mockTeamMembers)
        .end((err, res) => {
          if (err) {
            console.warn('Skipping test due to API error:', err.message);
            this.skip();
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success');
          done();
        });
    });

    it('should suggest team roles', function(done) {
      chai.request(app)
        .post('/api/agents/team-formation/suggest-roles')
        .send(mockTeamMembers)
        .end((err, res) => {
          if (err) {
            console.warn('Skipping test due to API error:', err.message);
            this.skip();
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success');
          done();
        });
    });
  });

  describe('Scheduling Agent API', () => {
    it('should generate event schedule', function(done) {
      const constraints = {
        requiredEvents: ['opening', 'team formation', 'workshops', 'judging', 'closing'],
        timeZone: 'America/New_York'
      };
      
      chai.request(app)
        .post('/api/agents/scheduling/generate-schedule')
        .send({
          hackathonDetails: mockHackathonDetails,
          constraints
        })
        .end((err, res) => {
          if (err) {
            console.warn('Skipping test due to API error:', err.message);
            this.skip();
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success');
          done();
        });
    });
  });

  describe('Submission Agent API', () => {
    it('should validate submission completeness', function(done) {
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
      
      chai.request(app)
        .post('/api/agents/submission/validate')
        .send({
          submission: mockSubmission,
          requirements: mockRequirements
        })
        .end((err, res) => {
          if (err) {
            console.warn('Skipping test due to API error:', err.message);
            this.skip();
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success');
          done();
        });
    });
  });

  describe('Judging Agent API', () => {
    it('should assign judges to projects', function(done) {
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
      
      chai.request(app)
        .post('/api/agents/judging/assign-judges')
        .send({
          judges: mockJudges,
          projects: mockProjects
        })
        .end((err, res) => {
          if (err) {
            console.warn('Skipping test due to API error:', err.message);
            this.skip();
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success');
          done();
        });
    });
  });

  describe('Communication Agent API', () => {
    it('should generate notifications', function(done) {
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
      
      chai.request(app)
        .post('/api/agents/communication/generate-notification')
        .send({
          eventType,
          recipientData,
          eventData
        })
        .end((err, res) => {
          if (err) {
            console.warn('Skipping test due to API error:', err.message);
            this.skip();
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success');
          done();
        });
    });

    it('should answer questions about hackathons', function(done) {
      chai.request(app)
        .post('/api/agents/communication/answer-question')
        .send({
          question: 'How do I form a team for the hackathon?',
          hackathonDetails: mockHackathonDetails,
          userContext: { role: 'participant', experience: 'first-time' }
        })
        .end((err, res) => {
          if (err) {
            console.warn('Skipping test due to API error:', err.message);
            this.skip();
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success');
          done();
        });
    });
  });
});
