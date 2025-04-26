const express = require('express');
const router = express.Router();
const { createAgent, agentTypes } = require('../agents');

// Initialize agents
let registrationAgent;
let teamFormationAgent;
let schedulingAgent;
let submissionAgent;
let judgingAgent;
let communicationAgent;

try {
  registrationAgent = createAgent(agentTypes.REGISTRATION.name);
  teamFormationAgent = createAgent(agentTypes.TEAM_FORMATION.name);
  schedulingAgent = createAgent(agentTypes.SCHEDULING.name);
  submissionAgent = createAgent(agentTypes.SUBMISSION.name);
  judgingAgent = createAgent(agentTypes.JUDGING.name);
  communicationAgent = createAgent(agentTypes.COMMUNICATION.name);
  console.log('All agents initialized successfully');
} catch (error) {
  console.error('Error initializing agents:', error);
}

// Registration Agent Routes
router.post('/registration/validate', async (req, res) => {
  try {
    const result = await registrationAgent.validateRegistrationData(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/registration/suggest-skills', async (req, res) => {
  try {
    const { interests, background } = req.body;
    const result = await registrationAgent.suggestSkills(interests, background);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/registration/welcome-message', async (req, res) => {
  try {
    const result = await registrationAgent.generateWelcomeMessage(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/registration/profile-recommendations', async (req, res) => {
  try {
    const result = await registrationAgent.getProfileCompletionRecommendations(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Team Formation Agent Routes
router.post('/team-formation/suggest-members', async (req, res) => {
  try {
    const { userData, availableParticipants } = req.body;
    const result = await teamFormationAgent.suggestTeamMembers(userData, availableParticipants);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/team-formation/analyze-balance', async (req, res) => {
  try {
    const result = await teamFormationAgent.analyzeTeamBalance(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/team-formation/generate-plan', async (req, res) => {
  try {
    const { participants, hackathonDetails } = req.body;
    const result = await teamFormationAgent.generateTeamFormationPlan(participants, hackathonDetails);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/team-formation/suggest-roles', async (req, res) => {
  try {
    const result = await teamFormationAgent.suggestTeamRoles(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Scheduling Agent Routes
router.post('/scheduling/generate-schedule', async (req, res) => {
  try {
    const { hackathonDetails, constraints } = req.body;
    const result = await schedulingAgent.generateEventSchedule(hackathonDetails, constraints);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/scheduling/optimize-availability', async (req, res) => {
  try {
    const { baseSchedule, participantAvailability } = req.body;
    const result = await schedulingAgent.optimizeScheduleForAvailability(baseSchedule, participantAvailability);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/scheduling/generate-reminders', async (req, res) => {
  try {
    const { events, userProfile } = req.body;
    const result = await schedulingAgent.generateScheduleReminders(events, userProfile);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/scheduling/resolve-conflicts', async (req, res) => {
  try {
    const { schedule, conflicts } = req.body;
    const result = await schedulingAgent.resolveScheduleConflicts(schedule, conflicts);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submission Agent Routes
router.post('/submission/validate', async (req, res) => {
  try {
    const { submission, requirements } = req.body;
    const result = await submissionAgent.validateSubmission(submission, requirements);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/submission/feedback', async (req, res) => {
  try {
    const { submission, hackathonCriteria } = req.body;
    const result = await submissionAgent.generateSubmissionFeedback(submission, hackathonCriteria);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/submission/presentation-improvements', async (req, res) => {
  try {
    const result = await submissionAgent.suggestPresentationImprovements(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/submission/judging-summary', async (req, res) => {
  try {
    const result = await submissionAgent.prepareJudgingSummary(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Judging Agent Routes
router.post('/judging/assign-judges', async (req, res) => {
  try {
    const { judges, projects } = req.body;
    const result = await judgingAgent.assignJudgesToProjects(judges, projects);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/judging/normalize-scores', async (req, res) => {
  try {
    const { scores, criteria } = req.body;
    const result = await judgingAgent.normalizeJudgingScores(scores, criteria);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/judging/team-feedback', async (req, res) => {
  try {
    const { projectId, judgingResults } = req.body;
    const result = await judgingAgent.generateTeamFeedback(projectId, judgingResults);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/judging/award-candidates', async (req, res) => {
  try {
    const { judgingResults, awardCategories } = req.body;
    const result = await judgingAgent.identifyAwardCandidates(judgingResults, awardCategories);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Communication Agent Routes
router.post('/communication/generate-notification', async (req, res) => {
  try {
    const { eventType, recipientData, eventData } = req.body;
    const result = await communicationAgent.generateNotification(eventType, recipientData, eventData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/communication/create-announcement', async (req, res) => {
  try {
    const { eventUpdate, audienceType } = req.body;
    const result = await communicationAgent.createEventAnnouncement(eventUpdate, audienceType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/communication/answer-question', async (req, res) => {
  try {
    const { question, hackathonDetails, userContext } = req.body;
    const result = await communicationAgent.answerQuestion(question, hackathonDetails, userContext);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/communication/event-summary', async (req, res) => {
  try {
    const { eventData, audienceType } = req.body;
    const result = await communicationAgent.generateEventSummary(eventData, audienceType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/communication/facilitate', async (req, res) => {
  try {
    const { request, senderInfo, recipientInfo } = req.body;
    const result = await communicationAgent.facilitateStakeholderCommunication(request, senderInfo, recipientInfo);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
