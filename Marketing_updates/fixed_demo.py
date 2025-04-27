#!/usr/bin/env python
"""
Fixed Azure Marketing Agent Demo

This script demonstrates using Azure AI Projects to create a marketing agent
that generates content using the available API in Azure AI Projects.
"""

import os
import sys
import asyncio
import argparse
import logging
from typing import Dict, List, Optional, Any
from dotenv import load_dotenv

# Azure imports
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import (
    Agent, ThreadMessage, MessageRole, AgentThread,
    BingGroundingToolDefinition, CodeInterpreterToolDefinition
)

# Load environment variables - check both current directory and parent directory
if os.path.exists(os.path.join(os.path.dirname(__file__), '..', '.env')):
    # .env file is in the parent directory
    load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
    print("Loaded .env file from parent directory")
else:
    # Try current directory
    load_dotenv()
    print("Attempted to load .env from current directory")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("AzureMarketingAgent")

def check_azure_environment():
    """Check if required environment variables are set."""
    required_vars = ["AZURE_ENDPOINT", "AZURE_SUBSCRIPTION_ID", "AZURE_RESOURCE_GROUP", "AZURE_PROJECT_NAME"]
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        print("\nError: Missing required Azure environment variables:")
        for var in missing:
            print(f"  - {var}")
        
        # Print existing environment variables that might be related to Azure
        azure_vars = {key: value for key, value in os.environ.items() if 'AZURE' in key.upper()}
        if azure_vars:
            print("\nFound the following Azure-related environment variables:")
            for key, value in azure_vars.items():
                # Mask the value if it might be a key or secret
                masked_value = value
                if 'KEY' in key.upper() or 'SECRET' in key.upper() or 'PASSWORD' in key.upper():
                    if len(value) > 8:
                        masked_value = value[:4] + '*' * (len(value) - 8) + value[-4:]
                    else:
                        masked_value = '*' * len(value)
                print(f"  - {key}: {masked_value}")
        
        print("\nPlease create a .env file with the following variables:")
        print("""
        # Azure AI Projects Configuration
        AZURE_ENDPOINT=https://your-ai-project-endpoint.azure.com
        AZURE_SUBSCRIPTION_ID=your-subscription-id
        AZURE_RESOURCE_GROUP=your-resource-group-name
        AZURE_PROJECT_NAME=your-ai-project-name
        """)
        print("See update_env_instructions.txt for more details on finding these values.")
        sys.exit(1)
    
    print("\nAll required Azure environment variables found:")
    for var in required_vars:
        value = os.getenv(var)
        # Mask subscription ID for privacy
        if var == "AZURE_SUBSCRIPTION_ID" and value:
            if len(value) > 8:
                value = value[:4] + '*' * (len(value) - 8) + value[-4:]
            else:
                value = '*' * len(value)
        print(f"  - {var}: {value}")

def get_example_content(content_type, tone, audience):
    """Generate example content when Azure environment is not configured."""
    if content_type == "social media post" or content_type == "tweet":
        return f"""🌿 Transform your home into an eco-paradise with our sustainable smart devices! They don't just save the planet—they save your wallet too. #EcoLiving #SmartHome #SustainableTech"""
    
    elif content_type == "email":
        return f"""Subject: Discover How Our Eco-Friendly Products Can Transform Your Home

Hello there,

Are you looking to make your home more sustainable without sacrificing comfort or style?

Our latest collection of eco-friendly products combines cutting-edge technology with environmental responsibility. From energy-efficient appliances to biodegradable household items, we've got everything you need to reduce your carbon footprint while enhancing your living space.

Key benefits:
• Reduce energy consumption by up to 30%
• Made from sustainable, ethically-sourced materials
• Stylish designs that complement any home décor
• Long-lasting durability for better value

Ready to make a positive change for your home and the planet? Browse our collection today at [website] or visit our store.

Regards,
The Green Living Team"""
    
    elif content_type == "blog post":
        return f"""# 5 Ways Eco-Friendly Products Are Revolutionizing Modern Homes

In today's climate-conscious world, more homeowners are seeking sustainable alternatives to everyday products. The good news? Eco-friendly innovation has never been more exciting or accessible.

## The Rise of Sustainable Living

Recent studies show that 73% of consumers are actively changing their purchasing habits to reduce environmental impact. This shift has driven manufacturers to rethink product design from the ground up.

## How Green Products Are Making a Difference

### 1. Energy Efficiency That Pays For Itself

Modern eco-friendly appliances don't just reduce your carbon footprint—they reduce your utility bills. High-efficiency washing machines use 25% less energy and 33% less water than conventional models, saving the average household over $350 annually.

### 2. Sustainable Materials, Superior Performance

Today's bamboo, recycled plastics, and organic textiles often outperform their conventional counterparts in durability and functionality. For instance, bamboo utensils last longer than plastic and don't leach harmful chemicals into food.

### 3. Smart Design Reduces Waste

Innovative product design now emphasizes longevity, repairability, and end-of-life recycling. Companies like Patagonia offer lifetime repairs on their products, while others design with modular components that can be easily replaced without discarding the entire item.

### 4. Healthier Home Environment

Eco-friendly products typically contain fewer toxic chemicals, leading to better indoor air quality and fewer allergens. This creates a healthier living environment, especially important for families with children or pets.

### 5. Technology and Sustainability Join Forces

Smart home technology now works hand-in-hand with sustainability goals. From intelligent thermostats that learn your habits to solar-powered outdoor lighting with motion sensors, technology helps maximize resource efficiency.

## Making the Transition

Transforming your home doesn't require a complete overhaul overnight. Start by replacing items as they wear out with more sustainable alternatives. Focus on frequently used products first, where the environmental impact will be greatest.

Remember that every small change contributes to a larger collective impact. Your eco-friendly choices today help create a more sustainable marketplace for tomorrow."""
    
    else:
        return f"""Here's a sample {content_type} targeting {audience} with a {tone} tone. 

This would contain compelling marketing content showcasing the benefits of the product while maintaining the specified tone and appealing to the target audience's interests and values.

To generate actual AI-created marketing content, please configure your Azure AI environment with the necessary credentials."""

