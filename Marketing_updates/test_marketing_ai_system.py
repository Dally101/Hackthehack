"""
Test script for the Marketing AI System

This script tests the functionality of the Marketing AI System by:
1. Creating a test campaign
2. Generating content for the campaign
3. Scheduling the content
4. Distributing the content
5. Analyzing the campaign performance

Usage:
    python test_marketing_ai_system.py
"""

import os
import sys
import json
import datetime
import time
import logging
import uuid
import random

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("MarketingAISystemTest")

# Import the Marketing AI System
sys.path.append('/home/ubuntu')
try:
    from marketing_ai_system import MarketingAISystem
    from scheduling_agent import SchedulingAgent
    from content_generation_agent import ContentGenerationAgent
    from distribution_agent import DistributionAgent
    from analytics_agent import AnalyticsAgent
except ImportError as e:
    logger.error(f"Error importing Marketing AI System modules: {e}")
    sys.exit(1)

def test_marketing_ai_system():
    """Run a comprehensive test of the Marketing AI System."""
    logger.info("Starting Marketing AI System test")
    
    # Initialize the Marketing AI System
    try:
        system = MarketingAISystem(db_path="/home/ubuntu/marketing_agent_test.db", use_azure=True)
        logger.info("Marketing AI System initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Marketing AI System: {e}")
        return False
    
    try:
        # Test 1: Create a campaign
        logger.info("Test 1: Creating a campaign")
        campaign_id = system.create_campaign(
            name="Test Hackathon Promotion",
            description="A campaign to promote the upcoming AI Agent Hackathon",
            start_date=datetime.datetime.now(),
            end_date=datetime.datetime.now() + datetime.timedelta(days=30),
            settings={
                "target_audience": "Tech professionals and students",
                "content_types": ["email", "social_media"],
                "frequency": "weekly"
            }
        )
        logger.info(f"Campaign created with ID: {campaign_id}")
        
        # Verify campaign creation
        campaign = system.get_campaign(campaign_id)
        if not campaign:
            logger.error("Failed to retrieve created campaign")
            return False
        logger.info("Campaign created and retrieved successfully")
        
        # Test 2: Create an audience segment
        logger.info("Test 2: Creating an audience segment")
        segment_id = system.create_audience_segment(
            name="Hackathon Participants",
            description="Potential participants for the AI Agent Hackathon",
            criteria={"interest": "artificial intelligence", "role": "developer"}
        )
        logger.info(f"Audience segment created with ID: {segment_id}")
        
        # Test 3: Create a content template
        logger.info("Test 3: Creating a content template")
        template_id = system.create_content_template(
            name="Hackathon Invitation Email",
            content_type="email",
            template="""
Subject: Join us for the {{event_name}} - {{event_date}}

Dear {{recipient_name}},

We're excited to invite you to the {{event_name}}, a unique opportunity to explore and develop AI agents using Azure AI services.

{{event_description}}

Event Details:
- Date: {{event_date}}
- Location: {{event_location}}
- Registration Deadline: {{registration_deadline}}

{{call_to_action}}

We hope to see you there!

Best regards,
{{sender_name}}
{{organization_name}}
            """,
            variables=[
                "event_name", "event_date", "recipient_name", "event_description",
                "event_location", "registration_deadline", "call_to_action",
                "sender_name", "organization_name"
            ]
        )
        logger.info(f"Content template created with ID: {template_id}")
        
        # Test 4: Generate content for the campaign
        logger.info("Test 4: Generating content for the campaign")
        content_items = system.generate_campaign_content(
            campaign_id=campaign_id,
            segment_id=segment_id,
            content_type="email",
            template_id=template_id,
            base_personalization={
                "event_name": "CSI Agentic AI Hackathon",
                "event_date": "May 15-17, 2025",
                "event_description": "Join us for an exciting weekend of building AI agents that can automate tasks, assist users, and solve real-world problems using Azure AI services.",
                "event_location": "Virtual and In-Person at Tech Hub",
                "registration_deadline": "May 1, 2025",
                "call_to_action": "Register now at https://aihackathon.example.com",
                "sender_name": "The Hackathon Team",
                "organization_name": "CSI Tech Community"
            }
        )
        logger.info(f"Generated {len(content_items)} content items")
        
        # Test 5: Schedule the content
        logger.info("Test 5: Scheduling content")
        earliest_time = datetime.datetime.now() + datetime.timedelta(days=1)
        latest_time = datetime.datetime.now() + datetime.timedelta(days=7)
        schedule = system.schedule_campaign_content(
            campaign_id=campaign_id,
            content_items=content_items,
            earliest_time=earliest_time,
            latest_time=latest_time
        )
        logger.info(f"Scheduled {len(schedule)} content items")
        
        # Test 6: Create a distribution channel
        logger.info("Test 6: Creating a distribution channel")
        channel_id = system.create_distribution_channel(
            name="Hackathon Email Channel",
            channel_type="email",
            config={
                "smtp_server": "smtp.example.com",
                "smtp_port": 587,
                "smtp_user": "hackathon@example.com",
                "smtp_password": "password",
                "from_email": "hackathon@example.com",
                "from_name": "AI Hackathon Team"
            }
        )
        logger.info(f"Distribution channel created with ID: {channel_id}")
        
        # Test 7: Queue content for distribution
        logger.info("Test 7: Queuing content for distribution")
        queue_ids = system.distribute_campaign_content(
            campaign_id=campaign_id,
            content_items=content_items,
            channel_id=channel_id,
            schedule=schedule
        )
        logger.info(f"Queued {len(queue_ids)} content items for distribution")
        
        # Test 8: Process the distribution queue
        logger.info("Test 8: Processing distribution queue")
        processed_count = system.process_distribution_queue()
        logger.info(f"Processed {processed_count} queued items")
        
        # Test 9: Track metrics and engagement
        logger.info("Test 9: Tracking metrics and engagement")
        # Track send count
        system.track_campaign_metric(
            campaign_id=campaign_id,
            metric_name="send_count",
            metric_value=len(content_items)
        )
        
        # Simulate some opens, clicks, and other engagement
        for i, item in enumerate(content_items):
            # Simulate different engagement patterns
            if i % 3 == 0:  # Every 3rd recipient opens and clicks
                system.track_content_engagement(
                    content_id=item['id'],
                    recipient_id=item['recipient_id'],
                    engagement_type="open"
                )
                system.track_content_engagement(
                    content_id=item['id'],
                    recipient_id=item['recipient_id'],
                    engagement_type="click",
                    engagement_value="/register"
                )
            elif i % 3 == 1:  # Every 3rd + 1 recipient only opens
                system.track_content_engagement(
                    content_id=item['id'],
                    recipient_id=item['recipient_id'],
                    engagement_type="open"
                )
            # The rest don't engage
        
        # Track open and click counts
        open_count = len(content_items) // 3 * 2  # 2/3 of recipients open
        click_count = len(content_items) // 3     # 1/3 of recipients click
        
        system.track_campaign_metric(
            campaign_id=campaign_id,
            metric_name="open_count",
            metric_value=open_count
        )
        
        system.track_campaign_metric(
            campaign_id=campaign_id,
            metric_name="click_count",
            metric_value=click_count
        )
        
        logger.info(f"Tracked metrics: send_count={len(content_items)}, open_count={open_count}, click_count={click_count}")
        
        # Test 10: Analyze campaign performance
        logger.info("Test 10: Analyzing campaign performance")
        analysis = system.analyze_campaign_performance(campaign_id)
        
        # Log insights and recommendations
        logger.info("Campaign Analysis Results:")
        logger.info("Insights:")
        for insight in analysis.get("insights", []):
            logger.info(f"- {insight.get('insight_text', '')}")
        
        logger.info("Recommendations:")
        for recommendation in analysis.get("recommendations", []):
            logger.info(f"- {recommendation.get('recommendation_text', '')}")
        
        # Test 11: Generate a campaign report
        logger.info("Test 11: Generating campaign report")
        report = system.generate_campaign_report(campaign_id)
        logger.info(f"Generated report for campaign {campaign_id}")
        
        # Test 12: Test Azure synchronization
        logger.info("Test 12: Testing Azure synchronization")
        sync_results = system.sync_with_azure()
        logger.info(f"Azure sync results: {sync_results}")
        
        logger.info("All tests completed successfully")
        return True
        
    except Exception as e:
        logger.error(f"Test failed with error: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False
    finally:
        # Clean up
        try:
            system.close()
            logger.info("Marketing AI System closed")
        except Exception as e:
            logger.error(f"Error closing Marketing AI System: {e}")

if __name__ == "__main__":
    success = test_marketing_ai_system()
    if success:
        print("Marketing AI System test completed successfully")
        sys.exit(0)
    else:
        print("Marketing AI System test failed")
        sys.exit(1)
