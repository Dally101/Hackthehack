/**
 * Coordinator Agent
 * Central orchestrator that manages communication between specialized agents,
 * delegates tasks, and ensures the overall hackathon lifecycle progresses smoothly.
 */

const { 
  subscribeToEvents, 
  publishEvent, 
  EVENT_TYPES, 
  requestData, 
  respondToRequest,
  alertCoordinator
} = require('../utils/interAgentComm');

const {
  TASK_STATUS,
  TASK_PRIORITY,
  HACKATHON_PHASE,
  createTask,
  updateTaskStatus,
  reassignTask,
  getTasksDueSoon,
  getNextActionableTasks,
  getTaskScheduleByPhase
} = require('../utils/taskManager');

// Agent definitions and capabilities
const AGENT_TYPES = {
  REGISTRATION: 'registration',
  TEAM_FORMATION: 'team_formation',
  SCHEDULING: 'scheduling',
  SUBMISSION: 'submission',
  JUDGING: 'judging',
  COMMUNICATION: 'communication',
  MARKETING: 'marketing',
  LOGISTICS: 'logistics',
  COORDINATOR: 'coordinator'
};

// Map of agent types to their primary responsibilities
const AGENT_RESPONSIBILITIES = {
  [AGENT_TYPES.REGISTRATION]: ['participant_management', 'attendee_tracking', 'confirmation_emails'],
  [AGENT_TYPES.TEAM_FORMATION]: ['team_matching', 'skill_assessment', 'team_communication'],
  [AGENT_TYPES.SCHEDULING]: ['event_timeline', 'workshop_scheduling', 'agenda_management'],
  [AGENT_TYPES.SUBMISSION]: ['project_collection', 'submission_validation', 'deadline_management'],
  [AGENT_TYPES.JUDGING]: ['judge_coordination', 'evaluation_criteria', 'scoring_management'],
  [AGENT_TYPES.COMMUNICATION]: ['announcements', 'q&a_support', 'notification_delivery'],
  [AGENT_TYPES.MARKETING]: ['promotion', 'social_media', 'content_creation'],
  [AGENT_TYPES.LOGISTICS]: ['venue_management', 'catering', 'equipment_setup', 'signage'],
  [AGENT_TYPES.COORDINATOR]: ['task_delegation', 'progress_monitoring', 'inter_agent_coordination']
};

// Current state of the hackathon
let hackathonState = {
  currentPhase: HACKATHON_PHASE.PLANNING,
  phaseProgress: 0, // 0-100%
  activeAgents: {},
  eventDetails: {
    name: '',
    startDate: null,
    endDate: null,
    location: '',
    expectedParticipants: 0,
    budget: 0,
    theme: '',
    sponsors: []
  },
  statistics: {
    registeredParticipants: 0,
    formedTeams: 0,
    completedTasks: 0,
    pendingTasks: 0
  }
};

/**
 * Initialize the coordinator agent
 * @param {Object} initialEventDetails - Initial details about the hackathon
 */
function initCoordinator(initialEventDetails = {}) {
  console.log('Initializing Coordinator Agent');
  
  // Set event details
  hackathonState.eventDetails = {
    ...hackathonState.eventDetails,
    ...initialEventDetails
  };
  
  // Subscribe to all relevant events
  subscribeToEvents(ALL_EVENT_TYPES, handleEvent, AGENT_TYPES.COORDINATOR);
  
  // Create initial planning tasks
  createInitialTasks();
  
  // Start the scheduling cycle
  setInterval(runSchedulingCycle, 60000); // Run every minute
  
  console.log('Coordinator initialized and ready');
  
  // Broadcast system status
  broadcastSystemStatus();
}

// All event types the coordinator listens to
const ALL_EVENT_TYPES = Object.values(EVENT_TYPES);

/**
 * Handle incoming events from other agents
 * @param {Object} event - The event object
 */
