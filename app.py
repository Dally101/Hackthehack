import os
import json
import logging
import traceback
import mimetypes
import io
import sys
import threading
import time
import asyncio
from datetime import datetime
from pathlib import Path
from flask import Flask, render_template, request, jsonify, make_response, send_from_directory, abort
from openai import AzureOpenAI
from dotenv import load_dotenv
import argparse

# Force UTF-8 encoding for all IO operations
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
    
# Load environment variables
load_dotenv()

# Configure logging
log_dir = Path("logs")
log_dir.mkdir(exist_ok=True)
logging.basicConfig(
    level=logging.DEBUG, 
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_dir / f"app_{datetime.now().strftime('%Y%m%d')}.log", encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__, 
            static_folder="static",
            template_folder="Marketing_updates/templates")

# Set the Flask JSON encoder to handle UTF-8 properly
app.json.ensure_ascii = False  # Allows UTF-8 characters in JSON responses

# Get environment variables for configuration - hardcode API version to known working version
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT", "https://unocode4377087879.openai.azure.com/")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY", "8QRutvmpeSE3H2eQRt6DpvymhfzLVPX2VqDZuVMIOWe1fNQS52bIJQQJ99BDACYeBjFXJ3w3AAAAACOGjWih")
# Hardcode the API version to the known working version instead of using environment variable
AZURE_OPENAI_API_VERSION = "2023-05-15"  # Hardcoded working version
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o")

# Log configuration values (masking API key for security)
masked_key = AZURE_OPENAI_API_KEY[:5] + "..." + AZURE_OPENAI_API_KEY[-5:] if AZURE_OPENAI_API_KEY else None
logger.info(f"Configuration:")
logger.info(f"- Endpoint: {AZURE_OPENAI_ENDPOINT}")
logger.info(f"- API Version: {AZURE_OPENAI_API_VERSION}")
logger.info(f"- Deployment: {AZURE_OPENAI_DEPLOYMENT}")
logger.info(f"- API Key (masked): {masked_key}")
logger.info(f"- Python Version: {sys.version}")

# Initialize Azure OpenAI client - make it a global variable with a lock for thread safety
client = None
client_lock = threading.Lock()

# Template mapping
TEMPLATES = {
    "social": "Create a {tone} social media post for {audience} about {topic}. Highlight the key features and benefits.",
    "email": "Write a {tone} email newsletter for {audience} about {topic}. Include an engaging subject line and call to action.",
    "blog": "Create a {tone} blog post titled '{title}' for {audience} discussing {topic}. Include an introduction, key points, and conclusion.",
    "press": "Write a {tone} press release announcing {topic} for {audience}. Include quotes, key facts, and contact information.",
    "ad": "Create a {tone} advertisement for {audience} promoting {product/service}. Highlight the unique selling points and include a call to action.",
    "product": "Write a {tone} product description for {product_name} targeting {audience}. Emphasize the features, benefits, and use cases."
}

# Marketing content options
CONTENT_TYPES = [
    {"id": "social", "name": "Social Media Post"},
    {"id": "email", "name": "Email Campaign"},
    {"id": "blog", "name": "Blog Post"},
    {"id": "press", "name": "Press Release"},
    {"id": "ad", "name": "Advertisement"},
    {"id": "product", "name": "Product Description"}
]

TONES = [
    {"id": "professional", "name": "Professional"},
    {"id": "conversational", "name": "Conversational"},
    {"id": "enthusiastic", "name": "Enthusiastic"},
    {"id": "formal", "name": "Formal"},
    {"id": "informal", "name": "Informal"},
    {"id": "humorous", "name": "Humorous"},
    {"id": "authoritative", "name": "Authoritative"},
    {"id": "inspirational", "name": "Inspirational"},
    {"id": "educational", "name": "Educational"}
]

