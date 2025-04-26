import React from 'react';

// This component will be used to integrate Azure AI admin signup functionality
const AdminSignup = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">Admin Registration</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Create Admin Account</h3>
        <p className="text-gray-600 mb-4">
          Register as an administrator to access the hackathon management dashboard and tools.
          All admin accounts require approval from the CSI Hackathon Coordinator.
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-first-name" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input 
                type="text" 
                id="admin-first-name" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter first name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="admin-last-name" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input 
                type="text" 
                id="admin-last-name" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">UWM Email *</label>
            <input 
              type="email" 
              id="admin-email" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="name@uwm.edu"
              required
            />
          </div>
          
          <div>
            <label htmlFor="admin-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              id="admin-phone" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="(123) 456-7890"
            />
          </div>
          
          <div>
            <label htmlFor="admin-role" className="block text-sm font-medium text-gray-700 mb-1">Role at UWM *</label>
            <select 
              id="admin-role" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select your role</option>
              <option value="faculty">Faculty</option>
              <option value="staff">Staff</option>
              <option value="graduate-assistant">Graduate Assistant</option>
              <option value="student-worker">Student Worker</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="admin-department" className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
            <input 
              type="text" 
              id="admin-department" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your department"
              required
            />
          </div>
          
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input 
              type="password" 
              id="admin-password" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Create a secure password"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters with a mix of letters, numbers, and symbols</p>
          </div>
          
          <div>
            <label htmlFor="admin-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
            <input 
              type="password" 
              id="admin-confirm-password" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <div>
            <label htmlFor="admin-responsibilities" className="block text-sm font-medium text-gray-700 mb-1">Hackathon Responsibilities *</label>
            <select 
              id="admin-responsibilities" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              multiple
              required
            >
              <option value="registration">Registration Management</option>
              <option value="logistics">Logistics Coordination</option>
              <option value="sponsors">Sponsor Engagement</option>
              <option value="mentors">Mentor Coordination</option>
              <option value="judging">Judging Process</option>
              <option value="technical">Technical Support</option>
              <option value="communications">Communications</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple responsibilities</p>
          </div>
          
          <div>
            <label className="flex items-start">
              <input 
                type="checkbox" 
                className="mt-1 mr-2"
                required
              />
              <span className="text-sm text-gray-700">
                I agree to maintain the confidentiality of participant data and follow all UWM policies regarding data privacy and security.
              </span>
            </label>
          </div>
          
          <div className="pt-2">
            <button className="btn-primary">
              Submit Registration
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium mb-3">Admin Access Levels</h3>
        <div className="space-y-3">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-primary">Level 1: Coordinator</h4>
            <p className="text-sm text-gray-600 mt-1">Full access to all hackathon management features and user administration.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-primary">Level 2: Manager</h4>
            <p className="text-sm text-gray-600 mt-1">Access to most management features except user administration and financial data.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-primary">Level 3: Assistant</h4>
            <p className="text-sm text-gray-600 mt-1">Limited access to specific assigned areas such as registration or logistics.</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Access level will be assigned by the Hackathon Coordinator based on your role and responsibilities.
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
