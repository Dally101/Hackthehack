"""
Marketing AI System

This module provides the main Marketing AI System which handles campaign management,
content generation, distribution, and analytics.
"""

import os
import logging
import sqlite3
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple

# Import the interAgentComm module
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.utils.interAgentComm import publishEvent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("MarketingAISystem")

class AnalyticsAgent:
    """
    Agent responsible for analyzing marketing campaign performance.
    """
    
    def __init__(self, db_path: str, use_azure: bool = True):
        """
        Initialize the Analytics Agent.
        
        Args:
            db_path: Path to the SQLite database
            use_azure: Whether to use Azure services for enhanced analytics
        """
        self.db_path = db_path
        self.use_azure = use_azure
        logger.info("Analytics Agent initialized")
    
    def analyze_campaign(self, campaign_id: str) -> Dict[str, Any]:
        """
        Analyze a marketing campaign and return performance metrics.
        
        Args:
            campaign_id: ID of the campaign to analyze
            
        Returns:
            Dictionary with campaign performance metrics
        """
        logger.info(f"Analyzing campaign: {campaign_id}")
        
        # In a real implementation, this would query the database
        # and possibly use AI services to analyze performance
        
        # Mock analysis data for demonstration
        return {
            "campaign_id": campaign_id,
            "metrics": {
                "reach": 12500,
                "engagement_rate": 3.2,
                "conversion_rate": 1.8,
                "roi": 2.4,
                "click_through_rate": 2.1
            },
            "trends": {
                "engagement_trend": "increasing",
                "conversion_trend": "stable",
                "reach_trend": "increasing"
            },
            "recommendations": [
                "Increase frequency of posts on LinkedIn",
                "A/B test different call-to-action phrases",
                "Focus more on video content based on engagement metrics"
            ],
            "analysis_timestamp": datetime.now().isoformat()
        }
    
    def detect_engagement_anomalies(self, campaign_id: str) -> List[Dict[str, Any]]:
        """
        Detect unusual engagement patterns for a campaign.
        
        Args:
            campaign_id: ID of the campaign to analyze
            
        Returns:
            List of detected anomalies with details
        """
        logger.info(f"Detecting engagement anomalies for campaign: {campaign_id}")
        
        # Mock anomaly data for demonstration
        return [
            {
                "type": "high_engagement",
                "content_id": "content_123",
                "metric": "shares",
                "value": 250,
                "expected_range": [20, 100],
                "timestamp": datetime.now().isoformat()
            }
        ]


class ContentGenerator:
    """
    Agent responsible for generating marketing content.
    """
    
    def __init__(self, use_azure: bool = True):
        """
        Initialize the Content Generator.
        
        Args:
            use_azure: Whether to use Azure AI services for content generation
        """
        self.use_azure = use_azure
        logger.info("Content Generator initialized")
    
    def generate_content(self, campaign_id: str, content_type: str, 
                         target_audience: str, key_messages: List[str]) -> Dict[str, Any]:
        """
        Generate marketing content for a campaign.
        
        Args:
            campaign_id: ID of the campaign
            content_type: Type of content (email, social, blog, etc.)
            target_audience: Description of the target audience
            key_messages: List of key messages to include
            
        Returns:
            Dictionary with the generated content
        """
        logger.info(f"Generating {content_type} content for campaign: {campaign_id}")
        
        # Mock content generation for demonstration
        # In a real implementation, this would use an LLM or other AI service
        
        content = {
            "content_id": f"content_{hash(campaign_id + content_type) % 10000}",
            "campaign_id": campaign_id,
            "content_type": content_type,
            "title": f"Engaging {content_type.capitalize()} for {target_audience}",
            "body": f"This is a sample {content_type} targeting {target_audience}. " + 
                    "It includes key messages about our product and services.",
            "key_points": key_messages,
            "generated_at": datetime.now().isoformat()
        }
        
        if content_type == "email":
            content["subject_line"] = "Special offer just for you!"
            content["preview_text"] = "Discover our latest innovations..."
        elif content_type == "social":
            content["hashtags"] = ["#marketing", "#innovation", "#digital"]
            content["recommended_platforms"] = ["LinkedIn", "Twitter"]
        
        return content


