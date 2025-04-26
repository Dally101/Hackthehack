import React from 'react';

// This component will be used to integrate Azure AI name tag generation
const NameTagGenerator = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">Name Tag Generator</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Generate Name Tags</h3>
        <p className="text-gray-600 mb-4">
          Use our Azure AI-powered name tag generator to create professional name tags for all participants.
          Upload your participant list or select from registered attendees.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Source</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="radio" name="data-source" className="mr-2" defaultChecked />
                <span>Registered Participants</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="data-source" className="mr-2" />
                <span>Upload CSV</span>
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="name-tag-template" className="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <select 
              id="name-tag-template" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="standard">Standard (Name, Organization)</option>
              <option value="detailed">Detailed (Name, Organization, Role)</option>
              <option value="minimal">Minimal (Name only)</option>
              <option value="qr">QR Code (Name + QR Code)</option>
              <option value="custom">Custom Template</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="badge-size" className="block text-sm font-medium text-gray-700 mb-1">Badge Size</label>
              <select 
                id="badge-size" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="standard">Standard (3.5" x 2.25")</option>
                <option value="large">Large (4" x 3")</option>
                <option value="small">Small (3" x 2")</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="badge-color" className="block text-sm font-medium text-gray-700 mb-1">Color Scheme</label>
              <select 
                id="badge-color" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="azure">Azure Theme</option>
                <option value="uwm">UWM Colors</option>
                <option value="csi">CSI Branding</option>
                <option value="custom">Custom Colors</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="badge-format" className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
              <select 
                id="badge-format" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="pdf">PDF (Multiple per page)</option>
                <option value="individual">Individual PDFs</option>
                <option value="png">PNG Images</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm text-gray-700">Include event logo</span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm text-gray-700">Include QR code for check-in</span>
            </label>
          </div>
          
          <div className="pt-2">
            <button className="btn-primary">
              Generate Name Tags
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Preview</h3>
        <div className="border border-gray-300 rounded-md p-4 bg-gray-50 flex justify-center">
          <div className="bg-white border border-gray-300 shadow-md w-56 h-36 rounded-md p-4 flex flex-col items-center justify-center">
            <div className="w-full flex justify-between items-center mb-2">
              <div className="w-10 h-10 bg-primary rounded-full"></div>
              <div className="text-xs text-gray-500">CSI Agentic AI Hackathon</div>
            </div>
            <div className="text-xl font-bold text-center">John Doe</div>
            <div className="text-sm text-gray-600 text-center">University of Wisconsin-Milwaukee</div>
            <div className="text-xs text-primary mt-1">Participant</div>
            <div className="mt-2 w-10 h-10 bg-gray-300"></div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Preview updates as you change options</p>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium mb-3">Recent Batches</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">All Participants</p>
              <p className="text-sm text-gray-500">98 name tags • Generated on Apr 20, 2025</p>
            </div>
            <div className="flex space-x-2">
              <button className="text-primary hover:text-opacity-80 px-3 py-1 border border-primary rounded-md text-sm">
                Download
              </button>
              <button className="text-primary hover:text-opacity-80 px-3 py-1 border border-primary rounded-md text-sm">
                Print
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">Team Leaders</p>
              <p className="text-sm text-gray-500">24 name tags • Generated on Apr 20, 2025</p>
            </div>
            <div className="flex space-x-2">
              <button className="text-primary hover:text-opacity-80 px-3 py-1 border border-primary rounded-md text-sm">
                Download
              </button>
              <button className="text-primary hover:text-opacity-80 px-3 py-1 border border-primary rounded-md text-sm">
                Print
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">Mentors and Judges</p>
              <p className="text-sm text-gray-500">12 name tags • Generated on Apr 19, 2025</p>
            </div>
            <div className="flex space-x-2">
              <button className="text-primary hover:text-opacity-80 px-3 py-1 border border-primary rounded-md text-sm">
                Download
              </button>
              <button className="text-primary hover:text-opacity-80 px-3 py-1 border border-primary rounded-md text-sm">
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameTagGenerator;
