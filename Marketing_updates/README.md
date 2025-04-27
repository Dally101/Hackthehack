# Azure Marketing Agent Demo

This demo showcases how to use Azure AI Projects to create an AI-powered marketing agent that can generate various types of marketing content.

## Prerequisites

- Python 3.8 or later
- Azure account with access to Azure AI Projects
- Azure credentials configured (either through environment variables or Azure CLI login)

## Installation

1. Install the required packages:

```bash
pip install azure-ai-projects~=1.0.0b7 azure-identity
```

2. Ensure you have properly configured Azure authentication credentials.

## Usage

The marketing agent can generate various types of marketing content based on your specifications:

```bash
python azure_marketing_agent_demo.py --prompt "Create a promotional email for our new product launch" --audience "tech professionals" --type "email" --tone "professional" --length "medium"
```

### Command Line Arguments

- `--prompt`: (Required) The main instruction for content generation
- `--audience`: Target audience for the content
- `--type`: Type of content (email, social post, blog, etc.)
- `--tone`: Desired tone (professional, casual, humorous, etc.)
- `--length`: Approximate length of content (short, medium, long)
- `--stream`: Enable streaming response mode

### Streaming Mode

To see the content as it's being generated:

```bash
python azure_marketing_agent_demo.py --prompt "Create a social media post about our upcoming webinar" --audience "marketing professionals" --type "social" --tone "casual" --stream
```

## Example Use Cases

1. **Email Campaigns**:
   ```bash
   python azure_marketing_agent_demo.py --prompt "Create an email campaign for Black Friday sale" --audience "existing customers" --type "email" --tone "exciting" --length "medium"
   ```

2. **Social Media Posts**:
   ```bash
   python azure_marketing_agent_demo.py --prompt "Create an Instagram post for product launch" --audience "young professionals" --type "social" --tone "casual" --length "short"
   ```

3. **Blog Content**:
   ```bash
   python azure_marketing_agent_demo.py --prompt "Write a blog post about the future of AI in marketing" --audience "marketing managers" --type "blog" --tone "informative" --length "long"
   ```

4. **Press Releases**:
   ```bash
   python azure_marketing_agent_demo.py --prompt "Draft a press release about our company's recent acquisition" --audience "media outlets" --type "press release" --tone "formal" --length "medium"
   ```

## Customization

The agent uses Azure AI Projects to configure and run the content generation. You can modify the code to:

- Change the default model used
- Add more tools or capabilities to the agent
- Implement custom prompting strategies
- Save generated content to files
- Integrate with other systems

## Troubleshooting

- If you encounter authentication issues, ensure you've logged in with the Azure CLI or set proper environment variables
- For "Access Denied" errors, verify your Azure account has appropriate permissions
- Windows users may need to install Rust for cryptography dependencies 