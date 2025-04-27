"""
Content Generation Agent for Marketing AI System

This module implements the Content Generation Agent component of the Marketing AI system.
The agent is responsible for creating personalized marketing materials using Azure OpenAI
with local fallback capabilities for offline operation.

Features:
- Personalized marketing content generation
- Email, social media, and other marketing content formats
- Local model fallback for offline operation
- Content customization based on target audience
"""

import os
import json
import datetime
import sqlite3
import logging
import uuid
import re
from typing import Dict, List, Optional, Tuple, Union

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("ContentGenerationAgent")

class ContentGenerationAgent:
    """
    Agent responsible for generating marketing content.
    
    This agent creates personalized marketing materials using Azure OpenAI
    with local fallback capabilities for offline operation.
    """
    
    def __init__(self, db_path: str = "marketing_agent.db", use_azure: bool = True):
        """
        Initialize the Content Generation Agent.
        
        Args:
            db_path: Path to the SQLite database for local storage
            use_azure: Whether to use Azure services when available
        """
        self.db_path = db_path
        self.use_azure = use_azure
        self.conn = None
        self.initialize_database()
        self.azure_connected = self._check_azure_connection() if use_azure else False
        logger.info(f"Content Generation Agent initialized. Azure connected: {self.azure_connected}")
    
    def initialize_database(self) -> None:
        """Set up the local SQLite database for content data."""
        try:
            self.conn = sqlite3.connect(self.db_path)
            cursor = self.conn.cursor()
            
            # Create tables if they don't exist
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS content_templates (
                id TEXT PRIMARY KEY,
                name TEXT,
                content_type TEXT,
                template TEXT,
                variables TEXT,
                created_at TEXT,
                updated_at TEXT
            )
            ''')
            
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS generated_content (
                id TEXT PRIMARY KEY,
                template_id TEXT,
                campaign_id TEXT,
                recipient_id TEXT,
                content TEXT,
                content_type TEXT,
                personalization_data TEXT,
                created_at TEXT,
                status TEXT
            )
            ''')
            
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS audience_segments (
                id TEXT PRIMARY KEY,
                name TEXT,
                description TEXT,
                criteria TEXT,
                created_at TEXT,
                updated_at TEXT
            )
            ''')
            
            self.conn.commit()
            logger.info("Database initialized successfully")
            
            # Add default templates if none exist
            self._add_default_templates()
            
        except sqlite3.Error as e:
            logger.error(f"Database initialization error: {e}")
            raise
    
    def _add_default_templates(self) -> None:
        """Add default content templates if none exist."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM content_templates")
        count = cursor.fetchone()[0]
        
        if count == 0:
            # Add default email template
            email_template = {
                "id": str(uuid.uuid4()),
                "name": "Standard Email Template",
                "content_type": "email",
                "template": """
Subject: {{subject}}

Dear {{recipient_name}},

{{main_content}}

{{call_to_action}}

Best regards,
{{sender_name}}
{{company_name}}
                """,
                "variables": json.dumps([
                    "subject", "recipient_name", "main_content", 
                    "call_to_action", "sender_name", "company_name"
                ]),
                "created_at": datetime.datetime.now().isoformat(),
                "updated_at": datetime.datetime.now().isoformat()
            }
            
            # Add default social media template
            social_template = {
                "id": str(uuid.uuid4()),
                "name": "Standard Social Media Post",
                "content_type": "social_media",
                "template": """
{{headline}}

{{post_content}}

{{hashtags}}
                """,
                "variables": json.dumps([
                    "headline", "post_content", "hashtags"
                ]),
                "created_at": datetime.datetime.now().isoformat(),
                "updated_at": datetime.datetime.now().isoformat()
            }
            
            # Add default newsletter template
            newsletter_template = {
                "id": str(uuid.uuid4()),
                "name": "Standard Newsletter",
                "content_type": "newsletter",
                "template": """
# {{newsletter_title}}

## {{main_headline}}

{{introduction}}

### {{section1_title}}
{{section1_content}}

### {{section2_title}}
{{section2_content}}

{{closing_message}}

[{{cta_text}}]({{cta_link}})

To unsubscribe, click [here]({{unsubscribe_link}})
                """,
                "variables": json.dumps([
                    "newsletter_title", "main_headline", "introduction",
                    "section1_title", "section1_content", "section2_title",
                    "section2_content", "closing_message", "cta_text",
                    "cta_link", "unsubscribe_link"
                ]),
                "created_at": datetime.datetime.now().isoformat(),
                "updated_at": datetime.datetime.now().isoformat()
            }
            
            # Insert templates
            for template in [email_template, social_template, newsletter_template]:
                cursor.execute('''
                INSERT INTO content_templates (
                    id, name, content_type, template, variables, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    template["id"],
                    template["name"],
                    template["content_type"],
                    template["template"],
                    template["variables"],
                    template["created_at"],
                    template["updated_at"]
                ))
            
            # Add default audience segments
            segments = [
                {
                    "id": str(uuid.uuid4()),
                    "name": "New Customers",
                    "description": "Customers who have made their first purchase in the last 30 days",
                    "criteria": json.dumps({
                        "customer_since": {"max_days": 30},
                        "purchase_count": {"max": 1}
                    }),
                    "created_at": datetime.datetime.now().isoformat(),
                    "updated_at": datetime.datetime.now().isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Loyal Customers",
                    "description": "Customers who have made at least 5 purchases",
                    "criteria": json.dumps({
                        "purchase_count": {"min": 5}
                    }),
                    "created_at": datetime.datetime.now().isoformat(),
                    "updated_at": datetime.datetime.now().isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Inactive Customers",
                    "description": "Customers who haven't made a purchase in the last 90 days",
                    "criteria": json.dumps({
                        "days_since_last_purchase": {"min": 90}
                    }),
                    "created_at": datetime.datetime.now().isoformat(),
                    "updated_at": datetime.datetime.now().isoformat()
                }
            ]
            
            for segment in segments:
                cursor.execute('''
                INSERT INTO audience_segments (
                    id, name, description, criteria, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    segment["id"],
                    segment["name"],
                    segment["description"],
                    segment["criteria"],
                    segment["created_at"],
                    segment["updated_at"]
                ))
            
            self.conn.commit()
            logger.info("Added default templates and audience segments")
    
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
    
    def generate_content(self, 
                       campaign_id: str,
                       content_type: str,
                       recipient_id: str,
                       template_id: Optional[str] = None,
                       personalization_data: Optional[Dict] = None) -> Dict:
        """
        Generate personalized marketing content.
        
        Args:
            campaign_id: Identifier for the marketing campaign
            content_type: Type of content to generate (email, social_media, etc.)
            recipient_id: Identifier for the content recipient
            template_id: Optional template ID to use (if None, a default for the content type will be used)
            personalization_data: Optional data for personalizing the content
            
        Returns:
            Dict containing the generated content and metadata
        """
        # Get template
        template = self._get_template(template_id, content_type)
        if not template:
            raise ValueError(f"No template found for content type: {content_type}")
        
        # Get recipient data for personalization
        recipient_data = self._get_recipient_data(recipient_id)
        
        # Combine recipient data with provided personalization data
        if personalization_data:
            combined_data = {**recipient_data, **personalization_data}
        else:
            combined_data = recipient_data
        
        # Generate content using Azure OpenAI if available, otherwise use local generation
        if self.use_azure and self.azure_connected:
            try:
                content = self._generate_with_azure(template, combined_data, content_type)
                generation_method = "azure"
            except Exception as e:
                logger.warning(f"Azure content generation failed, falling back to local: {e}")
                content = self._generate_locally(template, combined_data, content_type)
                generation_method = "local"
        else:
            content = self._generate_locally(template, combined_data, content_type)
            generation_method = "local"
        
        # Save generated content
        content_id = self._save_generated_content(
            template["id"],
            campaign_id,
            recipient_id,
            content,
            content_type,
            combined_data
        )
        
        return {
            "id": content_id,
            "content": content,
            "content_type": content_type,
            "template_id": template["id"],
            "campaign_id": campaign_id,
            "recipient_id": recipient_id,
            "generation_method": generation_method,
            "created_at": datetime.datetime.now().isoformat()
        }
    
    def _get_template(self, template_id: Optional[str], content_type: str) -> Dict:
        """
        Get a content template by ID or content type.
        
        Args:
            template_id: Optional template ID
            content_type: Content type to use if template_id is None
            
        Returns:
            Dict containing the template data
        """
        cursor = self.conn.cursor()
        
        if template_id:
            cursor.execute(
                "SELECT * FROM content_templates WHERE id = ?", 
                (template_id,)
            )
        else:
            cursor.execute(
                "SELECT * FROM content_templates WHERE content_type = ? LIMIT 1", 
                (content_type,)
            )
            
        row = cursor.fetchone()
        
        if row:
            columns = [col[0] for col in cursor.description]
            template = {columns[i]: row[i] for i in range(len(columns))}
            
            # Parse variables from JSON string
            if template.get('variables'):
                template['variables'] = json.loads(template['variables'])
                
            return template
        else:
            return None
    
    def _get_recipient_data(self, recipient_id: str) -> Dict:
        """
        Get recipient data for personalization.
        
        In a real implementation, this would query a CRM or user database.
        For now, we'll return mock data.
        
        Args:
            recipient_id: Identifier for the recipient
            
        Returns:
            Dict containing recipient data for personalization
        """
        # Mock recipient data
        # In a real implementation, this would query a database or API
        if "@" in recipient_id:
            name_part = recipient_id.split("@")[0]
            if "." in name_part:
                parts = name_part.split(".")
                first_name = parts[0].capitalize()
                last_name = parts[1].capitalize() if len(parts) > 1 else ""
            else:
                first_name = name_part.capitalize()
                last_name = ""
        else:
            first_name = "Valued"
            last_name = "Customer"
            
        return {
            "recipient_id": recipient_id,
            "recipient_name": f"{first_name} {last_name}".strip(),
            "first_name": first_name,
            "last_name": last_name,
            "company_name": "Innovative Solutions Inc.",
            "sender_name": "Marketing Team",
            "unsubscribe_link": "https://example.com/unsubscribe?id=" + recipient_id
        }
    
    def _generate_with_azure(self, template: Dict, personalization_data: Dict, content_type: str) -> str:
        """
        Generate content using Azure OpenAI.
        
        Args:
            template: Content template
            personalization_data: Data for personalizing the content
            content_type: Type of content being generated
            
        Returns:
            Generated content as a string
        """
        # In a real implementation, this would use the Azure OpenAI SDK
        # For now, we'll simulate the response
        
        logger.info(f"Generating {content_type} content using Azure OpenAI")
        
        # Extract template variables
        variables = template.get('variables', [])
        
        # Check if we have all required variables
        missing_vars = [var for var in variables if var not in personalization_data]
        if missing_vars:
            # G
(Content truncated due to size limit. Use line ranges to read in chunks)