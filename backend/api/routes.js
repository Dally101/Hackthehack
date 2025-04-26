const express = require('express');
const router = express.Router();
const { createAgent, agentTypes } = require('../agents');
const { asyncHandler } = require('./middleware');

// Root API route
router.get('/', asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hackathon Management API',
    version: '1.0.0',
    endpoints: {
      agents: '/agent/:type',
      communication: {
        notify: '/communication/notify',
        announce: '/communication/announce',
        faq: '/communication/faq',
        summary: '/communication/summary'
      },
      auth: {
        register: '/auth/signup',
        login: '/auth/login',
        me: '/auth/me',
        logout: '/auth/logout'
      },
      example: {
        public: '/example',
        protected: '/example/protected',
        admin: '/example/admin',
        error: '/example/error'
      }
    }
  });
}));

// Helper function to process agent response
async function processAgentRequest(req, res, agentTypeName) {
  try {
    const { prompt, context = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Missing required parameter: prompt' 
      });
    }

    const agent = createAgent(agentTypeName);
    const response = await agent.generateResponse(prompt, context);
    
    return res.json({ response });
  } catch (error) {
    console.error(`Error in ${agentTypeName} endpoint:`, error);
    return res.status(500).json({ 
      error: 'An error occurred when processing your request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Route for general agent interactions
router.post('/agent/:type', async (req, res) => {
  const { type } = req.params;
  
  // Check if the requested agent type exists
  const agentType = Object.values(agentTypes).find(a => a.name === type);
  
  if (!agentType) {
    return res.status(404).json({ error: `Unknown agent type: ${type}` });
  }
  
  try {
    const { prompt, context = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Missing required parameter: prompt' 
      });
    }

    const agent = createAgent(type);
    const agentResponse = await agent.generateResponse(prompt, context);
    
    return res.json({ 
      response: agentResponse,
      success: true
    });
  } catch (error) {
    console.error(`Error in ${type} endpoint:`, error);
    return res.status(500).json({ 
      error: 'An error occurred when processing your request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Communication agent specific endpoints
router.post('/communication/notify', async (req, res) => {
  try {
    const { audienceType, eventInfo, context = {} } = req.body;
    
    if (!audienceType || !eventInfo) {
      return res.status(400).json({ 
        error: 'Missing required parameters: audienceType, eventInfo' 
      });
    }
    
    const agent = createAgent(agentTypes.COMMUNICATION.name);
    const notification = await agent.generateNotification(audienceType, eventInfo, context);
    
    return res.json({ notification });
  } catch (error) {
    console.error('Error in notification endpoint:', error);
    return res.status(500).json({ 
      error: 'An error occurred when generating notification',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/communication/announce', async (req, res) => {
  try {
    const { eventType, eventDetails, context = {} } = req.body;
    
    if (!eventType || !eventDetails) {
      return res.status(400).json({ 
        error: 'Missing required parameters: eventType, eventDetails' 
      });
    }
    
    const agent = createAgent(agentTypes.COMMUNICATION.name);
    const announcement = await agent.createEventAnnouncement(eventType, eventDetails, context);
    
    return res.json({ announcement });
  } catch (error) {
    console.error('Error in announcement endpoint:', error);
    return res.status(500).json({ 
      error: 'An error occurred when creating announcement',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/communication/faq', async (req, res) => {
  try {
    const { question, context = {} } = req.body;
    
    if (!question) {
      return res.status(400).json({ 
        error: 'Missing required parameter: question' 
      });
    }
    
    const agent = createAgent(agentTypes.COMMUNICATION.name);
    const agentResponse = await agent.generateResponse(question, context);
    
    return res.json({ 
      answer: agentResponse.content,
      metadata: agentResponse.metadata || {},
      success: true
    });
  } catch (error) {
    console.error('Error in FAQ endpoint:', error);
    
    // Provide a fallback response to keep the chat functional even when errors occur
    return res.json({ 
      answer: "I'm sorry, I'm having trouble processing your question right now. Please try asking something else or try again later.",
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Processing error'
    });
  }
});

router.post('/communication/summary', async (req, res) => {
  try {
    const { eventData, reportType, context = {} } = req.body;
    
    if (!eventData || !reportType) {
      return res.status(400).json({ 
        error: 'Missing required parameters: eventData, reportType' 
      });
    }
    
    const agent = createAgent(agentTypes.COMMUNICATION.name);
    const summary = await agent.generateEventSummary(eventData, reportType, context);
    
    return res.json({ summary });
  } catch (error) {
    console.error('Error in summary endpoint:', error);
    return res.status(500).json({ 
      error: 'An error occurred when generating summary',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 