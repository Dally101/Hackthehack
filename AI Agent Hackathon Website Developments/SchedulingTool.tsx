import React from 'react';

// This component will be used to integrate Azure AI scheduling tools
const SchedulingTool = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">Event Scheduler</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Create New Event</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
            <input 
              type="text" 
              id="event-title" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter event title"
            />
          </div>
          
          <div>
            <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              id="event-date" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label htmlFor="event-time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input 
              type="time" 
              id="event-time" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input 
              type="text" 
              id="event-location" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter location"
            />
          </div>
          
          <div>
            <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              id="event-description" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter event description"
              rows={3}
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="event-attendees" className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
            <select 
              id="event-attendees" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              multiple
            >
              <option value="all-participants">All Participants</option>
              <option value="team-leaders">Team Leaders Only</option>
              <option value="mentors">Mentors</option>
              <option value="sponsors">Sponsors</option>
              <option value="judges">Judges</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple groups</p>
          </div>
          
          <div>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-700">Send calendar invites</span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-700">Set up reminder notifications</span>
            </label>
          </div>
          
          <div className="pt-2">
            <button className="btn-primary">
              Schedule Event
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Upcoming Events</h3>
        <div className="space-y-3">
          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Azure AI Workshop</h4>
                <p className="text-sm text-gray-600">April 25, 2025 • 2:00 PM • CSI Classroom</p>
                <p className="text-sm mt-1">Introduction to Azure AI services and tools for the hackathon.</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-primary hover:text-opacity-80">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button className="text-red-500 hover:text-opacity-80">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Team Formation Session</h4>
                <p className="text-sm text-gray-600">April 25, 2025 • 3:15 PM • CSI Main Area</p>
                <p className="text-sm mt-1">Participants organize into teams for the hackathon.</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-primary hover:text-opacity-80">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button className="text-red-500 hover:text-opacity-80">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Mentor Check-in</h4>
                <p className="text-sm text-gray-600">April 26, 2025 • 10:00 AM • CSI Main Area</p>
                <p className="text-sm mt-1">Scheduled check-in with mentors to assist teams.</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-primary hover:text-opacity-80">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button className="text-red-500 hover:text-opacity-80">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingTool;
