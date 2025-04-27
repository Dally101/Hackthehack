#!/usr/bin/env python
"""
Marketing AI Agent

Implementation of a marketing content generation agent using Azure AI Foundry
following the structure from https://github.com/Azure-Samples/get-started-with-ai-agents
"""

import os
import sys
import asyncio
import argparse
import logging
from typing import Dict, List, Optional, Union, Any
import json
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("MarketingAgent")

# Load environment variables from parent directory
parent_env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(parent_env_path)
logger.info(f"Loaded environment from: {parent_env_path}")

# Attempt to import Azure modules; if missing, fall back to sample content only
try:
    from azure.identity import DefaultAzureCredential
    from azure.ai.projects import AIProjectClient
    from azure.core.exceptions import ResourceNotFoundError
except ImportError as e:
    logger.warning(f"Azure modules not found ({e}); will use sample content fallback mode.")
    DefaultAzureCredential = None  # type: ignore
    AIProjectClient = None  # type: ignore
    ResourceNotFoundError = None  # type: ignore

class MarketingAgent:
    """Marketing content generation agent using Azure AI Foundry."""
    
    def __init__(self, 
                endpoint: Optional[str] = None,
                subscription_id: Optional[str] = None,
                resource_group: Optional[str] = None,
                project_name: Optional[str] = None):
        """
        Initialize the Marketing AI Agent.
        
        Args:
            endpoint: Azure AI Foundry endpoint
            subscription_id: Azure subscription ID
            resource_group: Azure resource group name
            project_name: Azure AI Project name
        """
        # Use provided values or fall back to environment variables
        self.endpoint = endpoint or os.environ.get("AZURE_ENDPOINT")
        self.subscription_id = subscription_id or os.environ.get("AZURE_SUBSCRIPTION_ID")
        self.resource_group = resource_group or os.environ.get("AZURE_RESOURCE_GROUP")
        self.project_name = project_name or os.environ.get("AZURE_PROJECT_NAME")
        
        # Instance variables
        self.client = None
        self.agent = None
        self.thread = None
        self.initialized = False
        
        # Marketing-specific configuration
        self.agent_name = "Marketing Content Generator"
        self.model_name = os.environ.get("AZURE_MODEL_NAME", "gpt-4o-mini")
        
        # Check required configuration
        self._validate_config()
    
    def _validate_config(self) -> None:
        """Validate that all required configuration is present."""
        missing = []
        if not self.endpoint:
            missing.append("AZURE_ENDPOINT")
        if not self.subscription_id:
            missing.append("AZURE_SUBSCRIPTION_ID")
        if not self.resource_group:
            missing.append("AZURE_RESOURCE_GROUP")
        if not self.project_name:
            missing.append("AZURE_PROJECT_NAME")
        
        if missing:
            logger.error(f"Missing required configuration: {', '.join(missing)}")
            logger.info("Falling back to sample content generation mode")
    
    async def initialize(self) -> bool:
        """
        Initialize the client and create agent and thread.
        
        Returns:
            bool: True if initialization was successful, False otherwise
        """
        if self.initialized:
            return True
            
        # Skip initialization if missing required config
        if not all([self.endpoint, self.subscription_id, self.resource_group, self.project_name]):
            logger.warning("Skipping Azure initialization due to missing configuration")
            return False
            
        try:
            logger.info("Initializing Azure AI Project client...")
            
            # Create the client with proper authentication
            self.client = AIProjectClient(
                endpoint=self.endpoint,
                subscription_id=self.subscription_id,
                resource_group_name=self.resource_group,
                project_name=self.project_name,
                credential=DefaultAzureCredential(exclude_shared_token_cache_credential=True)
            )
            logger.info("Azure AI Project client initialized successfully")
            
            # Create or retrieve the agent
            await self._create_or_get_agent()
            
            # Create a thread for conversation
            self.thread = await self.client.agents.create_thread()
            logger.info(f"Thread created with ID: {self.thread.id}")
            
            self.initialized = True
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize Azure client: {str(e)}")
            import traceback
            traceback.print_exc()
            return False
    
    async def _create_or_get_agent(self) -> None:
        """Create a new agent or get an existing one with the same name."""
        try:
            # First try to get existing agents
            agents = await self.client.agents.list_agents()
            existing_agent = next((a for a in agents if a.name == self.agent_name), None)
            
            if existing_agent:
                logger.info(f"Using existing agent: {existing_agent.id}")
                self.agent = existing_agent
            else:
                # Create a new agent with marketing instructions
                logger.info(f"Creating new agent with model: {self.model_name}")
                self.agent = await self.client.agents.create_agent(
                    name=self.agent_name,
                    instructions=self._get_marketing_instructions(),
                    model=self.model_name
                )
                logger.info(f"Agent created with ID: {self.agent.id}")
        except Exception as e:
            logger.error(f"Error creating or getting agent: {str(e)}")
            raise
    
    def _get_marketing_instructions(self) -> str:
        """Get the instructions for the marketing agent."""
        return """
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
        7. Follow best practices for each content type (email, social media, blog, etc.)
        8. Include appropriate formatting and structure for the content type
        """
    
    async def generate_content(self, 
                             prompt: str,
                             audience: str,
                             content_type: str,
                             tone: str,
                             length: str = "medium") -> str:
        """
        Generate marketing content using the agent.
        
        Args:
            prompt: Main content instruction or prompt
            audience: Target audience description
            content_type: Type of content (email, social post, blog, etc.)
            tone: Desired tone (professional, casual, enthusiastic, etc.)
            length: Content length (short, medium, long)
            
        Returns:
            str: Generated marketing content
        """
        # Fall back to sample content if not initialized
        if not self.initialized:
            return self._generate_sample_content(content_type, audience, tone)
        
        try:
            # Format the message for the agent
            message_content = f"{prompt}\n\nParameters:\n"
            message_content += f"Target Audience: {audience}\n"
            message_content += f"Content Type: {content_type}\n"
            message_content += f"Tone: {tone}\n"
            message_content += f"Length: {length}\n"
            
            # Send message to thread
            logger.info("Sending content request to agent...")
            message = await self.client.agents.create_message(
                thread_id=self.thread.id,
                role="user",
                content=message_content
            )
            logger.info(f"Message sent with ID: {message.id}")
            
            # Run the agent
            logger.info("Running agent to generate content...")
            run = await self.client.agents.create_run(
                thread_id=self.thread.id,
                agent_id=self.agent.id
            )
            
            # Poll for completion
            logger.info("Waiting for content generation to complete...")
            while run.status not in ["completed", "failed", "cancelled"]:
                await asyncio.sleep(1)
                run = await self.client.agents.get_run(
                    thread_id=self.thread.id,
                    run_id=run.id
                )
                logger.info(f"Run status: {run.status}")
            
            if run.status != "completed":
                logger.error(f"Run failed with status: {run.status}")
                return f"Failed to generate content: {run.status}"
            
            # Get the response
            logger.info("Retrieving generated content...")
            messages = await self.client.agents.list_messages(
                thread_id=self.thread.id,
                after=message.id
            )
            
            # Extract content from assistant message
            assistant_message = next((m for m in messages if m.role == "assistant"), None)
            if not assistant_message:
                logger.error("No response received from assistant")
                return "No content could be generated."
            
            content_text = ""
            if assistant_message.content and len(assistant_message.content) > 0:
                for content_item in assistant_message.content:
                    if hasattr(content_item, 'text'):
                        content_text += content_item.text
            
            return content_text
            
        except Exception as e:
            logger.error(f"Error generating content: {str(e)}")
            import traceback
            traceback.print_exc()
            return f"Error generating content: {str(e)}"
    
    def _generate_sample_content(self, content_type: str, audience: str, tone: str) -> str:
        """Generate sample marketing content when Azure is not available."""
        if content_type.lower() in ["social media", "social media post", "tweet", "social"]:
            return f"""🚀 Attention {audience}! Our innovative products are transforming the industry with features you won't find anywhere else. Experience the difference today! #Innovation #LeadingEdge"""
        
        elif content_type.lower() in ["email", "newsletter"]:
            return f"""Subject: Discover How Our Products Can Transform Your Experience

Hello {audience},

Are you ready to experience our innovative solutions?

Our latest products combine cutting-edge technology with intuitive design to create a seamless experience. From advanced features that truly understand your needs to efficiency improvements that save you time and money, our offerings adapt to your lifestyle.

Key benefits include:
• Innovative technology that anticipates your needs
• Seamless integration with your existing systems
• Cost savings of up to 30%
• Enhanced performance with real-time monitoring

Join thousands of satisfied customers who have already transformed their experience.

Ready to elevate your experience? Visit our website for an exclusive limited-time offer.

Warm regards,
The Marketing Team"""
        
        elif content_type.lower() in ["blog post", "article", "blog"]:
            return f"""# 5 Ways Our Solutions Are Transforming the Industry

In today's fast-paced world, {audience} are seeking innovative solutions to everyday challenges. The good news? Our offerings have never been more exciting or accessible.

## The Evolution of Excellence

Recent studies show that over 70% of consumers are actively searching for solutions that provide meaningful improvements. This shift has driven us to rethink our approach from the ground up.

## How Our Solutions Make a Difference

### 1. Efficiency That Pays For Itself

Our innovative products don't just improve your experience—they improve your bottom line. Our customers report saving 25% more time and resources compared to conventional solutions.

### 2. Superior Materials, Superior Performance

We use only the highest quality components that outperform conventional alternatives in durability and functionality. This commitment to quality ensures a longer lifespan and better performance.

### 3. Intelligent Design Reduces Waste

Our design philosophy emphasizes longevity, repairability, and sustainability. We proudly offer lifetime support on our products, with modular components that can be easily replaced.

### 4. Enhanced User Experience

Our products contain fewer complications and a more intuitive interface, leading to better user satisfaction and fewer support issues. This creates a better experience for everyone.

### 5. Innovation and Practicality Join Forces

Our technology works hand-in-hand with practical needs. From intelligent interfaces that learn your preferences to automated features that save time, our innovations help maximize your efficiency.

## Making the Transition

Transforming your experience doesn't require a complete overhaul overnight. Start by exploring our solutions that address your most pressing needs, where the impact will be greatest.

Remember that every improvement contributes to a larger collective benefit. Your choice today helps create a better tomorrow."""
        
        else:
            return f"""Here's a sample {content_type} for {audience} with a {tone} tone.

This would be custom-generated marketing content that highlights the benefits of our product while appealing directly to {audience} using language and references that resonate with them.

In a real implementation with Azure AI, this would be dynamically generated based on your specific requirements and brand guidelines."""
    
    async def cleanup(self) -> None:
        """Clean up resources."""
        if self.initialized and self.client and self.agent:
            try:
                logger.info(f"Deleting agent {self.agent.id}...")
                await self.client.agents.delete_agent(agent_id=self.agent.id)
                logger.info("Agent deleted successfully")
            except Exception as e:
                logger.warning(f"Error cleaning up agent: {str(e)}")


