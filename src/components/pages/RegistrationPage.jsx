import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../auth/RegisterForm';
import { agentService } from '../../services/apiService';

function RegistrationPage() {
  const [agentResponse, setAgentResponse] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [question, setQuestion] = React.useState('');

  const askAgent = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await agentService.getAgentResponse(
        'Registration Agent',
        question,
        {}
      );
    
      if (response && response.content) {
        setAgentResponse(response.content);
    }
    } catch (error) {
      console.error('Error asking registration agent:', error);
      setAgentResponse("I'm sorry, I encountered an error while processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Hackathon Community</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create your account to participate in hackathons, form teams, and showcase your projects.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <RegisterForm />
                    </div>
                    
          <div className="lg:col-span-1">
            <div className="bg-blue-50 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-blue-800">Registration Assistant</h2>
              <p className="text-gray-700 mb-4">
                Need help with registration? Our AI assistant can answer your questions about account creation, skill selection, and more.
              </p>
              
              <form onSubmit={askAgent} className="mb-4">
                <div className="flex">
                    <input
                      type="text"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ask a question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={isLoading}
                  />
                      <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
                    disabled={isLoading || !question.trim()}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Thinking...
                      </span>
                    ) : (
                      'Ask'
                    )}
                  </button>
                </div>
              </form>
              
              {agentResponse && (
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Registration Agent:</h3>
                  <p className="text-gray-800">{agentResponse}</p>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2 text-gray-700">Common Questions:</h3>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => {
                        setQuestion("What skills should I include in my profile?");
                        document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm text-left"
                    >
                      What skills should I include in my profile?
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        setQuestion("How do I join a team after registration?");
                        document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm text-left"
                    >
                      How do I join a team after registration?
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        setQuestion("What happens after I register?");
                        document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm text-left"
                    >
                      What happens after I register?
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold mb-3 text-gray-800">Already have an account?</h3>
              <p className="text-gray-700 mb-4">If you've already registered, you can sign in to access your dashboard.</p>
              <Link 
                to="/login" 
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md text-center transition duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;