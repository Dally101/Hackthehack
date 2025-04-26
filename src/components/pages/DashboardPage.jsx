import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

// Dashboard components
const DashboardHome = () => {
  // Mock data for dashboard - would come from API in real implementation
  const upcomingEvents = [
    { id: 1, name: 'AI Innovation Challenge', date: 'May 15-17, 2025', role: 'Participant' },
    { id: 2, name: 'Sustainable Tech Hackathon', date: 'June 10-12, 2025', role: 'Participant' }
  ];

  const notifications = [
    { id: 1, message: 'Your team "AI Innovators" has been created successfully.', time: '2 hours ago', read: false },
    { id: 2, message: 'New team member request from Alex Chen.', time: '1 day ago', read: false },
    { id: 3, message: 'AI Innovation Challenge registration confirmed.', time: '3 days ago', read: true }
  ];

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h3 className="text-xl font-heading font-semibold mb-4">Upcoming Hackathons</h3>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{event.name}</h4>
                      <p className="text-sm text-gray-600">{event.date} • {event.role}</p>
                    </div>
                    <Link to={`/hackathons/${event.id}`} className="btn-outline text-sm py-1 px-3">
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">You haven't registered for any upcoming hackathons.</p>
            )}
            <div className="mt-4">
              <Link to="/hackathons" className="text-primary hover:text-primary-dark font-semibold">
                Browse Hackathons →
              </Link>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-heading font-semibold mb-4">My Teams</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold">AI Innovators</h4>
                <p className="text-sm text-gray-600">AI Innovation Challenge • 3 members</p>
              </div>
              <Link to="/dashboard/teams/1" className="btn-outline text-sm py-1 px-3">
                Team Space
              </Link>
            </div>
            <div className="mt-4">
              <Link to="/dashboard/teams" className="text-primary hover:text-primary-dark font-semibold">
                View All Teams →
              </Link>
            </div>
          </div>
        </div>
        
        <div>
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-heading font-semibold">Notifications</h3>
              <span className="text-sm text-primary font-semibold cursor-pointer">Mark all as read</span>
            </div>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div key={notification.id} className={`p-3 rounded-lg border-l-4 ${notification.read ? 'border-gray-300 bg-gray-50' : 'border-primary bg-blue-50'}`}>
                    <p className={`${notification.read ? 'text-gray-700' : 'text-gray-900 font-semibold'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No new notifications.</p>
            )}
            <div className="mt-4">
              <Link to="/dashboard/notifications" className="text-primary hover:text-primary-dark font-semibold">
                View All Notifications →
              </Link>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-heading font-semibold mb-4">AI Assistant</h3>
            <p className="text-gray-600 mb-4">
              Need help with your hackathon journey? Ask our AI assistant for guidance.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm italic text-gray-600">
                "Try asking about team formation strategies, project submission requirements, or how to prepare for presentations."
              </p>
            </div>
            <button className="btn-primary w-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat with AI Assistant
            </button>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-xl font-heading font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-800">You created team "AI Innovators"</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-800">Registered for AI Innovation Challenge</p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-purple-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-800">Updated your profile skills</p>
              <p className="text-xs text-gray-500">5 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamsList = () => {
  // Mock data for teams - would come from API in real implementation
  const teams = [
    { 
      id: 1, 
      name: 'AI Innovators', 
      hackathon: 'AI Innovation Challenge',
      members: 3,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Green Tech Solutions', 
      hackathon: 'Sustainable Tech Hackathon',
      members: 2,
      status: 'forming'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-bold">My Teams</h2>
        <button className="btn-primary">
          Create New Team
        </button>
      </div>
      
      <div className="card mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hackathon
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teams.map((team) => (
                <tr key={team.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{team.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-700">{team.hackathon}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-700">{team.members}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      team.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {team.status === 'active' ? 'Active' : 'Forming'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/dashboard/teams/${team.id}`} className="text-primary hover:text-primary-dark mr-4">
                      View
                    </Link>
                    <button className="text-gray-600 hover:text-gray-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-xl font-heading font-semibold mb-4">Team Suggestions</h3>
        <p className="text-gray-600 mb-4">
          Based on your skills and interests, our AI suggests these teams that might be a good fit for you:
        </p>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">Data Wizards</h4>
                <p className="text-sm text-gray-600 mb-2">AI Innovation Challenge • 3/4 members</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Machine Learning</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Python</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Data Science</span>
                </div>
                <p className="text-sm text-gray-700">Looking for a frontend developer with React experience.</p>
              </div>
              <button className="btn-outline text-sm py-1 px-3">
                Request to Join
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">Web3 Pioneers</h4>
                <p className="text-sm text-gray-600 mb-2">AI Innovation Challenge • 2/4 members</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">JavaScript</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Blockchain</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">React</span>
                </div>
                <p className="text-sm text-gray-700">Building a decentralized AI-powered application.</p>
              </div>
              <button className="btn-outline text-sm py-1 px-3">
                Request to Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectSubmissions = () => {
  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-6">Project Submissions</h2>
      
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-heading font-semibold">AI Innovation Challenge</h3>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
            Submission Due: May 17, 2025
          </span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">Team: AI Innovators</h4>
              <p className="text-sm text-gray-600">No submission yet</p>
            </div>
            <button className="btn-primary">
              Create Submission
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-semibold mb-2">Submission Requirements:</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Project title and description</li>
            <li>GitHub repository link</li>
            <li>Demo video or link (max 3 minutes)</li>
            <li>Presentation slides (PDF format)</li>
            <li>Team member contributions</li>
          </ul>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-xl font-heading font-semibold mb-4">AI-Powered Submission Assistant</h3>
        <p className="text-gray-600 mb-4">
          Our AI can help you create a compelling project submission that highlights your innovation.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-sm italic text-gray-600">
            "The AI assistant can help you craft your project description, suggest structure for your presentation, and provide feedback on your submission materials."
          </p>
        </div>
        <button className="btn-secondary w-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-1.07-.505-2.037-1.359-2.751l-.548-.547z" />
          </svg>
          Get AI Assistance
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;