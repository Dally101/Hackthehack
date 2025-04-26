# Hack the Hackathon - Deployment Guide

This document provides instructions for deploying the Hack the Hackathon platform, an agentic AI system for planning, running, and managing hackathons using Azure services.

## System Architecture

The Hack the Hackathon platform consists of two main components:

1. **Frontend Website**: A React-based web application with Redux for state management
2. **Backend API & AI Agents**: An Express.js server with Azure OpenAI Service integration

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Azure account with access to Azure OpenAI Service
- MongoDB instance (optional)

## Deployment Options

### Option 1: Local Deployment

#### Frontend Deployment

1. Navigate to the website directory:
   ```
   cd /path/to/hackathon_project/website
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the production version:
   ```
   npm run build
   ```

4. Serve the built files:
   ```
   npx serve -s dist
   ```

#### Backend Deployment

1. Navigate to the backend directory:
   ```
   cd /path/to/hackathon_project/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your Azure OpenAI Service credentials and other configuration values.

5. Start the server:
   ```
   npm start
   ```

### Option 2: Azure Deployment

#### Frontend Deployment with Azure Static Web Apps

1. Create an Azure Static Web App resource in the Azure Portal.

2. Configure GitHub Actions or Azure DevOps for CI/CD:
   - Connect your repository
   - Set the build configuration:
     - App location: `/website`
     - API location: `/backend`
     - Output location: `dist`

3. Push your code to trigger the deployment.

#### Backend Deployment with Azure App Service

1. Create an Azure App Service resource in the Azure Portal.

2. Configure the deployment source (GitHub, Azure DevOps, etc.).

3. Set the following Application Settings in the Azure Portal:
   - `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI Service endpoint
   - `AZURE_OPENAI_API_KEY`: Your Azure OpenAI API key
   - `AZURE_OPENAI_DEPLOYMENT_NAME`: Your deployment name
   - `MONGODB_URI`: Connection string to your MongoDB (if using)
   - `JWT_SECRET`: Secret for JWT authentication
   - Other environment variables as needed

4. Deploy the backend code to Azure App Service.

### Option 3: Docker Deployment

#### Building and Running Docker Containers

1. Build the frontend Docker image:
   ```
   cd /path/to/hackathon_project/website
   docker build -t hackathon-frontend .
   ```

2. Build the backend Docker image:
   ```
   cd /path/to/hackathon_project/backend
   docker build -t hackathon-backend .
   ```

3. Run the containers:
   ```
   docker run -d -p 3000:80 hackathon-frontend
   docker run -d -p 5000:5000 --env-file .env hackathon-backend
   ```

## Azure OpenAI Service Configuration

1. Create an Azure OpenAI Service resource in the Azure Portal.

2. Deploy a model (e.g., GPT-4) with an appropriate deployment name.

3. Get the endpoint URL and API key from the Azure Portal.

4. Update the backend `.env` file or Azure App Service configuration with these values.

## Testing the Deployment

1. Access the frontend application at the deployed URL or http://localhost:3000 for local deployment.

2. Test the backend API health check at `/health` endpoint.

3. Verify AI agent functionality by testing a simple agent endpoint, such as:
   ```
   POST /api/agents/communication/answer-question
   {
     "question": "What is Hack the Hackathon?",
     "hackathonDetails": {},
     "userContext": { "role": "participant" }
   }
   ```

## Troubleshooting

- **Azure OpenAI Service Issues**: Verify API keys, endpoints, and deployment names. Check quota limits.
- **Frontend Connection Issues**: Ensure CORS is properly configured in the backend.
- **Backend Startup Failures**: Check environment variables and logs for errors.

## Security Considerations

- Always use HTTPS in production
- Store API keys and secrets securely
- Implement proper authentication and authorization
- Regularly update dependencies

## Monitoring and Maintenance

- Set up Azure Application Insights for monitoring
- Configure alerts for error rates and performance issues
- Regularly backup any persistent data
- Schedule regular updates and maintenance