function handleEvent(event) {
  const { type, data, sender } = event;
  
  console.log(`Coordinator received ${type} event from ${sender}`);
  
  switch (type) {
    case EVENT_TYPES.REGISTRATION_UPDATED:
      handleRegistrationUpdate(data);
      break;
      
    case EVENT_TYPES.SCHEDULE_CHANGED:
      handleScheduleChange(data);
      break;
      
    case EVENT_TYPES.TASK_COMPLETED:
      handleTaskCompletion(data);
      break;
      
    case EVENT_TYPES.DATA_REQUEST:
      handleDataRequest(data, sender);
      break;
      
    case EVENT_TYPES.ALERT:
      handleAlert(data, sender);
      break;
      
    case EVENT_TYPES.STATUS_UPDATE:
      updateSystemStatus(data, sender);
      break;
      
    default:
      console.log(`Unhandled event type: ${type}`);
  }
}

/**
 * Handle registration updates
 * @param {Object} data - Registration update data
 */
function handleRegistrationUpdate(data) {
  // Update statistics
  if (data.newRegistrations) {
    hackathonState.statistics.registeredParticipants += data.newRegistrations;
  }
  
  // Check if we need to initiate team formation
  if (hackathonState.statistics.registeredParticipants >= 
      hackathonState.eventDetails.expectedParticipants * 0.5) {
    
    const teamFormationTasks = [
      {
        title: 'Prepare team formation strategy',
        description: 'Analyze registered participants and develop a strategy for optimal team formation',
        assignedTo: AGENT_TYPES.TEAM_FORMATION,
        priority: TASK_PRIORITY.HIGH,
        phase: HACKATHON_PHASE.REGISTRATION
      },
      {
        title: 'Create skill assessment form',
        description: 'Develop questionnaire to assess participant skills and team preferences',
        assignedTo: AGENT_TYPES.TEAM_FORMATION,
        priority: TASK_PRIORITY.MEDIUM,
        phase: HACKATHON_PHASE.REGISTRATION
      }
    ];
    
    teamFormationTasks.forEach(task => {
      createTask({
        ...task,
        createdBy: AGENT_TYPES.COORDINATOR
      });
    });
  }
}

/**
 * Handle schedule changes
 * @param {Object} data - Schedule change data
 */
function handleScheduleChange(data) {
  // Notify all agents about schedule changes
  publishEvent(EVENT_TYPES.STATUS_UPDATE, {
    type: 'schedule_update',
    changes: data.changes
  }, AGENT_TYPES.COORDINATOR);
  
  // Create tasks for any new schedule items
  if (data.newItems && data.newItems.length > 0) {
    data.newItems.forEach(item => {
      let assignedAgent = AGENT_TYPES.LOGISTICS;
      
      // Determine the best agent for the task based on the event type
      if (item.type === 'workshop') assignedAgent = AGENT_TYPES.SCHEDULING;
      if (item.type === 'judging') assignedAgent = AGENT_TYPES.JUDGING;
      if (item.type === 'announcement') assignedAgent = AGENT_TYPES.COMMUNICATION;
      
      createTask({
        title: `Prepare for: ${item.title}`,
        description: `Setup needed for event: ${item.title} at ${item.time}, ${item.location}`,
        assignedTo: assignedAgent,
        createdBy: AGENT_TYPES.COORDINATOR,
        priority: TASK_PRIORITY.MEDIUM,
        phase: determinePhaseFromDate(item.date),
        dueDate: new Date(item.date)
      });
    });
  }
}

/**
 * Determine hackathon phase based on a date
 * @param {string} dateString - ISO date string
 * @returns {string} The appropriate hackathon phase
 */
function determinePhaseFromDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const eventStart = new Date(hackathonState.eventDetails.startDate);
  const eventEnd = new Date(hackathonState.eventDetails.endDate);
  
  if (date < eventStart) {
    // More than 2 weeks before = PLANNING, otherwise PRE_EVENT
    const twoWeeksBefore = new Date(eventStart);
    twoWeeksBefore.setDate(eventStart.getDate() - 14);
    
    return date < twoWeeksBefore ? HACKATHON_PHASE.PLANNING : HACKATHON_PHASE.PRE_EVENT;
  } else if (date >= eventStart && date <= eventEnd) {
    return HACKATHON_PHASE.EVENT_DAY;
  } else {
    return HACKATHON_PHASE.POST_EVENT;
  }
}

/**
 * Handle task completion
 * @param {Object} data - Task completion data
 */
function handleTaskCompletion(data) {
  hackathonState.statistics.completedTasks++;
  hackathonState.statistics.pendingTasks = Math.max(0, hackathonState.statistics.pendingTasks - 1);
  
  // Check if completion triggers new tasks
  analyzeDependentTasks(data.taskId);
  
  // Update phase progress if needed
  updatePhaseProgress();
}

