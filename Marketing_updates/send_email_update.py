#!/usr/bin/env python3
"""
Send Email Update Script

This script sends a one-time marketing update email to specified recipients.
It provides a simple way to test the email sending functionality of the Marketing Update Agent.
"""

import os
import sys
import logging
import argparse
import getpass
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("SendEmailUpdate")


def send_email(sender_email, sender_name, recipient_email, recipient_name, 
              subject, text_content, html_content, smtp_server, smtp_port,
              username=None, password=None):
    """
    Send an email using SMTP.
    
    Args:
        sender_email: Sender email address
        sender_name: Sender name
        recipient_email: Recipient email address
        recipient_name: Recipient name
        subject: Email subject
        text_content: Plain text email content
        html_content: HTML email content
        smtp_server: SMTP server address
        smtp_port: SMTP server port
        username: SMTP username (optional)
        password: SMTP password (optional)
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Create email message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"{sender_name} <{sender_email}>"
        message["To"] = f"{recipient_name} <{recipient_email}>"
        
        # Attach parts
        message.attach(MIMEText(text_content, "plain"))
        message.attach(MIMEText(html_content, "html"))
        
        # Create a secure SSL context
        context = ssl.create_default_context()
        
        # Connect to the server
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            
            # Login if credentials are provided
            if username and password:
                server.login(username, password)
            
            # Send email
            server.sendmail(
                sender_email, 
                recipient_email, 
                message.as_string()
            )
            
            logger.info(f"Email sent to {recipient_email}")
            return True
            
    except Exception as e:
        logger.error(f"Error sending email: {e}", exc_info=True)
        return False


def generate_text_email(campaign_name, metrics, highlights, recommendations):
    """Generate plain text email content."""
    text = f"""
Hello,

Marketing Campaign Update: {campaign_name}

Latest updates for the {campaign_name} campaign.

KEY METRICS:
"""
    
    for metric, value in metrics.items():
        text += f"- {metric.replace('_', ' ').title()}: {value}\n"
    
    text += "\nHIGHLIGHTS:\n"
    for highlight in highlights:
        text += f"- {highlight}\n"
    
    text += "\nRECOMMENDATIONS:\n"
    for recommendation in recommendations:
        text += f"- {recommendation}\n"
    
    text += """
This update was generated by the Marketing AI System.
"""
    
    return text


def generate_html_email(campaign_name, metrics, highlights, recommendations):
    """Generate HTML email content."""
    html = f"""
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
        }}
        .header {{
            background-color: #4285f4;
            color: white;
            padding: 20px;
            text-align: center;
        }}
        .content {{
            padding: 20px;
        }}
        .section {{
            margin-bottom: 20px;
        }}
        .metrics {{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
        }}
        .metric {{
            flex: 1;
            min-width: 120px;
            padding: 10px;
            text-align: center;
        }}
        .metric-value {{
            font-size: 24px;
            font-weight: bold;
            color: #4285f4;
        }}
        .metric-label {{
            font-size: 14px;
            color: #666;
        }}
        ul {{
            padding-left: 20px;
        }}
        .footer {{
            font-size: 12px;
            color: #999;
            text-align: center;
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #eee;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Marketing Campaign Update: {campaign_name}</h1>
    </div>
    <div class="content">
        <div class="section">
            <p>Latest updates for the {campaign_name} campaign.</p>
        </div>
"""
    
    html += """
        <div class="section">
            <h2>Key Metrics</h2>
            <div class="metrics">
"""
    for metric, value in metrics.items():
        html += f"""
                <div class="metric">
                    <div class="metric-value">{value}</div>
                    <div class="metric-label">{metric.replace('_', ' ').title()}</div>
                </div>
"""
    html += """
            </div>
        </div>
"""
    
    html += """
        <div class="section">
            <h2>Highlights</h2>
            <ul>
"""
    for highlight in highlights:
        html += f"                <li>{highlight}</li>\n"
    html += """
            </ul>
        </div>
"""
    
    html += """
        <div class="section">
            <h2>Recommendations</h2>
            <ul>
"""
    for recommendation in recommendations:
        html += f"                <li>{recommendation}</li>\n"
    html += """
            </ul>
        </div>
"""
    
    html += """
        <div class="footer">
            <p>This update was generated by the Marketing AI System</p>
        </div>
    </div>
</body>
</html>
"""
    
    return html


def main():
    """Main function to send a one-time email update."""
    parser = argparse.ArgumentParser(description="Send a one-time marketing update email")
    
    # Email sending configuration
    parser.add_argument("--smtp-server", default="smtp.gmail.com", help="SMTP server for sending emails")
    parser.add_argument("--smtp-port", type=int, default=587, help="SMTP port for sending emails")
    parser.add_argument("--sender-email", required=True, help="Sender email address")
    parser.add_argument("--sender-name", default="Marketing AI System", help="Sender name")
    parser.add_argument("--username", help="SMTP username")
    parser.add_argument("--password", help="SMTP password")
    parser.add_argument("--no-auth", action="store_true", help="Skip SMTP authentication")
    
    # Email content configuration
    parser.add_argument("--recipient-email", default="abhirooprt03@gmail.com", help="Recipient email address")
    parser.add_argument("--recipient-name", default="Marketing Manager", help="Recipient name")
    parser.add_argument("--title", default="Marketing Campaign Update", help="Email title")
    parser.add_argument("--campaign-name", default="Summer Product Launch", help="Campaign name")
    
    args = parser.parse_args()
    
    # If no authentication is requested, make sure username is None
    if args.no_auth:
        args.username = None
        args.password = None
    
    # If username is provided but password is not, prompt for it
    if args.username and not args.password and not args.no_auth:
        args.password = getpass.getpass(f"Enter SMTP password for {args.username}: ")
    
    # Create sample content
    metrics = {
        "reach": 25000,
        "engagement": 5.2,
        "conversion": 2.8,
        "roi": 3.5
    }
    
    highlights = [
        "Social media engagement increased by 42% this week",
        "Email open rates at 28%, above industry average",
        "Website traffic from campaign up 35% month-over-month",
        "Mobile conversion rate improved by 2.1 percentage points"
    ]
    
    recommendations = [
        "Allocate additional budget to top-performing Facebook ads",
        "Expand LinkedIn campaign targeting to include related industries",
        "A/B test new email subject lines to improve open rates further",
        "Optimize mobile checkout flow to capitalize on increased traffic"
    ]
    
    # Generate email content
    text_content = generate_text_email(
        args.campaign_name, metrics, highlights, recommendations)
    
    html_content = generate_html_email(
        args.campaign_name, metrics, highlights, recommendations)
    
    logger.info(f"Sending update email to {args.recipient_email}")
    
    # Send the email
    success = send_email(
        sender_email=args.sender_email,
        sender_name=args.sender_name,
        recipient_email=args.recipient_email,
        recipient_name=args.recipient_name,
        subject=args.title,
        text_content=text_content,
        html_content=html_content,
        smtp_server=args.smtp_server,
        smtp_port=args.smtp_port,
        username=args.username,
        password=args.password
    )
    
    if success:
        logger.info("✅ Email update sent successfully!")
    else:
        logger.error("❌ Failed to send email update")


if __name__ == "__main__":
    main() 