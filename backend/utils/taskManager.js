/**
 * Task Management System for Hackathon Lifecycle
 * Handles task creation, assignment, tracking, and completion
 */

const { publishEvent, EVENT_TYPES } = require('./interAgentComm');

// Task status enumeration
const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
  CANCELED: 'canceled'
};

// Task priority levels
const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Hackathon phases
const HACKATHON_PHASE = {
  PLANNING: 'planning',
  REGISTRATION: 'registration',
  PRE_EVENT: 'pre_event',
  EVENT_DAY: 'event_day',
  POST_EVENT: 'post_event'
};

// In-memory task storage
// In a production app, this would be a database
const tasks = [];

/**
 * Create a new task
 * @param {string} title - Task title
 * @param {string} description - Task description
 * @param {string} assignedTo - Agent assigned to the task
 * @param {string} createdBy - Agent who created the task
 * @param {string} priority - Task priority level
 * @param {string} phase - Hackathon phase this task belongs to
 * @param {Date} dueDate - When the task should be completed
 * @param {Array} dependencies - Array of task IDs that must complete before this
 * @param {Array} tags - Categorical tags for the task
 * @returns {Object} The created task
 */
function createTask({
  title,
  description,
  assignedTo,
  createdBy,
  priority = TASK_PRIORITY.MEDIUM,
  phase = HACKATHON_PHASE.PLANNING,
  dueDate = null,
  dependencies = [],
  tags = []
}) {
  const task = {
    id: Date.now().toString(),
    title,
    description,
    assignedTo,
    createdBy,
    status: TASK_STATUS.PENDING,
    priority,
    phase,
    dueDate,
    dependencies,
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
    notes: []
  };

  tasks.push(task);
  
  // Notify the system about new task
  publishEvent(EVENT_TYPES.TASK_ASSIGNED, {
    taskId: task.id,
    assignedTo,
    title,
    priority
  }, createdBy);
  
  return task;
}

/**
 * Update a task's status
 * @param {string} taskId - ID of the task to update
 * @param {string} newStatus - New status for the task
 * @param {string} updatedBy - Agent updating the status
 * @param {string} note - Optional note about the update
 * @returns {Object|null} Updated task or null if not found
 */
function updateTaskStatus(taskId, newStatus, updatedBy, note = '') {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return null;
  }
  
  const task = tasks[taskIndex];
  const oldStatus = task.status;
  
  task.status = newStatus;
  task.updatedAt = new Date().toISOString();
  
  if (note) {
    task.notes.push({
      text: note,
      addedBy: updatedBy,
      timestamp: new Date().toISOString()
    });
  }
  
  if (newStatus === TASK_STATUS.COMPLETED) {
    task.completedAt = new Date().toISOString();
    publishEvent(EVENT_TYPES.TASK_COMPLETED, {
      taskId: task.id,
      title: task.title,
      assignedTo: task.assignedTo,
      completedBy: updatedBy
    }, updatedBy);
  } else {
    publishEvent(EVENT_TYPES.STATUS_UPDATE, {
      type: 'task_status_change',
      taskId: task.id,
      oldStatus,
      newStatus,
      updatedBy
    }, updatedBy);
  }
  
  // Update the task in the array
  tasks[taskIndex] = task;
  
  return task;
}

/**
 * Assign a task to a different agent
 * @param {string} taskId - ID of the task
 * @param {string} newAssignee - Agent to assign the task to
 * @param {string} assignedBy - Agent making the assignment
 * @param {string} note - Optional note about the assignment change
 * @returns {Object|null} Updated task or null if not found
 */
function reassignTask(taskId, newAssignee, assignedBy, note = '') {
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return null;
  }
  
  const previousAssignee = task.assignedTo;
  task.assignedTo = newAssignee;
  task.updatedAt = new Date().toISOString();
  
  if (note) {
    task.notes.push({
      text: note,
      addedBy: assignedBy,
      timestamp: new Date().toISOString()
    });
  }
  
  publishEvent(EVENT_TYPES.TASK_ASSIGNED, {
    taskId: task.id,
    title: task.title,
    previousAssignee,
    newAssignee,
    assignedBy
  }, assignedBy);
  
  return task;
}

