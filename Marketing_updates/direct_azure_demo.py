#!/usr/bin/env python
"""
Direct Azure AI Marketing Demo

This script directly connects to Azure AI Projects using the environment variables
without any additional validation or filtering.
"""

import os
import sys
import asyncio
import argparse
from dotenv import load_dotenv

# Load environment variables from parent directory
parent_env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(parent_env_path)
print(f"Loaded .env from: {parent_env_path}")

# Import Azure modules
try:
    from azure.identity import DefaultAzureCredential
    from azure.ai.projects import AIProjectClient
except ImportError:
    print("Required Azure modules not found. Please install with:")
    print("pip install azure-ai-projects~=1.0.0b7 azure-identity")
    sys.exit(1)

async def main():
    """Main function to run the Azure AI Marketing demo."""
    parser = argparse.ArgumentParser(description="Direct Azure AI Marketing Demo")
    parser.add_argument("--prompt", type=str, default="Create marketing content for eco-friendly products",
                      help="The main prompt for content generation")
    parser.add_argument("--audience", type=str, default="environmentally conscious consumers",
                      help="Target audience for the content")
    parser.add_argument("--type", type=str, default="social media post",
                      help="Type of content (email, social post, blog, etc.)")
    parser.add_argument("--tone", type=str, default="enthusiastic",
                      help="Desired tone (professional, casual, humorous, etc.)")
    args = parser.parse_args()
    
    # Display environment variables (without masking)
    print("\nUsing the following Azure environment variables:")
    print(f"AZURE_ENDPOINT: {os.environ.get('AZURE_ENDPOINT')}")
    print(f"AZURE_SUBSCRIPTION_ID: {os.environ.get('AZURE_SUBSCRIPTION_ID')}")
    print(f"AZURE_RESOURCE_GROUP: {os.environ.get('AZURE_RESOURCE_GROUP')}")
    print(f"AZURE_PROJECT_NAME: {os.environ.get('AZURE_PROJECT_NAME')}")
    
    try:
        print("\nInitializing AI Project client...")
        client = AIProjectClient(
            endpoint=os.environ.get('AZURE_ENDPOINT'),
            subscription_id=os.environ.get('AZURE_SUBSCRIPTION_ID'),
            resource_group_name=os.environ.get('AZURE_RESOURCE_GROUP'),
            project_name=os.environ.get('AZURE_PROJECT_NAME'),
            credential=DefaultAzureCredential(exclude_shared_token_cache_credential=True)
        )
        print("Client initialized successfully")
        
        # Create a simple agent
        print("Creating agent...")
        agent = await client.agents.create_agent(
            name="Marketing Content Generator",
            instructions=f"You are an expert marketing content creator. Generate {args.type} content for {args.audience} with a {args.tone} tone.",
            model="gpt-4"
        )
        print(f"Agent created with ID: {agent.id}")
        
        # Create a thread
        print("Creating thread...")
        thread = await client.agents.create_thread()
        print(f"Thread created with ID: {thread.id}")
        
        # Create a message
        print("Sending message to agent...")
        message = await client.agents.create_message(
            thread_id=thread.id,
            role="user",
            content=f"{args.prompt}\n\nAudience: {args.audience}\nContent Type: {args.type}\nTone: {args.tone}"
        )
        print(f"Message sent with ID: {message.id}")
        
        # Run the agent
        print("Running agent...")
        run = await client.agents.create_run(
            thread_id=thread.id,
            agent_id=agent.id
        )
        
        # Wait for completion
        print("Waiting for the agent to generate content...")
        while run.status not in ["completed", "failed", "cancelled"]:
            await asyncio.sleep(1)
            run = await client.agents.get_run(
                thread_id=thread.id,
                run_id=run.id
            )
            print(f"Run status: {run.status}")
        
        if run.status == "completed":
            # Get the response
            messages = await client.agents.list_messages(
                thread_id=thread.id,
                after=message.id
            )
            
            response = next((m for m in messages if m.role == "assistant"), None)
            if response:
                content = response.content[0].text if response.content else "No content generated"
                print("\n=== Generated Content ===")
                print(content)
            else:
                print("No response received from the agent")
        else:
            print(f"Run failed with status: {run.status}")
            
        # Clean up
        print("\nCleaning up resources...")
        await client.agents.delete_agent(agent_id=agent.id)
        print("Resources cleaned up successfully")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Set up event loop for Windows
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(main()) 