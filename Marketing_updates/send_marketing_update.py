#!/usr/bin/env python3
"""
Marketing Update Email Sender

This script sends beautiful marketing update emails using the App Password authentication with Gmail.
Includes anti-spam measures to improve deliverability.
"""

import smtplib
import ssl
import argparse
import uuid
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from email.utils import formatdate, make_msgid

# Default values
DEFAULT_SENDER_EMAIL = "agentcsihack@gmail.com"
DEFAULT_APP_PASSWORD = "xyjqdoacqdjgafuk"  # App Password without spaces
DEFAULT_RECIPIENT_EMAIL = "abhirooprt03@gmail.com"
DEFAULT_SECONDARY_EMAIL = "atokala@uwm.edu"
DEFAULT_CAMPAIGN_NAME = "Summer Product Launch"

def parse_args():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description="Send a marketing update email")
    
    # Email configuration
    parser.add_argument("--sender-email", default=DEFAULT_SENDER_EMAIL, help="Sender email address")
    parser.add_argument("--app-password", default=DEFAULT_APP_PASSWORD, help="Gmail App Password (no spaces)")
    parser.add_argument("--recipient-email", default=DEFAULT_RECIPIENT_EMAIL, help="Primary recipient")
    parser.add_argument("--cc-email", default=DEFAULT_SECONDARY_EMAIL, help="CC recipient")
    
    # Email content
    parser.add_argument("--campaign-name", default=DEFAULT_CAMPAIGN_NAME, help="Marketing campaign name")
    parser.add_argument("--title", default="Marketing Report: {campaign} Performance Update", help="Email subject template")
    parser.add_argument("--reach", type=int, default=25000, help="Reach metric")
    parser.add_argument("--engagement", type=float, default=5.2, help="Engagement rate")
    parser.add_argument("--conversion", type=float, default=2.8, help="Conversion rate")
    parser.add_argument("--roi", type=float, default=3.5, help="ROI metric")
    
    return parser.parse_args()

def send_marketing_update(args):
    """Send a marketing update email with the specified parameters"""
    # Set up email addresses
    sender_email = args.sender_email
    app_password = args.app_password
    recipient_emails = [args.recipient_email]
    if args.cc_email:
        recipient_emails.append(args.cc_email)
    
    # Create message
    message = MIMEMultipart("alternative")
    
    # Format subject with campaign name
    subject = args.title.format(campaign=args.campaign_name)
    message["Subject"] = subject
    
    # Add standard headers to avoid spam filters
    message["From"] = f"Marketing AI System <{sender_email}>"
    message["To"] = args.recipient_email
    if args.cc_email:
        message["Cc"] = args.cc_email
    
    # Add additional headers to improve deliverability
    message["Date"] = formatdate(localtime=True)
    message["Message-ID"] = make_msgid(domain=sender_email.split('@')[1])
    message["Reply-To"] = sender_email
    
    # Add List-Unsubscribe header (helps avoid spam filters)
    message["List-Unsubscribe"] = f"<mailto:{sender_email}?subject=unsubscribe>"
    
    # Create content with metrics
    metrics = {
        "reach": args.reach,
        "engagement": args.engagement,
        "conversion": args.conversion,
        "roi": args.roi
    }
    
    highlights = [
        "Social media engagement has increased by 42% this week",
        "Email open rates are at 28%, above the industry average",
        "Website traffic from this campaign has grown 35% month-over-month",
        "Mobile conversion rate has improved by 2.1 percentage points"
    ]
    
    recommendations = [
        "Consider allocating additional resources to the top-performing ads",
        "Expand the LinkedIn campaign targeting to include similar industries",
        "Test new variations of email subject lines to improve open rates further",
        "Optimize the mobile checkout experience to improve conversion"
    ]
    
    # Generate email content
    text_content = generate_text_email(args.campaign_name, metrics, highlights, recommendations)
    html_content = generate_html_email(args.campaign_name, metrics, highlights, recommendations)
    
    # Attach parts
    message.attach(MIMEText(text_content, "plain"))
    message.attach(MIMEText(html_content, "html"))
    
    # Send email
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            print("Logging in to Gmail...")
            server.login(sender_email, app_password)
            print("Sending marketing update email...")
            server.sendmail(
                sender_email, 
                recipient_emails, 
                message.as_string()
            )
            print(f"✅ Marketing update sent successfully to {', '.join(recipient_emails)}!")
            print("📋 Note: If the email goes to spam, please add the sender to your contacts.")
        return True
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return False

