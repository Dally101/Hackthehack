#!/usr/bin/env python3
"""
Example script to demonstrate the Marketing Update System integration.

This script creates a sample campaign and demonstrates the automated updates
that would be generated by the Marketing Update Agent.
"""

import os
import sys
import time
import logging
import argparse
import getpass
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("MarketingExampleScript")

# Add the parent directory to the path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import our components
from Marketing_updates.integrate_update_agent import MarketingUpdateIntegration
from backend.utils.interAgentComm import subscribe, publishEvent


def main():
    """Main function to run the example."""
    parser = argparse.ArgumentParser(description="Marketing Update System Example")
    parser.add_argument("--db-path", default="marketing_example.db", help="Path to the SQLite database")
    parser.add_argument("--use-azure", action="store_true", help="Use Azure services")
    parser.add_argument("--smtp-server", default="smtp.gmail.com", help="SMTP server for sending emails")
    parser.add_argument("--smtp-port", type=int, default=587, help="SMTP port for sending emails")
    parser.add_argument("--sender-email", default="marketing.system@example.com", help="Sender email address")
    parser.add_argument("--sender-name", default="Marketing AI System", help="Sender name")
    parser.add_argument("--username", help="SMTP username (if required)")
    parser.add_argument("--no-auth", action="store_true", help="Skip SMTP authentication")
    parser.add_argument("--recipient-email", default="abhirooprt03@gmail.com", help="Recipient email address")
    parser.add_argument("--recipient-email2", default="atokala@uwm.edu", help="Second recipient email address")
    args = parser.parse_args()
    
    # Delete existing database file if it exists (for clean example run)
    if os.path.exists(args.db_path):
        try:
            os.remove(args.db_path)
            logger.info(f"Removed existing database file: {args.db_path}")
        except Exception as e:
            logger.warning(f"Could not remove existing database: {e}")
    
    # Set up email configuration
    email_config = {
        "smtp_server": args.smtp_server,
        "smtp_port": args.smtp_port,
        "sender_email": args.sender_email,
        "sender_name": args.sender_name,
        "username": args.username,
        "password": None
    }
    
    # Prompt for password if username is provided and no-auth is not set
    if args.username and not args.no_auth:
        password = getpass.getpass(f"Enter SMTP password for {args.username}: ")
        email_config["password"] = password
    
    # Initialize the integration with email configuration
    logger.info("Initializing Marketing Update Integration")
    integration = MarketingUpdateIntegration(
        db_path=args.db_path,
        use_azure=args.use_azure,
        email_config=email_config
    )
    
    # Start the integration
    integration.run()
    
    # Create recipients for updates
    logger.info("Creating test update recipients")
    recipient_ids = []
    
    # First recipient
    recipient_id1 = integration.update_agent.add_recipient(
        name="Marketing Manager",
        email=args.recipient_email,
        role="manager",
        channels=["email"],
        preferences={
            "update_frequency": "daily",
            "notification_types": ["all"]
        }
    )
    recipient_ids.append(recipient_id1)
    logger.info(f"Created recipient with ID: {recipient_id1}")
    
    # Second recipient
    recipient_id2 = integration.update_agent.add_recipient(
        name="Marketing Analyst",
        email=args.recipient_email2,
        role="analyst",
        channels=["email"],
        preferences={
            "update_frequency": "weekly",
            "notification_types": ["performance", "anomalies"]
        }
    )
    recipient_ids.append(recipient_id2)
    logger.info(f"Created recipient with ID: {recipient_id2}")
    
    # Create a sample campaign
    logger.info("Creating sample marketing campaign")
    now = datetime.now()
    campaign_data = {
        "name": "Summer Product Launch",
        "description": "Launch campaign for our new summer product line",
        "start_date": now.isoformat(),
        "end_date": (now + timedelta(days=30)).isoformat(),
        "target_audience": "18-35 year olds interested in outdoor activities",
        "goals": "Increase brand awareness,Drive pre-orders,Generate social media engagement",
        "status": "active"
    }
    
    campaign = integration.marketing_system.create_campaign(campaign_data)
    campaign_id = campaign["id"]
    logger.info(f"Created campaign with ID: {campaign_id}")
    
    # Set up a handler to monitor events
    def event_monitor(event_type, data):
        logger.info(f"EVENT: {event_type}")
        logger.info(f"DATA: {data}")
    
    # Subscribe to all relevant events
    subscribe("campaign_created", event_monitor)
    subscribe("campaign_updated", event_monitor)
    subscribe("high_engagement", event_monitor)
    subscribe("content_generated", event_monitor)
    subscribe("content_distributed", event_monitor)
    subscribe("update_sent", event_monitor)
    
    # Generate some content for the campaign
    logger.info("Generating and distributing campaign content")
    content_result = integration.marketing_system.generate_and_distribute_content(
        campaign_id=campaign_id,
        content_type="email",
        channels=["email", "social"]
    )
    
    logger.info(f"Generated and distributed content: {content_result['content']['content_id']}")
    
    # Simulate high engagement being detected
    logger.info("Simulating high engagement detection")
    
    # Wait for 2 seconds to allow event processing
    time.sleep(2)
    
    # Publish a high engagement event
    publishEvent(
        "high_engagement",
        {
            "campaign_id": campaign_id,
            "content_id": content_result['content']['content_id'],
            "metric": "click_rate",
            "value": 12.5,
            "expected_range": [3.0, 8.0],
            "timestamp": datetime.now().isoformat()
        }
    )
    
    # Wait for 2 seconds to allow event processing
    time.sleep(2)
    
    # Analyze the campaign
    logger.info("Analyzing campaign performance")
    analysis_result = integration.marketing_system.analyze_and_report(campaign_id)
    
    logger.info("Analysis completed")
    
    # Generate a manual update
    logger.info("Generating a manual update")
    update_content = integration.update_agent.generate_campaign_update(
        campaign_id=campaign_id,
        update_type="performance"
    )
    
    update = integration.update_agent.create_update(
        campaign_id=campaign_id,
        update_type="manual",
        content=update_content,
        recipients=recipient_ids
    )
    
    logger.info(f"Created update with ID: {update['update_id']}")
    
    # Send the update
    logger.info("Sending the update")
    integration.update_agent.send_update(update["update_id"])
    
    # Wait for 2 seconds to allow event processing
    time.sleep(2)
    
    logger.info("Example completed! The following events were demonstrated:")
    logger.info("1. Marketing Update Integration initialization")
    logger.info("2. Creating recipients for updates")
    logger.info("3. Creating a marketing campaign")
    logger.info("4. Generating and distributing content")
    logger.info("5. Simulating high engagement detection")
    logger.info("6. Analyzing campaign performance")
    logger.info("7. Creating and sending a manual update")
    
    # Clean up
    integration.cleanup()
    logger.info("Resources cleaned up")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.info("Example interrupted by user")
    except Exception as e:
        logger.error(f"Error in example: {e}", exc_info=True) 