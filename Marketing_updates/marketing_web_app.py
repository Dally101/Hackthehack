#!/usr/bin/env python3
"""
Marketing Agent Web Application

A simple web interface for the Marketing AI Agent based on the structure
from https://github.com/Azure-Samples/get-started-with-ai-agents
"""

import os
import sys
import json
import asyncio
import logging
import time
from datetime import datetime
from typing import Dict, Any, Optional
from pathlib import Path
import argparse

from flask import Flask, render_template, request, jsonify, make_response, abort
from dotenv import load_dotenv

# Import the marketing agent
try:
    from marketing_ai_agent import MarketingAgent, setup_logging
except ImportError:
    # Define sample content generation function for fallback
    def setup_logging(log_dir):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        )
    
    class MarketingAgent:
        """Fallback Marketing Agent that doesn't require Azure."""
        
        def __init__(self):
            self.initialized = False
            
        async def initialize(self):
            self.initialized = True
            return True
            
        async def generate_content(self, prompt, audience, content_type, tone, length, save_to_file=False):
            """Generate sample marketing content with length variations."""
            # Base content templates by type and length
            content_templates = {
                "social": {
                    "short": f"🚀 Attention {audience}! Try our innovative products. #Innovation",
                    "medium": f"🚀 Attention {audience}! Our innovative products are transforming the industry with features you won't find anywhere else. Experience the difference today! #Innovation #LeadingEdge",
                    "long": f"🚀 Attention {audience}! Our innovative products are transforming the industry with features you won't find anywhere else. Experience the difference today!\n\nOur cutting-edge solutions are designed specifically for {audience}, with careful attention to your unique needs. We've spent years perfecting our approach, and the results speak for themselves.\n\n#Innovation #LeadingEdge #CustomerSuccess #QualityMatters"
                },
                "email": {
                    "short": f"Subject: Special Offer for {audience}\n\nHello,\n\nDon't miss our latest solutions designed for {audience}. Visit our website today!\n\nRegards,\nThe Marketing Team",
                    "medium": f"Subject: Discover How Our Products Can Transform Your Experience\n\nHello {audience},\n\nAre you ready to experience our innovative solutions?\n\nOur latest products combine cutting-edge technology with intuitive design to create a seamless experience.\n\nReady to elevate your experience? Visit our website for an exclusive limited-time offer.\n\nWarm regards,\nThe Marketing Team",
                    "long": f"""Subject: Discover How Our Products Can Transform Your Experience

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
                },
                "blog": {
                    "short": f"# Solutions for {audience}\n\nOur products help {audience} solve common problems efficiently. Learn how we can help you today.",
                    "medium": f"# 3 Ways Our Solutions Help {audience}\n\nIn today's fast-paced world, {audience} need efficient solutions. Here's how our products can help:\n\n1. Save time with automation\n2. Reduce costs with smart technology\n3. Improve results with data-driven insights",
                    "long": f"""# 5 Ways Our Solutions Are Transforming the Industry

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
                }
            }
            
            # Get the appropriate template based on content type and length
            content_type_key = "social"  # default
            if content_type.lower() in ["social media", "social media post", "tweet", "social"]:
                content_type_key = "social"
            elif content_type.lower() in ["email", "email/newsletter", "newsletter"]:
                content_type_key = "email" 
            elif content_type.lower() in ["blog post", "article", "blog"]:
                content_type_key = "blog"
                
            # Get the appropriate length (default to medium if not found)
            length = length.lower() if length else "medium"
            if length not in ["short", "medium", "long"]:
                length = "medium"
                
            # Return the content based on type and length
            if content_type_key in content_templates and length in content_templates[content_type_key]:
                return content_templates[content_type_key][length]
            
            # Fallback for other content types
            return f"""Here's a sample {content_type} for {audience} with a {tone} tone, {length} length.

{prompt}

This would be custom-generated marketing content that highlights the benefits of our product while appealing directly to {audience} using language and references that resonate with them."""
        
        async def close(self):
            """Clean up resources."""
            pass

# Load environment variables
parent_env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(parent_env_path)

# Set up logging
log_dir = Path("logs")
log_dir.mkdir(exist_ok=True)
setup_logging(log_dir)
logger = logging.getLogger("MarketingWebApp")

# Initialize Flask app
app = Flask(__name__, 
           static_folder='static',
           template_folder='templates')

# Initialize the marketing agent as a global variable
marketing_agent = None

# Template mapping
TEMPLATES = {
    "social": "Create a {tone} social media post for {audience} about {topic}. Highlight the key features and benefits.",
    "email": "Write a {tone} email newsletter for {audience} about {topic}. Include an engaging subject line and call to action.",
    "blog": "Create a {tone} blog post titled '{title}' for {audience} discussing {topic}. Include an introduction, key points, and conclusion.",
    "press": "Write a {tone} press release announcing {topic} for {audience}. Include quotes, key facts, and contact information.",
    "ad": "Create a {tone} advertisement for {audience} promoting {product/service}. Highlight the unique selling points and include a call to action.",
    "product": "Write a {tone} product description for {product_name} targeting {audience}. Emphasize the features, benefits, and use cases."
}

