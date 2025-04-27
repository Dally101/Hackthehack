"""
Marketing Update Agent Integration

This module integrates the Marketing Update Agent with the Marketing AI System,
enabling automated updates and alerts about marketing campaigns.
"""

import os
import sys
import logging
import argparse
from typing import Dict, List, Any, Optional

# Add the parent directory to the path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the inter-agent communication module
from backend.utils.interAgentComm import (
    subscribe, unsubscribe, publishEvent, 
    requestData, respondToRequest, 
    registerDataRequestHandler
)

# Import our components
from Marketing_updates.marketing_update_agent import MarketingUpdateAgent
from Marketing_updates.marketing_ai_system import MarketingAISystem

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("MarketingUpdateIntegration")

class MarketingUpdateIntegration:
    """
    Integration between the Marketing Update Agent and the Marketing AI System.
    
    This class:
    - Sets up event forwarding between systems
    - Registers data request handlers
    - Manages startup and shutdown procedures
    """
    
    def __init__(self, db_path: str = "marketing.db", use_azure: bool = True,
                 email_config: Optional[Dict[str, Any]] = None):
        """
        Initialize the integration.
        
        Args:
            db_path: Path to the SQLite database
            use_azure: Whether to use Azure services
            email_config: Email configuration for sending updates
        """
        # Initialize component systems
        self.marketing_system = MarketingAISystem(db_path, use_azure)
        self.update_agent = MarketingUpdateAgent(db_path, use_azure, email_config)
        
        # Set up event mapping
        self.event_mapping = self._setup_event_mapping()
        
        # Register data request handlers
        self._register_data_handlers()
        
        logger.info("Marketing Update Integration initialized")
    
    def _setup_event_mapping(self) -> Dict[str, str]:
        """
        Set up mapping between internal marketing system events and update agent events.
        
        Returns:
            Dictionary mapping internal event types to external event types
        """
        # Define the mapping between internal and external events
        return {
            # Marketing AI System events to forward
            "campaign_created": "CAMPAIGN_CREATED",
            "campaign_updated": "CAMPAIGN_UPDATED",
            "high_engagement": "HIGH_ENGAGEMENT_DETECTED",
            "low_engagement": "LOW_ENGAGEMENT_DETECTED",
            "content_generated": "CONTENT_GENERATED",
            "content_distributed": "CONTENT_DISTRIBUTED",
            "campaign_analyzed": "CAMPAIGN_ANALYZED",
            
            # Update Agent events to forward
            "update_sent": "UPDATE_SENT",
            "update_scheduled": "UPDATE_SCHEDULED"
        }
    
    def _register_data_handlers(self) -> None:
        """Register data request handlers for both systems."""
        # Register handlers for Marketing AI System data requests
        registerDataRequestHandler("campaign_details", self._handle_campaign_details_request)
        registerDataRequestHandler("campaign_analysis", self._handle_campaign_analysis_request)
        
        # Register Update Agent's ability to handle update requests
        self.update_agent.register_data_request_handler(
            "generate_update", 
            lambda data: self.update_agent.generate_campaign_update(
                data.get("campaign_id", ""), 
                data.get("update_type", "auto")
            )
        )
        
        logger.info("Data request handlers registered")
    
    def _handle_campaign_details_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle requests for campaign details.
        
        Args:
            request_data: Request parameters
            
        Returns:
            Response data with campaign details
        """
        campaign_id = request_data.get("campaign_id")
        if not campaign_id:
            return {"status": "error", "message": "Missing campaign_id"}
        
        try:
            campaign = self.marketing_system.get_campaign(campaign_id)
            return {
                "status": "success",
                "data": campaign
            }
        except Exception as e:
            logger.error(f"Error getting campaign details: {e}")
            return {
                "status": "error",
                "message": str(e)
            }
    
    def _handle_campaign_analysis_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle requests for campaign analysis.
        
        Args:
            request_data: Request parameters
            
        Returns:
            Response data with campaign analysis
        """
        campaign_id = request_data.get("campaign_id")
        if not campaign_id:
            return {"status": "error", "message": "Missing campaign_id"}
        
        try:
            analysis = self.marketing_system.analyze_and_report(campaign_id)
            return {
                "status": "success",
                "data": analysis
            }
        except Exception as e:
            logger.error(f"Error getting campaign analysis: {e}")
            return {
                "status": "error",
                "message": str(e)
            }
    
    def _subscribe_to_marketing_system_events(self) -> None:
        """Subscribe to events from the Marketing AI System."""
        # Define a handler for marketing system events
        def handle_marketing_event(event_type: str, data: Dict[str, Any]) -> None:
            logger.info(f"Marketing system event received: {event_type}")
            
            # Process the event in the update agent
            self.update_agent.process_campaign_event(event_type, data)
            
            # Forward the event to the global event system if needed
            if event_type in self.event_mapping:
                global_event_type = self.event_mapping[event_type]
                publishEvent(global_event_type, data)
                logger.info(f"Forwarded event to global system: {global_event_type}")
        
        # Subscribe to all relevant marketing system events
        for event_type in self.event_mapping.keys():
            if event_type.startswith("campaign_") or event_type.startswith("content_") or "engagement" in event_type:
                # Handle the events internally - in a real system this would use the marketing_system's
                # event subscription mechanism
                subscribe(event_type, handle_marketing_event)
                logger.info(f"Subscribed to marketing system event: {event_type}")
    
    def _subscribe_to_update_agent_events(self) -> None:
        """Subscribe to events from the Update Agent."""
        # Define a handler for update agent events
        def handle_update_event(data: Dict[str, Any]) -> None:
            event_type = data.get("event_type", "unknown")
            logger.info(f"Update agent event received: {event_type}")
            
            # Forward the event to the global event system if needed
            if event_type in self.event_mapping:
                global_event_type = self.event_mapping[event_type]
                publishEvent(global_event_type, data)
                logger.info(f"Forwarded update event to global system: {global_event_type}")
        
        # Subscribe to update agent events
        self.update_agent.subscribe_to_event(
            self.update_agent.EVENT_TYPES["UPDATE_SENT"], 
            handle_update_event
        )
        
        self.update_agent.subscribe_to_event(
            self.update_agent.EVENT_TYPES["UPDATE_SCHEDULED"], 
            handle_update_event
        )
        
        logger.info("Subscribed to update agent events")
    
    def run(self) -> None:
        """Start the integrated system."""
        # Subscribe to events from both systems
        self._subscribe_to_marketing_system_events()
        self._subscribe_to_update_agent_events()
        
        # Set up automatic updates for new campaigns
        def handle_campaign_created(event_type: str, data: Dict[str, Any]) -> None:
            campaign_id = data.get("id") or data.get("campaign_id")
            if campaign_id:
                logger.info(f"Setting up automatic updates for new campaign: {campaign_id}")
                self.update_agent.schedule_updates(
                    campaign_id=campaign_id,
                    update_type="weekly",
                    frequency="weekly"
                )
        
        # Subscribe to campaign creation events for automatic updates
        subscribe("campaign_created", handle_campaign_created)
        
        logger.info("Marketing Update Integration is running")
        
        # In a real application, we would have a main loop here
        # For now, we'll just log that we're ready
        logger.info("System is ready and waiting for events")
    
    def cleanup(self) -> None:
        """Clean up resources when shutting down."""
        logger.info("Cleaning up Marketing Update Integration")
        
        # Unsubscribe from events
        for event_type in self.event_mapping.keys():
            try:
                unsubscribe(event_type, None)  # Unsubscribe all handlers
            except Exception as e:
                logger.warning(f"Error unsubscribing from {event_type}: {e}")
        
        # Clean up component systems
        self.marketing_system.cleanup()
        self.update_agent.cleanup()
        
        logger.info("Cleanup complete")