# Initialize the single global instance of AzureOpenAI
try:
    logger.info("Creating global AzureOpenAI client instance")
    # Create the client outside of any function to ensure it's available to all threads
    client = AzureOpenAI(
        api_key=AZURE_OPENAI_API_KEY,
        azure_endpoint=AZURE_OPENAI_ENDPOINT,
        api_version=AZURE_OPENAI_API_VERSION
    )
    logger.info("Global AzureOpenAI client created successfully")
except Exception as e:
    logger.error(f"Failed to create global AzureOpenAI client: {str(e)}")
    logger.error(traceback.format_exc())

def init_openai_client():
    """Initialize the OpenAI client if it's not already initialized"""
    global client
    
    # Use a lock to prevent multiple threads from initializing simultaneously
    with client_lock:
        if client is not None:
            logger.debug("Client already initialized, using existing client")
            return True
            
        try:
            logger.info("Initializing Azure OpenAI client")
            client = AzureOpenAI(
                api_key=AZURE_OPENAI_API_KEY,
                azure_endpoint=AZURE_OPENAI_ENDPOINT,
                api_version=AZURE_OPENAI_API_VERSION
            )
            
            # Test connection with a simple completion
            logger.info("Testing Azure OpenAI connection...")
            test_response = client.chat.completions.create(
                model=AZURE_OPENAI_DEPLOYMENT,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": "Hello, are you working correctly?"}
                ],
                max_tokens=50
            )
            logger.info(f"Test response successful: {test_response.choices[0].message.content[:50]}...")
            logger.info("Azure OpenAI client initialized successfully")
            
            # Store client globally
            logger.debug(f"Client object created and stored: {client is not None}")
            return True
        except Exception as e:
            logger.error(f"Error initializing Azure OpenAI client: {str(e)}")
            logger.error(f"Full error: {traceback.format_exc()}")
            return False

# Test the client immediately to ensure it's working
if client is not None:
    try:
        logger.info("Testing global client with a simple request...")
        test_response = client.chat.completions.create(
            model=AZURE_OPENAI_DEPLOYMENT,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello, are you working correctly?"}
            ],
            max_tokens=50
        )
        logger.info(f"Global client test successful: {test_response.choices[0].message.content[:50]}...")
    except Exception as e:
        logger.error(f"Global client test failed: {str(e)}")
        logger.error(traceback.format_exc())
        client = None  # Clear the client so init_openai_client() will recreate it later

# Conversation history store
conversation_history = {}

