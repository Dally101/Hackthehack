"""
Scheduling Agent for Marketing AI System

This module implements the Scheduling Agent component of the Marketing AI system.
The agent is responsible for determining optimal timing for sending marketing materials
and integrating with calendar systems.

Features:
- Schedule optimization based on recipient data
- Calendar integration for conflict avoidance
- Local caching for offline functionality
- Synchronization with cloud services when online
"""

import os
import json
import datetime
import sqlite3
import logging
from typing import Dict, List, Optional, Tuple, Union
import uuid

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("SchedulingAgent")

class SchedulingAgent:
    """
    Agent responsible for scheduling marketing content delivery.
    
    This agent determines the optimal time to send marketing materials
    based on recipient preferences, historical engagement data, and
    calendar availability.
    """
    
    def __init__(self, db_path: str = "marketing_agent.db", use_azure: bool = True):
        """
        Initialize the Scheduling Agent.
        
        Args:
            db_path: Path to the SQLite database for local storage
            use_azure: Whether to use Azure services when available
        """
        self.db_path = db_path
        self.use_azure = use_azure
        self.conn = None
        self.initialize_database()
        self.azure_connected = self._check_azure_connection() if use_azure else False
        logger.info(f"Scheduling Agent initialized. Azure connected: {self.azure_connected}")
    
    def initialize_database(self) -> None:
        """Set up the local SQLite database for scheduling data."""
        try:
            self.conn = sqlite3.connect(self.db_path)
            cursor = self.conn.cursor()
            
            # Create tables if they don't exist
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS schedules (
                id TEXT PRIMARY KEY,
                campaign_id TEXT,
                recipient_id TEXT,
                scheduled_time TEXT,
                content_type TEXT,
                status TEXT,
                created_at TEXT,
                updated_at TEXT
            )
            ''')
            
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS recipient_preferences (
                recipient_id TEXT PRIMARY KEY,
                preferred_time TEXT,
                preferred_days TEXT,
                preferred_frequency TEXT,
                last_contact TEXT,
                engagement_score REAL,
                updated_at TEXT
            )
            ''')
            
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS calendar_events (
                id TEXT PRIMARY KEY,
                start_time TEXT,
                end_time TEXT,
                title TEXT,
                description TEXT,
                synced_with_cloud BOOLEAN
            )
            ''')
            
            self.conn.commit()
            logger.info("Database initialized successfully")
        except sqlite3.Error as e:
            logger.error(f"Database initialization error: {e}")
            raise
    
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
    
    def get_optimal_schedule(self, 
                           campaign_id: str, 
                           recipient_ids: List[str], 
                           content_type: str,
                           earliest_time: Optional[datetime.datetime] = None,
                           latest_time: Optional[datetime.datetime] = None) -> Dict[str, datetime.datetime]:
        """
        Determine the optimal schedule for sending marketing materials.
        
        Args:
            campaign_id: Identifier for the marketing campaign
            recipient_ids: List of recipient identifiers
            content_type: Type of content being scheduled (email, social, etc.)
            earliest_time: Earliest allowed time for scheduling
            latest_time: Latest allowed time for scheduling
            
        Returns:
            Dict mapping recipient IDs to scheduled datetime objects
        """
        if not earliest_time:
            earliest_time = datetime.datetime.now()
        if not latest_time:
            latest_time = earliest_time + datetime.timedelta(days=7)
            
        schedule = {}
        
        # Try to use Azure for advanced scheduling if available
        if self.use_azure and self.azure_connected:
            try:
                # In a real implementation, this would call Azure AI services
                # For now, we'll use our local algorithm
                logger.info("Using Azure for optimal scheduling")
                schedule = self._local_scheduling_algorithm(
                    campaign_id, recipient_ids, content_type, earliest_time, latest_time
                )
            except Exception as e:
                logger.warning(f"Azure scheduling failed, falling back to local: {e}")
                schedule = self._local_scheduling_algorithm(
                    campaign_id, recipient_ids, content_type, earliest_time, latest_time
                )
        else:
            # Use local scheduling algorithm
            logger.info("Using local scheduling algorithm")
            schedule = self._local_scheduling_algorithm(
                campaign_id, recipient_ids, content_type, earliest_time, latest_time
            )
            
        # Save the schedule to the database
        self._save_schedule(campaign_id, schedule, content_type)
        
        return schedule
    
    def _local_scheduling_algorithm(self,
                                  campaign_id: str,
                                  recipient_ids: List[str],
                                  content_type: str,
                                  earliest_time: datetime.datetime,
                                  latest_time: datetime.datetime) -> Dict[str, datetime.datetime]:
        """
        Local algorithm for determining optimal send times.
        
        This is used when Azure is unavailable or for offline operation.
        
        Args:
            campaign_id: Identifier for the marketing campaign
            recipient_ids: List of recipient identifiers
            content_type: Type of content being scheduled
            earliest_time: Earliest allowed time for scheduling
            latest_time: Latest allowed time for scheduling
            
        Returns:
            Dict mapping recipient IDs to scheduled datetime objects
        """
        schedule = {}
        
        for recipient_id in recipient_ids:
            # Get recipient preferences
            preferences = self._get_recipient_preferences(recipient_id)
            
            # Get calendar conflicts
            conflicts = self._get_calendar_conflicts(earliest_time, latest_time)
            
            # Determine best time based on preferences and conflicts
            best_time = self._calculate_best_time(
                preferences, conflicts, earliest_time, latest_time, content_type
            )
            
            schedule[recipient_id] = best_time
            
        return schedule
    
    def _get_recipient_preferences(self, recipient_id: str) -> Dict:
        """
        Retrieve recipient preferences from the database.
        
        Args:
            recipient_id: Identifier for the recipient
            
        Returns:
            Dict containing recipient preferences
        """
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT * FROM recipient_preferences WHERE recipient_id = ?", 
            (recipient_id,)
        )
        row = cursor.fetchone()
        
        if row:
            # Convert row to dictionary
            columns = [col[0] for col in cursor.description]
            preferences = {columns[i]: row[i] for i in range(len(columns))}
            
            # Parse preferred days from JSON string
            if preferences.get('preferred_days'):
                preferences['preferred_days'] = json.loads(preferences['preferred_days'])
                
            return preferences
        else:
            # Return default preferences if none found
            now = datetime.datetime.now().isoformat()
            default_preferences = {
                'recipient_id': recipient_id,
                'preferred_time': '10:00',  # Default to morning
                'preferred_days': json.dumps(['Monday', 'Wednesday', 'Friday']),
                'preferred_frequency': 'weekly',
                'last_contact': now,
                'engagement_score': 0.5,  # Neutral score
                'updated_at': now
            }
            
            # Save default preferences to database
            self._save_recipient_preferences(default_preferences)
            
            default_preferences['preferred_days'] = json.loads(default_preferences['preferred_days'])
            return default_preferences
    
    def _save_recipient_preferences(self, preferences: Dict) -> None:
        """
        Save recipient preferences to the database.
        
        Args:
            preferences: Dictionary of recipient preferences
        """
        cursor = self.conn.cursor()
        
        # Ensure preferred_days is stored as JSON string
        if isinstance(preferences.get('preferred_days'), list):
            preferences['preferred_days'] = json.dumps(preferences['preferred_days'])
            
        # Update or insert preferences
        cursor.execute('''
        INSERT OR REPLACE INTO recipient_preferences (
            recipient_id, preferred_time, preferred_days, preferred_frequency,
            last_contact, engagement_score, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            preferences['recipient_id'],
            preferences['preferred_time'],
            preferences['preferred_days'],
            preferences['preferred_frequency'],
            preferences['last_contact'],
            preferences['engagement_score'],
            datetime.datetime.now().isoformat()
        ))
        
        self.conn.commit()
    
    def _get_calendar_conflicts(self, 
                              start_time: datetime.datetime, 
                              end_time: datetime.datetime) -> List[Dict]:
        """
        Retrieve calendar events that might conflict with scheduling.
        
        Args:
            start_time: Start of the time range to check
            end_time: End of the time range to check
            
        Returns:
            List of calendar events within the specified time range
        """
        cursor = self.conn.cursor()
        cursor.execute('''
        SELECT * FROM calendar_events 
        WHERE (start_time BETWEEN ? AND ?) OR (end_time BETWEEN ? AND ?)
        ''', (
            start_time.isoformat(), end_time.isoformat(),
            start_time.isoformat(), end_time.isoformat()
        ))
        
        conflicts = []
        for row in cursor.fetchall():
            columns = [col[0] for col in cursor.description]
            event = {columns[i]: row[i] for i in range(len(columns))}
            conflicts.append(event)
            
        return conflicts
    
    def _calculate_best_time(self,
                           preferences: Dict,
                           conflicts: List[Dict],
                           earliest_time: datetime.datetime,
                           latest_time: datetime.datetime,
                           content_type: str) -> datetime.datetime:
        """
        Calculate the best time to send marketing content based on preferences and conflicts.
        
        Args:
            preferences: Recipient preferences
            conflicts: Calendar conflicts
            earliest_time: Earliest allowed time
            latest_time: Latest allowed time
            content_type: Type of content being scheduled
            
        Returns:
            Optimal datetime for sending content
        """
        # Start with the earliest possible time
        current_time = earliest_time
        
        # Convert preferred time to hours and minutes
        preferred_time_parts = preferences.get('preferred_time', '10:00').split(':')
        preferred_hour = int(preferred_time_parts[0])
        preferred_minute = int(preferred_time_parts[1]) if len(preferred_time_parts) > 1 else 0
        
        # Parse preferred days
        preferred_days = preferences.get('preferred_days', ['Monday', 'Wednesday', 'Friday'])
        if isinstance(preferred_days, str):
            preferred_days = json.loads(preferred_days)
            
        # Map day names to weekday numbers (0 = Monday, 6 = Sunday)
        day_mapping = {
            'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3,
            'Friday': 4, 'Saturday': 5, 'Sunday': 6
        }
        preferred_weekdays = [day_mapping[day] for day in preferred_days if day in day_mapping]
        
        # Find the next preferred day and time
        while current_time <= latest_time:
            # Check if current day is preferred
            if current_time.weekday() in preferred_weekdays:
                # Set time to preferred time
                candidate_time = current_time.replace(
                    hour=preferred_hour, 
                    minute=preferred_minute,
                    second=0,
                    microsecond=0
                )
                
                # If candidate time is in the past, move to next day
                if candidate_time < earliest_time:
                    current_time = current_time + datetime.timedelta(days=1)
                    continue
                    
                # Check for conflicts
                conflict_found = False
                for event in conflicts:
                    event_start = datetime.datetime.fromisoformat(event['start_time'])
                    event_end = datetime.datetime.fromisoformat(event['end_time'])
                    
                    # Consider a 1-hour window for the marketing content
                    content_end = candidate_time + datetime.timedelta(hours=1)
                    
                    # Check for overlap
                    if (candidate_time <= event_end and content_end >= event_start):
                        conflict_found = True
                        break
                        
                if not conflict_found:
                    return candidate_time
            
            # Move to next day
            current_time = current_time + datetime.timedelta(days=1)
            
        # If no optimal time found, return the earliest time
        return earliest_time
    
    def _save_schedule(self, 
                     campaign_id: str, 
                     schedule: Dict[str, datetime.datetime],
                     content_type: str) -> None:
        """
        Save the generated schedule to the database.
        
        Args:
            campaign_id: Identifier for the marketing campaign
            schedule: Dict mapping recipient IDs to scheduled times
            content_type: Type of content being scheduled
        """
        cursor = self.conn.cursor()
        now = datetime.datetime.now().isoformat()
        
  
(Content truncated due to size limit. Use line ranges to read in chunks)