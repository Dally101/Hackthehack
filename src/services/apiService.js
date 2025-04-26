import axios from 'axios';

// DEMO: Use mock data for now, no real backend connection
const MOCK_USER = {
  id: 1,
  name: 'Demo User',
  email: 'demo@example.com',
  skills: ['JavaScript', 'React', 'Node.js'],
  interests: ['AI', 'Web Development', 'Mobile Apps'],
  avatar: '/images/avatar.jpg'
};

// Mock token
const MOCK_TOKEN = 'mock-jwt-token-for-demo-purposes';

// Use the relative URL to ensure it works in both development and production
const API_URL = '/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - add auth token to headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login page if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: async (credentials) => {
    try {
      // DEMO: Mock login for demo purposes
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        // Store the mock token
        localStorage.setItem('token', MOCK_TOKEN);
        return { 
          token: MOCK_TOKEN,
          user: MOCK_USER
        };
      }
      
      // For demo purposes, allow any login
      localStorage.setItem('token', MOCK_TOKEN);
      return { 
        token: MOCK_TOKEN,
        user: MOCK_USER
      };
      
      // Real implementation would call the API
      // const response = await api.post('/auth/login', credentials);
      // if (response.data.token) {
      //   localStorage.setItem('token', response.data.token);
      // }
      // return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  register: async (userData) => {
    try {
      // DEMO: Mock registration for demo purposes
      localStorage.setItem('token', MOCK_TOKEN);
      
      // Create a user based on the userType
      const userProfile = {
        ...MOCK_USER,
        name: userData.name || MOCK_USER.name,
        email: userData.email || MOCK_USER.email,
        userType: userData.userType || 'student',
        skills: userData.skills || MOCK_USER.skills,
        interests: userData.interests || MOCK_USER.interests
      };
      
      // Store the user type in localStorage for easy access
      localStorage.setItem('userType', userData.userType || 'student');
      
      return { 
        token: MOCK_TOKEN,
        user: userProfile
      };
      
      // Real implementation would call the API
      // const response = await api.post('/auth/register', userData);
      // if (response.data.token) {
      //   localStorage.setItem('token', response.data.token);
      // }
      // return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
  },

  getCurrentUser: async () => {
    try {
      // DEMO: Mock user data for demo purposes
      const token = localStorage.getItem('token');
      if (token) {
        // Add the userType to the mock user if stored
        const userType = localStorage.getItem('userType');
        return {
          ...MOCK_USER,
          userType: userType || 'student'
        };
      }
      throw new Error('No token found');
      
      // Real implementation would call the API
      // const response = await api.get('/auth/me');
      // return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user' };
    }
  },

  updateProfile: async (userData) => {
    try {
      // DEMO: Mock profile update for demo purposes
      return {
        ...MOCK_USER,
        ...userData,
        userType: userData.userType || localStorage.getItem('userType') || 'student'
      };
      
      // Real implementation would call the API
      // const response = await api.put('/auth/profile', userData);
      // return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  }
};

// Hackathon services
export const hackathonService = {
  getAll: async () => {
    try {
      const response = await api.get('/hackathons');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get hackathons' };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/hackathons/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get hackathon' };
    }
  },

  create: async (hackathonData) => {
    try {
      const response = await api.post('/hackathons', hackathonData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create hackathon' };
    }
  },

  update: async (id, hackathonData) => {
    try {
      const response = await api.put(`/hackathons/${id}`, hackathonData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update hackathon' };
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/hackathons/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete hackathon' };
    }
  }
};

// Team services
export const teamService = {
  getAll: async (hackathonId) => {
    try {
      const response = await api.get(`/hackathons/${hackathonId}/teams`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get teams' };
    }
  },

  getById: async (hackathonId, teamId) => {
    try {
      const response = await api.get(`/hackathons/${hackathonId}/teams/${teamId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get team' };
    }
  },

  create: async (hackathonId, teamData) => {
    try {
      const response = await api.post(`/hackathons/${hackathonId}/teams`, teamData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create team' };
    }
  },

  update: async (hackathonId, teamId, teamData) => {
    try {
      const response = await api.put(`/hackathons/${hackathonId}/teams/${teamId}`, teamData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update team' };
    }
  },

  delete: async (hackathonId, teamId) => {
    try {
      const response = await api.delete(`/hackathons/${hackathonId}/teams/${teamId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete team' };
    }
  },

  joinTeam: async (hackathonId, teamId) => {
    try {
      const response = await api.post(`/hackathons/${hackathonId}/teams/${teamId}/join`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to join team' };
    }
  },

  leaveTeam: async (hackathonId, teamId) => {
    try {
      const response = await api.post(`/hackathons/${hackathonId}/teams/${teamId}/leave`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to leave team' };
    }
  }
};

// Project services
export const projectService = {
  getByTeam: async (hackathonId, teamId) => {
    try {
      const response = await api.get(`/hackathons/${hackathonId}/teams/${teamId}/project`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get project' };
    }
  },

  submit: async (hackathonId, teamId, projectData) => {
    try {
      const response = await api.post(`/hackathons/${hackathonId}/teams/${teamId}/project`, projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit project' };
    }
  },

  update: async (hackathonId, teamId, projectData) => {
    try {
      const response = await api.put(`/hackathons/${hackathonId}/teams/${teamId}/project`, projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update project' };
    }
  }
};

// Agent service for AI interactions
export const agentService = {
  getAgentResponse: async (agentType, prompt, context = {}) => {
    try {
      // Log the request for debugging
      console.log(`Sending request to agent ${agentType} with prompt: ${prompt}`);
      
      // Convert agent type name to lowercase and replace spaces with hyphens for URL
      const normalizedAgentType = agentType
        .toLowerCase()
        .replace(/\s+agent$/, '')
        .replace(/\s+/, '-');
      
      // Fallback response in case of error or missing backend
      const fallbackResponse = {
        response: {
          content: `I'm a demo AI assistant. In the production version, I would provide real assistance with ${agentType} functionality. For now, please imagine I've given you a helpful response about "${prompt}".`,
          metadata: {
            mockMode: true,
            timestamp: new Date().toISOString()
          }
        }
      };
      
      // Skip API call for development/demo purposes - uncomment to use real API
      // return fallbackResponse;
      
      // Try the general agent endpoint first
      try {
        console.log(`Calling agent endpoint: /agent/${agentType}`);
        const response = await api.post(`/agent/${agentType}`, { 
          prompt, 
          context 
        });
        console.log('Agent response received:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error in agent endpoint:', error);
        
        if (error.response && error.response.status === 404) {
          // If agent endpoint not found, try the communication/faq endpoint as fallback
          console.log('Agent endpoint not found, trying communication/faq endpoint');
          try {
            const faqResponse = await api.post('/communication/faq', {
              question: prompt,
              context
            });
            console.log('FAQ response received:', faqResponse.data);
            return faqResponse.data;
          } catch (faqError) {
            console.error('Error in FAQ endpoint:', faqError);
            return fallbackResponse;
          }
        }
        
        // If we get here, return the fallback response
        console.log('Returning fallback response');
        return fallbackResponse;
      }
    } catch (error) {
      console.error(`Failed to get response from ${agentType}:`, error);
      
      // Return mock response in case of error to keep the app functional
      return {
        response: {
          content: `I'm a demo AI assistant. In the production version, I would provide real assistance with ${agentType} functionality. For now, please imagine I've given you a helpful response about "${prompt}".`
        }
      };
    }
  }
};

export default api; 