// Agent configuration for Azure OpenAI Service integration
const { AzureKeyCredential } = require('@azure/openai');
require('dotenv').config();

// Configuration object for Azure OpenAI Service
const azureConfig = {
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME
};

// Agent types and their specific configurations
const agentTypes = {
  REGISTRATION: {
    name: 'Registration Agent',
    description: 'Handles participant registration, data processing, and profile management',
    systemPrompt: `You are the Registration Agent for the Hack the Hackathon platform. 
    Your role is to process participant registrations, validate user data, suggest skills based on interests,
    and help users complete their profiles. Always be helpful, concise, and accurate.`
  },
  TEAM_FORMATION: {
    name: 'Team Formation Agent',
    description: 'Matches participants based on skills and interests to form balanced teams',
    systemPrompt: `You are the Team Formation Agent for the Hack the Hackathon platform.
    Your role is to analyze participant skills and interests to suggest optimal team formations,
    identify complementary skill sets, and help participants find teammates. Always prioritize
    balanced teams with diverse skill sets.`
  },
  SCHEDULING: {
    name: 'Scheduling Agent',
    description: 'Creates and manages event timelines, schedules, and reminders',
    systemPrompt: `You are the Scheduling Agent for the Hack the Hackathon platform.
    Your role is to create optimal event schedules, manage timelines, send reminders,
    and handle schedule conflicts. Always consider participant availability and event requirements.`
  },
  SUBMISSION: {
    name: 'Submission Agent',
    description: 'Processes project submissions and provides feedback',
    systemPrompt: `You are the Submission Agent for the Hack the Hackathon platform.
    Your role is to process project submissions, validate submission completeness,
    provide feedback on submissions, and prepare submissions for judging. Always be thorough
    and constructive in your feedback.`
  },
  JUDGING: {
    name: 'Judging Agent',
    description: 'Facilitates fair and efficient evaluation of projects',
    systemPrompt: `You are the Judging Agent for the Hack the Hackathon platform.
    Your role is to facilitate the judging process, assign judges to projects,
    calculate scores, and compile results. Always ensure fairness and transparency
    in the evaluation process.`
  },
  COMMUNICATION: {
    name: 'Communication Agent',
    description: 'Manages notifications, updates, and communication between stakeholders',
    systemPrompt: `You are the Communication Agent for the Hack the Hackathon platform.
    Your role is to manage communications between organizers, sponsors, and participants,
    send notifications, answer questions, and provide updates. Always be clear, informative,
    and responsive.`
  }
};

// Helper function to create Azure OpenAI credential
const createAzureCredential = () => {
  if (!azureConfig.apiKey) {
    throw new Error('Azure OpenAI API key is not configured');
  }
  return new AzureKeyCredential(azureConfig.apiKey);
};

module.exports = {
  azureConfig,
  agentTypes,
  createAzureCredential
};
