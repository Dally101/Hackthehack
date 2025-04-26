import React, { useState, useEffect, useRef } from 'react';
import { View, XStack, YStack, Text, Button, Input, ScrollView } from 'tamagui';
import { X, Send } from '@tamagui/lucide-icons';
import { agentService, AgentContext, ConversationHistoryItem } from '../../services/agentService';
import { GestureResponderEvent } from 'react-native';
import { agentTypes } from '../../config/agentConfig';

interface Agent {
  id: string;
  name: string;
  description: string;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  agent?: string;
}

const AIAssistant: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I\'m your AI assistant for the Hack the Hackathon platform. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(agentTypes.COMMUNICATION.name);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Available agents with their descriptions for user reference
  const agents: Agent[] = [
    { 
      id: agentTypes.REGISTRATION.name, 
      name: agentTypes.REGISTRATION.name,
      description: agentTypes.REGISTRATION.description 
    },
    { 
      id: agentTypes.TEAM_FORMATION.name, 
      name: agentTypes.TEAM_FORMATION.name,
      description: agentTypes.TEAM_FORMATION.description 
    },
    { 
      id: agentTypes.SCHEDULING.name, 
      name: agentTypes.SCHEDULING.name,
      description: agentTypes.SCHEDULING.description 
    },
    { 
      id: agentTypes.SUBMISSION.name, 
      name: agentTypes.SUBMISSION.name,
      description: agentTypes.SUBMISSION.description 
    },
    { 
      id: agentTypes.JUDGING.name, 
      name: agentTypes.JUDGING.name,
      description: agentTypes.JUDGING.description 
    },
    { 
      id: agentTypes.COMMUNICATION.name, 
      name: agentTypes.COMMUNICATION.name,
      description: agentTypes.COMMUNICATION.description 
    }
  ];

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
  const detectAgentType = (userInput: string): string => {
    const lowercaseInput = userInput.toLowerCase();
    
    if (lowercaseInput.includes('register') || lowercaseInput.includes('sign up') || lowercaseInput.includes('profile')) {
      return agentTypes.REGISTRATION.name;
    } else if (lowercaseInput.includes('team') || lowercaseInput.includes('partner') || lowercaseInput.includes('teammate')) {
      return agentTypes.TEAM_FORMATION.name;
    } else if (lowercaseInput.includes('schedule') || lowercaseInput.includes('time') || lowercaseInput.includes('when')) {
      return agentTypes.SCHEDULING.name;
    } else if (lowercaseInput.includes('submit') || lowercaseInput.includes('project') || lowercaseInput.includes('hand in')) {
      return agentTypes.SUBMISSION.name;
    } else if (lowercaseInput.includes('judge') || lowercaseInput.includes('score') || lowercaseInput.includes('evaluate')) {
      return agentTypes.JUDGING.name;
    }
    
    // Default to communication agent for general questions
    return agentTypes.COMMUNICATION.name;
  };

  const handleSubmit = async (e: React.FormEvent | GestureResponderEvent) => {
    // Prevent default for web form submit
    if ('preventDefault' in e) {
      e.preventDefault();
    }
    
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
      const conversationHistory: ConversationHistoryItem[] = messages
        .slice(-6) // Get last 6 messages for context
        .map(msg => ({
          role: msg.sender === 'ai' ? 'assistant' : 'user',
          content: msg.text
        }));
      
      // Prepare context
      const context: AgentContext = { 
        conversationHistory,
        userContext: {} // Can be populated with user data if available
      };
      
      // Call the appropriate agent
      const response = await agentService.getAgentResponse(
        detectedAgent,
        userMessage,
        context
      );
      
      // Add AI response
      if (response && response.content) {
        setMessages(prev => [...prev, { 
          sender: 'ai', 
          text: response.content,
          agent: detectedAgent
        }]);
      } else {
        // Fallback for error
        setMessages(prev => [...prev, { 
          sender: 'ai', 
          text: "I'm sorry, I couldn't process your request at this time. Please try again later.",
          agent: detectedAgent
        }]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        agent: currentAgent
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAgentChange = (agentId: string) => {
    setCurrentAgent(agentId);
    setMessages(prev => [...prev, { 
      sender: 'ai', 
      text: `You're now chatting with the ${agentId}. How can I help you?`,
      agent: agentId
    }]);
  };

  // AIAssistant button component
  const AIAssistantButton = () => (
    <Button
      position="absolute"
      bottom={16}
      right={16}
      size="$5"
      circular
      backgroundColor="$blue9"
      pressStyle={{ backgroundColor: '$blue10' }}
      onPress={() => setIsVisible(!isVisible)}
      aria-label="Toggle AI Assistant"
    >
      <Text color="$white" fontSize={24}>AI</Text>
    </Button>
  );

  return (
    <>
      <AIAssistantButton />
      
      {isVisible && (
        <View
          position="absolute"
          bottom="$20"
          right="$6"
          width={380}
          backgroundColor="$background"
          borderRadius="$4"
          shadowColor="$shadowColor"
          shadowRadius={16}
          shadowOffset={{ width: 0, height: 4 }}
          zIndex={50}
          overflow="hidden"
        >
          <XStack
            backgroundColor="$blue9"
            paddingHorizontal="$4"
            paddingVertical="$3"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text color="$white" fontWeight="$semibold">AI Assistant: {currentAgent}</Text>
            <Button
              size="$2"
              circular
              chromeless
              onPress={() => setIsVisible(false)}
              aria-label="Close assistant"
            >
              <X size={18} color="$white" />
            </Button>
          </XStack>
          
          <ScrollView
            height={320}
            padding="$4"
            backgroundColor="$gray2"
          >
            {messages.map((msg, index) => (
              <XStack
                key={index}
                marginBottom="$3"
                justifyContent={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
              >
                {msg.sender === 'ai' && (
                  <View
                    marginRight="$2"
                    width={32}
                    height={32}
                    borderRadius="$full"
                    backgroundColor="$blue9"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="$white" fontSize="$1" fontWeight="$bold">AI</Text>
                  </View>
                )}
                <View
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$4"
                  maxWidth="80%"
                  backgroundColor={msg.sender === 'ai' ? '$blue9' : '$gray4'}
                  marginLeft={msg.sender === 'user' ? '$4' : undefined}
                >
                  {msg.agent && msg.sender === 'ai' && (
                    <Text color="$blue2" fontSize="$1" marginBottom="$1">{msg.agent}</Text>
                  )}
                  <Text
                    fontSize="$2"
                    color={msg.sender === 'ai' ? '$white' : '$gray12'}
                  >
                    {msg.text}
                  </Text>
                </View>
              </XStack>
            ))}
            
            {isTyping && (
              <XStack marginBottom="$3">
                <View
                  marginRight="$2"
                  width={32}
                  height={32}
                  borderRadius="$full"
                  backgroundColor="$blue9"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="$white" fontSize="$1" fontWeight="$bold">AI</Text>
                </View>
                <View
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$4"
                  backgroundColor="$blue9"
                >
                  <Text color="$blue2" fontSize="$1" marginBottom="$1">{currentAgent}</Text>
                  <Text fontSize="$2" color="$white">
                    <Text opacity={0.6} style={{ animationName: 'pulse', animationDuration: '1s', animationIterationCount: 'infinite' }}>•</Text>
                    <Text opacity={0.6} style={{ animationName: 'pulse', animationDuration: '1s', animationIterationCount: 'infinite', animationDelay: '0.2s' }}>•</Text>
                    <Text opacity={0.6} style={{ animationName: 'pulse', animationDuration: '1s', animationIterationCount: 'infinite', animationDelay: '0.4s' }}>•</Text>
                  </Text>
                </View>
              </XStack>
            )}
            <div ref={messagesEndRef} />
          </ScrollView>
          
          <View
            padding="$2"
            borderTopWidth={1}
            borderTopColor="$gray4"
            backgroundColor="$gray2"
          >
            <XStack flexWrap="wrap" gap="$1" marginBottom="$2">
              {agents.map((agent) => (
                <Button
                  key={agent.id}
                  size="$1"
                  paddingHorizontal="$2"
                  backgroundColor={currentAgent === agent.id ? '$blue9' : '$gray4'}
                  color={currentAgent === agent.id ? '$white' : '$gray11'}
                  borderRadius="$full"
                  onPress={() => handleAgentChange(agent.id)}
                  fontWeight="$normal"
                  fontSize="$1"
                >
                  {agent.name.replace(' Agent', '')}
                </Button>
              ))}
            </XStack>
            <form onSubmit={handleSubmit}>
              <XStack>
                <Input
                  flex={1}
                  placeholder="Ask a question..."
                  value={input}
                  onChangeText={setInput}
                  disabled={isTyping}
                  borderTopRightRadius={0}
                  borderBottomRightRadius={0}
                />
                <Button
                  backgroundColor="$blue9"
                  paddingHorizontal="$4"
                  paddingVertical="$2"
                  disabled={!input.trim() || isTyping}
                  opacity={!input.trim() || isTyping ? 0.7 : 1}
                  borderTopLeftRadius={0}
                  borderBottomLeftRadius={0}
                  onPress={handleSubmit}
                >
                  <Send size={18} color="$white" />
                </Button>
              </XStack>
            </form>
          </View>
        </View>
      )}
    </>
  );
};

export default AIAssistant; 