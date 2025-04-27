# Azure Marketing Agent Demo

This demo showcases how to use Azure AI Projects to create an AI-powered marketing agent for generating marketing content.

## Running in Sample Mode

By default, the demo runs in "sample mode," which doesn't require Azure credentials:

```bash
python fixed_demo.py --type "social media post" --audience "environmentally conscious consumers" --tone "enthusiastic"
```

### Command Line Arguments

- `--prompt`: The main instruction for content generation
- `--audience`: Target audience for the content
- `--type`: Type of content (email, social post, blog, etc.)
- `--tone`: Desired tone (professional, casual, humorous, etc.)
- `--length`: Approximate length of content (short, medium, long)
- `--use-azure`: Enable Azure AI connection (requires proper configuration)

## Setting Up with Azure AI Projects

To use this with actual Azure AI services:

1. Create an Azure AI Project in the Azure portal
2. Copy `env_template.txt` to a new file named `.env`
3. Fill in your Azure credentials in the `.env` file:
   ```
   AZURE_ENDPOINT=https://your-project-endpoint.azure.com
   AZURE_SUBSCRIPTION_ID=your-subscription-id
   AZURE_RESOURCE_GROUP=your-resource-group-name
   AZURE_PROJECT_NAME=your-ai-project-name
   ```
4. Run the script with the `--use-azure` flag:
   ```bash
   python fixed_demo.py --use-azure --type "email" --audience "tech professionals" --tone "professional"
   ```

## Dependencies

Install the required packages:

```bash
pip install azure-ai-projects~=1.0.0b7 azure-identity python-dotenv
```

## Troubleshooting

- **Missing Module Error**: Make sure you've installed all dependencies.
- **Authentication Error**: Verify your Azure credentials are correct in the `.env` file.
- **Initialization Error**: Ensure your Azure AI Project is properly set up and accessible.
- **Rust Error**: Windows users may need to install Rust for cryptography dependencies.

## Example Content Types

The demo supports various content types:

1. **Social Media Posts**:
   ```bash
   python fixed_demo.py --type "social media post" --audience "young professionals" --tone "casual"
   ```

2. **Email Campaigns**:
   ```bash
   python fixed_demo.py --type "email" --audience "existing customers" --tone "friendly"
   ```

3. **Blog Posts**:
   ```bash
   python fixed_demo.py --type "blog post" --audience "industry professionals" --tone "informative"
   ```

4. **Product Descriptions**:
   ```bash
   python fixed_demo.py --type "product description" --audience "shoppers" --tone "persuasive"
   ```

## Notes on Azure AI Projects API

The Azure AI Projects API is currently in beta and subject to change. The fixed_demo.py script has been adapted to work with the available API structure in version 1.0.0b10.

If you want to use the full capabilities of Azure AI Projects for content generation, you'll need:

1. An Azure subscription
2. An Azure AI project created in the Azure portal
3. Proper permissions set up for your account
4. The required environment variables specified in the `.env` file 