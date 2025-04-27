#!/usr/bin/env python
"""
Marketing Agent for content generation using Azure AI Projects.
This agent connects to Azure AI Agent Service to create unique 
and engaging marketing materials based on user instructions.
"""

import os
import argparse
import asyncio
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import BingGroundingTool, FileSearchTool, CodeInterpreterTool
from azure.identity import DefaultAzureCredential
from typing import Optional, List, Dict, Any
from datetime import datetime

class MarketingAgent:
    """Marketing Agent that uses Azure AI Agent Service to generate marketing content."""

    def __init__(self, connection_string: Optional[str] = None):
        """Initialize the Marketing Agent with Azure credentials."""
        # Use passed connection string or environment variable
        self.connection_string = connection_string or os.environ.get("PROJECT_CONNECTION_STRING")
        if not self.connection_string:
            raise ValueError("PROJECT_CONNECTION_STRING environment variable or connection string parameter is required")
            
        # Create AI Project client with default Azure credentials
        self.project_client = AIProjectClient.from_connection_string(
            credential=DefaultAzureCredential(),
            conn_str=self.connection_string
        )
        
        # Model deployment name - defaults to gpt-4o but can be overridden
        self.model_deployment_name = os.environ.get("MODEL_DEPLOYMENT_NAME", "gpt-4o")
        self.agent = None
        self.thread = None

    async def setup(self, instructions: str = "You are a marketing specialist who creates engaging content"):
        """Setup the agent with the necessary tools and instructions."""
        # Set up tools for the agent
        toolset = self._create_toolset()
        
        # Create the agent with the specified tools and instructions
        print(f"Setting up marketing agent with model: {self.model_deployment_name}")
        
        self.agent = await self.project_client.agents.create_agent(
            model=self.model_deployment_name,
            name="Marketing Content Generator",
            instructions=instructions,
            tools=toolset.tool_definitions,
            tool_resources=toolset.tool_resources
        )
        print(f"Created agent with ID: {self.agent.id}")
        
        # Create a thread for the conversation
        self.thread = await self.project_client.agents.create_thread()
        print(f"Created thread with ID: {self.thread.id}")
        
        return self.agent, self.thread

    def _create_toolset(self):
        """Create a toolset with the necessary tools for marketing content generation."""
        # Set up individual tools
        tools = []
        tool_resources = {}
        
        # Setup Bing Grounding for research if connection exists
        try:
            bing_connection = self.project_client.connections.get_default("bing")
            if bing_connection:
                bing_tool = BingGroundingTool(connection_id=bing_connection.id)
                tools.extend(bing_tool.definitions)
        except Exception as e:
            print(f"Bing Grounding tool setup failed: {str(e)}. Proceeding without Bing integration.")
            
        # Set up code interpreter for formatting and data analysis
        code_interpreter = CodeInterpreterTool()
        tools.extend(code_interpreter.definitions)
        tool_resources.update(code_interpreter.resources)
        
        # Package tools and resources
        class ToolSet:
            def __init__(self, definitions, resources):
                self.tool_definitions = definitions
                self.tool_resources = resources
                
        return ToolSet(tools, tool_resources)

    async def generate_content(self, 
                         prompt: str, 
                         target_audience: str = "general", 
                         content_type: str = "blog post",
                         tone: str = "professional",
                         length: str = "medium") -> str:
        """Generate marketing content based on the given parameters."""
        if not self.agent or not self.thread:
            await self.setup()
        
        # Create a structured message with content requirements
        message_content = (
            f"Please create a {tone} {content_type} about the following topic: {prompt}\n\n"
            f"Target audience: {target_audience}\n"
            f"Desired length: {length}\n"
            f"Current date: {datetime.now().strftime('%B %d, %Y')}\n\n"
            f"Include compelling headlines, engaging content, and a clear call to action."
        )
        
        # Send message to the thread
        message = await self.project_client.agents.create_message(
            thread_id=self.thread.id,
            role="user",
            content=message_content
        )
        print(f"Sent message with ID: {message.id}")
        
        # Run the agent to process the message
        print("Generating content...")
        run = await self.project_client.agents.create_and_process_run(
            thread_id=self.thread.id,
            agent_id=self.agent.id
        )
        
        if run.status == "completed":
            # Get messages from the thread to retrieve the generated content
            messages = await self.project_client.agents.list_messages(thread_id=self.thread.id)
            
            # Get the last message from the agent
            for message in messages.data:
                if message.role == "assistant":
                    for content_item in message.content:
                        if hasattr(content_item, "text") and hasattr(content_item.text, "value"):
                            return content_item.text.value
            
            return "No content was generated."
        else:
            return f"Run failed with status: {run.status}. Error: {run.last_error}"

    async def generate_content_with_streaming(self, prompt: str, **kwargs):
        """Generate marketing content with streaming response."""
        if not self.agent or not self.thread:
            await self.setup()
            
        # Create a structured message with content requirements
        message_content = (
            f"Please create marketing content about: {prompt}\n\n"
        )
        
        for key, value in kwargs.items():
            message_content += f"{key.replace('_', ' ').title()}: {value}\n"
            
        # Send message to the thread
        await self.project_client.agents.create_message(
            thread_id=self.thread.id,
            role="user",
            content=message_content
        )
        
        # Create a stream for the agent's response
        async with self.project_client.agents.create_stream(
            thread_id=self.thread.id, 
            agent_id=self.agent.id
        ) as stream:
            async for event_type, event_data, func_return in stream:
                yield func_return

    async def close(self):
        """Clean up resources."""
        if self.agent:
            await self.project_client.agents.delete_agent(self.agent.id)
            print(f"Deleted agent with ID: {self.agent.id}")
            
async def main():
    """Run the marketing agent as a standalone script."""
    parser = argparse.ArgumentParser(description="Generate marketing content using Azure AI Agent Service")
    parser.add_argument("--prompt", required=True, help="The main topic for content generation")
    parser.add_argument("--audience", default="general", help="Target audience for the content")
    parser.add_argument("--content-type", default="blog post", help="Type of content to generate")
    parser.add_argument("--tone", default="professional", help="Tone of the content")
    parser.add_argument("--length", default="medium", help="Length of the content")
    parser.add_argument("--stream", action="store_true", help="Stream the content as it's generated")
    
    args = parser.parse_args()
    
    agent = MarketingAgent()
    
    try:
        if args.stream:
            async for chunk in agent.generate_content_with_streaming(
                args.prompt,
                target_audience=args.audience,
                content_type=args.content_type,
                tone=args.tone,
                length=args.length
            ):
                if chunk:
                    print(chunk, end="", flush=True)
        else:
            content = await agent.generate_content(
                args.prompt,
                args.audience,
                args.content_type,
                args.tone,
                args.length
            )
            print("\n--- Generated Marketing Content ---\n")
            print(content)
    finally:
        await agent.close()

if __name__ == "__main__":
    asyncio.run(main()) 