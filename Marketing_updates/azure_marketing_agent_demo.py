#!/usr/bin/env python
"""
Azure Marketing Agent Demo

This script demonstrates using Azure AI Projects to create a marketing agent
that can generate various types of marketing content using Azure AI.
"""

import os
import sys
import asyncio
import argparse
import logging
from datetime import datetime
from typing import Dict, List, Optional, Union, AsyncIterator

# Azure imports
try:
    from azure.identity import DefaultAzureCredential
    from azure.ai.projects import AIProjectClient
    from azure.ai.projects.agents import Agent, Thread, Message, AgentTool, BingGroundingTool, CodeInterpreterTool
except ImportError:
    print("Error: Required Azure packages not found.")
    print("Please install with: pip install azure-ai-projects~=1.0.0b7 azure-identity")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("AzureMarketingAgent")

class MarketingAgent:
    """A marketing agent that leverages Azure AI capabilities to generate marketing content."""
    
    def __init__(self, connection_string: Optional[str] = None):
        """
        Initialize the marketing agent.
        
        Args:
            connection_string: Optional Azure connection string. If not provided, 
                               DefaultAzureCredential will be used.
        """
        self.client = None
        self.agent = None
        self.thread = None
        self.tools = []
        self.model = "gpt-4-32k"  # Default model
        
        try:
            # Initialize the AI Project client
            logger.info("Initializing Azure AI Project client...")
            self.client = AIProjectClient(
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
            self.tools = await self._create_toolset()
            
            logger.info(f"Creating agent with model: {self.model}")
            # Create the agent
            self.agent = await self.client.agents.create_agent(
                name="Marketing Content Generator",
                instructions=instructions,
                tools=self.tools,
                model=self.model
            )
            
            # Create a thread for conversation
            self.thread = await self.client.agents.create_thread()
            
            logger.info(f"Agent created successfully. Using model: {self.model}")
            logger.info(f"Agent ID: {self.agent.id}")
            logger.info(f"Thread ID: {self.thread.id}")
            
            return self.agent, self.thread
            
        except Exception as e:
            logger.error(f"Failed to set up agent: {str(e)}")
            raise

    async def _create_toolset(self) -> List[AgentTool]:
        """
        Create and configure tools needed by the marketing agent.
        
        Returns:
            List of agent tools.
        """
        tools = []
        
        try:
            # Add Bing Grounding Tool for research
            bing_tool = await BingGroundingTool.create(self.client)
            tools.append(bing_tool)
            logger.info("Added Bing Grounding Tool for market research")
        except Exception as e:
            logger.warning(f"Couldn't add Bing Grounding Tool: {str(e)}")
            logger.warning("Agent will continue without Bing research capabilities")
            
        try:
            # Add Code Interpreter Tool for data analysis and formatting
            code_tool = await CodeInterpreterTool.create(self.client)
            tools.append(code_tool)
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
        if not self.agent or not self.thread:
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
                thread_id=self.thread.id,
                role="user",
                content=content_request
            )
            
            # Run the agent on the thread
            run = await self.client.agents.create_run(
                thread_id=self.thread.id,
                agent_id=self.agent.id
            )
            
            # Wait for the run to complete
            while run.status not in ["completed", "failed", "cancelled"]:
                await asyncio.sleep(1)
                run = await self.client.agents.get_run(
                    thread_id=self.thread.id,
                    run_id=run.id
                )
                
            if run.status != "completed":
                raise Exception(f"Run failed with status: {run.status}")
                
            # Get messages from the run
            messages = await self.client.agents.list_messages(
                thread_id=self.thread.id,
                after=message.id
            )
            
            # Extract the generated content
            assistant_message = next((m for m in messages if m.role == "assistant"), None)
            if not assistant_message:
                raise Exception("No response received from assistant")
                
            return assistant_message.content[0].text
            
        except Exception as e:
            logger.error(f"Error generating content: {str(e)}")
            raise

    async def generate_content_with_streaming(
        self, 
        prompt: str,
        target_audience: Optional[str] = None,
        content_type: Optional[str] = None,
        tone: Optional[str] = None,
        length: Optional[str] = None
    ) -> AsyncIterator[str]:
        """
        Generate marketing content with streaming responses.
        
        Args:
            prompt: The main instruction or prompt for content generation
            target_audience: Who the content is targeting
            content_type: Type of content (email, social post, blog, etc.)
            tone: Desired tone (professional, casual, humorous, etc.)
            length: Approximate length of content (short, medium, long)
            
        Yields:
            Chunks of generated content as they are produced
        """
        if not self.agent or not self.thread:
            raise ValueError("Agent and thread not initialized. Run setup() first.")
            
        # Construct message similar to generate_content
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
            logger.info("Sending content request to agent (streaming)")
            message = await self.client.agents.create_message(
                thread_id=self.thread.id,
                role="user",
                content=content_request
            )
            
            # Run the agent on the thread with streaming
            stream = await self.client.agents.create_run_stream(
                thread_id=self.thread.id,
                agent_id=self.agent.id
            )
            
            # Process streamed chunks
            async for chunk in stream:
                if hasattr(chunk, 'data') and chunk.data and hasattr(chunk.data, 'content'):
                    yield chunk.data.content
                    
        except Exception as e:
            logger.error(f"Error in streaming content generation: {str(e)}")
            raise

    async def close(self):
        """Clean up resources by deleting the agent."""
        if self.agent and self.client:
            try:
                await self.client.agents.delete_agent(agent_id=self.agent.id)
                logger.info(f"Agent {self.agent.id} deleted successfully")
            except Exception as e:
                logger.warning(f"Failed to delete agent: {str(e)}")


async def main():
    """
    Main entry point for the script.
    """
    parser = argparse.ArgumentParser(description='Azure Marketing Agent Demo')
    parser.add_argument('--prompt', type=str, required=True, 
                        help='The main prompt for content generation')
    parser.add_argument('--audience', type=str, default=None,
                        help='Target audience for the content')
    parser.add_argument('--type', type=str, default=None,
                        help='Type of content (email, social post, blog, etc.)')
    parser.add_argument('--tone', type=str, default=None,
                        help='Desired tone (professional, casual, humorous, etc.)')
    parser.add_argument('--length', type=str, default=None,
                        help='Approximate length of content (short, medium, long)')
    parser.add_argument('--stream', action='store_true',
                        help='Enable streaming response')
    
    args = parser.parse_args()
    
    try:
        # Create and set up agent
        agent = MarketingAgent()
        await agent.setup()
        
        # Generate content based on arguments
        if args.stream:
            print("Generating content (streaming mode):")
            async for content_chunk in agent.generate_content_with_streaming(
                prompt=args.prompt,
                target_audience=args.audience,
                content_type=args.type,
                tone=args.tone,
                length=args.length
            ):
                print(content_chunk, end='', flush=True)
            print("\n")
        else:
            print("Generating content:")
            content = await agent.generate_content(
                prompt=args.prompt,
                target_audience=args.audience,
                content_type=args.type,
                tone=args.tone,
                length=args.length
            )
            print(content)
            
        # Clean up
        await agent.close()
        
    except Exception as e:
        logger.error(f"Error in main function: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    # Set up event loop and run main function
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(main()) 