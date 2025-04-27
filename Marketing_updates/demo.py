#!/usr/bin/env python
"""
Azure Marketing Agent Demo Script

This script demonstrates how to use the Azure Marketing Agent
for various common marketing tasks.
"""

import os
import sys
import asyncio
import argparse
from pathlib import Path

# Import the marketing agent
try:
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from azure_marketing_agent_demo import MarketingAgent
except ImportError:
    print("Error: Could not import MarketingAgent. Make sure azure_marketing_agent_demo.py is in the same directory.")
    sys.exit(1)

async def generate_social_post(agent, product_name, target_audience, tone):
    """Generate a social media post for a product."""
    print(f"\n📱 Generating social media post for {product_name}...")
    
    prompt = f"""
    Create an engaging social media post for {product_name}.
    The post should resonate with {target_audience} and encourage engagement.
    Include relevant hashtags and a compelling call-to-action.
    """
    
    content = await agent.generate_content(
        prompt=prompt,
        target_audience=target_audience,
        content_type="social media",
        tone=tone,
        length="short"
    )
    
    print("\n=== Social Media Post ===")
    print(content)
    return content

async def generate_email_newsletter(agent, topic, target_audience, tone):
    """Generate an email newsletter on a specified topic."""
    print(f"\n📧 Generating email newsletter about {topic}...")
    
    prompt = f"""
    Create an email newsletter about {topic}.
    The newsletter should be informative, engaging, and provide value to {target_audience}.
    Include a subject line, greeting, body content with sections, and a strong conclusion.
    """
    
    content = await agent.generate_content(
        prompt=prompt,
        target_audience=target_audience,
        content_type="email",
        tone=tone,
        length="medium"
    )
    
    print("\n=== Email Newsletter ===")
    print(content)
    return content

async def generate_product_description(agent, product_name, key_features, target_audience, tone):
    """Generate a product description with key features."""
    print(f"\n📦 Generating product description for {product_name}...")
    
    features_text = ", ".join(key_features)
    
    prompt = f"""
    Create a compelling product description for {product_name}.
    The product has these key features: {features_text}.
    Target audience: {target_audience}.
    The description should highlight benefits, not just features.
    """
    
    content = await agent.generate_content(
        prompt=prompt,
        target_audience=target_audience,
        content_type="product description",
        tone=tone,
        length="medium"
    )
    
    print("\n=== Product Description ===")
    print(content)
    return content

async def generate_seo_meta_content(agent, page_topic, target_keywords):
    """Generate SEO meta title and description for a webpage."""
    print(f"\n🔍 Generating SEO meta content for topic: {page_topic}...")
    
    keywords_text = ", ".join(target_keywords)
    
    prompt = f"""
    Create SEO meta title and description for a webpage about {page_topic}.
    Target keywords: {keywords_text}.
    The meta title should be compelling and under 60 characters.
    The meta description should be persuasive and under 160 characters.
    """
    
    content = await agent.generate_content(
        prompt=prompt,
        content_type="SEO meta",
        tone="professional",
        length="short"
    )
    
    print("\n=== SEO Meta Content ===")
    print(content)
    return content

async def generate_press_release(agent, company_name, announcement, industry, tone):
    """Generate a press release for a company announcement."""
    print(f"\n📰 Generating press release for {company_name}...")
    
    prompt = f"""
    Create a press release for {company_name} about {announcement}.
    The company operates in the {industry} industry.
    Include standard press release elements: headline, dateline, introduction,
    body paragraphs, boilerplate, and contact information (use placeholder).
    """
    
    content = await agent.generate_content(
        prompt=prompt,
        content_type="press release",
        tone=tone,
        length="medium"
    )
    
    print("\n=== Press Release ===")
    print(content)
    return content

async def save_content(content, filename, output_dir="demo_output"):
    """Save generated content to a file."""
    Path(output_dir).mkdir(exist_ok=True)
    file_path = os.path.join(output_dir, filename)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Content saved to {file_path}")

async def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(description='Azure Marketing Agent Demo')
    parser.add_argument('--task', type=str, choices=['social', 'email', 'product', 'seo', 'press', 'all'],
                        default='all', help='Marketing task to demonstrate')
    parser.add_argument('--save', action='store_true', help='Save output to files')
    
    args = parser.parse_args()
    
    try:
        # Create and set up agent
        print("🤖 Setting up Azure Marketing Agent...")
        agent = MarketingAgent()
        await agent.setup()
        print("✅ Agent setup complete!")
        
        # Define some example inputs
        product_name = "EcoTech Smart Thermostat"
        key_features = [
            "AI-powered temperature optimization",
            "Energy usage monitoring",
            "Mobile app control",
            "Voice assistant integration"
        ]
        target_audience = "environmentally conscious homeowners"
        company_name = "EcoTech Solutions"
        
        if args.task == 'all' or args.task == 'social':
            content = await generate_social_post(agent, product_name, target_audience, "enthusiastic")
            if args.save:
                await save_content(content, "social_post.md")
        
        if args.task == 'all' or args.task == 'email':
            content = await generate_email_newsletter(agent, "Energy Saving Tips for Summer", 
                                                     "homeowners", "informative")
            if args.save:
                await save_content(content, "email_newsletter.md")
        
        if args.task == 'all' or args.task == 'product':
            content = await generate_product_description(agent, product_name, key_features, 
                                                        target_audience, "professional")
            if args.save:
                await save_content(content, "product_description.md")
        
        if args.task == 'all' or args.task == 'seo':
            content = await generate_seo_meta_content(agent, "Smart Home Energy Efficiency", 
                                                     ["smart thermostat", "energy saving", "home automation"])
            if args.save:
                await save_content(content, "seo_meta.md")
        
        if args.task == 'all' or args.task == 'press':
            content = await generate_press_release(agent, company_name, 
                                                 "launch of their new AI-powered smart thermostat", 
                                                 "smart home technology", "formal")
            if args.save:
                await save_content(content, "press_release.md")
        
        # Clean up
        print("\n🧹 Cleaning up resources...")
        await agent.close()
        print("✅ Demo completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    # Set up event loop and run main function
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(main()) 