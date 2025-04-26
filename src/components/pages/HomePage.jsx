import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AIAssistant from '../ai/AIAssistant';

function HomePage() {
  const navigate = useNavigate();
  
  const handleStartOrganising = () => {
    // Set organizer as the pre-selected user type in localStorage
    console.log('Start Organising button clicked!');
    localStorage.setItem('preSelectedUserType', 'organizer');
    console.log('Value set in localStorage:', localStorage.getItem('preSelectedUserType'));
    
    // Ensure the navigation happens
    setTimeout(() => {
      navigate('/register');
      console.log('Navigation to /register triggered');
    }, 100);
  };
  
  const agentFeatures = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>,
      title: 'Registration Agent',
      description: 'Streamlines participant signup, validates user data, and provides personalized skill suggestions based on interests.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>,
      title: 'Team Formation Agent',
      description: 'Matches participants based on complementary skills and interests, ensuring balanced and effective teams.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>,
      title: 'Scheduling Agent',
      description: 'Creates optimized event timelines, manages schedules, and sends timely reminders to participants.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>,
      title: 'Submission Agent',
      description: 'Processes project submissions, validates completeness, and provides constructive feedback.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>,
      title: 'Judging Agent',
      description: 'Facilitates fair evaluation of projects, assigns judges based on expertise, and compiles results.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>,
      title: 'Communication Agent',
      description: 'Manages notifications and updates, answers questions, and ensures clear communication.'
    }
  ];

  const testimonials = [
    {
      quote: "The AI agents completely transformed our hackathon experience. Team formation was so much more effective!",
      author: "Sarah Chen",
      role: "Hackathon Organizer"
    },
    {
      quote: "I was amazed by how personalized the skill suggestions were. It helped me develop a much stronger profile.",
      author: "Marcus Johnson",
      role: "Participant"
    },
    {
      quote: "As a sponsor, the detailed analytics and insights we received were invaluable for understanding engagement.",
      author: "Jessica Lee",
      role: "Corporate Sponsor"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Revolutionize Your Hackathon with AI
              </h1>
              <p className="text-xl mb-8">
                Our intelligent agent system streamlines every aspect of planning, running, and managing hackathons.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/hackathons" 
                  className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
                >
                  Browse Hackathons
                </Link>
                <button 
                  onClick={handleStartOrganising}
                  className="bg-transparent hover:bg-blue-600 text-white font-bold py-3 px-6 border-2 border-white rounded-lg transition duration-300"
                >
                  Start Organising
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
              <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Hackathon collaboration" 
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
                  <p className="font-bold">Powered by</p>
                  <p>Azure OpenAI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">AI Agents at Your Service</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our specialized AI agents handle every aspect of your hackathon, providing real-time assistance and automating complex tasks.
            </p>
            </div>
            
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agentFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:transform hover:scale-105">
                <div className="text-blue-600 mb-4">
                  {feature.icon}
              </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hackathon?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of organizers and participants who are using our platform to create exceptional hackathon experiences.
              </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 inline-block"
            >
              Sign Up to Participate
            </Link>
            <button 
              onClick={handleStartOrganising}
              className="bg-transparent hover:bg-blue-800 text-white font-bold py-3 px-8 border-2 border-white rounded-lg transition duration-300 inline-block"
            >
              Sign Up to Organize
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What People Are Saying</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-gray-800 mb-4">
                  <svg className="h-8 w-8 text-blue-600 mb-2" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.7 1.3-3 3-3h3V8h-4zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.7 1.3-3 3-3h3V8h-4z" />
                  </svg>
                  <p className="text-lg italic">{testimonial.quote}</p>
                </div>
                <div className="mt-4">
                  <p className="font-bold text-gray-800">{testimonial.author}</p>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}

export default HomePage;