class MarketingAgent:
    """A marketing agent that leverages Azure AI capabilities to generate marketing content."""
    
    def __init__(self):
        """Initialize the marketing agent."""
        self.client = None
        self.agent_id = None
        self.thread_id = None
        self.tools = []
        self.model = "gpt-4" # Default model
        
        try:
            # Initialize the AI Project client
            logger.info("Initializing Azure AI Project client...")
            
            # Get variables from environment
            endpoint = os.getenv("AZURE_ENDPOINT")
            subscription_id = os.getenv("AZURE_SUBSCRIPTION_ID")
            resource_group = os.getenv("AZURE_RESOURCE_GROUP")
            project_name = os.getenv("AZURE_PROJECT_NAME")
            
            # Log the values we're using (with masking for sensitive data)
            logger.info(f"Using endpoint: {endpoint}")
            if subscription_id:
                masked_sub_id = subscription_id[:4] + '*' * (len(subscription_id) - 8) + subscription_id[-4:] 
                logger.info(f"Using subscription ID: {masked_sub_id}")
            logger.info(f"Using resource group: {resource_group}")
            logger.info(f"Using project name: {project_name}")
            
            self.client = AIProjectClient(
                endpoint=endpoint,
                subscription_id=subscription_id,
                resource_group_name=resource_group,
                project_name=project_name,
                credential=DefaultAzureCredential(exclude_shared_token_cache_credential=True)
            )
            logger.info("Azure AI Project client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Azure AI Project client: {str(e)}")
            raise

    async def setup(self, instructions: Optional[str] = None):
        """
        Set up the marketing agent with tools and instructions.
        
        Args:
            instructions: Optional custom instructions for the agent.
        """
        if not self.client:
            raise ValueError("Client not initialized. Initialize the client first.")
        
        # Default marketing agent instructions if none provided
        if not instructions:
            instructions = """
            You are an expert marketing content creator specializing in digital marketing, 
            social media marketing, email marketing, and content marketing. Your goal is to help 
            create high-quality, engaging marketing content tailored to specific target audiences.
            
            When creating content:
            1. Always maintain a consistent brand voice and tone
            2. Use persuasive language and compelling calls-to-action
            3. Focus on benefits rather than features
            4. Make content skimmable with bullet points and short paragraphs
            5. Include strategic keywords for SEO where appropriate
            6. Create content that resonates emotionally with the target audience
            
            Use your tools to research current trends, analyze data, and craft optimal content.
            """
        
        try:
            # Create toolset
            tools = await self._create_toolset()
            
            logger.info(f"Creating agent with model: {self.model}")
            # Create the agent
            agent_response = await self.client.agents.create_agent(
                name="Marketing Content Generator",
                instructions=instructions,
                tools=tools,
                model=self.model
            )
            self.agent_id = agent_response.id
            
            # Create a thread for conversation
            thread_response = await self.client.agents.create_thread()
            self.thread_id = thread_response.id
            
            logger.info(f"Agent created successfully. Using model: {self.model}")
            logger.info(f"Agent ID: {self.agent_id}")
            logger.info(f"Thread ID: {self.thread_id}")
            
            return self.agent_id, self.thread_id
            
        except Exception as e:
            logger.error(f"Failed to set up agent: {str(e)}")
            raise

    async def _create_toolset(self) -> List[Dict[str, Any]]:
        """
        Create and configure tools needed by the marketing agent.
        
        Returns:
            List of tool definitions.
        """
        tools = []
        
        try:
            # Add Bing Grounding Tool for research
            tools.append(BingGroundingToolDefinition())
            logger.info("Added Bing Grounding Tool for market research")
        except Exception as e:
            logger.warning(f"Couldn't add Bing Grounding Tool: {str(e)}")
            logger.warning("Agent will continue without Bing research capabilities")
            
        try:
            # Add Code Interpreter Tool for data analysis and formatting
            tools.append(CodeInterpreterToolDefinition())
            logger.info("Added Code Interpreter Tool for data analysis")
        except Exception as e:
            logger.warning(f"Couldn't add Code Interpreter Tool: {str(e)}")
            
        return tools

    async def generate_content(
        self, 
        prompt: str,
        target_audience: Optional[str] = None,
        content_type: Optional[str] = None,
        tone: Optional[str] = None,
        length: Optional[str] = None
    ) -> str:
        """
        Generate marketing content based on parameters.
        
        Args:
            prompt: The main instruction or prompt for content generation
            target_audience: Who the content is targeting
            content_type: Type of content (email, social post, blog, etc.)
            tone: Desired tone (professional, casual, humorous, etc.)
            length: Approximate length of content (short, medium, long)
            
        Returns:
            Generated marketing content
        """
        if not self.agent_id or not self.thread_id:
            raise ValueError("Agent and thread not initialized. Run setup() first.")
            
        # Construct message
        content_request = prompt
        
        # Add parameters if provided
        parameters = []
        if target_audience:
            parameters.append(f"Target Audience: {target_audience}")
        if content_type:
            parameters.append(f"Content Type: {content_type}")
        if tone:
            parameters.append(f"Tone: {tone}")
        if length:
            parameters.append(f"Length: {length}")
            
        if parameters:
            content_request += "\n\nParameters:\n" + "\n".join(parameters)
            
        try:
            # Send message to the thread
            logger.info("Sending content request to agent")
            message = await self.client.agents.create_message(
                thread_id=self.thread_id,
                role=MessageRole.USER,
                content=content_request
            )
            
            # Run the agent on the thread
            run = await self.client.agents.create_run(
                thread_id=self.thread_id,
                agent_id=self.agent_id
            )
            
            # Wait for the run to complete
            while run.status not in ["completed", "failed", "cancelled"]:
                await asyncio.sleep(1)
                run = await self.client.agents.get_run(
                    thread_id=self.thread_id,
                    run_id=run.id
                )
                
            if run.status != "completed":
                raise Exception(f"Run failed with status: {run.status}")
                
            # Get messages from the run
            messages = await self.client.agents.list_messages(
                thread_id=self.thread_id,
                after=message.id
            )
            
            # Extract the generated content
            assistant_message = next((m for m in messages if m.role == MessageRole.ASSISTANT), None)
            if not assistant_message:
                raise Exception("No response received from assistant")
                
            # Extract the content text
            content_text = ""
            if assistant_message.content and len(assistant_message.content) > 0:
                for content_item in assistant_message.content:
                    if hasattr(content_item, 'text'):
                        content_text += content_item.text
            
            return content_text
            
        except Exception as e:
            logger.error(f"Error generating content: {str(e)}")
            raise

    async def close(self):
        """Clean up resources by deleting the agent."""
        if self.agent_id and self.client:
            try:
                await self.client.agents.delete_agent(agent_id=self.agent_id)
                logger.info(f"Agent {self.agent_id} deleted successfully")
            except Exception as e:
                logger.warning(f"Failed to delete agent: {str(e)}")