/**
 * Analyze and trigger dependent tasks
 * @param {string} completedTaskId - ID of the completed task
 */
function analyzeDependentTasks(completedTaskId) {
  // In a real implementation, this would query the database
  // For this demo, we'll use a simplified approach
  
  // For demonstration, create a follow-up communication task
  createTask({
    title: 'Send task completion notification',
    description: 'Notify relevant stakeholders about recent task completion',
    assignedTo: AGENT_TYPES.COMMUNICATION,
    createdBy: AGENT_TYPES.COORDINATOR,
    priority: TASK_PRIORITY.LOW,
    phase: hackathonState.currentPhase
  });
}

/**
 * Update the progress percentage of the current phase
 */
function updatePhaseProgress() {
  // Get all tasks for the current phase
  requestData('tasksByPhase', { phase: hackathonState.currentPhase }, AGENT_TYPES.COORDINATOR)
    .then(tasks => {
      if (!tasks || !tasks.length) return;
      
      const completedTasks = tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length;
      const totalTasks = tasks.length;
      
      const newProgress = Math.round((completedTasks / totalTasks) * 100);
      hackathonState.phaseProgress = newProgress;
      
      // If progress is 100%, check if we should move to the next phase
      if (newProgress >= 100) {
        evaluatePhaseTransition();
      }
      
      // Broadcast updated status
      broadcastSystemStatus();
    });
}

/**
 * Evaluate if we should transition to the next hackathon phase
 */
function evaluatePhaseTransition() {
  const currentPhase = hackathonState.currentPhase;
  let nextPhase = null;
  
  switch (currentPhase) {
    case HACKATHON_PHASE.PLANNING:
      nextPhase = HACKATHON_PHASE.REGISTRATION;
      break;
    case HACKATHON_PHASE.REGISTRATION:
      nextPhase = HACKATHON_PHASE.PRE_EVENT;
      break;
    case HACKATHON_PHASE.PRE_EVENT:
      nextPhase = HACKATHON_PHASE.EVENT_DAY;
      break;
    case HACKATHON_PHASE.EVENT_DAY:
      nextPhase = HACKATHON_PHASE.POST_EVENT;
      break;
    // POST_EVENT is the final phase
  }
  
  if (nextPhase) {
    transitionToPhase(nextPhase);
  }
}

/**
 * Transition to a new hackathon phase
 * @param {string} newPhase - The phase to transition to
 */
function transitionToPhase(newPhase) {
  const oldPhase = hackathonState.currentPhase;
  hackathonState.currentPhase = newPhase;
  hackathonState.phaseProgress = 0;
  
  console.log(`Transitioning from ${oldPhase} to ${newPhase}`);
  
  // Notify all agents about the phase change
  publishEvent(EVENT_TYPES.STATUS_UPDATE, {
    type: 'phase_change',
    oldPhase,
    newPhase
  }, AGENT_TYPES.COORDINATOR);
  
  // Create phase-specific tasks
  createPhaseSpecificTasks(newPhase);
}

/**
 * Create tasks specific to a new phase
 * @param {string} phase - The phase to create tasks for
 */
