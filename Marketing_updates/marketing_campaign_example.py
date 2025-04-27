#!/usr/bin/env python
"""
Marketing Campaign Example

This script demonstrates how to use the Azure Marketing Agent to generate
a complete marketing campaign with multiple content pieces.
"""

import os
import sys
import asyncio
import argparse
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

# Import the marketing agent
try:
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from azure_marketing_agent_demo import MarketingAgent
except ImportError:
    print("Error: Could not import MarketingAgent. Make sure azure_marketing_agent_demo.py is in the same directory.")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("MarketingCampaignExample")

class MarketingCampaignGenerator:
    """Generates a complete marketing campaign using the Azure Marketing Agent."""
    
    def __init__(self, output_dir: str = "campaign_output"):
        """
        Initialize the marketing campaign generator.
        
        Args:
            output_dir: Directory to save generated content
        """
        self.output_dir = output_dir
        self.agent = None
        Path(output_dir).mkdir(exist_ok=True)
        
    async def setup(self):
        """Set up the marketing agent."""
        self.agent = MarketingAgent()
        await self.agent.setup()
        
    async def generate_campaign(self, 
                               product_name: str,
                               campaign_name: str,
                               target_audience: str,
                               key_features: List[str],
                               unique_selling_points: List[str],
                               campaign_duration: str,
                               brand_tone: str):
        """
        Generate a complete marketing campaign.
        
        Args:
            product_name: Name of the product
            campaign_name: Name of the campaign
            target_audience: Description of the target audience
            key_features: List of key product features
            unique_selling_points: List of unique selling points
            campaign_duration: Duration of the campaign (e.g., "2 weeks")
            brand_tone: Tone of the brand (e.g., "professional", "friendly")
        """
        if not self.agent:
            raise ValueError("Agent not set up. Run setup() first.")
            
        # Create campaign plan
        logger.info("Generating campaign plan...")
        campaign_plan = await self._generate_campaign_plan(
            product_name, campaign_name, target_audience, 
            key_features, unique_selling_points, campaign_duration, brand_tone
        )
        self._save_content("campaign_plan.md", campaign_plan)
        
        # Generate email content
        logger.info("Generating email content...")
        email_content = await self._generate_email_content(
            product_name, campaign_name, target_audience, key_features, brand_tone
        )
        self._save_content("email_content.html", email_content)
        
        # Generate social media posts
        logger.info("Generating social media content...")
        social_media_content = await self._generate_social_media_content(
            product_name, campaign_name, target_audience, key_features, brand_tone
        )
        self._save_content("social_media_content.md", social_media_content)
        
        # Generate landing page copy
        logger.info("Generating landing page content...")
        landing_page_content = await self._generate_landing_page_content(
            product_name, campaign_name, target_audience, 
            key_features, unique_selling_points, brand_tone
        )
        self._save_content("landing_page_content.html", landing_page_content)
        
        # Generate ad copy
        logger.info("Generating ad copy...")
        ad_copy = await self._generate_ad_copy(
            product_name, campaign_name, target_audience, unique_selling_points, brand_tone
        )
        self._save_content("ad_copy.md", ad_copy)
        
        # Create campaign summary with metrics projections
        logger.info("Generating campaign summary with metrics projections...")
        campaign_summary = await self._generate_campaign_summary(
            product_name, campaign_name, target_audience, campaign_duration
        )
        self._save_content("campaign_summary.md", campaign_summary)
        
        # Create campaign metadata file
        metadata = {
            "campaign_name": campaign_name,
            "product_name": product_name,
            "target_audience": target_audience,
            "key_features": key_features,
            "unique_selling_points": unique_selling_points,
            "campaign_duration": campaign_duration,
            "brand_tone": brand_tone,
            "generated_at": datetime.now().isoformat(),
            "files": [
                "campaign_plan.md",
                "email_content.html",
                "social_media_content.md",
                "landing_page_content.html",
                "ad_copy.md",
                "campaign_summary.md"
            ]
        }
        self._save_content("campaign_metadata.json", json.dumps(metadata, indent=2))
        
        logger.info(f"Campaign generation complete. All files saved to {self.output_dir}")
        return metadata
        
    async def _generate_campaign_plan(self, 
                                     product_name: str,
                                     campaign_name: str,
                                     target_audience: str,
                                     key_features: List[str],
                                     unique_selling_points: List[str],
                                     campaign_duration: str,
                                     brand_tone: str) -> str:
        """Generate a marketing campaign plan."""
        features_text = "\n".join([f"- {feature}" for feature in key_features])
        usps_text = "\n".join([f"- {usp}" for usp in unique_selling_points])
        
        prompt = f"""
        Create a detailed marketing campaign plan for the following:
        
        Product: {product_name}
        Campaign Name: {campaign_name}
        Target Audience: {target_audience}
        Campaign Duration: {campaign_duration}
        
        Key Product Features:
        {features_text}
        
        Unique Selling Points:
        {usps_text}
        
        The campaign plan should include:
        1. Executive Summary
        2. Campaign Objectives
        3. Target Audience Analysis
        4. Channel Strategy
        5. Content Calendar
        6. Budget Allocation
        7. Key Performance Indicators
        8. Timeline with key milestones
        9. Risk Assessment
        
        Please format this as a professional marketing document in Markdown.
        """
        
        return await self.agent.generate_content(
            prompt=prompt,
            target_audience="marketing professionals",
            content_type="marketing plan",
            tone=brand_tone,
            length="long"
        )
        
    async def _generate_email_content(self,
                                     product_name: str,
                                     campaign_name: str,
                                     target_audience: str,
                                     key_features: List[str],
                                     brand_tone: str) -> str:
        """Generate marketing email content in HTML format."""
        features_text = ", ".join(key_features)
        
        prompt = f"""
        Create a marketing email for the following:
        
        Product: {product_name}
        Campaign Name: {campaign_name}
        Target Audience: {target_audience}
        Key Features: {features_text}
        
        The email should include:
        1. An attention-grabbing subject line
        2. Compelling opening paragraph
        3. Key benefits of the product
        4. A strong call-to-action
        5. Professional closing
        
        Please format this as a complete HTML email (including <!DOCTYPE html>, <html>, <head>, and <body> tags).
        Use responsive design principles. Use a clean, modern design with a color scheme that would work well for this product.
        Include placeholder text for images: [IMAGE: Description] where appropriate.
        """
        
        return await self.agent.generate_content(
            prompt=prompt,
            target_audience=target_audience,
            content_type="email",
            tone=brand_tone,
            length="medium"
        )
        
    async def _generate_social_media_content(self,
                                            product_name: str,
                                            campaign_name: str,
                                            target_audience: str,
                                            key_features: List[str],
                                            brand_tone: str) -> str:
        """Generate social media content for various platforms."""
        features_text = ", ".join(key_features)
        
        prompt = f"""
        Create a set of social media posts for the following:
        
        Product: {product_name}
        Campaign Name: {campaign_name}
        Target Audience: {target_audience}
        Key Features: {features_text}
        
        Please create:
        1. 5 Twitter/X posts (280 char max) with hashtag suggestions
        2. 3 LinkedIn posts (longer form, professional)
        3. 3 Facebook posts with engaging questions
        4. 3 Instagram captions with hashtag suggestions
        
        For each platform, provide a content strategy paragraph explaining the approach.
        Format as Markdown with clear sections for each platform.
        Include image/video suggestions in brackets: [IMAGE: Description] where appropriate.
        """
        
        return await self.agent.generate_content(
            prompt=prompt,
            target_audience=target_audience,
            content_type="social media",
            tone=brand_tone,
            length="long"
        )
        
    async def _generate_landing_page_content(self,
                                            product_name: str,
                                            campaign_name: str,
                                            target_audience: str,
                                            key_features: List[str],
                                            unique_selling_points: List[str],
                                            brand_tone: str) -> str:
        """Generate landing page content in HTML format."""
        features_text = "\n".join([f"- {feature}" for feature in key_features])
        usps_text = "\n".join([f"- {usp}" for usp in unique_selling_points])
        
        prompt = f"""
        Create landing page content for the following:
        
        Product: {product_name}
        Campaign Name: {campaign_name}
        Target Audience: {target_audience}
        
        Key Product Features:
        {features_text}
        
        Unique Selling Points:
        {usps_text}
        
        The landing page should include:
        1. Headline and subheadline
        2. Hero section content
        3. Feature sections with compelling copy
        4. Benefits section
        5. Testimonial placeholders
        6. Call-to-action sections
        7. FAQ section with at least 5 questions and answers
        
        Please format this as complete HTML (including <!DOCTYPE html>, <html>, <head>, and <body> tags).
        Use responsive design principles. Include placeholder text for images: [IMAGE: Description] where appropriate.
        Style the page using inline CSS or a style section. Use modern, clean design principles.
        """
        
        return await self.agent.generate_content(
            prompt=prompt,
            target_audience=target_audience,
            content_type="landing page",
            tone=brand_tone,
            length="long"
        )
        
    async def _generate_ad_copy(self,
                               product_name: str,
                               campaign_name: str,
                               target_audience: str,
                               unique_selling_points: List[str],
                               brand_tone: str) -> str:
        """Generate ad copy for various platforms."""
        usps_text = ", ".join(unique_selling_points)
        
        prompt = f"""
        Create ad copy for the following:
        
        Product: {product_name}
        Campaign Name: {campaign_name}
        Target Audience: {target_audience}
        Unique Selling Points: {usps_text}
        
        Please create:
        1. 3 sets of Google Ads copy (headline, description line 1, description line 2)
        2. 3 sets of Facebook Ads copy (headline, main text, description)
        3. 3 sets of LinkedIn Ads copy (headline, main text, description)
        4. 2 sets of Display Ad copy (headline, subheadline, body, CTA)
        
        Format as Markdown with clear sections for each platform.
        Include character counts for each section to ensure they meet platform requirements.
        For each platform, provide a brief optimization strategy.
        """
        
        return await self.agent.generate_content(
            prompt=prompt,
            target_audience=target_audience,
            content_type="ad copy",
            tone=brand_tone,
            length="medium"
        )
        
    async def _generate_campaign_summary(self,
                                        product_name: str,
                                        campaign_name: str,
                                        target_audience: str,
                                        campaign_duration: str) -> str:
        """Generate a campaign summary with projected metrics."""
        
        prompt = f"""
        Create a marketing campaign summary with projected metrics for the following:
        
        Product: {product_name}
        Campaign Name: {campaign_name}
        Target Audience: {target_audience}
        Campaign Duration: {campaign_duration}
        
        Please include:
        1. Executive summary of the campaign strategy
        2. Channel breakdown with projected metrics:
           - Email: Open rates, click rates, conversion rates
           - Social Media: Engagement rates, reach, shares
           - Website: Traffic, time on page, bounce rate
           - Paid Advertising: CTR, CPC, conversion rate
        3. ROI projection with cost assumptions
        4. Key success metrics and benchmarks
        5. Monitoring and optimization recommendations
        
        Format as a professional Markdown document with tables for metrics.
        Make realistic projections based on industry standards.
        """
        
        return await self.agent.generate_content(
            prompt=prompt,
            target_audience="marketing managers",
            content_type="report",
            tone="professional",
            length="medium"
        )
        
    def _save_content(self, filename: str, content: str):
        """Save generated content to a file."""
        file_path = os.path.join(self.output_dir, filename)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        logger.info(f"Saved content to {file_path}")
        
    async def close(self):
        """Clean up resources."""
        if self.agent:
            await self.agent.close()