/**
 * Get all tasks matching filter criteria
 * @param {Object} filters - Filters to apply
 * @returns {Array} Matching tasks
 */
function getTasks(filters = {}) {
  return tasks.filter(task => {
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value)) {
        // Handle array values (for tags, etc.)
        if (!value.some(v => {
          if (Array.isArray(task[key])) {
            return task[key].includes(v);
          }
          return task[key] === v;
        })) {
          return false;
        }
      } else if (task[key] !== value) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Get a specific task by ID
 * @param {string} taskId - Task ID to find
 * @returns {Object|null} The task or null if not found
 */
function getTaskById(taskId) {
  return tasks.find(t => t.id === taskId) || null;
}

/**
 * Get tasks assigned to a specific agent
 * @param {string} agentName - Name of the agent
 * @param {string} status - Optional status filter
 * @returns {Array} Tasks assigned to the agent
 */
function getTasksByAssignee(agentName, status = null) {
  const filters = { assignedTo: agentName };
  
  if (status) {
    filters.status = status;
  }
  
  return getTasks(filters);
}

/**
 * Get tasks that are due soon
 * @param {number} daysThreshold - Number of days to consider "soon"
 * @returns {Array} Tasks due within the threshold
 */
function getTasksDueSoon(daysThreshold = 3) {
  const now = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(now.getDate() + daysThreshold);
  
  return tasks.filter(task => {
    if (!task.dueDate) return false;
    
    const taskDueDate = new Date(task.dueDate);
    return (
      taskDueDate > now && 
      taskDueDate <= thresholdDate && 
      task.status !== TASK_STATUS.COMPLETED &&
      task.status !== TASK_STATUS.CANCELED
    );
  });
}

/**
 * Add a note to a task
 * @param {string} taskId - Task ID
 * @param {string} note - Note text
 * @param {string} addedBy - Agent adding the note
 * @returns {Object|null} Updated task or null if not found
 */
function addTaskNote(taskId, note, addedBy) {
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return null;
  }
  
  task.notes.push({
    text: note,
    addedBy,
    timestamp: new Date().toISOString()
  });
  
  task.updatedAt = new Date().toISOString();
  
  return task;
}

/**
 * Get the next highest priority tasks that can be worked on
 * @param {number} limit - Maximum number of tasks to return
 * @returns {Array} Actionable tasks in priority order
 */
function getNextActionableTasks(limit = 5) {
  // Get tasks that are not blocked by dependencies
  const actionableTasks = tasks.filter(task => {
    // Skip completed or canceled tasks
    if (task.status === TASK_STATUS.COMPLETED || task.status === TASK_STATUS.CANCELED) {
      return false;
    }
    
    // Check dependencies - all must be completed
    if (task.dependencies && task.dependencies.length > 0) {
      return task.dependencies.every(depId => {
        const depTask = tasks.find(t => t.id === depId);
        return depTask && depTask.status === TASK_STATUS.COMPLETED;
      });
    }
    
    return true;
  });
  
  // Sort by priority
  const priorityOrder = {
    [TASK_PRIORITY.URGENT]: 0,
    [TASK_PRIORITY.HIGH]: 1,
    [TASK_PRIORITY.MEDIUM]: 2,
    [TASK_PRIORITY.LOW]: 3
  };
  
  return actionableTasks
    .sort((a, b) => {
      // First by priority
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Then by due date if available
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      
      // Tasks with due dates come before those without
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      // Finally by creation date
      return new Date(a.createdAt) - new Date(b.createdAt);
    })
    .slice(0, limit);
}

/**
 * Generate a schedule of tasks by phase
 * @returns {Object} Tasks organized by phase
 */
function getTaskScheduleByPhase() {
  const schedule = {};
  
  Object.values(HACKATHON_PHASE).forEach(phase => {
    schedule[phase] = tasks.filter(task => task.phase === phase);
  });
  
  return schedule;
}

module.exports = {
  TASK_STATUS,
  TASK_PRIORITY,
  HACKATHON_PHASE,
  createTask,
  updateTaskStatus,
  reassignTask,
  getTasks,
  getTaskById,
  getTasksByAssignee,
  getTasksDueSoon,
  addTaskNote,
  getNextActionableTasks,
  getTaskScheduleByPhase
}; 