function createPhaseSpecificTasks(phase) {
  let tasks = [];
  
  switch (phase) {
    case HACKATHON_PHASE.REGISTRATION:
      tasks = [
        {
          title: 'Launch registration form',
          description: 'Finalize and publish the participant registration form',
          assignedTo: AGENT_TYPES.REGISTRATION,
          priority: TASK_PRIORITY.URGENT
        },
        {
          title: 'Prepare marketing campaign',
          description: 'Create social media and email campaign to promote registration',
          assignedTo: AGENT_TYPES.MARKETING,
          priority: TASK_PRIORITY.HIGH
        }
      ];
      break;
      
    case HACKATHON_PHASE.PRE_EVENT:
      tasks = [
        {
          title: 'Finalize workshop schedule',
          description: 'Confirm all workshops, speakers, and timeslots',
          assignedTo: AGENT_TYPES.SCHEDULING,
          priority: TASK_PRIORITY.HIGH
        },
        {
          title: 'Send pre-event instructions',
          description: 'Email all participants with event details and preparation instructions',
          assignedTo: AGENT_TYPES.COMMUNICATION,
          priority: TASK_PRIORITY.HIGH
        },
        {
          title: 'Prepare venue setup plan',
          description: 'Create detailed plan for venue layout, equipment, and signage',
          assignedTo: AGENT_TYPES.LOGISTICS,
          priority: TASK_PRIORITY.MEDIUM
        }
      ];
      break;
      
    case HACKATHON_PHASE.EVENT_DAY:
      tasks = [
        {
          title: 'Coordinate check-in process',
          description: 'Setup and manage participant check-in stations',
          assignedTo: AGENT_TYPES.REGISTRATION,
          priority: TASK_PRIORITY.URGENT
        },
        {
          title: 'Monitor submission platform',
          description: 'Ensure project submission system is working and assist teams',
          assignedTo: AGENT_TYPES.SUBMISSION,
          priority: TASK_PRIORITY.HIGH
        },
        {
          title: 'Brief judges on evaluation process',
          description: 'Provide judges with evaluation criteria and scoring instructions',
          assignedTo: AGENT_TYPES.JUDGING,
          priority: TASK_PRIORITY.HIGH
        }
      ];
      break;
      
    case HACKATHON_PHASE.POST_EVENT:
      tasks = [
        {
          title: 'Collect participant feedback',
          description: 'Send feedback survey to all participants and analyze results',
          assignedTo: AGENT_TYPES.COMMUNICATION,
          priority: TASK_PRIORITY.HIGH
        },
        {
          title: 'Publish event highlights',
          description: 'Create recap of the event with photos, statistics, and winning projects',
          assignedTo: AGENT_TYPES.MARKETING,
          priority: TASK_PRIORITY.MEDIUM
        },
        {
          title: 'Prepare event report',
          description: 'Compile comprehensive report on the hackathon outcomes, metrics, and learnings',
          assignedTo: AGENT_TYPES.COORDINATOR,
          priority: TASK_PRIORITY.MEDIUM
        }
      ];
      break;
  }
  
  // Create all the phase-specific tasks
  tasks.forEach(task => {
    createTask({
      ...task,
      phase,
      createdBy: AGENT_TYPES.COORDINATOR
    });
  });
  
  // Update pending tasks count
  hackathonState.statistics.pendingTasks += tasks.length;
}

/**
 * Handle data requests from other agents
 * @param {Object} data - The request data
 * @param {string} sender - The agent requesting data
 */
function handleDataRequest(data, sender) {
  const { requestId, dataType, params } = data;
  
  console.log(`Data request from ${sender}: ${dataType}`);
  
  let responseData = null;
  
  switch (dataType) {
    case 'hackathonState':
      responseData = hackathonState;
      break;
      
    case 'eventDetails':
      responseData = hackathonState.eventDetails;
      break;
      
    case 'currentPhase':
      responseData = {
        phase: hackathonState.currentPhase,
        progress: hackathonState.phaseProgress
      };
      break;
      
    case 'agentResponsibilities':
      responseData = AGENT_RESPONSIBILITIES[params.agentType] || [];
      break;
      
    case 'statistics':
      responseData = hackathonState.statistics;
      break;
      
    default:
      responseData = { error: 'Unknown data type requested' };
  }
  
  respondToRequest(requestId, responseData, AGENT_TYPES.COORDINATOR, sender);
}

/**
 * Handle alerts from other agents
 * @param {Object} data - The alert data
 * @param {string} sender - The agent sending the alert
 */
function handleAlert(data, sender) {
  const { alertType, message, severity, relatedData } = data;
  
  console.log(`ALERT from ${sender}: [${severity}] ${alertType} - ${message}`);
  
  // Handle different types of alerts
  switch (alertType) {
    case 'deadline_approaching':
      handleDeadlineAlert(relatedData);
      break;
      
    case 'resource_shortage':
      handleResourceAlert(relatedData);
      break;
      
    case 'system_issue':
      handleSystemIssueAlert(relatedData);
      break;
      
    case 'participant_problem':
      handleParticipantAlert(relatedData);
      break;
  }
  
  // High severity alerts might require immediate attention
  if (severity === 'high' || severity === 'critical') {
    createTask({
      title: `ADDRESS ALERT: ${alertType}`,
      description: `Urgent attention needed: ${message}`,
      assignedTo: determineResponsibleAgent(alertType),
      createdBy: AGENT_TYPES.COORDINATOR,
      priority: TASK_PRIORITY.URGENT,
      phase: hackathonState.currentPhase,
      tags: ['alert', severity, alertType]
    });
  }
}

