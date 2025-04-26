import { z } from 'zod';

// Schema for environment variables validation
const EnvSchema = z.object({
  AZURE_OPENAI_API_KEY: z.string().min(1, 'Azure OpenAI API key is required'),
  AZURE_OPENAI_ENDPOINT: z.string().url('Azure OpenAI endpoint must be a valid URL'),
  AZURE_OPENAI_API_VERSION: z.string().min(1, 'Azure OpenAI API version is required'),
  AZURE_OPENAI_DEPLOYMENT_NAME: z.string().min(1, 'Azure OpenAI deployment name is required'),
});

// Parse environment variables with fallbacks
const parseEnv = () => {
  const env = {
    AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY || '',
    AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT || '',
    AZURE_OPENAI_API_VERSION: process.env.AZURE_OPENAI_API_VERSION || '2023-05-15',
    AZURE_OPENAI_DEPLOYMENT_NAME: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || '',
  };

  try {
    return EnvSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:', error.errors);
      return null;
    }
    throw error;
  }
};

// Azure OpenAI configuration
export const azureConfig = {
  apiKey: parseEnv()?.AZURE_OPENAI_API_KEY,
  endpoint: parseEnv()?.AZURE_OPENAI_ENDPOINT,
  apiVersion: parseEnv()?.AZURE_OPENAI_API_VERSION,
  deploymentName: parseEnv()?.AZURE_OPENAI_DEPLOYMENT_NAME,
};

// Check if we have valid credentials
export const hasValidCredentials = 
  !!azureConfig.apiKey && 
  azureConfig.apiKey !== 'YOUR_AZURE_OPENAI_API_KEY' &&
  azureConfig.apiKey !== 'sk-test-key' &&
  !!azureConfig.endpoint && 
  !!azureConfig.deploymentName;

// Agent types with their configurations
export const agentTypes = {
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

export default {
  azureConfig,
  agentTypes,
  hasValidCredentials
}; 