def generate_sample_content(content_type, audience, tone, length, prompt):
    """Generate sample marketing content if the Azure client fails."""
    # Base content templates by type and length
    content_templates = {
        "social": {
            "short": f"🚀 Attention {audience}! Try our innovative products. #{tone.capitalize()}",
            "medium": f"🚀 Attention {audience}! Our innovative products are transforming the industry with features you won't find anywhere else. Experience the difference today! #{tone.capitalize()} #LeadingEdge",
            "long": f"🚀 Attention {audience}! Our innovative products are transforming the industry with features you won't find anywhere else. Experience the difference today!\n\nOur cutting-edge solutions are designed specifically for {audience}, with careful attention to your unique needs. We've spent years perfecting our approach, and the results speak for themselves.\n\n#{tone.capitalize()} #LeadingEdge #CustomerSuccess #QualityMatters"
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
    elif content_type.lower() in ["email", "email/newsletter", "newsletter", "email campaign"]:
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

@app.route('/')
def index():
    """Render the home page"""
    logger.debug("/ route accessed")
    return render_template('index.html')

@app.route('/status')
def status():
    """Return API status"""
    logger.debug("/status route accessed")
    global client
    
    status_info = {
        'server': 'online',
        'client_initialized': client is not None,
        'client_exists': client is not None,
        'api_version': AZURE_OPENAI_API_VERSION,
        'deployment': AZURE_OPENAI_DEPLOYMENT
    }
    
    return jsonify(status_info)

@app.route('/content-types', methods=['GET'])
def get_content_types():
    """Get list of available content types."""
    return jsonify(CONTENT_TYPES)

@app.route('/tones', methods=['GET'])
def get_tones():
    """Get list of available tones."""
    return jsonify(TONES)

@app.route('/templates/<template_type>')
def get_template(template_type):
    """Get template configuration"""
    logger.debug(f"/templates/{template_type} route accessed")
    if template_type in TEMPLATES:
        return jsonify({"template": TEMPLATES[template_type]})
    else:
        return jsonify({"template": "Please provide details for your content."})

@app.route('/generate', methods=['POST'])
def generate_content():
    """Generate content based on the template and user inputs"""
    # Debug entry into generate endpoint
    logger.debug(f"Generate endpoint called: method={request.method}")
    logger.debug(f"Form data: {dict(request.form)}")
    # Log environment API_VERSION vs hardcoded version
    env_api_version = os.getenv("AZURE_OPENAI_API_VERSION")
    logger.debug(f"Environment AZURE_OPENAI_API_VERSION: {env_api_version}")
    logger.debug(f"Using AZURE_OPENAI_API_VERSION: {AZURE_OPENAI_API_VERSION}")

    # Always ensure client is initialized
    if client is None:
        logger.warning("Client is None, attempting to initialize...")
        if not init_openai_client():
            logger.error("Failed to initialize Azure OpenAI client in generate endpoint")
            # Instead of returning an error, use the sample content generator
            logger.info("Falling back to sample content generation")
            try:
                content_type = request.form.get('content_type', '')
                prompt = request.form.get('prompt', '')
                audience = request.form.get('audience', 'general audience')
                tone = request.form.get('tone', 'professional')
                length = request.form.get('length', 'medium')
                save = request.form.get('save', 'false') == 'true'
                
                # Generate sample content
                generated_content = generate_sample_content(
                    content_type=content_type,
                    audience=audience,
                    tone=tone,
                    length=length,
                    prompt=prompt
                )
                
                # Return response
                resp = make_response(jsonify({
                    'status': 'success',
                    'content': generated_content,
                    'metadata': {
                        'content_type': content_type,
                        'audience': audience,
                        'tone': tone,
                        'length': length,
                        'timestamp': datetime.now().isoformat(),
                        'generation_mode': 'sample'
                    }
                }))
                
                # Set user_id cookie
                user_id = request.cookies.get('user_id') or datetime.now().strftime("%Y%m%d%H%M%S")
                resp.set_cookie('user_id', user_id)
                
                return resp
            except Exception as e:
                logger.error(f"Error generating sample content: {str(e)}")
                logger.error(traceback.format_exc())
                return jsonify({
                    'status': 'error',
                    'message': f"Failed to generate content: {str(e)}"
                }), 500
    else:
        logger.debug("Client already initialized and ready.")

    # Proceed with generation now that client is assured
    try:
        # Start timing for performance metrics
        start_time = time.time()
        
        # Get form data
        content_type = request.form.get('content_type', '')
        prompt = request.form.get('prompt', '')
        audience = request.form.get('audience', 'general audience')
        tone = request.form.get('tone', 'professional')
        length = request.form.get('length', 'medium')
        save = request.form.get('save', 'false') == 'true'
        
        logger.info(f"Generating content for '{content_type}' with prompt: '{prompt[:50]}...'")
        
        # Build conversation history
        user_id = request.cookies.get('user_id') or datetime.now().strftime("%Y%m%d%H%M%S")
        conversation = conversation_history.setdefault(user_id, [])
        if not conversation:
            conversation.append({"role": "system", "content": "You are a marketing expert specialized in creating compelling and effective marketing content. You are excellent at adapting your writing style to different audiences and tones."})
        
        # Enhance the prompt with specific details
        enhanced_prompt = f"""Content Type: {content_type}
Target Audience: {audience}
Tone: {tone}
Length: {length}

Instructions: {prompt}

Create a {tone} {content_type} for {audience}. The content should be {length} in length and follow marketing best practices. Ensure the content is engaging, on-brand, and includes a clear call-to-action.
"""
        
        conversation.append({"role": "user", "content": enhanced_prompt})
        
        # Call OpenAI API
        logger.debug(f"Client object before API call: {client}")
        response = client.chat.completions.create(
            model=AZURE_OPENAI_DEPLOYMENT,
            messages=conversation,
            max_tokens=4096,
            temperature=0.7,
        )
        generated_content = response.choices[0].message.content
        logger.info(f"Received response: '{generated_content[:50]}...'")
        conversation.append({"role": "assistant", "content": generated_content})
        
        # Calculate generation time
        elapsed_time = time.time() - start_time
        logger.info(f"Content generated in {elapsed_time:.2f} seconds")
        
        # Handle save
        if save:
            content_dir = Path('content')
            content_dir.mkdir(exist_ok=True)
            filename = f"{content_type.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d%H%M%S')}.txt"
            file_path = content_dir / filename
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(generated_content)
            logger.info(f"Saved content to file: {file_path}")
        
        # Return response
        resp = make_response(jsonify({
            'status': 'success',
            'content': generated_content,
            'metadata': {
                'content_type': content_type,
                'audience': audience,
                'tone': tone,
                'length': length,
                'timestamp': datetime.now().isoformat(),
                'generation_time': f"{elapsed_time:.2f}s",
                'generation_mode': 'azure_openai'
            }
        }))
        resp.set_cookie('user_id', user_id)
        return resp
    except Exception as e:
        logger.error(f"Error in generate endpoint: {str(e)}")
        logger.error(traceback.format_exc())
        
        # Attempt to generate fallback content
        try:
            content_type = request.form.get('content_type', '')
            prompt = request.form.get('prompt', '')
            audience = request.form.get('audience', 'general audience')
            tone = request.form.get('tone', 'professional')
            length = request.form.get('length', 'medium')
            
            logger.info("Falling back to sample content generation due to API error")
            
            # Generate sample content
            generated_content = generate_sample_content(
                content_type=content_type,
                audience=audience,
                tone=tone,
                length=length,
                prompt=prompt
            )
            
            # Return response with sample content
            resp = make_response(jsonify({
                'status': 'success',
                'content': generated_content,
                'metadata': {
                    'content_type': content_type,
                    'audience': audience,
                    'tone': tone,
                    'length': length,
                    'timestamp': datetime.now().isoformat(),
                    'generation_mode': 'sample',
                    'fallback_reason': str(e)
                }
            }))
            
            # Set user_id cookie
            user_id = request.cookies.get('user_id') or datetime.now().strftime("%Y%m%d%H%M%S")
            resp.set_cookie('user_id', user_id)
            
            return resp
        except Exception as fallback_error:
            logger.error(f"Error generating fallback content: {str(fallback_error)}")
            return jsonify({
                'status': 'error',
                'message': str(e),
                'fallback_error': str(fallback_error)
            }), 500

@app.route('/content/<path:filename>')
def download_content(filename):
    """Serve content files for download."""
    logger.debug(f"Download requested for {filename}")
    return send_from_directory('content', filename)

@app.route('/export/<format_type>', methods=['POST'])
def export_content(format_type):
    """Export content in various formats (markdown, txt, pdf)"""
    try:
        content = request.json.get('content', '')
        content_type = request.json.get('content_type', 'Content')
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        filename = f"{content_type.replace(' ', '_')}_{timestamp}"
        
        content_dir = Path('content')
        content_dir.mkdir(exist_ok=True)
        
        if format_type == 'md':
            file_path = content_dir / f"{filename}.md"
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            return jsonify({
                'status': 'success',
                'message': 'Content exported as Markdown',
                'filename': file_path.name,
                'download_url': f"/content/{file_path.name}"
            })
            
        elif format_type == 'txt':
            file_path = content_dir / f"{filename}.txt"
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            return jsonify({
                'status': 'success',
                'message': 'Content exported as text',
                'filename': file_path.name,
                'download_url': f"/content/{file_path.name}"
            })
            
        elif format_type == 'pdf':
            # For PDF, we'll create a simple HTML file and return it
            # The actual PDF conversion should happen on the client side using a library like html2pdf
            file_path = content_dir / f"{filename}.html"
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>{content_type}</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }}
                    h1 {{ color: #333; }}
                    pre {{ white-space: pre-wrap; }}
                </style>
            </head>
            <body>
                <h1>{content_type}</h1>
                <pre>{content}</pre>
            </body>
            </html>
            """
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(html_content)
            return jsonify({
                'status': 'success',
                'message': 'Content prepared for PDF export',
                'filename': file_path.name,
                'download_url': f"/content/{file_path.name}",
                'html_content': html_content
            })
        else:
            return jsonify({
                'status': 'error',
                'message': f'Unsupported export format: {format_type}'
            }), 400
    except Exception as e:
        logger.error(f"Error exporting content: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'status': 'error',
            'message': f"Failed to export content: {str(e)}"
        }), 500

@app.route('/share/<platform>', methods=['POST'])
def share_content(platform):
    """Handle sharing content to various platforms (social, email, blog)"""
    try:
        content = request.json.get('content', '')
        content_type = request.json.get('content_type', 'Content')
        
        # Store the content for sharing
        content_dir = Path('content')
        content_dir.mkdir(exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        filename = f"{platform}_{content_type.replace(' ', '_')}_{timestamp}.txt"
        file_path = content_dir / filename
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
            
        share_url = None
        share_message = None
        
        if platform == 'social':
            # Simulate social media sharing
            share_url = f"/content/{filename}"
            share_message = "Content prepared for social media sharing"
            logger.info(f"Social media content prepared: {file_path}")
            
        elif platform == 'email':
            # Simulate email campaign creation
            email_template = f"""
Subject: {content_type}

{content}

---
This email was generated using the Marketing AI System.
"""
            email_file = content_dir / f"email_{content_type.replace(' ', '_')}_{timestamp}.eml"
            with open(email_file, "w", encoding="utf-8") as f:
                f.write(email_template)
                
            share_url = f"/content/{email_file.name}"
            share_message = "Content prepared for email campaigns"
            logger.info(f"Email content prepared: {email_file}")
            
        elif platform == 'blog':
            # Simulate blog post creation
            blog_template = f"""
# {content_type}

{content}

---
*This blog post was generated using the Marketing AI System.*
"""
            blog_file = content_dir / f"blog_{content_type.replace(' ', '_')}_{timestamp}.md"
            with open(blog_file, "w", encoding="utf-8") as f:
                f.write(blog_template)
                
            share_url = f"/content/{blog_file.name}"
            share_message = "Content prepared for blog publishing"
            logger.info(f"Blog content prepared: {blog_file}")
            
        else:
            return jsonify({
                'status': 'error',
                'message': f'Unsupported sharing platform: {platform}'
            }), 400
            
        return jsonify({
            'status': 'success',
            'message': share_message,
            'platform': platform,
            'filename': file_path.name,
            'download_url': share_url
        })
        
    except Exception as e:
        logger.error(f"Error sharing content: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'status': 'error',
            'message': f"Failed to share content: {str(e)}"
        }), 500

@app.route('/static/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory('static', path)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring."""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    return jsonify({"status": "error", "message": "Resource not found"}), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    return jsonify({"status": "error", "message": "Internal server error"}), 500

if __name__ == '__main__':
    # Initialize the client before starting the app
    if not client:
        init_openai_client()
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Marketing AI Agent Server')
    parser.add_argument('--port', type=int, default=5000, help='Port to run the server on')
    parser.add_argument('--host', type=str, default='0.0.0.0', help='Host to run the server on')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')
    args = parser.parse_args()
    
    # Log startup information
    logger.info(f"Starting Marketing AI Agent on {args.host}:{args.port}")
    
    # Run the Flask app
    app.run(host=args.host, port=args.port, debug=args.debug) 