/**
 * Determine which agent should handle a specific alert type
 * @param {string} alertType - The type of alert
 * @returns {string} The agent type that should handle this alert
 */
function determineResponsibleAgent(alertType) {
  // Map alert types to the most appropriate agent
  const alertMap = {
    'deadline_approaching': AGENT_TYPES.SCHEDULING,
    'submission_issue': AGENT_TYPES.SUBMISSION,
    'registration_problem': AGENT_TYPES.REGISTRATION,
    'team_conflict': AGENT_TYPES.TEAM_FORMATION,
    'venue_issue': AGENT_TYPES.LOGISTICS,
    'judging_question': AGENT_TYPES.JUDGING,
    'system_issue': AGENT_TYPES.COORDINATOR,
    'resource_shortage': AGENT_TYPES.LOGISTICS,
    'participant_problem': AGENT_TYPES.COMMUNICATION
  };
  
  return alertMap[alertType] || AGENT_TYPES.COORDINATOR;
}

/**
 * Handle deadline approaching alerts
 * @param {Object} data - Alert related data
 */
function handleDeadlineAlert(data) {
  const { deadline, task, timeRemaining } = data;
  
  // Create reminder tasks if needed
  if (timeRemaining && timeRemaining < 24) { // Less than 24 hours
    createTask({
      title: `REMINDER: ${deadline} approaching`,
      description: `Deadline ${deadline} is in ${timeRemaining} hours. Ensure all preparations are complete.`,
      assignedTo: determineResponsibleAgent(task.type || 'deadline_approaching'),
      createdBy: AGENT_TYPES.COORDINATOR,
      priority: TASK_PRIORITY.HIGH,
      phase: hackathonState.currentPhase,
      dueDate: new Date(deadline).toISOString()
    });
    
    // Send communications to relevant stakeholders
    publishEvent(EVENT_TYPES.STATUS_UPDATE, {
      type: 'deadline_reminder',
      deadline,
      timeRemaining
    }, AGENT_TYPES.COORDINATOR);
  }
}

/**
 * Handle resource shortage alerts
 * @param {Object} data - Alert related data
 */
function handleResourceAlert(data) {
  const { resource, current, required } = data;
  
  createTask({
    title: `Resolve resource shortage: ${resource}`,
    description: `Current ${resource}: ${current}, Required: ${required}. Please address this shortage.`,
    assignedTo: AGENT_TYPES.LOGISTICS,
    createdBy: AGENT_TYPES.COORDINATOR,
    priority: TASK_PRIORITY.HIGH,
    phase: hackathonState.currentPhase
  });
}

/**
 * Handle system issue alerts
 * @param {Object} data - Alert related data
 */
function handleSystemIssueAlert(data) {
  const { system, issue, impact } = data;
  
  console.log(`SYSTEM ISSUE: ${system} - ${issue} (Impact: ${impact})`);
  
  // For critical issues, might need to notify all agents
  if (impact === 'high' || impact === 'critical') {
    publishEvent(EVENT_TYPES.STATUS_UPDATE, {
      type: 'system_issue',
      system,
      issue,
      impact
    }, AGENT_TYPES.COORDINATOR);
  }
}

/**
 * Handle participant-related alerts
 * @param {Object} data - Alert related data
 */
function handleParticipantAlert(data) {
  const { participantId, issue, urgency } = data;
  
  createTask({
    title: `Participant issue: ${issue}`,
    description: `Participant ${participantId} has reported: ${issue}`,
    assignedTo: AGENT_TYPES.COMMUNICATION,
    createdBy: AGENT_TYPES.COORDINATOR,
    priority: urgency === 'high' ? TASK_PRIORITY.HIGH : TASK_PRIORITY.MEDIUM,
    phase: hackathonState.currentPhase
  });
}

/**
 * Update the system status based on agent updates
 * @param {Object} data - Status update data
 * @param {string} sender - The agent sending the update
 */
