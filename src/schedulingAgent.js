// Scheduling Agent for creating and managing event timelines
const BaseAgent = require('./baseAgent');
const { agentTypes } = require('./agentConfig');

class SchedulingAgent extends BaseAgent {
  constructor() {
    super(agentTypes.SCHEDULING);
  }

  // Method to generate optimal event schedule based on requirements
  async generateEventSchedule(hackathonDetails, constraints) {
    const prompt = `
      Create an optimal schedule for the following hackathon:
      
      Hackathon Details: ${JSON.stringify(hackathonDetails)}
      Constraints: ${JSON.stringify(constraints)}
      
      Generate a comprehensive schedule that includes:
      1. Registration and check-in periods
      2. Opening ceremony and keynote sessions
      3. Team formation activities (if applicable)
      4. Workshop and mentoring sessions
      5. Designated work periods
      6. Breaks and meal times
      7. Check-in/milestone points
      8. Submission deadlines
      9. Judging periods
      10. Closing ceremony and awards
      
      The schedule should:
      - Respect the specified start and end dates/times
      - Account for the ${hackathonDetails.format || 'virtual/in-person/hybrid'} format
      - Include appropriate buffer times between activities
      - Balance structured activities with team work time
      
      Return a detailed JSON schedule with timestamps, activity descriptions, durations, and locations.
    `;
    
    return this.generateResponse(prompt);
  }

  // Method to optimize schedule based on participant availability
  async optimizeScheduleForAvailability(baseSchedule, participantAvailability) {
    const prompt = `
      Optimize the following hackathon schedule based on participant availability:
      
      Base Schedule: ${JSON.stringify(baseSchedule)}
      Participant Availability: ${JSON.stringify(participantAvailability)}
      
      Analyze the current schedule and participant availability patterns to:
      1. Identify optimal time slots for key activities with maximum participation
      2. Suggest adjustments to improve overall attendance
      3. Recommend alternative times for sessions with low expected attendance
      4. Propose flexible options for activities where appropriate
      
      Return a revised JSON schedule with changes highlighted and justification for each adjustment.
    `;
    
    return this.generateResponse(prompt);
  }

  // Method to generate personalized schedule reminders
  async generateScheduleReminders(events, userProfile) {
    const prompt = `
      Create personalized schedule reminders for a hackathon participant based on:
      
      Upcoming Events: ${JSON.stringify(events)}
      User Profile: ${JSON.stringify(userProfile)}
      
      For each event, generate:
      1. A personalized notification message (friendly, concise, and specific)
      2. Recommended notification timing (how long before the event)
      3. Any personalized preparation tips based on the user's role and skills
      
      Tailor the content to the user's experience level and role in the hackathon.
      Return a JSON array of reminder objects with 'eventId', 'message', 'sendTime', and 'preparationTips' properties.
    `;
    
    return this.generateResponse(prompt);
  }

  // Method to handle schedule conflicts
  async resolveScheduleConflicts(schedule, conflicts) {
    const prompt = `
      Resolve the following scheduling conflicts for a hackathon:
      
      Current Schedule: ${JSON.stringify(schedule)}
      Identified Conflicts: ${JSON.stringify(conflicts)}
      
      For each conflict:
      1. Analyze the severity and impact
      2. Propose 2-3 alternative solutions
      3. Recommend the optimal resolution with minimal disruption
      4. Suggest communication language for notifying affected participants
      
      Consider factors like room availability, speaker/mentor schedules, and activity dependencies.
      Return a JSON object with resolution plans for each conflict ID.
    `;
    
    return this.generateResponse(prompt);
  }
}

module.exports = SchedulingAgent;
