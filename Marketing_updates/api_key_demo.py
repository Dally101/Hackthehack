#!/usr/bin/env python
"""
Azure AI Marketing Demo with API Key Authentication

This script connects to Azure AI Projects using an API key for authentication.
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

# Check for Azure OpenAI API key
azure_api_key = os.environ.get('AZURE_OPENAI_API_KEY')
if not azure_api_key:
    print("Error: AZURE_OPENAI_API_KEY environment variable is required")
    print("Please add it to your .env file")
    sys.exit(1)

# Import Azure modules
try:
    from azure.core.credentials import AzureKeyCredential
    from azure.ai.projects import AIProjectClient
except ImportError:
    print("Required Azure modules not found. Please install with:")
    print("pip install azure-ai-projects~=1.0.0b7 azure-identity")
    sys.exit(1)

def generate_sample_content(content_type, audience, tone):
    """Generate sample marketing content."""
    if content_type.lower() in ["social media", "social media post", "tweet", "social"]:
        return f"""🚀 Tech enthusiasts! Our new smart devices are revolutionizing home automation with AI-powered features you've never seen before. Experience the future today! #TechInnovation #SmartHome"""
    
    elif content_type.lower() in ["email", "newsletter"]:
        return f"""Subject: Discover How Technology is Transforming Your Home Experience

Hello {audience},

Are you ready to experience the next generation of home technology?

Our latest smart devices combine cutting-edge AI with intuitive design to create a seamless home experience. From voice-activated assistants that truly understand your needs to energy management systems that learn your habits, our technology adapts to your lifestyle.

Key innovations include:
• Advanced AI algorithms that predict your preferences
• Seamless integration with your existing devices
• Energy efficiency that reduces your bills by up to 30%
• Enhanced security features with real-time monitoring

Join the thousands of satisfied customers who've transformed their homes into intelligent living spaces.

Ready to upgrade your living experience? Visit our website for an exclusive limited-time offer.

Warm regards,
The Innovation Team"""
    
    else:
        return f"""Here's a sample {content_type} for {audience} with a {tone} tone.

This would be custom-generated marketing content that highlights the benefits of our product while appealing directly to {audience} using language and references that resonate with them.

In a real implementation with Azure AI, this would be dynamically generated based on your specific requirements and brand guidelines."""

def main():
    """Main function to run the Azure marketing demo."""
    parser = argparse.ArgumentParser(description="Azure AI Marketing Demo with API Key")
    parser.add_argument("--prompt", type=str, default="Create marketing content for our tech products",
                      help="The main prompt for content generation")
    parser.add_argument("--audience", type=str, default="tech enthusiasts",
                      help="Target audience for the content")
    parser.add_argument("--type", type=str, default="social media post",
                      help="Type of content (email, social post, blog, etc.)")
    parser.add_argument("--tone", type=str, default="enthusiastic",
                      help="Desired tone (professional, casual, humorous, etc.)")
    args = parser.parse_args()
    
    # Display environment variables
    print("\nAzure Environment:")
    print(f"Using AZURE_OPENAI_ENDPOINT: {os.environ.get('AZURE_OPENAI_ENDPOINT')}")
    print(f"Using AZURE_OPENAI_DEPLOYMENT_NAME: {os.environ.get('AZURE_OPENAI_DEPLOYMENT_NAME')}")
    # Hide the actual API key
    print(f"API Key is {'configured' if azure_api_key else 'missing'}")
    
    print("\nNOTE: A complete Azure AI Projects setup requires:")
    print("1. An Azure AI Studio project")
    print("2. Proper permissions and credentials")
    print("3. A configured deployment")
    
    print("\nSince we can't fully connect to Azure AI Projects without the complete setup,")
    print("we'll generate a sample marketing content based on your parameters.\n")
    
    print(f"Generating {args.type} for {args.audience} with {args.tone} tone...")
    content = generate_sample_content(args.type, args.audience, args.tone)
    
    print("\n=== Sample Generated Content ===")
    print(content)
    
    print("\nTo use actual Azure AI for content generation, you need to:")
    print("1. Create an Azure AI Studio project")
    print("2. Configure all required settings in your .env file")
    print("3. Use the appropriate authentication method")

if __name__ == "__main__":
    main() 