function updateSystemStatus(data, sender) {
  // Track active agents
  hackathonState.activeAgents[sender] = {
    lastUpdate: new Date().toISOString(),
    status: data.status || 'active'
  };
  
  // Update specific statistics if provided
  if (data.statistics) {
    Object.keys(data.statistics).forEach(key => {
      if (hackathonState.statistics[key] !== undefined) {
        hackathonState.statistics[key] = data.statistics[key];
      }
    });
  }
}

/**
 * Broadcast the current system status to all agents
 */
function broadcastSystemStatus() {
  publishEvent(EVENT_TYPES.SYSTEM_STATUS, {
    currentPhase: hackathonState.currentPhase,
    phaseProgress: hackathonState.phaseProgress,
    statistics: hackathonState.statistics,
    activeAgents: Object.keys(hackathonState.activeAgents),
    timestamp: new Date().toISOString()
  }, AGENT_TYPES.COORDINATOR);
}

/**
 * Create initial planning tasks when the coordinator is initialized
 */
function createInitialTasks() {
  const initialTasks = [
    {
      title: 'Define hackathon theme and objectives',
      description: 'Establish the core theme, objectives, and success metrics for the hackathon',
      assignedTo: AGENT_TYPES.COORDINATOR,
      priority: TASK_PRIORITY.HIGH
    },
    {
      title: 'Create registration form',
      description: 'Design and implement the participant registration form',
      assignedTo: AGENT_TYPES.REGISTRATION,
      priority: TASK_PRIORITY.HIGH
    },
    {
      title: 'Develop initial marketing plan',
      description: 'Create a comprehensive marketing strategy to promote the hackathon',
      assignedTo: AGENT_TYPES.MARKETING,
      priority: TASK_PRIORITY.MEDIUM
    },
    {
      title: 'Prepare logistics checklist',
      description: 'Create a detailed checklist for venue, equipment, and catering needs',
      assignedTo: AGENT_TYPES.LOGISTICS,
      priority: TASK_PRIORITY.MEDIUM
    },
    {
      title: 'Design judging criteria',
      description: 'Establish evaluation framework and scoring system for project submissions',
      assignedTo: AGENT_TYPES.JUDGING,
      priority: TASK_PRIORITY.MEDIUM
    },
    {
      title: 'Set up submission platform',
      description: 'Configure and test the project submission system',
      assignedTo: AGENT_TYPES.SUBMISSION,
      priority: TASK_PRIORITY.MEDIUM
    }
  ];
  
  initialTasks.forEach(task => {
    createTask({
      ...task,
      phase: HACKATHON_PHASE.PLANNING,
      createdBy: AGENT_TYPES.COORDINATOR
    });
  });
  
  hackathonState.statistics.pendingTasks = initialTasks.length;
}

/**
 * Run the periodic scheduling cycle to assign new tasks and check deadlines
 */
function runSchedulingCycle() {
  console.log('Running scheduling cycle...');
  
  // Check for tasks due soon
  const tasksDueSoon = getTasksDueSoon(2); // Tasks due in the next 2 days
  
  if (tasksDueSoon.length > 0) {
    console.log(`Found ${tasksDueSoon.length} tasks due soon`);
    
    // Send reminders for each task
    tasksDueSoon.forEach(task => {
      publishEvent(EVENT_TYPES.STATUS_UPDATE, {
        type: 'task_reminder',
        taskId: task.id,
        title: task.title,
        dueDate: task.dueDate
      }, AGENT_TYPES.COORDINATOR);
    });
  }
  
  // Check for new high priority tasks that can be worked on
  const actionableTasks = getNextActionableTasks(3);
  
  if (actionableTasks.length > 0) {
    console.log(`Found ${actionableTasks.length} high priority actionable tasks`);
    
    // Notify agents about high priority tasks
    actionableTasks.forEach(task => {
      const targetAgent = task.assignedTo;
      
      publishEvent(EVENT_TYPES.STATUS_UPDATE, {
        type: 'high_priority_task',
        taskId: task.id,
        title: task.title,
        priority: task.priority
      }, AGENT_TYPES.COORDINATOR, targetAgent);
    });
  }
  
  // Optionally update and broadcast system status
  broadcastSystemStatus();
}

// Export the coordinator functionality
module.exports = {
  initCoordinator,
  handleEvent,
  AGENT_TYPES,
  AGENT_RESPONSIBILITIES,
  broadcastSystemStatus
}; 