def initialize_agent():
    """Initialize the marketing agent."""
    global marketing_agent
    if marketing_agent is None:
        marketing_agent = MarketingAgent()
        # Note: We'll initialize it asynchronously when needed

@app.route('/')
def index():
    """Render the main page."""
    # Create a simple template with form for content generation
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_content():
    """Generate marketing content based on form input."""
    global marketing_agent
    
    try:
        # Get form data
        content_type = request.form.get('content_type', 'social media post')
        audience = request.form.get('audience', 'general audience')
        tone = request.form.get('tone', 'professional')
        length = request.form.get('length', 'medium')
        prompt = request.form.get('prompt', '')
        save_to_file = request.form.get('save', 'false').lower() == 'true'
        
        logger.info(f"Generating content: {content_type} for {audience} with {tone} tone")
        
        # Initialize agent if not already done
        if marketing_agent is None:
            logger.info("Initializing marketing agent")
            marketing_agent = MarketingAgent()
            asyncio.run(marketing_agent.initialize())
        
        # Generate content
        start_time = time.time()
        content = asyncio.run(marketing_agent.generate_content(
            prompt=prompt,
            audience=audience,
            content_type=content_type,
            tone=tone,
            length=length,
            save_to_file=save_to_file
        ))
        elapsed_time = time.time() - start_time
        
        logger.info(f"Content generated in {elapsed_time:.2f} seconds")
        
        # Create response data
        timestamp = datetime.now().isoformat()
        response_data = {
            "status": "success",
            "content": content,
            "metadata": {
                "content_type": content_type,
                "audience": audience,
                "tone": tone,
                "length": length,
                "timestamp": timestamp,
                "generation_time": f"{elapsed_time:.2f}s"
            }
        }
        
        return jsonify(response_data)
    
    except Exception as e:
        logger.error(f"Error generating content: {str(e)}", exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/templates/<template_type>', methods=['GET'])
def get_template(template_type):
    """Get a prompt template for a specific content type."""
    if template_type not in TEMPLATES:
        return jsonify({"status": "error", "message": "Template not found"}), 404
    
    return jsonify({
        "status": "success",
        "template": TEMPLATES.get(template_type, "")
    })

@app.route('/content-types', methods=['GET'])
def get_content_types():
    """Get available content types."""
    content_types = [
        {"value": "social media post", "label": "Social Media Post"},
        {"value": "email", "label": "Email/Newsletter"},
        {"value": "blog post", "label": "Blog Post"},
        {"value": "press release", "label": "Press Release"},
        {"value": "ad copy", "label": "Advertisement"},
        {"value": "product description", "label": "Product Description"}
    ]
    return jsonify({"status": "success", "content_types": content_types})

@app.route('/tones', methods=['GET'])
def get_tones():
    """Get available tones."""
    tones = [
        {"value": "professional", "label": "Professional"},
        {"value": "casual", "label": "Casual"},
        {"value": "enthusiastic", "label": "Enthusiastic"},
        {"value": "formal", "label": "Formal"},
        {"value": "friendly", "label": "Friendly"},
        {"value": "informative", "label": "Informative"},
        {"value": "persuasive", "label": "Persuasive"}
    ]
    return jsonify({"status": "success", "tones": tones})

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "message": "Service is running"})

@app.route('/cleanup', methods=['POST'])
def cleanup():
    """Clean up resources."""
    global marketing_agent
    
    try:
        if marketing_agent:
            asyncio.run(marketing_agent.close())
            marketing_agent = None
            logger.info("Cleaned up marketing agent")
        
        return jsonify({"status": "success", "message": "Resources cleaned up"})
    
    except Exception as e:
        logger.error(f"Error cleaning up: {str(e)}", exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500

async def shutdown_app():
    """Shut down the application gracefully."""
    global marketing_agent
    
    try:
        if marketing_agent:
            asyncio.run(marketing_agent.close())
            marketing_agent = None
            logger.info("Cleaned up marketing agent on shutdown")
    
    except Exception as e:
        logger.error(f"Error during shutdown: {str(e)}", exc_info=True)

def main():
    """Run the Flask application."""
    parser = argparse.ArgumentParser(description="Marketing Agent Web Application")
    parser.add_argument("--port", type=int, default=5000, help="Port to run the server on")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host to run the server on")
    parser.add_argument("--debug", action="store_true", help="Run in debug mode")
    
    args = parser.parse_args()
    
    logger.info(f"Starting web application on {args.host}:{args.port}")
    
    try:
        app.run(host=args.host, port=args.port, debug=args.debug)
        
    except KeyboardInterrupt:
        logger.info("Server shutdown requested")
        
    finally:
        # Run cleanup in asyncio event loop
        loop = asyncio.get_event_loop()
        loop.run_until_complete(shutdown_app())
        logger.info("Application shutdown complete")

# Initialize the agent when the app starts
# initialize_agent()  # We'll initialize lazily instead

if __name__ == '__main__':
    main() 