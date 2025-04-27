#!/usr/bin/env python
"""
Simple Azure AI Marketing Demo

This script demonstrates how to use Azure AI Projects directly for marketing content generation.
"""

import os
import asyncio
import argparse
import logging
from datetime import datetime
from typing import Optional

# Azure imports
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient
from azure.ai.projects.agents import BingGroundingTool, CodeInterpreterTool

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("AzureMarketingDemo")

async def setup_agent():
    """Set up the Azure AI agent."""
    try:
        # Initialize the client
        client = AIProjectClient(
            credential=DefaultAzureCredential(exclude_shared_token_cache_credential=True)
        )
        logger.info("Azure AI Project client initialized")
        
        # Create the agent's toolset
        tools = []
        try:
            # Add research tool
            bing_tool = await BingGroundingTool.create(client)
            tools.append(bing_tool)
            logger.info("Added Bing tool")
        except Exception as e:
            logger.warning(f"Couldn't add Bing tool: {e}")
            
        try:
            # Add code interpreter
            code_tool = await CodeInterpreterTool.create(client)
            tools.append(code_tool)
            logger.info("Added Code Interpreter tool")
        except Exception as e:
            logger.warning(f"Couldn't add Code Interpreter tool: {e}")
        
        # Create the agent
        instructions = """
        You are an expert marketing content creator specializing in digital marketing, 
        social media marketing, email marketing, and content marketing. Your goal is to 
        create high-quality, engaging marketing content tailored to specific audiences.
        """
        
        agent = await client.agents.create_agent(
            name="Simple Marketing Generator",
            instructions=instructions,
            tools=tools,
            model="gpt-4"
        )
        logger.info(f"Agent created successfully: {agent.id}")
        
        # Create a thread for conversation
        thread = await client.agents.create_thread()
        logger.info(f"Thread created: {thread.id}")
        
        return client, agent, thread
    
    except Exception as e:
        logger.error(f"Failed to set up agent: {e}")
        raise

async def generate_marketing_content(client, agent, thread, prompt, content_type, tone):
    """Generate marketing content using the agent."""
    try:
        # Create the message
        formatted_prompt = f"""
        {prompt}
        
        Content type: {content_type}
        Tone: {tone}
        
        Please be creative, engaging, and persuasive.
        """
        
        logger.info("Sending request to agent")
        message = await client.agents.create_message(
            thread_id=thread.id,
            role="user",
            content=formatted_prompt
        )
        
        # Run the agent
        run = await client.agents.create_run(
            thread_id=thread.id,
            agent_id=agent.id
        )
        logger.info(f"Run created: {run.id}")
        
        # Wait for completion
        while run.status not in ["completed", "failed", "cancelled"]:
            logger.info(f"Run status: {run.status}")
            await asyncio.sleep(2)
            run = await client.agents.get_run(
                thread_id=thread.id,
                run_id=run.id
            )
        
        if run.status != "completed":
            logger.error(f"Run failed with status: {run.status}")
            return f"Failed to generate content: {run.status}"
        
        # Get the response
        messages = await client.agents.list_messages(
            thread_id=thread.id,
            after=message.id
        )
        
        assistant_message = next((m for m in messages if m.role == "assistant"), None)
        if not assistant_message:
            return "No response received"
        
        return assistant_message.content[0].text
    
    except Exception as e:
        logger.error(f"Error generating content: {e}")
        return f"Error: {str(e)}"

async def cleanup(client, agent):
    """Clean up resources."""
    try:
        await client.agents.delete_agent(agent_id=agent.id)
        logger.info(f"Agent {agent.id} deleted")
    except Exception as e:
        logger.warning(f"Failed to delete agent: {e}")

async def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description='Simple Azure AI Marketing Demo')
    parser.add_argument('--prompt', type=str, default="Create a social media post about a new smartphone",
                        help='Content generation prompt')
    parser.add_argument('--type', type=str, default="social media post",
                        help='Content type (e.g., social media post, email, blog)')
    parser.add_argument('--tone', type=str, default="enthusiastic",
                        help='Tone of the content (e.g., professional, casual, enthusiastic)')
    
    args = parser.parse_args()
    
    try:
        # Set up the agent
        print("Setting up Azure AI agent...")
        client, agent, thread = await setup_agent()
        
        # Generate content
        print(f"\nGenerating {args.type} with {args.tone} tone...")
        content = await generate_marketing_content(
            client=client,
            agent=agent,
            thread=thread,
            prompt=args.prompt,
            content_type=args.type,
            tone=args.tone
        )
        
        # Display the result
        print("\n=== Generated Content ===")
        print(content)
        
        # Clean up
        print("\nCleaning up resources...")
        await cleanup(client, agent)
        print("Demo completed successfully!")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    # Set up event loop and run main
    if os.name == 'nt':  # Windows
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(main()) 