async def main():
    """Main function for the marketing agent."""
    parser = argparse.ArgumentParser(description="Marketing AI Agent")
    parser.add_argument("--prompt", type=str, default="Create marketing content for our products",
                      help="The main prompt for content generation")
    parser.add_argument("--audience", type=str, default="potential customers",
                      help="Target audience for the content")
    parser.add_argument("--type", type=str, default="social media post",
                      help="Type of content (email, social post, blog, etc.)")
    parser.add_argument("--tone", type=str, default="professional",
                      help="Desired tone (professional, casual, enthusiastic, etc.)")
    parser.add_argument("--length", type=str, default="medium",
                      help="Content length (short, medium, long)")
    parser.add_argument("--save", action="store_true",
                      help="Save the generated content to a file")
    parser.add_argument("--output-dir", type=str, default="generated_content",
                      help="Directory to save generated content")
    
    args = parser.parse_args()
    
    # Create and initialize the agent
    agent = MarketingAgent()
    initialized = await agent.initialize()
    
    if initialized:
        logger.info("Azure AI Foundry agent initialized successfully")
    else:
        logger.warning("Using sample content generation mode (Azure AI not configured)")
    
    # Generate content
    print(f"\nGenerating {args.type} for {args.audience} with {args.tone} tone...")
    content = await agent.generate_content(
        prompt=args.prompt,
        audience=args.audience,
        content_type=args.type,
        tone=args.tone,
        length=args.length
    )
    
    # Display the generated content
    print("\n=== Generated Content ===")
    print(content)
    
    # Save content if requested
    if args.save:
        os.makedirs(args.output_dir, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{args.type.replace(' ', '_')}_{timestamp}.txt"
        file_path = os.path.join(args.output_dir, filename)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"\nContent saved to: {file_path}")
    
    # Clean up
    await agent.cleanup()
    logger.info("Marketing agent session completed")


if __name__ == "__main__":
    # Set up event loop for Windows
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(main()) 