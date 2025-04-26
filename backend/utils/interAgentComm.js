/**
 * Inter-Agent Communication Utility
 * Provides a standardized communication system for agents to exchange messages, 
 * publish events, request data, and alert each other of important changes.
 */

// Event types that can be published and subscribed to
const EVENT_TYPES = {
  REGISTRATION_UPDATED: 'registration_updated',
  SCHEDULE_CHANGED: 'schedule_changed',
  TASK_COMPLETED: 'task_completed',
  TASK_ASSIGNED: 'task_assigned',
  DATA_REQUEST: 'data_request',
  DATA_RESPONSE: 'data_response',
  ALERT: 'alert',
  STATUS_UPDATE: 'status_update',
  SYSTEM_STATUS: 'system_status'
};

// Map of event subscriptions - { eventType: [{ callback, subscriber }] }
const subscriptions = {};

// Map to track pending data requests - { requestId: { resolver, timestamp } }
const pendingRequests = {};

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 5000;

// Generate a unique ID for requests
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Subscribe to specific event types
 * @param {string|Array<string>} eventTypes - Event type(s) to subscribe to
 * @param {Function} callback - Function to call when event is published
 * @param {string} subscriber - ID of the subscribing agent
 */
function subscribeToEvents(eventTypes, callback, subscriber) {
  const types = Array.isArray(eventTypes) ? eventTypes : [eventTypes];
  
  types.forEach(type => {
    if (!subscriptions[type]) {
      subscriptions[type] = [];
    }
    
    // Don't add duplicate subscriptions
    const existingSubscription = subscriptions[type].find(
      sub => sub.subscriber === subscriber
    );
    
    if (!existingSubscription) {
      subscriptions[type].push({ callback, subscriber });
      console.log(`${subscriber} subscribed to ${type} events`);
    }
  });
}

/**
 * Unsubscribe from specific event types
 * @param {string|Array<string>} eventTypes - Event type(s) to unsubscribe from
 * @param {string} subscriber - ID of the subscribing agent
 */
function unsubscribeFromEvents(eventTypes, subscriber) {
  const types = Array.isArray(eventTypes) ? eventTypes : [eventTypes];
  
  types.forEach(type => {
    if (subscriptions[type]) {
      subscriptions[type] = subscriptions[type].filter(
        sub => sub.subscriber !== subscriber
      );
      
      console.log(`${subscriber} unsubscribed from ${type} events`);
      
      // Clean up empty subscription arrays
      if (subscriptions[type].length === 0) {
        delete subscriptions[type];
      }
    }
  });
}

/**
 * Publish an event to all subscribers
 * @param {string} type - Event type
 * @param {Object} data - Event data
 * @param {string} sender - ID of the publishing agent
 * @param {string} [targetAgent] - Optional target agent (if event is meant for specific agent)
 */
function publishEvent(type, data, sender, targetAgent = null) {
  console.log(`Event published by ${sender}: ${type}`);
  
  if (!subscriptions[type]) {
    console.log(`No subscribers for ${type} events`);
    return;
  }
  
  const event = { type, data, sender, timestamp: new Date().toISOString() };
  
  subscriptions[type].forEach(subscription => {
    // If targetAgent is specified, only notify that agent
    if (targetAgent && subscription.subscriber !== targetAgent) {
      return;
    }
    
    try {
      subscription.callback(event);
    } catch (error) {
      console.error(`Error in ${subscription.subscriber}'s handler for ${type}:`, error);
    }
  });
}

/**
 * Request data from another agent
 * @param {string} dataType - Type of data being requested
 * @param {Object} params - Parameters for the request
 * @param {string} requester - ID of the requesting agent
 * @returns {Promise<Object>} - Promise that resolves with the requested data
 */
function requestData(dataType, params, requester) {
  return new Promise((resolve, reject) => {
    const requestId = generateRequestId();
    
    // Store the resolver function to be called when response is received
    pendingRequests[requestId] = {
      resolver: resolve,
      timestamp: Date.now()
    };
    
    // Set a timeout to reject the promise if no response is received
    setTimeout(() => {
      if (pendingRequests[requestId]) {
        delete pendingRequests[requestId];
        reject(new Error(`Request ${requestId} for ${dataType} timed out`));
      }
    }, REQUEST_TIMEOUT);
    
    // Publish the data request event
    publishEvent(EVENT_TYPES.DATA_REQUEST, {
      requestId,
      dataType,
      params
    }, requester);
  });
}

/**
 * Respond to a data request
 * @param {string} requestId - ID of the request to respond to
 * @param {Object} data - Response data
 * @param {string} responder - ID of the responding agent
 * @param {string} targetAgent - ID of the agent that made the request
 */
function respondToRequest(requestId, data, responder, targetAgent) {
  publishEvent(EVENT_TYPES.DATA_RESPONSE, {
    requestId,
    data
  }, responder, targetAgent);
}

/**
 * Handle a data response (internal usage)
 * @param {Object} event - Response event
 */
function handleDataResponse(event) {
  const { requestId, data } = event.data;
  
  if (pendingRequests[requestId]) {
    const { resolver } = pendingRequests[requestId];
    delete pendingRequests[requestId];
    resolver(data);
  }
}

// Subscribe to DATA_RESPONSE events internally
subscribeToEvents(EVENT_TYPES.DATA_RESPONSE, handleDataResponse, 'interAgentComm');

/**
 * Clean up expired pending requests
 * Should be called periodically to prevent memory leaks
 */
function cleanupExpiredRequests() {
  const now = Date.now();
  
  Object.keys(pendingRequests).forEach(requestId => {
    if (now - pendingRequests[requestId].timestamp > REQUEST_TIMEOUT) {
      delete pendingRequests[requestId];
    }
  });
}

// Run cleanup every minute
setInterval(cleanupExpiredRequests, 60000);

/**
 * Send an alert to the coordinator
 * @param {string} alertType - Type of alert
 * @param {string} message - Alert message
 * @param {string} severity - Alert severity (low, medium, high, critical)
 * @param {Object} relatedData - Additional data related to the alert
 * @param {string} sender - ID of the agent sending the alert
 */
function alertCoordinator(alertType, message, severity, relatedData, sender) {
  publishEvent(EVENT_TYPES.ALERT, {
    alertType,
    message,
    severity,
    relatedData,
    timestamp: new Date().toISOString()
  }, sender);
}

module.exports = {
  EVENT_TYPES,
  subscribeToEvents,
  unsubscribeFromEvents,
  publishEvent,
  requestData,
  respondToRequest,
  alertCoordinator
}; 