async def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(description='Marketing Campaign Generator')
    parser.add_argument('--product', type=str, required=True, 
                        help='Product name')
    parser.add_argument('--campaign', type=str, required=True,
                        help='Campaign name')
    parser.add_argument('--audience', type=str, required=True,
                        help='Target audience description')
    parser.add_argument('--features', type=str, nargs='+', required=True,
                        help='Key product features (space-separated)')
    parser.add_argument('--usps', type=str, nargs='+', required=True,
                        help='Unique selling points (space-separated)')
    parser.add_argument('--duration', type=str, default="4 weeks",
                        help='Campaign duration (default: "4 weeks")')
    parser.add_argument('--tone', type=str, default="professional",
                        help='Brand tone (default: "professional")')
    parser.add_argument('--output-dir', type=str, default="campaign_output",
                        help='Directory to save generated content (default: "campaign_output")')
    
    args = parser.parse_args()
    
    try:
        campaign_generator = MarketingCampaignGenerator(output_dir=args.output_dir)
        await campaign_generator.setup()
        
        metadata = await campaign_generator.generate_campaign(
            product_name=args.product,
            campaign_name=args.campaign,
            target_audience=args.audience,
            key_features=args.features,
            unique_selling_points=args.usps,
            campaign_duration=args.duration,
            brand_tone=args.tone
        )
        
        # Print summary
        print("\nCampaign Generation Complete!")
        print(f"Campaign: {metadata['campaign_name']}")
        print(f"Generated files saved to: {args.output_dir}/")
        print("Files generated:")
        for file in metadata['files']:
            print(f"- {file}")
            
        await campaign_generator.close()
        
    except Exception as e:
        logger.error(f"Error in campaign generation: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    # Set up event loop and run main function
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(main()) 