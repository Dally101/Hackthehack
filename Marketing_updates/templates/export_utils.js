// Export utilities for marketing templates
const exportUtils = {
  // Convert form data to markdown format
  toMarkdown: function(formData, templateType) {
    let markdown = '';
    
    switch(templateType) {
      case 'advertisement':
        markdown = this.advertisementToMarkdown(formData);
        break;
      case 'product':
        markdown = this.productToMarkdown(formData);
        break;
      case 'press':
        markdown = this.pressToMarkdown(formData);
        break;
      case 'email':
        markdown = this.emailToMarkdown(formData);
        break;
      case 'blog':
        markdown = this.blogToMarkdown(formData);
        break;
      case 'social':
        markdown = this.socialToMarkdown(formData);
        break;
      default:
        markdown = '# Export Error\nTemplate type not recognized';
    }
    
    return markdown;
  },
  
  // Format specific conversions
  advertisementToMarkdown: function(data) {
    return `# ${data.campaignName || 'Advertisement Campaign'}

## Campaign Details
- **Type:** ${data.adType || 'N/A'}
- **Platform:** ${data.platform || 'N/A'}
- **Objective:** ${data.objective || 'N/A'}

## Target Audience
${data.targetAudience || 'N/A'}

## Content
### Headline
${data.headline || 'N/A'}

${data.subheadline ? `### Subheadline\n${data.subheadline}\n\n` : ''}

### Body Copy
${data.bodyText || 'N/A'}

### Call to Action
${data.cta || 'N/A'}

## Brand Elements
- **Tone:** ${data.brandTone || 'N/A'}
- **Unique Selling Proposition:** ${data.usp || 'N/A'}

### Key Benefits
${data.keyBenefits || 'N/A'}

${data.visualDescription ? `## Visual Elements\n${data.visualDescription}\n\n` : ''}

${data.specialInstructions ? `## Special Instructions\n${data.specialInstructions}` : ''}`;
  },
  
  productToMarkdown: function(data) {
    return `# ${data.productName || 'Product Description'}

## Product Basics
- **Category:** ${data.productCategory || 'N/A'}
- **Purpose:** ${data.productPurpose || 'N/A'}
- **Platform:** ${data.targetPlatform || 'N/A'}

## Target Audience
${data.targetAudience || 'N/A'}

## Customer Pain Points
${data.customerPainPoints || 'N/A'}

## Key Features
${data.keyFeatures || 'N/A'}

## Primary Benefits
${data.primaryBenefits || 'N/A'}

## Technical Specifications
${data.specifications || 'N/A'}

## Unique Selling Points
${data.uniqueSellingPoints || 'N/A'}

## Style Guide
- **Brand Voice:** ${data.brandVoice || 'N/A'}
- **Description Length:** ${data.descriptionLength || 'N/A'}

${data.socialProof ? `## Social Proof\n${data.socialProof}\n\n` : ''}

## Call to Action
${data.callToAction || 'N/A'}

${data.pricing ? `## Pricing\n${data.pricing}\n\n` : ''}

${data.keywords ? `## SEO Keywords\n${data.keywords}\n\n` : ''}

${data.specialInstructions ? `## Special Instructions\n${data.specialInstructions}` : ''}`;
  },
  
  pressToMarkdown: function(data) {
    const date = data.releaseDate ? new Date(data.releaseDate).toLocaleDateString() : 'N/A';
    
    return `# ${data.headline || 'Press Release'}

## Release Information
- **Type:** ${data.releaseType || 'N/A'}
- **Date:** ${date}
- **Location:** ${data.location || 'N/A'}

${data.subheadline ? `## Subheadline\n${data.subheadline}\n\n` : ''}

## Lead
${data.lead || 'N/A'}

## Body
${data.bodyText || 'N/A'}

${data.quote1 ? `## Primary Quote\n"${data.quote1}"\n\n— ${data.quoteName1 || 'N/A'}${data.quoteTitle1 ? `, ${data.quoteTitle1}` : ''}\n\n` : ''}

${data.quote2 ? `## Secondary Quote\n"${data.quote2}"\n\n— ${data.quoteName2 || 'N/A'}${data.quoteTitle2 ? `, ${data.quoteTitle2}` : ''}\n\n` : ''}

## Company Boilerplate
${data.boilerplate || 'N/A'}

${data.callToAction ? `## Call to Action\n${data.callToAction}\n\n` : ''}

## Contact Information
${data.contactInfo || 'N/A'}

${data.additionalResources ? `## Additional Resources\n${data.additionalResources}\n\n` : ''}

${data.notes ? `## Notes\n${data.notes}` : ''}`;
  },
  
  emailToMarkdown: function(data) {
    return `# ${data.subject || 'Email Campaign'}

## Campaign Details
- **Type:** ${data.campaignType || 'N/A'}
- **Purpose:** ${data.emailPurpose || 'N/A'}

## Subject Line
${data.subject || 'N/A'}

## Preheader
${data.preheader || 'N/A'}

## Target Audience
${data.audience || 'N/A'}

${data.segmentation ? `## Audience Segmentation\n${data.segmentation}\n\n` : ''}

## Main Message
${data.mainMessage || 'N/A'}

## Key Points
${data.keyPoints || 'N/A'}

${data.personalization ? `## Personalization Elements\n${data.personalization}\n\n` : ''}

## Call to Action
${data.callToAction || 'N/A'}

${data.structure ? `## Content Structure\n${data.structure}\n\n` : ''}

${data.visuals ? `## Visual Elements\n${data.visuals}\n\n` : ''}

${data.timing ? `## Timing Context\n${data.timing}\n\n` : ''}

${data.urgency ? `## Urgency Elements\n${data.urgency}\n\n` : ''}

${data.legalNotes ? `## Legal Compliance\n${data.legalNotes}\n\n` : ''}

${data.specialInstructions ? `## Special Instructions\n${data.specialInstructions}` : ''}`;
  },
  
  blogToMarkdown: function(data) {
    return `# ${data.title || 'Blog Post'}

## Blog Details
- **Category:** ${data.category || 'N/A'}
- **Target Audience:** ${data.targetAudience || 'N/A'}
- **Tone:** ${data.tone || 'N/A'}

## Introduction
${data.introduction || 'N/A'}

## Main Points
${data.mainPoints || 'N/A'}

## Conclusion
${data.conclusion || 'N/A'}

${data.keywords ? `## SEO Keywords\n${data.keywords}\n\n` : ''}

${data.callToAction ? `## Call to Action\n${data.callToAction}\n\n` : ''}

${data.specialInstructions ? `## Special Instructions\n${data.specialInstructions}` : ''}`;
  },
  
  socialToMarkdown: function(data) {
    return `# ${data.platform || 'Social Media Post'}

## Post Details
- **Platform:** ${data.platform || 'N/A'}
- **Post Type:** ${data.postType || 'N/A'}
- **Campaign:** ${data.campaign || 'N/A'}

## Content
${data.content || 'N/A'}

${data.hashtags ? `## Hashtags\n${data.hashtags}\n\n` : ''}

${data.callToAction ? `## Call to Action\n${data.callToAction}\n\n` : ''}

${data.visualDescription ? `## Visual Elements\n${data.visualDescription}\n\n` : ''}

${data.specialInstructions ? `## Special Instructions\n${data.specialInstructions}` : ''}`;
  },
  
  // Export to various formats
  downloadAs: function(content, filename, format) {
    let fileContent;
    let mimeType;
    let extension;
    
    switch(format) {
      case 'md':
        fileContent = content;
        mimeType = 'text/markdown';
        extension = 'md';
        break;
      case 'txt':
        fileContent = content.replace(/[#*_]/g, '').replace(/\n\n/g, '\n');
        mimeType = 'text/plain';
        extension = 'txt';
        break;
      case 'pdf':
        this.generatePDF(content, filename);
        return; // PDF generation handled separately
      default:
        fileContent = content;
        mimeType = 'text/markdown';
        extension = 'md';
    }
    
    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  // Generate PDF using html2pdf.js
  generatePDF: function(markdown, filename) {
    // Convert markdown to HTML first
    const converter = new showdown.Converter();
    const html = converter.makeHtml(markdown);
    
    // Create temporary container
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.padding = '20px';
    document.body.appendChild(container);
    
    // Generate PDF
    html2pdf()
      .from(container)
      .set({
        margin: [15, 15],
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .save()
      .then(() => {
        document.body.removeChild(container);
      });
  },
  
  // Preview the output in a modal
  preview: function(content, templateType) {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(content);
    
    // Create or get modal
    let modal = document.getElementById('previewModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'previewModal';
      modal.className = 'preview-modal';
      
      modal.innerHTML = `
        <div class="preview-modal-content">
          <div class="preview-modal-header">
            <h2>Preview</h2>
            <span class="preview-modal-close">&times;</span>
          </div>
          <div class="preview-modal-body"></div>
          <div class="preview-modal-footer">
            <button class="download-md">Download as Markdown</button>
            <button class="download-txt">Download as Text</button>
            <button class="download-pdf">Download as PDF</button>
            <button class="copy-markdown">Copy Markdown</button>
            <button class="generate-ai">Generate with AI</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Close button functionality
      const closeBtn = modal.querySelector('.preview-modal-close');
      closeBtn.onclick = function() {
        modal.style.display = 'none';
      };
      
      // Click outside to close
      window.onclick = function(event) {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      };
    }
    
    // Update content and display modal
    const modalBody = modal.querySelector('.preview-modal-body');
    modalBody.innerHTML = html;
    
    // Set up download buttons
    const filename = this.getFilenameFromTemplate(templateType);
    
    const mdBtn = modal.querySelector('.download-md');
    mdBtn.onclick = () => this.downloadAs(content, filename, 'md');
    
    const txtBtn = modal.querySelector('.download-txt');
    txtBtn.onclick = () => this.downloadAs(content, filename, 'txt');
    
    const pdfBtn = modal.querySelector('.download-pdf');
    pdfBtn.onclick = () => this.downloadAs(content, filename, 'pdf');
    
    const copyBtn = modal.querySelector('.copy-markdown');
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(content)
        .then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        });
    };
    
    const generateBtn = modal.querySelector('.generate-ai');
    generateBtn.onclick = () => {
      modal.style.display = 'none';
      document.querySelector('form').submit();
    };
    
    modal.style.display = 'block';
  },
  
  // Helper method to get a sensible filename based on template type
  getFilenameFromTemplate: function(templateType) {
    const date = new Date().toISOString().split('T')[0];
    
    switch(templateType) {
      case 'advertisement':
        return `ad_campaign_${date}`;
      case 'product':
        return `product_description_${date}`;
      case 'press':
        return `press_release_${date}`;
      case 'email':
        return `email_campaign_${date}`;
      case 'blog':
        return `blog_post_${date}`;
      case 'social':
        return `social_post_${date}`;
      default:
        return `marketing_content_${date}`;
    }
  }
};

// Export to global scope
window.exportUtils = exportUtils; 