def main() -> None:
    """Main entry point for the integration."""
    parser = argparse.ArgumentParser(description="Marketing Update Integration")
    parser.add_argument("--db-path", default="marketing.db", help="Path to the SQLite database")
    parser.add_argument("--use-azure", action="store_true", help="Use Azure services")
    parser.add_argument("--smtp-server", default="smtp.gmail.com", help="SMTP server for sending emails")
    parser.add_argument("--smtp-port", type=int, default=587, help="SMTP port for sending emails")
    parser.add_argument("--sender-email", default="marketing.system@example.com", help="Sender email address")
    parser.add_argument("--sender-name", default="Marketing AI System", help="Sender name")
    parser.add_argument("--username", help="SMTP username (if required)")
    parser.add_argument("--password", help="SMTP password (if required)")
    parser.add_argument("--recipient-email", help="Send a one-time update to this email address")
    parser.add_argument("--campaign-name", default="Test Campaign", help="Campaign name for one-time update")
    parser.add_argument("--update-title", default="Marketing Update", help="Title for one-time update")
    args = parser.parse_args()
    
    # Set up email configuration
    email_config = {
        "smtp_server": args.smtp_server,
        "smtp_port": args.smtp_port,
        "sender_email": args.sender_email,
        "sender_name": args.sender_name,
        "username": args.username,
        "password": args.password
    }
    
    # Initialize the integration
    integration = MarketingUpdateIntegration(
        db_path=args.db_path,
        use_azure=args.use_azure,
        email_config=email_config
    )
    
    # If recipient email is provided, send a one-time update
    if args.recipient_email:
        print(f"Sending one-time update to {args.recipient_email}")
        
        # Create a temporary campaign
        campaign_data = {
            "name": args.campaign_name,
            "description": "One-time campaign update",
            "target_audience": "Marketing stakeholders",
            "goals": "Keep stakeholders informed",
            "status": "active"
        }
        
        campaign = integration.marketing_system.create_campaign(campaign_data)
        campaign_id = campaign["id"]
        
        # Add the recipient
        recipient_id = integration.update_agent.add_recipient(
            name="Marketing Stakeholder",
            email=args.recipient_email,
            role="stakeholder",
            channels=["email"],
            preferences={"update_frequency": "as_needed"}
        )
        
        # Generate update content
        update_content = {
            "title": args.update_title,
            "summary": "This is a one-time marketing update sent from the command line.",
            "metrics": {
                "reach": 15000,
                "engagement": 4.2,
                "conversion": 2.1
            },
            "highlights": [
                "Engagement is trending upward",
                "Social media campaigns showing strong results",
                "Email campaigns have higher open rates than industry average"
            ],
            "recommendations": [
                "Increase budget allocation for top-performing channels",
                "Test new messaging with target demographic",
                "Expand content strategy to include more video"
            ],
            "timestamp": integration.update_agent.generate_campaign_update(campaign_id)["timestamp"]
        }
        
        # Create and send the update
        update = integration.update_agent.create_update(
            campaign_id=campaign_id,
            update_type="one_time",
            content=update_content,
            recipients=[recipient_id]
        )
        
        success = integration.update_agent.send_update(update["update_id"])
        if success:
            print("Update sent successfully!")
        else:
            print("Failed to send update. Check logs for details.")
        
        # Clean up
        integration.cleanup()
        return
    
    # If no recipient email, run the integration as a service
    try:
        integration.run()
        
        # In a real application, we would wait for an exit signal here
        # For demonstration, we'll just indicate how to exit
        logger.info("Press Ctrl+C to exit")
        
        # Simulate keeping the process running
        import time
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        logger.info("Received exit signal")
    finally:
        integration.cleanup()


if __name__ == "__main__":
    main() 