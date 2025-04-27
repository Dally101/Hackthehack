#!/usr/bin/env python3
"""
Marketing Update Email Sender (Anti-Spam Improved Version)

This script sends beautiful marketing update emails using the App Password authentication with Gmail.
Includes enhanced anti-spam measures to improve deliverability.
"""

import smtplib
import ssl
import argparse
import uuid
import time
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from email.utils import formatdate, make_msgid, formataddr

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
    parser.add_argument("--title", default="Your {campaign} Performance Update for {date}", help="Email subject template")
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
    
    # Use a personalized date string
    date_str = datetime.now().strftime('%B %d, %Y')
    
    # Format subject with campaign name and date - avoid spam trigger words
    subject = args.title.format(campaign=args.campaign_name, date=date_str)
    message["Subject"] = subject
    
    # Add proper formatted From header (more professional looking)
    message["From"] = formataddr(("Marketing Analytics", sender_email))
    message["To"] = args.recipient_email
    if args.cc_email:
        message["Cc"] = args.cc_email
    
    # Add additional headers to improve deliverability
    message["Date"] = formatdate(localtime=True)
    message["Message-ID"] = make_msgid(domain=sender_email.split('@')[1])
    message["Reply-To"] = sender_email
    
    # Add List-Unsubscribe header (helps avoid spam filters)
    message["List-Unsubscribe"] = f"<mailto:{sender_email}?subject=unsubscribe>"
    message["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"
    
    # Add additional anti-spam headers
    message["Precedence"] = "bulk"
    message["X-Auto-Response-Suppress"] = "OOF, AutoReply"
    message["X-Report-Abuse"] = f"Please report abuse to {sender_email}"
    message["X-Mailer"] = "Marketing Analytics Platform 2.1"
    
    # Create content with metrics
    metrics = {
        "reach": f"{args.reach:,}",  # Format with commas for thousands
        "engagement": f"{args.engagement}%",
        "conversion": f"{args.conversion}%",
        "roi": f"{args.roi}x"
    }
    
    # Varied content to avoid content similarity filters
    highlights_options = [
        [
            "Social media engagement increased by 42% this week",
            "Email open rates are at 28%, above average",
            "Website traffic from this campaign grew 35%",
            "Mobile conversion rate improved by 2.1 points"
        ],
        [
            "Instagram followers increased by 315 this month",
            "Campaign click-through rate is 4.7%",
            "Return customer rate improved to 38%",
            "Average order value is up by $12.50"
        ]
    ]
    
    recommendations_options = [
        [
            "Consider allocating additional budget to top ads",
            "Expand LinkedIn targeting to similar industries",
            "Test new email subject line variations",
            "Optimize mobile checkout experience"
        ],
        [
            "Increase frequency on high-performing channels",
            "Consider A/B testing new creative content",
            "Review audience segmentation for refinement",
            "Add exit-intent popup to reduce abandonment"
        ]
    ]
    
    # Select varied content randomly to avoid spam detection
    random_seed = int(datetime.now().timestamp()) % 100
    random.seed(random_seed)
    highlights = random.choice(highlights_options)
    recommendations = random.choice(recommendations_options)
    
    # Generate email content
    text_content = generate_text_email(args.campaign_name, metrics, highlights, recommendations)
    html_content = generate_html_email(args.campaign_name, metrics, highlights, recommendations)
    
    # Attach parts
    message.attach(MIMEText(text_content, "plain"))
    message.attach(MIMEText(html_content, "html"))
    
    # Add a slight delay to avoid appearing automated
    time.sleep(1.5)
    
    # Send email
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            print("Logging in to Gmail...")
            server.login(sender_email, app_password)
            
            # Short delay before sending to appear more human-like
            time.sleep(0.5) 
            
            print("Sending marketing update email...")
            server.sendmail(
                sender_email, 
                recipient_emails, 
                message.as_string()
            )
            print(f"✅ Marketing update sent successfully to {', '.join(recipient_emails)}!")
            print("📋 Note: If the email goes to spam, please add the sender to your contacts.")
            print("   Your mail client may have a 'Not Spam' or 'Move to Inbox' option as well.")
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

This is your {date_str} analytics report for the {campaign_name} campaign.
Message ID: {message_id}

CAMPAIGN PERFORMANCE SUMMARY:

Latest insights for the {campaign_name} campaign as of {date_str}.

KEY METRICS:
"""
    
    for metric, value in metrics.items():
        text += f"- {metric.replace('_', ' ').title()}: {value}\n"
    
    text += "\nRECENT HIGHLIGHTS:\n"
    for highlight in highlights:
        text += f"- {highlight}\n"
    
    text += "\nSTRATEGIC INSIGHTS:\n"
    for recommendation in recommendations:
        text += f"- {recommendation}\n"
    
    text += f"""
ABOUT THIS REPORT:
This analytics report was prepared for you on {date_str}. To ensure delivery 
to your inbox, please add this email address to your contacts.

If you'd like to unsubscribe, please reply with "unsubscribe" in the subject.

Thank you,
Marketing Analytics Team
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
    <title>Campaign Analytics</title>
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
            background-color: #0078D4;
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
            color: #0078D4;
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
        .button {{
            display: inline-block;
            padding: 10px 20px;
            background-color: #0078D4;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin-top: 10px;
        }}
        .unsubscribe {{
            text-align: center;
            font-size: 11px;
            color: #999999;
            margin-top: 10px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Campaign Analytics</h1>
            <h2>{campaign_name}</h2>
            <div style="font-size:14px;">{date_str}</div>
        </div>
        <div class="content">
            <div class="section">
                <p>Here is your campaign analytics report for <strong>{campaign_name}</strong> as of <strong>{date_str}</strong>.</p>
                <div class="message-id">Reference: {message_id}</div>
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
                <h2>Strategic Insights</h2>
                <ul>
"""
    for recommendation in recommendations:
        html += f"                <li>{recommendation}</li>\n"
    html += """
                </ul>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <a href="https://example.com/dashboard" class="button">View Full Dashboard</a>
            </div>
            
            <div class="whitelist-notice">
                <strong>📬 Email Delivery Notice:</strong> To ensure you receive future reports in your inbox, please add
                <strong>agentcsihack@gmail.com</strong> to your contacts and mark this email as "Not Spam" if needed.
            </div>

            <div class="footer">
                <p>Generated by Marketing Analytics Platform<br>
                For more detailed information, contact your account manager.</p>
                <p>Thank you,<br>Marketing Analytics Team</p>
                <div class="unsubscribe">
                    To unsubscribe from these updates, please <a href="mailto:agentcsihack@gmail.com?subject=unsubscribe">click here</a> or reply with "unsubscribe" in the subject line.
                </div>
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