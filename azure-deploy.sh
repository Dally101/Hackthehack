#!/bin/bash

# Azure deployment script for Hack the Hackathon platform
# This script deploys the frontend to Azure Static Web Apps and the backend to Azure App Service

# Exit on error
set -e

# Configuration
RESOURCE_GROUP="hack-the-hackathon-rg"
LOCATION="eastus"
FRONTEND_NAME="hack-the-hackathon-frontend"
BACKEND_NAME="hack-the-hackathon-backend"
MONGODB_NAME="hack-the-hackathon-db"
OPENAI_NAME="hack-the-hackathon-openai"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment of Hack the Hackathon platform to Azure...${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "Azure CLI is not installed. Please install it first."
    exit 1
fi

# Login to Azure
echo -e "${YELLOW}Logging in to Azure...${NC}"
az login

# Create resource group if it doesn't exist
echo -e "${YELLOW}Creating resource group if it doesn't exist...${NC}"
az group create --name $RESOURCE_GROUP --location $LOCATION

# Deploy backend to Azure App Service
echo -e "${YELLOW}Deploying backend to Azure App Service...${NC}"
az webapp up \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_NAME \
    --location $LOCATION \
    --sku B1 \
    --os-type Linux \
    --runtime "NODE|16-lts" \
    --src-path ../backend

# Set environment variables for backend
echo -e "${YELLOW}Setting environment variables for backend...${NC}"
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_NAME \
    --settings \
    AZURE_OPENAI_ENDPOINT="https://$OPENAI_NAME.openai.azure.com/" \
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4" \
    CORS_ORIGIN="https://$FRONTEND_NAME.azurestaticapps.net"

# Deploy frontend to Azure Static Web Apps
echo -e "${YELLOW}Deploying frontend to Azure Static Web Apps...${NC}"
cd ../website
npm run build
az staticwebapp create \
    --resource-group $RESOURCE_GROUP \
    --name $FRONTEND_NAME \
    --location $LOCATION \
    --source . \
    --output-location dist \
    --api-location ../backend

# Set environment variables for frontend
echo -e "${YELLOW}Setting environment variables for frontend...${NC}"
az staticwebapp appsettings set \
    --name $FRONTEND_NAME \
    --resource-group $RESOURCE_GROUP \
    --setting-names \
    REACT_APP_API_URL="https://$BACKEND_NAME.azurewebsites.net/api"

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Frontend URL: https://$FRONTEND_NAME.azurestaticapps.net${NC}"
echo -e "${GREEN}Backend URL: https://$BACKEND_NAME.azurewebsites.net${NC}"

echo -e "${YELLOW}IMPORTANT: You still need to manually configure the Azure OpenAI Service and set the API key in the App Service configuration.${NC}"
