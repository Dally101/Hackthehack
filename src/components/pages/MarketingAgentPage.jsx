import React, { useEffect } from 'react';

const MarketingAgentPage = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Marketing AI Agent | Hackathon Management';
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Marketing AI Agent</h1>
        <p className="text-lg text-gray-700 mb-6">
          Generate professional marketing content for your hackathon using our AI-powered marketing agent.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Embed the marketing agent interface in an iframe */}
        <iframe 
          src="http://localhost:5001" 
          title="Marketing AI Agent"
          className="w-full"
          style={{ height: 'calc(100vh - 250px)', minHeight: '800px' }}
          frameBorder="0"
        ></iframe>
      </div>
      
      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold mb-3">How to Use the Marketing Agent</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Select the type of content you want to generate (social media post, email, blog post, etc.)</li>
          <li>Specify your target audience for more relevant messaging</li>
          <li>Choose the tone that best fits your brand and message</li>
          <li>Adjust the length based on your needs</li>
          <li>Provide specific instructions in the prompt field</li>
          <li>Click "Generate Content" to create your marketing material</li>
          <li>Export or share your content using the buttons below the generated text</li>
        </ol>
      </div>
    </div>
  );
};

export default MarketingAgentPage; 