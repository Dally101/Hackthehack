"""
Distribution Agent for Marketing AI System

This module implements the Distribution Agent component of the Marketing AI system.
The agent is responsible for handling delivery of marketing materials to appropriate
channels and managing recipient lists.

Features:
- Delivery of marketing materials to appropriate channels
- Management of recipient lists and personalization
- Tracking of delivery status and reporting issues
- Local queuing for offline operation
"""

import os
import json
import datetime
import sqlite3
import logging
import uuid
import time
import smtplib
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, List, Optional, Tuple, Union

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("DistributionAgent")

class DistributionAgent:
    """
    Agent responsible for distributing marketing content.
    
    This agent handles the delivery of marketing materials to appropriate
    channels, manages recipient lists, and tracks delivery status.
    """
    
    def __init__(self, db_path: str = "marketing_agent.db", use_azure: bool = True):
        """
        Initialize the Distribution Agent.
        
        Args:
            db_path: Path to the SQLite database for local storage
            use_azure: Whether to use Azure services when available
        """
        self.db_path = db_path
        self.use_azure = use_azure
        self.conn = None
        self.initialize_database()
        self.azure_connected = self._check_azure_connection() if use_azure else False
        logger.info(f"Distribution Agent initialized. Azure connected: {self.azure_connected}")
    
    def initialize_database(self) -> None:
        """Set up the local SQLite database for distribution data."""
        try:
            self.conn = sqlite3.connect(self.db_path)
            cursor = self.conn.cursor()
            
            # Create tables if they don't exist
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS distribution_channels (
                id TEXT PRIMARY KEY,
                name TEXT,
                channel_type TEXT,
                config TEXT,
                created_at TEXT,
                updated_at TEXT
            )
            ''')
            
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS distribution_queue (
                id TEXT PRIMARY KEY,
                content_id TEXT,
                channel_id TEXT,
                recipient_id TEXT,
                status TEXT,
                scheduled_time TEXT,
                sent_time TEXT,
                retry_count INTEGER,
                error_message TEXT,
                created_at TEXT,
                updated_at TEXT
            )
            ''')
            
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS distribution_logs (
                id TEXT PRIMARY KEY,
                queue_id TEXT,
                status TEXT,
                message TEXT,
                timestamp TEXT
            )
            ''')
            
            self.conn.commit()
            logger.info("Database initialized successfully")
            
            # Add default channels if none exist
            self._add_default_channels()
            
        except sqlite3.Error as e:
            logger.error(f"Database initialization error: {e}")
            raise
    
    def _add_default_channels(self) -> None:
        """Add default distribution channels if none exist."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM distribution_channels")
        count = cursor.fetchone()[0]
        
        if count == 0:
            # Add default email channel
            email_channel = {
                "id": str(uuid.uuid4()),
                "name": "Default Email Channel",
                "channel_type": "email",
                "config": json.dumps({
                    "smtp_server": "smtp.example.com",
                    "smtp_port": 587,
                    "smtp_user": "user@example.com",
                    "smtp_password": "password",
                    "from_email": "marketing@example.com",
                    "from_name": "Marketing Team"
                }),
                "created_at": datetime.datetime.now().isoformat(),
                "updated_at": datetime.datetime.now().isoformat()
            }
            
            # Add default social media channel
            social_channel = {
                "id": str(uuid.uuid4()),
                "name": "Default Social Media Channel",
                "channel_type": "social_media",
                "config": json.dumps({
                    "platform": "twitter",
                    "api_key": "your_api_key",
                    "api_secret": "your_api_secret",
                    "access_token": "your_access_token",
                    "access_token_secret": "your_access_token_secret"
                }),
                "created_at": datetime.datetime.now().isoformat(),
                "updated_at": datetime.datetime.now().isoformat()
            }
            
            # Add default SMS channel
            sms_channel = {
                "id": str(uuid.uuid4()),
                "name": "Default SMS Channel",
                "channel_type": "sms",
                "config": json.dumps({
                    "provider": "twilio",
                    "account_sid": "your_account_sid",
                    "auth_token": "your_auth_token",
                    "from_number": "+1234567890"
                }),
                "created_at": datetime.datetime.now().isoformat(),
                "updated_at": datetime.datetime.now().isoformat()
            }
            
            # Insert channels
            for channel in [email_channel, social_channel, sms_channel]:
                cursor.execute('''
                INSERT INTO distribution_channels (
                    id, name, channel_type, config, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    channel["id"],
                    channel["name"],
                    channel["channel_type"],
                    channel["config"],
                    channel["created_at"],
                    channel["updated_at"]
                ))
            
            self.conn.commit()
            logger.info("Added default distribution channels")
    
    def _check_azure_connection(self) -> bool:
        """
        Check if Azure services are available.
        
        Returns:
            bool: True if connected to Azure, False otherwise
        """
        # In a real implementation, this would check actual Azure connectivity
        # For now, we'll simulate connectivity
        try:
            # Simulate checking Azure connection
            # In a real implementation, this would use the Azure SDK
            return True
        except Exception as e:
            logger.warning(f"Azure connection check failed: {e}")
            return False
    
    def queue_content(self, 
                    content_id: str,
                    channel_id: str,
                    recipient_id: str,
                    scheduled_time: Optional[datetime.datetime] = None) -> str:
        """
        Queue content for distribution.
        
        Args:
            content_id: ID of the content to distribute
            channel_id: ID of the distribution channel to use
            recipient_id: ID of the recipient
            scheduled_time: Optional scheduled time for distribution
            
        Returns:
            ID of the queued item
        """
        queue_id = str(uuid.uuid4())
        now = datetime.datetime.now()
        
        if not scheduled_time:
            scheduled_time = now
        
        cursor = self.conn.cursor()
        cursor.execute('''
        INSERT INTO distribution_queue (
            id, content_id, channel_id, recipient_id, status,
            scheduled_time, retry_count, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            queue_id,
            content_id,
            channel_id,
            recipient_id,
            'queued',
            scheduled_time.isoformat(),
            0,
            now.isoformat(),
            now.isoformat()
        ))
        
        self.conn.commit()
        
        # Log the queuing
        self._log_distribution(queue_id, 'queued', f"Content queued for distribution to {recipient_id}")
        
        logger.info(f"Queued content {content_id} for distribution to {recipient_id}")
        return queue_id
    
    def process_queue(self, limit: int = 10) -> int:
        """
        Process queued content for distribution.
        
        Args:
            limit: Maximum number of items to process
            
        Returns:
            Number of items processed
        """
        now = datetime.datetime.now()
        
        cursor = self.conn.cursor()
        cursor.execute('''
        SELECT * FROM distribution_queue 
        WHERE status = 'queued' 
        AND datetime(scheduled_time) <= datetime(?)
        ORDER BY datetime(scheduled_time) ASC
        LIMIT ?
        ''', (now.isoformat(), limit))
        
        queue_items = []
        for row in cursor.fetchall():
            columns = [col[0] for col in cursor.description]
            item = {columns[i]: row[i] for i in range(len(columns))}
            queue_items.append(item)
        
        processed_count = 0
        for item in queue_items:
            try:
                # Get content and channel details
                content = self._get_content(item['content_id'])
                channel = self._get_channel(item['channel_id'])
                
                if not content or not channel:
                    self._update_queue_status(
                        item['id'], 
                        'failed', 
                        f"Content or channel not found: content_id={item['content_id']}, channel_id={item['channel_id']}"
                    )
                    continue
                
                # Distribute content
                success, message = self._distribute_content(content, channel, item['recipient_id'])
                
                if success:
                    self._update_queue_status(
                        item['id'], 
                        'sent', 
                        message,
                        sent_time=now.isoformat()
                    )
                    processed_count += 1
                else:
                    # Increment retry count
                    retry_count = item['retry_count'] + 1
                    max_retries = 3  # Maximum number of retry attempts
                    
                    if retry_count >= max_retries:
                        self._update_queue_status(
                            item['id'], 
                            'failed', 
                            f"Max retries exceeded: {message}",
                            retry_count=retry_count
                        )
                    else:
                        # Reschedule for later
                        retry_delay = 30 * (2 ** retry_count)  # Exponential backoff
                        next_attempt = now + datetime.timedelta(minutes=retry_delay)
                        
                        self._update_queue_status(
                            item['id'], 
                            'queued', 
                            f"Scheduled for retry: {message}",
                            retry_count=retry_count,
                            scheduled_time=next_attempt.isoformat()
                        )
            except Exception as e:
                logger.error(f"Error processing queue item {item['id']}: {e}")
                self._update_queue_status(
                    item['id'], 
                    'failed', 
                    f"Processing error: {str(e)}"
                )
        
        logger.info(f"Processed {processed_count} queued items")
        return processed_count
    
    def _get_content(self, content_id: str) -> Dict:
        """
        Get content by ID.
        
        Args:
            content_id: ID of the content
            
        Returns:
            Dict containing the content data
        """
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT * FROM generated_content WHERE id = ?", 
            (content_id,)
        )
        
        row = cursor.fetchone()
        
        if row:
            columns = [col[0] for col in cursor.description]
            content = {columns[i]: row[i] for i in range(len(columns))}
            
            # Parse personalization data from JSON string
            if content.get('personalization_data'):
                content['personalization_data'] = json.loads(content['personalization_data'])
                
            return content
        else:
            return None
    
    def _get_channel(self, channel_id: str) -> Dict:
        """
        Get distribution channel by ID.
        
        Args:
            channel_id: ID of the channel
            
        Returns:
            Dict containing the channel data
        """
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT * FROM distribution_channels WHERE id = ?", 
            (channel_id,)
        )
        
        row = cursor.fetchone()
        
        if row:
            columns = [col[0] for col in cursor.description]
            channel = {columns[i]: row[i] for i in range(len(columns))}
            
            # Parse config from JSON string
            if channel.get('config'):
                channel['config'] = json.loads(channel['config'])
                
            return channel
        else:
            return None
    
    def _distribute_content(self, content: Dict, channel: Dict, recipient_id: str) -> Tuple[bool, str]:
        """
        Distribute content through the specified channel.
        
        Args:
            content: Content data
            channel: Channel data
            recipient_id: ID of the recipient
            
        Returns:
            Tuple of (success, message)
        """
        channel_type = channel['channel_type']
        
        # Try to use Azure for distribution if available
        if self.use_azure and self.azure_connected:
            try:
                # In a real implementation, this would use Azure Communication Services
                # For now, we'll use our local distribution methods
                logger.info(f"Using Azure for {channel_type} distribution")
                return self._distribute_locally(content, channel, recipient_id)
            except Exception as e:
                logger.warning(f"Azure distribution failed, falling back to local: {e}")
                return self._distribute_locally(content, channel, recipient_id)
        else:
            # Use local distribution methods
            logger.info(f"Using local {channel_type} distribution")
            return self._distribute_locally(content, channel, recipient_id)
    
    def _distribute_locally(self, content: Dict, channel: Dict, recipient_id: str) -> Tuple[bool, str]:
        """
        Distribute content using local methods.
        
        Args:
            content: Content data
            channel: Channel data
            recipient_id: ID of the recipient
            
        Returns:
            Tuple of (success, message)
        """
        channel_type = channel['channel_type']
        
        if channel_type == 'email':
            return self._send_email(content, channel, recipient_id)
        elif channel_type == 'social_media':
            return self._post_social_media(content, channel)
        elif channel_type == '
(Content truncated due to size limit. Use line ranges to read in chunks)