class ContentDistributor:
    """
    Agent responsible for distributing marketing content.
    """
    
    def __init__(self, use_azure: bool = True):
        """
        Initialize the Content Distributor.
        
        Args:
            use_azure: Whether to use Azure services for distribution
        """
        self.use_azure = use_azure
        logger.info("Content Distributor initialized")
    
    def distribute_content(self, content_id: str, channels: List[str], 
                          scheduling: Dict[str, Any]) -> Dict[str, Any]:
        """
        Distribute content across selected channels.
        
        Args:
            content_id: ID of the content to distribute
            channels: List of channels to distribute to
            scheduling: Scheduling information (times, frequency, etc.)
            
        Returns:
            Dictionary with distribution results
        """
        logger.info(f"Distributing content {content_id} to channels: {', '.join(channels)}")
        
        # Mock distribution results for demonstration
        return {
            "content_id": content_id,
            "distribution_id": f"dist_{hash(content_id) % 10000}",
            "channels": channels,
            "status": "scheduled",
            "scheduled_posts": [
                {
                    "channel": channel,
                    "scheduled_time": datetime.now().isoformat(),
                    "status": "pending"
                } for channel in channels
            ],
            "distribution_timestamp": datetime.now().isoformat()
        }


class MarketingAISystem:
    """
    Main Marketing AI System that orchestrates all marketing activities.
    
    This system manages:
    - Marketing campaigns
    - Content generation and distribution
    - Analytics and reporting
    - Event coordination with other systems
    """
    
    def __init__(self, db_path: str = "marketing.db", use_azure: bool = True):
        """
        Initialize the Marketing AI System.
        
        Args:
            db_path: Path to the SQLite database
            use_azure: Whether to use Azure services
        """
        self.db_path = db_path
        self.use_azure = use_azure
        
        # Initialize the database
        self._init_db()
        
        # Initialize component agents
        self.analytics_agent = AnalyticsAgent(db_path, use_azure)
        self.content_generator = ContentGenerator(use_azure)
        self.content_distributor = ContentDistributor(use_azure)
        
        logger.info("Marketing AI System initialized")
    
    def _init_db(self) -> None:
        """Initialize the SQLite database with necessary tables."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Create campaigns table
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS campaigns (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                start_date TEXT,
                end_date TEXT,
                target_audience TEXT,
                goals TEXT,
                status TEXT,
                created_at TEXT,
                updated_at TEXT
            )
            ''')
            
            # Create content table
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS content (
                id TEXT PRIMARY KEY,
                campaign_id TEXT,
                content_type TEXT,
                title TEXT,
                body TEXT,
                created_at TEXT,
                FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
            )
            ''')
            
            # Create distribution table
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS distribution (
                id TEXT PRIMARY KEY,
                content_id TEXT,
                channel TEXT,
                scheduled_time TEXT,
                status TEXT,
                FOREIGN KEY (content_id) REFERENCES content(id)
            )
            ''')
            
            # Create analytics table
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS analytics (
                id TEXT PRIMARY KEY,
                campaign_id TEXT,
                metric_name TEXT,
                metric_value REAL,
                timestamp TEXT,
                FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
            )
            ''')
            
            conn.commit()
            logger.info("Database initialized successfully")
            
        except sqlite3.Error as e:
            logger.error(f"Database initialization error: {e}")
        finally:
            if conn:
                conn.close()
    
    def create_campaign(self, campaign_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new marketing campaign.
        
        Args:
            campaign_data: Campaign information
            
        Returns:
            Dictionary with created campaign details
        """
        campaign_id = campaign_data.get('id', f"camp_{hash(campaign_data['name']) % 10000}")
        now = datetime.now().isoformat()
        
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
        cursor.execute('''
        INSERT INTO campaigns (
                id, name, description, start_date, end_date, 
                target_audience, goals, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            campaign_id,
                campaign_data.get('name', ''),
                campaign_data.get('description', ''),
                campaign_data.get('start_date', ''),
                campaign_data.get('end_date', ''),
                campaign_data.get('target_audience', ''),
                campaign_data.get('goals', ''),
                campaign_data.get('status', 'draft'),
                now,
                now
            ))
            
            conn.commit()
            logger.info(f"Campaign created: {campaign_id}")
            
            # Include the campaign ID in the result
            result = {**campaign_data, 'id': campaign_id, 'created_at': now, 'updated_at': now}
            
            # Publish campaign created event
            self._publish_event('campaign_created', result)
            
            return result
            
        except sqlite3.Error as e:
            logger.error(f"Error creating campaign: {e}")
            raise
        finally:
            if conn:
                conn.close()
    
    def update_campaign(self, campaign_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing marketing campaign.
        
        Args:
            campaign_id: ID of the campaign to update
            update_data: Updated campaign information
            
        Returns:
            Dictionary with updated campaign details
        """
        now = datetime.now().isoformat()
        
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get current campaign data
            cursor.execute("SELECT * FROM campaigns WHERE id = ?", (campaign_id,))
            campaign_row = cursor.fetchone()
            
            if not campaign_row:
                logger.error(f"Campaign not found: {campaign_id}")
                raise ValueError(f"Campaign not found: {campaign_id}")
            
            # Update campaign with new data
            set_clauses = []
            params = []
            
            for key, value in update_data.items():
                if key != 'id':  # Don't update the ID
                    set_clauses.append(f"{key} = ?")
                    params.append(value)
            
            set_clauses.append("updated_at = ?")
            params.append(now)
        params.append(campaign_id)
        
            cursor.execute(f'''
            UPDATE campaigns
            SET {', '.join(set_clauses)}
            WHERE id = ?
            ''', params)
            
            conn.commit()
            logger.info(f"Campaign updated: {campaign_id}")
            
            # Get updated campaign data
            cursor.execute("SELECT * FROM campaigns WHERE id = ?", (campaign_id,))
            updated_row = cursor.fetchone()
            column_names = [description[0] for description in cursor.description]
            updated_campaign = dict(zip(column_names, updated_row))
            
            # Publish campaign updated event
            self._publish_event('campaign_updated', updated_campaign)
            
            return updated_campaign
            
        except sqlite3.Error as e:
            logger.error(f"Error updating campaign: {e}")
            raise
        finally:
            if conn:
                conn.close()
    
    def get_campaign(self, campaign_id: str) -> Dict[str, Any]:
        """
        Get details of a specific campaign.
        
        Args:
            campaign_id: ID of the campaign
            
        Returns:
            Dictionary with campaign details
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute("SELECT * FROM campaigns WHERE id = ?", (campaign_id,))
            campaign_row = cursor.fetchone()
            
            if not campaign_row:
                logger.error(f"Campaign not found: {campaign_id}")
                raise ValueError(f"Campaign not found: {campaign_id}")
            
            column_names = [description[0] for description in cursor.description]
            campaign = dict(zip(column_names, campaign_row))
            
            return campaign
            
        except sqlite3.Error as e:
            logger.error(f"Error retrieving campaign: {e}")
            raise
        finally:
            if conn:
                conn.close()
    
    def generate_and_distribute_content(self, campaign_id: str, content_type: str, 
                                       channels: List[str]) -> Dict[str, Any]:
        """
        Generate and distribute content for a campaign.
        
        Args:
            campaign_id: ID of the campaign
            content_type: Type of content to generate
            channels: Channels to distribute to
            
        Returns:
            Dictionary with content and distribution details
        """
        # Get campaign details
        campaign = self.get_campaign(campaign_id)
        
        # Generate content
        content = self.content_generator.generate_content(
            campaign_id,
            content_type,
            campaign['target_audience'],
            campaign.get('goals', '').split(',')
        )
        
        # Publish content generated event
        self._publish_event('content_generated', content)
        
        # Distribute content
        scheduling = {
            "immediate": True
        }
        
        distribution = self.content_distributor.distribute_content(
            content['content_id'],
            channels,
            scheduling
        )
        
        # Publish content distributed event
        self._publish_event('content_distributed', distribution)
        
        # Return combined result
        return {
            "campaign": campaign,
            "content": content,
            "distribution": distribution
        }
    
    def analyze_and_report(self, campaign_id: str) -> Dict[str, Any]:
        """
        Analyze campaign performance and generate a report.
        
        Args:
            campaign_id: ID of the campaign to analyze
            
        Returns:
            Dictionary with analysis results
        """
        # Get campaign details
        campaign = self.get_campaign(campaign_id)
        
        # Analyze campaign
        analysis = self.analytics_agent.analyze_campaign(campaign_id)
        
        # Check for engagement anomalies
        anomalies = self.analytics_agent.detect_engagement_anomalies(campaign_id)
        
        # Publish analysis event
        self._publish_event('campaign_analyzed', analysis)
        
        # Publish anomaly events if any
        for anomaly in anomalies:
            if anomaly['type'] == 'high_engagement':
                self._publish_event('high_engagement', anomaly)
            elif anomaly['type'] == 'low_engagement':
                self._publish_event('low_engagement', anomaly)
        
        # Return combined result
        return {
            "campaign": campaign,
            "analysis": analysis,
            "anomalies": anomalies
        }
    
    def _publish_event(self, event_type: str, data: Dict[str, Any]) -> None:
        """
        Publish an event to the event system.
        
        Args:
            event_type: Type of event to publish
            data: Event data
        """
        logger.info(f"Publishing event: {event_type}")
        # Use the actual publishEvent function from interAgentComm
        publishEvent(event_type, data, "MarketingAISystem")
    
    def cleanup(self) -> None:
        """Clean up resources when shutting down."""
        logger.info("Cleaning up Marketing AI System resources")
        # Any cleanup needed would go here