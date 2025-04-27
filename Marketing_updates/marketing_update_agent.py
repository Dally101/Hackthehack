"""
Marketing Update Agent

This module provides a specialized agent for generating and sending marketing campaign updates
to stakeholders, team members, and other systems.
"""

import os
import logging
import json
import sqlite3
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple, Callable

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("MarketingUpdateAgent")

class MarketingUpdateAgent:
    """
    Agent responsible for generating and distributing marketing updates
    to stakeholders and other systems.
    
    This agent:
    - Monitors marketing campaign performance
    - Generates periodic and event-based updates
    - Distributes updates through multiple channels (email, Slack, etc.)
    - Provides an API for other systems to request updates
    """
    
    # Event types for the update agent
    EVENT_TYPES = {
        "CAMPAIGN_CREATED": "campaign_created",
        "CAMPAIGN_UPDATED": "campaign_updated",
        "HIGH_ENGAGEMENT": "high_engagement_detected",
        "LOW_ENGAGEMENT": "low_engagement_detected",
        "UPDATE_SENT": "update_sent",
        "UPDATE_SCHEDULED": "update_scheduled"
    }
    
    def __init__(self, db_path: str = "marketing_updates.db", use_azure: bool = True, 
                 email_config: Optional[Dict[str, Any]] = None):
        """
        Initialize the Marketing Update Agent.
        
        Args:
            db_path: Path to the SQLite database
            use_azure: Whether to use Azure services for enhanced functionality
            email_config: Email configuration for sending updates
        """
        self.db_path = db_path
        self.use_azure = use_azure
        
        # Default email configuration
        self.email_config = email_config or {
            "smtp_server": "smtp.gmail.com",
            "smtp_port": 587,
            "sender_email": "marketing.system@example.com",
            "sender_name": "Marketing AI System",
            "username": None,  # If None, will not attempt login
            "password": None   # If None, will not attempt login
        }
        
        # Initialize database
        self._init_db()
        
        # Initialize event subscribers
        self.event_subscribers = {event_type: [] for event_type in self.EVENT_TYPES.values()}
        
        # Initialize data request handlers
        self.data_request_handlers = {}
        
        logger.info("Marketing Update Agent initialized")
    
    def _init_db(self) -> None:
        """Initialize the SQLite database with necessary tables."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Create updates table
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS updates (
                id TEXT PRIMARY KEY,
                campaign_id TEXT,
                update_type TEXT,
                content TEXT,
                recipients TEXT,
                status TEXT,
                scheduled_time TEXT,
                sent_time TEXT,
                created_at TEXT
            )
            ''')
            
            # Create recipients table
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS recipients (
                id TEXT PRIMARY KEY,
                name TEXT,
                email TEXT,
                role TEXT,
                channels TEXT,
                preferences TEXT,
                created_at TEXT
            )
            ''')
            
            conn.commit()
            logger.info("Database initialized successfully")
            
        except sqlite3.Error as e:
            logger.error(f"Database initialization error: {e}")
        finally:
            if conn:
                conn.close()
    
    def subscribe_to_event(self, event_type: str, callback: Callable[[Dict[str, Any]], None]) -> bool:
        """
        Subscribe a callback function to a specific event type.
        
        Args:
            event_type: Type of event to subscribe to
            callback: Function to call when event occurs
            
        Returns:
            True if subscription was successful, False otherwise
        """
        if event_type in self.event_subscribers:
            self.event_subscribers[event_type].append(callback)
            logger.info(f"Added subscriber to event: {event_type}")
            return True
        else:
            logger.warning(f"Attempted to subscribe to unknown event type: {event_type}")
            return False
    
    def unsubscribe_from_event(self, event_type: str, callback: Callable[[Dict[str, Any]], None]) -> bool:
        """
        Unsubscribe a callback function from a specific event type.
        
        Args:
            event_type: Type of event to unsubscribe from
            callback: Function to unsubscribe
            
        Returns:
            True if unsubscription was successful, False otherwise
        """
        if event_type in self.event_subscribers and callback in self.event_subscribers[event_type]:
            self.event_subscribers[event_type].remove(callback)
            logger.info(f"Removed subscriber from event: {event_type}")
            return True
        else:
            logger.warning(f"Attempted to unsubscribe from unknown event or callback: {event_type}")
            return False
    
    def publish_event(self, event_type: str, data: Dict[str, Any]) -> None:
        """
        Publish an event to all subscribers.
        
        Args:
            event_type: Type of event to publish
            data: Event data
        """
        if event_type in self.event_subscribers:
            logger.info(f"Publishing event: {event_type}")
            for callback in self.event_subscribers[event_type]:
                try:
                    callback(data)
                except Exception as e:
                    logger.error(f"Error in event subscriber callback: {e}")
        else:
            logger.warning(f"Attempted to publish unknown event type: {event_type}")
    
    def register_data_request_handler(self, request_type: str, handler: Callable[[Dict[str, Any]], Dict[str, Any]]) -> bool:
        """
        Register a handler for a specific type of data request.
        
        Args:
            request_type: Type of data request
            handler: Function to handle the request
            
        Returns:
            True if registration was successful, False otherwise
        """
        if request_type in self.data_request_handlers:
            logger.warning(f"Overwriting existing handler for request type: {request_type}")
        
        self.data_request_handlers[request_type] = handler
        logger.info(f"Registered handler for request type: {request_type}")
        return True
    
    def handle_data_request(self, request_type: str, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle a data request from another system.
        
        Args:
            request_type: Type of data request
            request_data: Request parameters
            
        Returns:
            Response data dictionary
        """
        if request_type in self.data_request_handlers:
            logger.info(f"Handling data request: {request_type}")
            try:
                return self.data_request_handlers[request_type](request_data)
            except Exception as e:
                logger.error(f"Error handling data request: {e}")
                return {"error": str(e)}
        else:
            logger.warning(f"No handler for request type: {request_type}")
            return {"error": f"No handler for request type: {request_type}"}
    
    def create_update(self, campaign_id: str, update_type: str, 
                    content: Dict[str, Any], recipients: List[str],
                    scheduled_time: Optional[str] = None) -> Dict[str, Any]:
        """
        Create a new update for a marketing campaign.
        
        Args:
            campaign_id: ID of the campaign
            update_type: Type of update (daily, weekly, alert, etc.)
            content: Update content
            recipients: List of recipient IDs
            scheduled_time: Optional time to send the update
            
        Returns:
            Dictionary with the created update details
        """
        update_id = f"update_{hash(campaign_id + update_type + datetime.now().isoformat()) % 10000}"
        now = datetime.now().isoformat()
        
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Ensure the updates table exists
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS updates (
                id TEXT PRIMARY KEY,
                campaign_id TEXT,
                update_type TEXT,
                content TEXT,
                recipients TEXT,
                status TEXT,
                scheduled_time TEXT,
                sent_time TEXT,
                created_at TEXT
            )
            ''')
            conn.commit()
            
            # Convert dictionaries to JSON strings for storage
            content_json = json.dumps(content)
            recipients_json = json.dumps(recipients)
            
            # Determine status based on scheduled_time
            status = "scheduled" if scheduled_time else "pending"
            
            cursor.execute('''
            INSERT INTO updates (
                id, campaign_id, update_type, content, recipients,
                status, scheduled_time, sent_time, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                update_id,
                campaign_id,
                update_type,
                content_json,
                recipients_json,
                status,
                scheduled_time,
                None,  # sent_time is initially null
                now
            ))
            
            conn.commit()
            logger.info(f"Created update: {update_id} for campaign: {campaign_id}")
            
            # Create result dictionary
            result = {
                "update_id": update_id,
                "campaign_id": campaign_id,
                "update_type": update_type,
                "content": content,
                "recipients": recipients,
                "status": status,
                "scheduled_time": scheduled_time,
                "created_at": now
            }
            
            # Publish event
            self.publish_event(self.EVENT_TYPES["UPDATE_SCHEDULED"], result)
            
            return result
            
        except sqlite3.Error as e:
            logger.error(f"Error creating update: {e}")
            raise
        finally:
            if conn:
                conn.close()
    
    def send_update(self, update_id: str) -> bool:
        """
        Send a pending or scheduled update.
        
        Args:
            update_id: ID of the update to send
            
        Returns:
            True if successful, False otherwise
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Ensure the updates table exists
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS updates (
                id TEXT PRIMARY KEY,
                campaign_id TEXT,
                update_type TEXT,
                content TEXT,
                recipients TEXT,
                status TEXT,
                scheduled_time TEXT,
                sent_time TEXT,
                created_at TEXT
            )
            ''')
            conn.commit()
            
            # Get update details
            cursor.execute("SELECT * FROM updates WHERE id = ?", (update_id,))
            update_row = cursor.fetchone()
            
            if not update_row:
                logger.error(f"Update not found: {update_id}")
                return False
            
            # Convert row to dictionary
            column_names = [description[0] for description in cursor.description]
            update = dict(zip(column_names, update_row))
            
            # Parse JSON fields
            update["content"] = json.loads(update["content"])
            update["recipients"] = json.loads(update["recipients"])
            
            # Send the update to each recipient
            sent_time = datetime.now().isoformat()
            for recipient_id in update["recipients"]:
                self._send_to_recipient(recipient_id, update)
            
            # Update the status and sent_time
            cursor.execute('''
            UPDATE updates
            SET status = ?, sent_time = ?
            WHERE id = ?
            ''', ("sent", sent_time, update_id))
            
            conn.commit()
            logger.info(f"Sent update: {update_id}")
            
            # Publish event
            update["sent_time"] = sent_time
            update["status"] = "sent"
            self.publish_event(self.EVENT_TYPES["UPDATE_SENT"], update)
            
            return True
            
        except Exception as e:
            logger.error(f"Error sending update: {e}")
            return False
        finally:
            if conn:
                conn.close()
    
    def _send_to_recipient(self, recipient_id: str, update: Dict[str, Any]) -> bool:
        """
        Send an update to a specific recipient.
        
        Args:
            recipient_id: ID of the recipient
            update: Update data
            
        Returns:
            True if successful, False otherwise
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Ensure the recipients table exists
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS recipients (
                id TEXT PRIMARY KEY,
                name TEXT,
                email TEXT,
                role TEXT,
                channels TEXT,
                preferences TEXT,
                created_at TEXT
            )
            ''')
            conn.commit()
            
            # Get recipient details
            cursor.execute("SELECT * FROM recipients WHERE id = ?", (recipient_id,))
            recipient_row = cursor.fetchone()
            
            if not recipient_row:
                logger.error(f"Recipient not found: {recipient_id}")
                return False
            
            # Convert row to dictionary
            column_names = [description[0] for description in cursor.description]
            recipient = dict(zip(column_names, recipient_row))
            
            # Parse JSON fields
            if recipient["channels"]:
                recipient["channels"] = json.loads(recipient["channels"])
            else:
                recipient["channels"] = ["email"]  # Default to email
                
            if recipient["preferences"]:
                recipient["preferences"] = json.loads(recipient["preferences"])
            else:
                recipient["preferences"] = {}
            
            # Send through each channel
            for channel in recipient["channels"]:
                if channel == "email":
                    self._send_email_update(recipient, update)
                elif channel == "slack":
                    self._send_slack_update(recipient, update)
                elif channel == "sms":
                    self._send_sms_update(recipient, update)
                elif channel == "api":
                    self._send_api_update(recipient, update)
            
            logger.info(f"Sent update to recipient: {recipient_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error sending to recipient: {e}")
            return False
        finally:
            if conn:
                conn.close()
    
    def _send_email_update(self, recipient: Dict[str, Any], update: Dict[str, Any]) -> bool:
        """
        Send an update via email.
        
        Args:
            recipient: Recipient data
            update: Update data
            
        Returns:
            True if successful, False otherwise
        """
        recipient_email = recipient['email']
        recipient_name = recipient['name']
        logger.info(f"Sending email update to: {recipient_email}")
        
        try:
            # Create email message
            message = MIMEMultipart("alternative")
            message["Subject"] = update['content']['title']
            message["From"] = f"{self.email_config['sender_name']} <{self.email_config['sender_email']}>"
            message["To"] = f"{recipient_name} <{recipient_email}>"
            
            # Create plain text and HTML versions
            text_content = self._generate_text_email(update['content'], recipient)
            html_content = self._generate_html_email(update['content'], recipient)
            
            # Attach parts
            message.attach(MIMEText(text_content, "plain"))
            message.attach(MIMEText(html_content, "html"))
            
            # Send email
            if self.use_azure and "azure_communication_key" in self.email_config:
                logger.info("Using Azure Communication Services for email delivery")
                # In a real implementation, this would use Azure Communication Services
                # This is a placeholder for Azure email sending
                return True
            else:
                logger.info("Using SMTP for email delivery")
                return self._send_via_smtp(recipient_email, message)
            
        except Exception as e:
            logger.error(f"Error sending email: {e}", exc_info=True)
            return False
    
    def _send_via_smtp(self, recipient_email: str, message: MIMEMultipart) -> bool:
        """
        Send an email via SMTP.
        
        Args:
            recipient_email: Recipient email address
            message: Email message to send
            
        Returns:
            True if successful, False otherwise
        """
        smtp_server = self.email_config["smtp_server"]
        smtp_port = self.email_config["smtp_port"]
        username = self.email_config["username"]
        password = self.email_config["password"]
        
        try:
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
                    self.email_config["sender_email"], 
                    recipient_email, 
                    message.as_string()
                )
                
                logger.info(f"Email sent to {recipient_email}")
                return True
                
        except Exception as e:
            logger.error(f"Error sending email via SMTP: {e}", exc_info=True)
            return False
    
    def _generate_text_email(self, content: Dict[str, Any], recipient: Dict[str, Any]) -> str:
        """
        Generate plain text email content.
        
        Args:
            content: Update content
            recipient: Recipient data
            
        Returns:
            Plain text email content
        """
        # Get content components
        title = content.get("title", "Marketing Update")
        summary = content.get("summary", "")
        metrics = content.get("metrics", {})
        highlights = content.get("highlights", [])
        recommendations = content.get("recommendations", [])
        
        # Build text email
        text = f"""
Hello {recipient['name']},

{title}

{summary}

"""
        
        # Add metrics if available
        if metrics:
            text += "KEY METRICS:\n"
            for metric, value in metrics.items():
                text += f"- {metric.replace('_', ' ').title()}: {value}\n"
            text += "\n"
        
        # Add highlights if available
        if highlights:
            text += "HIGHLIGHTS:\n"
            for highlight in highlights:
                text += f"- {highlight}\n"
            text += "\n"
        
        # Add recommendations if available
        if recommendations:
            text += "RECOMMENDATIONS:\n"
            for recommendation in recommendations:
                text += f"- {recommendation}\n"
            text += "\n"
        
        # Add footer
        text += """
This update was generated by the Marketing AI System.
"""
        
        return text
    
    def _generate_html_email(self, content: Dict[str, Any], recipient: Dict[str, Any]) -> str:
        """
        Generate HTML email content.
        
        Args:
            content: Update content
            recipient: Recipient data
            
        Returns:
            HTML email content
        """
        # Get content components
        title = content.get("title", "Marketing Update")
        summary = content.get("summary", "")
        metrics = content.get("metrics", {})
        highlights = content.get("highlights", [])
        recommendations = content.get("recommendations", [])
        
        # Build HTML content
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
        <h1>{title}</h1>
    </div>
    <div class="content">
        <div class="section">
            <p>{summary}</p>
        </div>
"""
        
        # Add metrics if available
        if metrics:
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
        
        # Add highlights if available
        if highlights:
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
        
        # Add recommendations if available
        if recommendations:
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
        
        # Add footer
        html += """
        <div class="footer">
            <p>This update was generated by the Marketing AI System</p>
        </div>
    </div>
</body>
</html>
"""
        
        return html
    
    def _send_slack_update(self, recipient: Dict[str, Any], update: Dict[str, Any]) -> bool:
        """
        Send an update via Slack.
        
        Args:
            recipient: Recipient data
            update: Update data
            
        Returns:
            True if successful, False otherwise
        """
        # This is a placeholder for actual Slack sending logic
        logger.info(f"Sending Slack update to user: {recipient['name']}")
        
        return True
    
    def _send_sms_update(self, recipient: Dict[str, Any], update: Dict[str, Any]) -> bool:
        """
        Send an update via SMS.
        
        Args:
            recipient: Recipient data
            update: Update data
            
        Returns:
            True if successful, False otherwise
        """
        # This is a placeholder for actual SMS sending logic
        logger.info(f"Sending SMS update to: {recipient['name']}")
        
        if self.use_azure:
            logger.info("Using Azure Communication Services for SMS delivery")
        
        return True
    
    def _send_api_update(self, recipient: Dict[str, Any], update: Dict[str, Any]) -> bool:
        """
        Send an update via API webhook.
        
        Args:
            recipient: Recipient data
            update: Update data
            
        Returns:
            True if successful, False otherwise
        """
        # This is a placeholder for actual API webhook sending logic
        logger.info(f"Sending API update to webhook for: {recipient['name']}")
        
        return True
    
    def generate_campaign_update(self, campaign_id: str, update_type: str = "auto") -> Dict[str, Any]:
        """
        Generate update content for a campaign.
        
        Args:
            campaign_id: ID of the campaign
            update_type: Type of update to generate
            
        Returns:
            Update content dictionary
        """
        # This is where we'd request the latest campaign details and analytics
        # from the main Marketing AI System using interAgentComm
        
        # For now, we'll create a placeholder update
        update_content = {
            "title": f"Campaign Update: {campaign_id}",
            "summary": "This is an automatically generated campaign update.",
            "metrics": {
                "reach": 10000,
                "engagement": 2.5,
                "conversion": 1.2
            },
            "highlights": [
                "Engagement is trending upward",
                "New audience segments have been identified",
                "Content performance is exceeding targets"
            ],
            "recommendations": [
                "Consider increasing budget for high-performing channels",
                "Test new messaging variations based on engagement data",
                "Schedule additional content for peak engagement times"
            ],
            "timestamp": datetime.now().isoformat()
        }
        
        return update_content
    
    def get_campaign_recipients(self, campaign_id: str) -> List[str]:
        """
        Get the list of recipient IDs for a campaign.
        
        Args:
            campaign_id: ID of the campaign
            
        Returns:
            List of recipient IDs
        """
        # In a real implementation, this would query the database
        # to get recipients associated with the campaign
        # For now, we'll return a placeholder list
        return ["recipient_1", "recipient_2", "recipient_3"]
    
    def add_recipient(self, name: str, email: str, role: str, 
                    channels: Optional[List[str]] = None,
                    preferences: Optional[Dict[str, Any]] = None) -> str:
        """
        Add a new recipient.
        
        Args:
            name: Recipient name
            email: Recipient email
            role: Recipient role
            channels: List of communication channels
            preferences: Recipient preferences
            
        Returns:
            ID of the created recipient
        """
        recipient_id = f"recip_{hash(email) % 10000}"
        now = datetime.now().isoformat()
        
        # Set defaults
        if not channels:
            channels = ["email"]
        
        if not preferences:
            preferences = {
                "update_frequency": "daily",
                "notification_types": ["performance", "anomalies"]
            }
        
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Ensure the recipients table exists
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS recipients (
                id TEXT PRIMARY KEY,
                name TEXT,
                email TEXT,
                role TEXT,
                channels TEXT,
                preferences TEXT,
                created_at TEXT
            )
            ''')
            conn.commit()
            
            # Convert to JSON
            channels_json = json.dumps(channels)
            preferences_json = json.dumps(preferences)
            
            cursor.execute('''
            INSERT INTO recipients (
                id, name, email, role, channels, preferences, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                recipient_id,
                name,
                email,
                role,
                channels_json,
                preferences_json,
                now
            ))
            
            conn.commit()
            logger.info(f"Added recipient: {name} ({recipient_id})")
            
            return recipient_id
            
        except sqlite3.Error as e:
            logger.error(f"Error adding recipient: {e}")
            raise
        finally:
            if conn:
                conn.close()
    
    def schedule_updates(self, campaign_id: str, update_type: str,
                       frequency: str, start_date: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Schedule recurring updates for a campaign.
        
        Args:
            campaign_id: ID of the campaign
            update_type: Type of update to schedule
            frequency: Update frequency (daily, weekly, monthly)
            start_date: Optional start date
            
        Returns:
            List of scheduled update details
        """
        if not start_date:
            start_date = datetime.now().isoformat()
        
        # Get recipients for this campaign
        recipients = self.get_campaign_recipients(campaign_id)
        
        # In a real implementation, this would calculate a series
        # of scheduled dates based on the frequency and start date
        # For now, we'll just schedule a single update
        update_content = self.generate_campaign_update(campaign_id, update_type)
        
        scheduled_update = self.create_update(
            campaign_id=campaign_id,
            update_type=update_type,
            content=update_content,
            recipients=recipients,
            scheduled_time=start_date
        )
        
        return [scheduled_update]
    
    def process_campaign_event(self, event_type: str, campaign_data: Dict[str, Any]) -> None:
        """
        Process an event related to a campaign.
        
        Args:
            event_type: Type of campaign event
            campaign_data: Campaign event data
        """
        campaign_id = campaign_data.get("id") or campaign_data.get("campaign_id")
        if not campaign_id:
            logger.error("Campaign event missing ID")
            return
        
        logger.info(f"Processing campaign event: {event_type} for campaign: {campaign_id}")
        
        if event_type == "campaign_created":
            # Send a notification about the new campaign
            update_content = {
                "title": f"New Campaign Created: {campaign_data.get('name', campaign_id)}",
                "summary": campaign_data.get("description", "No description provided"),
                "details": campaign_data,
                "timestamp": datetime.now().isoformat()
            }
            
            self.create_update(
                campaign_id=campaign_id,
                update_type="notification",
                content=update_content,
                recipients=self.get_campaign_recipients(campaign_id)
            )
            
        elif event_type == "high_engagement":
            # Send an alert about high engagement
            update_content = {
                "title": f"High Engagement Alert: {campaign_id}",
                "summary": f"Unusually high engagement detected for content: {campaign_data.get('content_id', 'unknown')}",
                "details": campaign_data,
                "timestamp": datetime.now().isoformat()
            }
            
            self.create_update(
                campaign_id=campaign_id,
                update_type="alert",
                content=update_content,
                recipients=self.get_campaign_recipients(campaign_id)
            )
    
    def cleanup(self) -> None:
        """Clean up resources when shutting down."""
        logger.info("Cleaning up Marketing Update Agent resources")
        # Any cleanup needed would go here 