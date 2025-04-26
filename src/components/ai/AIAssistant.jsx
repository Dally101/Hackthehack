import React, { useState, useEffect, useRef } from 'react';
import AIAssistantButton from './AIAssistantButton';
import { agentService } from '../../services/apiService';

const AIAssistant = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I\'m your AI assistant for the Hack the Hackathon platform. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentAgent, setCurrentAgent] = useState('communication');
  const messagesEndRef = useRef(null);

  // Available agents with their descriptions for user reference
  const agents = [
    { 
      id: 'registration', 
      name: 'Registration Agent',
      description: 'Help with registration and profile setup' 
    },
    { 
      id: 'team-formation', 
      name: 'Team Formation Agent',
      description: 'Find teammates and build balanced teams' 
    },
    { 
      id: 'scheduling', 
      name: 'Scheduling Agent',
      description: 'Help with event schedules and timelines' 
    },
    { 
      id: 'submission', 
      name: 'Submission Agent',
      description: 'Guidance on project submissions' 
    },
    { 
      id: 'judging', 
      name: 'Judging Agent',
      description: 'Information about judging process' 
    },
    { 
      id: 'marketing', 
      name: 'Marketing Agent',
      description: 'Assistance with promotion and outreach' 
    },
    { 
      id: 'communication', 
      name: 'Communication Agent',
      description: 'General questions and communication' 
    }
  ];

  // Mapping from UI agent IDs to backend agent type names
  const agentTypeMap = {
    'registration': 'Registration Agent',
    'team-formation': 'Team Formation Agent',
    'scheduling': 'Scheduling Agent',
    'submission': 'Submission Agent',
    'judging': 'Judging Agent',
    'marketing': 'Marketing Agent',
    'communication': 'Communication Agent'
  };

  // Show the assistant after a short delay on first visit
  useEffect(() => {
    const hasSeenAssistant = localStorage.getItem('hasSeenAssistant');
    
    if (!hasSeenAssistant) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem('hasSeenAssistant', 'true');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Detect agent type from user input
  const detectAgentType = (input) => {
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes('register') || lowercaseInput.includes('sign up') || lowercaseInput.includes('profile')) {
      return 'registration';
    } else if (lowercaseInput.includes('team') || lowercaseInput.includes('partner') || lowercaseInput.includes('teammate')) {
      return 'team-formation';
    } else if (lowercaseInput.includes('schedule') || lowercaseInput.includes('time') || lowercaseInput.includes('when')) {
      return 'scheduling';
    } else if (lowercaseInput.includes('submit') || lowercaseInput.includes('project') || lowercaseInput.includes('hand in')) {
      return 'submission';
    } else if (lowercaseInput.includes('judge') || lowercaseInput.includes('score') || lowercaseInput.includes('evaluate')) {
      return 'judging';
    } else if (lowercaseInput.includes('market') || lowercaseInput.includes('promote') || 
              lowercaseInput.includes('advertising') || lowercaseInput.includes('social media') || 
              lowercaseInput.includes('sponsor') || lowercaseInput.includes('email campaign')) {
      return 'marketing';
    }
    
    // Default to communication agent for general questions
    return 'communication';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    
    // Detect the appropriate agent based on the question
    const detectedAgent = detectAgentType(userMessage);
    setCurrentAgent(detectedAgent);
    
    // Start typing animation
    setIsTyping(true);
    
    try {
      // Get conversation history for context
      const conversationHistory = messages
        .slice(-6) // Get last 6 messages for context
        .map(msg => ({
          role: msg.sender === 'ai' ? 'assistant' : 'user',
          content: msg.text
        }));
      
      // Map UI agent ID to backend agent type
      const backendAgentType = agentTypeMap[detectedAgent];
      
      // Call the appropriate agent
      console.log(`Calling agent ${backendAgentType} with message: ${userMessage}`);
      const response = await agentService.getAgentResponse(
        backendAgentType,
        userMessage,
        { 
          conversationHistory,
          userContext: {} // Can be populated with user data if available
        }
      );
      console.log('Agent response:', response);
      
      // Extract the response text from nested response structure
      let responseText = null;
      
      // Case 1: response.response.content structure (from regular agent endpoint)
      if (response?.response?.content) {
        responseText = response.response.content;
        console.log('Found response in response.response.content:', responseText);
      } 
      // Case 2: response.answer structure (from FAQ endpoint)
      else if (response?.answer) {
        responseText = response.answer;
        console.log('Found response in response.answer:', responseText);
      }
      // Case 3: Try to find any reasonable string in the response
      else {
        responseText = findResponseContent(response);
        console.log('Found response from findResponseContent:', responseText);
      }
      
      // Use the extracted response text or a fallback
      const finalResponseText = responseText || "I'm having trouble generating a response. Please try asking a different question.";
      
      // Add AI response
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: finalResponseText,
        agent: backendAgentType
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add a helpful error message
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: "I'm sorry, I encountered a technical issue while processing your request. Please try again later.",
        agent: agentTypeMap[currentAgent]
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper function to find content in nested response objects
  const findResponseContent = (obj) => {
    if (!obj || typeof obj !== 'object') return null;
    
    // Debug the object structure
    console.log('Searching for content in object:', JSON.stringify(obj).slice(0, 100) + '...');
    
    // Check for common response properties
    if (obj.content) return obj.content;
    if (obj.text) return obj.text;
    if (obj.message) return obj.message;
    if (obj.response && typeof obj.response === 'string') return obj.response;
    
    // Recursively search through object properties
    for (const key in obj) {
      if (typeof obj[key] === 'string' && obj[key].length > 15) {
        return obj[key]; // Return any reasonably long string
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const content = findResponseContent(obj[key]);
        if (content) return content;
      }
    }
    
    // If nothing else works, try stringifying the whole object
    try {
      const objStr = JSON.stringify(obj);
      return objStr.length > 1000 ? 
        "I received a response but couldn't extract readable text from it." : 
        `Raw response: ${objStr}`;
    } catch (e) {
      return null;
    }
  };

  const handleAgentChange = (agentId) => {
    setCurrentAgent(agentId);
    setMessages(prev => [...prev, { 
      sender: 'ai', 
      text: `You're now chatting with the ${agentTypeMap[agentId]}. How can I help you?`,
      agent: agentTypeMap[agentId]
    }]);
  };

  return (
    <>
      <AIAssistantButton onClick={() => setIsVisible(!isVisible)} />
      
      {isVisible && (
        <div className="fixed bottom-20 right-6 w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">AI Assistant: {agentTypeMap[currentAgent]}</h3>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-amber-300"
              aria-label="Close assistant"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex items-start mb-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
              >
                {msg.sender === 'ai' && (
                  <div className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      AI
                    </div>
                  </div>
                )}
                <div 
                  className={`rounded-lg py-2 px-3 max-w-[80%] ${
                    msg.sender === 'ai' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 ml-4'
                  }`}
                >
                  {msg.agent && msg.sender === 'ai' && (
                    <div className="text-xs text-blue-100 mb-1">{msg.agent}</div>
                  )}
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 mr-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    AI
                  </div>
                </div>
                <div className="bg-blue-600 text-white rounded-lg py-2 px-3">
                  <div className="text-xs text-blue-100 mb-1">{agentTypeMap[currentAgent]}</div>
                  <p className="text-sm flex">
                    <span className="animate-pulse">•</span>
                    <span className="animate-pulse delay-100">•</span>
                    <span className="animate-pulse delay-200">•</span>
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-2 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-1 mb-2">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => handleAgentChange(agent.id)}
                  className={`text-xs px-2 py-1 rounded-full ${
                    currentAgent === agent.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title={agent.description}
                >
                  {agent.name.replace(' Agent', '')}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex">
              <input 
                type="text" 
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Ask a question"
                disabled={isTyping}
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!input.trim() || isTyping}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
            </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
