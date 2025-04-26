import React from 'react';

// This component will be used to integrate the Azure AI chatbot
const Chatbot = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-lg w-80 overflow-hidden">
        <div className="bg-primary text-white p-4 flex justify-between items-center">
          <h3 className="font-bold">Hackathon Assistant</h3>
          <button className="text-white hover:text-gray-200">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="h-80 bg-gray-50 p-4 overflow-y-auto">
          <div className="flex flex-col space-y-3">
            <div className="bg-gray-200 rounded-lg p-3 max-w-[80%] self-start">
              <p className="text-sm">Hello! I'm your Hackathon Assistant. How can I help you today?</p>
            </div>
            <div className="bg-primary text-white rounded-lg p-3 max-w-[80%] self-end">
              <p className="text-sm">What are the prize categories?</p>
            </div>
            <div className="bg-gray-200 rounded-lg p-3 max-w-[80%] self-start">
              <p className="text-sm">There are 6 prize categories with a total of $5,000 in awards:</p>
              <ul className="text-sm list-disc pl-5 mt-1">
                <li>Best Overall Agentic AI Solution – $1,500</li>
                <li>Best Use of Azure AI Tools – $1,000</li>
                <li>Most Collaborative Multi-Agent System – $1,000</li>
                <li>Best Implementation Potential – $700</li>
                <li>Audience Favorite – $500</li>
                <li>Best First-Time Hacker Team – $300</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="p-3 border-t">
          <div className="flex items-center">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-opacity-90">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