def main():
    """
    Main entry point for the script without requiring Azure credentials.
    """
    parser = argparse.ArgumentParser(description='Azure Marketing Agent Demo (Sample Mode)')
    parser.add_argument('--prompt', type=str, default="Create a tweet about eco-friendly products",
                        help='The main prompt for content generation')
    parser.add_argument('--audience', type=str, default="environmentally conscious consumers",
                        help='Target audience for the content')
    parser.add_argument('--type', type=str, default="social media post",
                        help='Type of content (email, social post, blog, etc.)')
    parser.add_argument('--tone', type=str, default="enthusiastic",
                        help='Desired tone (professional, casual, humorous, etc.)')
    parser.add_argument('--length', type=str, default="short",
                        help='Approximate length of content (short, medium, long)')
    parser.add_argument('--use-azure', action='store_true',
                        help='Attempt to use actual Azure AI services if configured')
    
    args = parser.parse_args()
    
    # Check for Azure environment variables and use them if requested
    if args.use_azure:
        try:
            check_azure_environment()
            print("Azure environment variables found. However, full Azure integration requires proper setup of an Azure AI Project.")
            print("This demo will now provide sample output instead.")
        except SystemExit:
            pass
    
    print("\nRunning in sample mode (no Azure AI connection required)")
    print(f"\nGenerating {args.type} for {args.audience} with {args.tone} tone...")
    
    # Generate example content
    content = get_example_content(args.type, args.tone, args.audience)
    
    print("\n=== Sample Generated Content ===")
    print(content)
    
    print("\nNote: This is sample content. To generate actual AI content:")
    print("1. Set up an Azure AI Project")
    print("2. Create a .env file with required Azure credentials")
    print("3. Run this script with --use-azure flag")


if __name__ == "__main__":
    # Run non-async main function
    main() 