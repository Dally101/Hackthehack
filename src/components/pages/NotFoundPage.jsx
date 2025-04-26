import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="animate-fadeIn">
      <section className="py-20 bg-neutral-light min-h-screen flex items-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-heading font-bold text-primary mb-6">404</h1>
          <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6">Page Not Found</h2>
          <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/" className="btn-primary py-3 px-8">
              Return to Home
            </Link>
            <button 
              className="btn-outline py-3 px-8 flex items-center justify-center mx-auto sm:mx-0"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
          
          <div className="mt-12 p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
            <h3 className="text-xl font-heading font-semibold mb-4">Need Help?</h3>
            <p className="text-gray-700 mb-4">
              Our AI assistant can help you find what you're looking for or answer any questions about our platform.
            </p>
            <button className="btn-secondary flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat with AI Assistant
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFoundPage;