def generate_text_email(campaign_name, metrics, highlights, recommendations):
    """Generate plain text email content"""
    date_str = datetime.now().strftime('%B %d, %Y')
    message_id = str(uuid.uuid4())[:8]  # Create a unique message ID
    
    text = f"""
Hello,

This is your {date_str} marketing performance report for the {campaign_name} campaign.
Message ID: {message_id}

CAMPAIGN PERFORMANCE SUMMARY:

Latest metrics and insights for the {campaign_name} campaign as of {date_str}.

KEY METRICS:
"""
    
    for metric, value in metrics.items():
        text += f"- {metric.replace('_', ' ').title()}: {value}\n"
    
    text += "\nRECENT HIGHLIGHTS:\n"
    for highlight in highlights:
        text += f"- {highlight}\n"
    
    text += "\nRECOMMENDATIONS:\n"
    for recommendation in recommendations:
        text += f"- {recommendation}\n"
    
    text += """
ABOUT THIS REPORT:
This is an automated marketing performance report. To ensure you receive these 
updates in your inbox, please add this email address to your contacts.

If you wish to unsubscribe from these updates, please reply with "unsubscribe" 
in the subject line.

Thank you,
Marketing AI System
"""
    
    return text

def generate_html_email(campaign_name, metrics, highlights, recommendations):
    """Generate HTML email content"""
    date_str = datetime.now().strftime('%B %d, %Y')
    message_id = str(uuid.uuid4())[:8]  # Create a unique message ID
    
    html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marketing Update</title>
    <style>
        body {{
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
        }}
        .container {{
            width: 100%;
            background-color: #ffffff;
        }}
        .header {{
            background-color: #4285f4;
            color: #ffffff;
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
            margin-bottom: 20px;
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
            color: #666666;
        }}
        h1, h2, h3 {{
            color: #333333;
        }}
        ul {{
            padding-left: 20px;
        }}
        li {{
            margin-bottom: 8px;
        }}
        .footer {{
            font-size: 12px;
            color: #999999;
            text-align: center;
            margin-top: 30px;
            padding: 15px;
            border-top: 1px solid #eeeeee;
            background-color: #f9f9f9;
        }}
        .message-id {{
            font-size: 10px;
            color: #cccccc;
            text-align: center;
        }}
        .whitelist-notice {{
            background-color: #fffde7;
            padding: 10px;
            margin-top: 15px;
            border-radius: 4px;
            border-left: 4px solid #fdd835;
            font-size: 13px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Marketing Performance Report</h1>
            <h2>{campaign_name}</h2>
            <div style="font-size:14px;">{date_str}</div>
        </div>
        <div class="content">
            <div class="section">
                <p>Here is your <strong>{date_str}</strong> marketing performance report for the <strong>{campaign_name}</strong> campaign.</p>
                <div class="message-id">Message ID: {message_id}</div>
            </div>

            <div class="section">
                <h2>Key Performance Metrics</h2>
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

            <div class="section">
                <h2>Recent Highlights</h2>
                <ul>
"""
    for highlight in highlights:
        html += f"                <li>{highlight}</li>\n"
    html += """
                </ul>
            </div>

            <div class="section">
                <h2>Strategic Recommendations</h2>
                <ul>
"""
    for recommendation in recommendations:
        html += f"                <li>{recommendation}</li>\n"
    html += """
                </ul>
            </div>
            
            <div class="whitelist-notice">
                <strong>Not seeing our emails?</strong> To ensure you receive future marketing updates in your inbox, please add
                <strong>agentcsihack@gmail.com</strong> to your contacts.
            </div>

            <div class="footer">
                <p>This is an automated marketing performance report.<br>
                If you wish to unsubscribe from these updates, please reply with "unsubscribe" in the subject line.</p>
                <p>Thank you,<br>Marketing AI System</p>
            </div>
        </div>
    </div>
</body>
</html>
"""
    
    return html

if __name__ == "__main__":
    args = parse_args()
    send_marketing_update(args) 