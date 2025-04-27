# Marketing AI System Documentation

## Overview

The Marketing AI System is a comprehensive solution for automating marketing tasks for the CSI Agentic AI Hackathon. It leverages Azure AI services to generate personalized marketing content, schedule optimal delivery times, distribute content through various channels, and analyze campaign performance.

## System Architecture

The system consists of four specialized AI agents:

1. **Content Generation Agent**: Creates personalized marketing materials using Azure OpenAI with local fallback capabilities
2. **Scheduling Agent**: Determines optimal timing for sending marketing materials based on recipient preferences and engagement patterns
3. **Distribution Agent**: Handles delivery of marketing materials to appropriate channels and manages recipient lists
4. **Analytics Agent**: Analyzes campaign performance, provides insights, and generates recommendations

These agents are integrated through a unified Marketing AI System that provides a comprehensive API for the web interface.

## Features

### Content Generation
- Personalized marketing content creation
- Support for multiple content types (email, social media, newsletters)
- Template-based generation with variable placeholders
- Azure OpenAI integration with local fallback for offline operation
- Audience segmentation for targeted messaging

### Scheduling
- Optimal delivery time determination based on recipient preferences
- Calendar integration for scheduling around events
- Time zone awareness for global campaigns
- Frequency management to prevent recipient fatigue
- Local scheduling capabilities for offline operation

### Distribution
- Multi-channel distribution (email, social media, SMS)
- Delivery tracking and status reporting
- Retry handling for failed deliveries
- Queue management for scheduled content
- Local queuing for offline operation

### Analytics
- Campaign performance analysis
- Engagement and conversion tracking
- Insight generation based on performance data
- Recommendation generation for campaign improvement
- Comprehensive reporting

## Integration with Azure AI

The system integrates with Azure AI services for enhanced capabilities:

- **Azure OpenAI Service**: Powers the content generation with advanced language models
- **Azure Communication Services**: Enables multi-channel communication
- **Azure Cognitive Services**: Provides analytics and insights
- **Azure AI Search**: Helps with content organization and discovery

When Azure services are unavailable, the system falls back to local processing capabilities, ensuring continuous operation even offline.

## Getting Started

### Prerequisites
- Azure subscription for AI services
- Python 3.8 or higher
- SQLite for local database storage

### Installation

1. Clone the repository:
```
git clone https://github.com/your-org/marketing-ai-system.git
```

2. Install dependencies:
```
pip install -r requirements.txt
```

3. Configure Azure credentials:
```
export AZURE_OPENAI_KEY=your_key_here
export AZURE_OPENAI_ENDPOINT=your_endpoint_here
```

4. Initialize the database:
```
python initialize_database.py
```

### Usage

#### Command Line Interface

Run the system from the command line:
```
python marketing_ai_system.py
```

#### Web Interface

Access the web interface at `/marketing` on your hackathon website.

## Web Interface Guide

The web interface provides a user-friendly way to interact with the Marketing AI System. It includes the following sections:

### Campaigns
- View all marketing campaigns
- Create new campaigns
- Monitor campaign performance
- Analyze campaign results

### Templates
- Manage content templates
- Create new templates with variable placeholders
- Edit existing templates

### Audience Segments
- Define audience segments based on criteria
- Manage segment membership
- Target content to specific segments

### Distribution Channels
- Configure distribution channels (email, social media, SMS)
- Set up channel credentials
- Monitor channel performance

## API Reference

The Marketing AI System provides a comprehensive API for integration with other systems:

### Campaign Management
- `create_campaign(name, description, start_date, end_date, settings)`
- `get_campaign(campaign_id)`
- `update_campaign(campaign_id, name, description, status, start_date, end_date, settings)`
- `list_campaigns(status)`
- `delete_campaign(campaign_id)`

### Content Generation
- `generate_campaign_content(campaign_id, segment_id, content_type, template_id, base_personalization)`
- `create_content_template(name, content_type, template, variables)`
- `get_content_templates(content_type)`

### Audience Management
- `create_audience_segment(name, description, criteria)`
- `get_audience_segments()`

### Scheduling
- `schedule_campaign_content(campaign_id, content_items, earliest_time, latest_time)`

### Distribution
- `distribute_campaign_content(campaign_id, content_items, channel_id, schedule)`
- `process_distribution_queue(limit)`
- `create_distribution_channel(name, channel_type, config)`
- `get_distribution_channels(channel_type)`

### Analytics
- `analyze_campaign_performance(campaign_id)`
- `generate_campaign_report(campaign_id)`
- `track_campaign_metric(campaign_id, metric_name, metric_value, source)`
- `track_content_engagement(content_id, recipient_id, engagement_type, engagement_value)`
- `get_campaign_recommendations(campaign_id)`
- `update_recommendation_status(recommendation_id, status)`

## Offline Capabilities

The Marketing AI System is designed to function even without internet connectivity:

- Content is generated using local templates and rules when Azure OpenAI is unavailable
- Scheduling uses local algorithms when cloud services are inaccessible
- Distribution queues content locally for later delivery when channels are unavailable
- Analytics processes data locally when cloud analytics services are unreachable

When connectivity is restored, the system automatically synchronizes with Azure services.

## Customization

The system is highly customizable:

- Content templates can be tailored to specific needs
- Audience segments can be defined with custom criteria
- Distribution channels can be configured for various platforms
- Analytics can be customized to track specific metrics

## Troubleshooting

### Common Issues

#### Content Generation Issues
- **Problem**: Content generation fails
- **Solution**: Check Azure OpenAI credentials or use local fallback

#### Scheduling Issues
- **Problem**: Scheduling produces unexpected times
- **Solution**: Verify recipient preferences and time zone settings

#### Distribution Issues
- **Problem**: Content not being delivered
- **Solution**: Check channel credentials and queue status

#### Analytics Issues
- **Problem**: Analytics not showing data
- **Solution**: Verify tracking implementation and data collection

### Logging

The system logs all activities to help with troubleshooting:
```
tail -f logs/marketing_ai_system.log
```

## Security Considerations

The Marketing AI System includes several security features:

- Credentials are stored securely and never exposed in logs
- Personal data is handled according to privacy regulations
- All communications are encrypted
- Access to the system is controlled through authentication

## Future Enhancements

Planned future enhancements include:

- Integration with additional Azure AI services
- Enhanced personalization using machine learning
- More distribution channels
- Advanced analytics and predictive modeling
- Mobile app for on-the-go management

## Support

For support, contact the hackathon organizers or submit an issue on the GitHub repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
