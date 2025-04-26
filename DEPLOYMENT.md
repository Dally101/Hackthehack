# Deployment Instructions

## Built Project

The project has been built and is ready for deployment in the `dist` directory. You can deploy the application using one of the following methods:

## Option 1: Deploy to Netlify (Recommended for Static Websites)

1. **Install Netlify CLI** (if not already installed):
   ```
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```
   netlify login
   ```

3. **Deploy the site**:
   ```
   netlify deploy
   ```
   - When prompted, select "Create & configure a new site"
   - Choose your team
   - Provide a site name (or press enter for a random name)
   - For the publish directory, enter: `dist`

4. **Preview the deployment** and if it looks good, deploy to production:
   ```
   netlify deploy --prod
   ```

## Option 2: Deploy to Azure App Service

### Using Azure CLI

1. **Install the Azure CLI** (if not already installed)
   - Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

2. **Login to Azure**:
   ```
   az login
   ```

3. **Run the deployment script**:
   ```
   node deploy-azure.js
   ```
   This script will:
   - Build the application
   - Create necessary configuration files
   - Create or update the Azure resource group
   - Deploy the application to Azure App Service

### Manual Deployment to Azure App Service

1. **Build the application**:
   ```
   npm run build
   ```

2. **Zip the necessary files**:
   - server.js
   - web.config (created by deploy-azure.js)
   - package.json
   - dist/ directory

3. **Deploy to Azure App Service** using the Azure Portal or Azure CLI

## Option 3: Serve Locally

To serve the built application locally:

1. **Install dependencies**:
   ```
   npm install
   ```

2. **Start the server**:
   ```
   npm start
   ```

3. **Access the application** at http://localhost:3000

## Option 4: Docker Deployment (Requires Docker)

If you have Docker installed:

1. **Build the Docker image**:
   ```
   docker build -t hackathon-management-system .
   ```

2. **Run the container**:
   ```
   docker run -p 80:80 hackathon-management-system
   ```

3. **Access the application** at http://localhost

## Environment Configuration

For production deployments, you may need to configure environment variables:

- **Azure App Service**: Configure application settings in the Azure Portal
- **Netlify**: Configure environment variables in the Netlify dashboard 