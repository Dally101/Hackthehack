import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            About Hack the Hackathon
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            An innovative AI-powered platform designed to revolutionize how hackathons are planned, organized, and managed.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-3xl font-heading font-bold mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                At Hack the Hackathon, we believe in the power of collaborative innovation. Our mission is to create a seamless, intelligent platform that removes the administrative burden from hackathon organizers, allowing them to focus on what matters most: fostering creativity, collaboration, and breakthrough solutions.
              </p>
              <p className="text-gray-700 mb-4">
                By leveraging cutting-edge AI technology through Azure OpenAI and AI Foundry, we've built an agentic system that handles the complex, behind-the-scenes workflows that make hackathons possible, addressing the coordination challenges between sponsors, organizers, and participants.
              </p>
              <p className="text-gray-700">
                Our goal is to make hackathons more accessible, efficient, and impactful for everyone involved.
              </p>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/images/mission-image.svg" 
                alt="Our mission" 
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x400?text=Our+Mission';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Technology Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pl-10">
              <h2 className="text-3xl font-heading font-bold mb-6">AI Technology</h2>
              <p className="text-gray-700 mb-4">
                Our platform is built on advanced AI technology from Microsoft Azure, including Azure OpenAI Service and Azure AI Foundry. These powerful tools enable us to create intelligent agents that can understand natural language, make decisions, and automate complex workflows.
              </p>
              <p className="text-gray-700 mb-4">
                Each aspect of hackathon management is handled by specialized AI agents:
              </p>
              <ul className="list-disc pl-5 mb-4 text-gray-700">
                <li className="mb-2">Registration Agent - Processes applications and manages participant data</li>
                <li className="mb-2">Team Formation Agent - Matches participants based on skills and interests</li>
                <li className="mb-2">Scheduling Agent - Creates and manages event timelines</li>
                <li className="mb-2">Submission Agent - Handles project submissions and organization</li>
                <li className="mb-2">Judging Agent - Facilitates fair and efficient evaluation</li>
                <li>Communication Agent - Manages notifications and updates</li>
              </ul>
              <p className="text-gray-700">
                These agents work together seamlessly to create a cohesive, intelligent system that adapts to the specific needs of each hackathon.
              </p>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/images/ai-technology.svg" 
                alt="AI Technology" 
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x400?text=AI+Technology';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Our Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-heading font-semibold mb-2">Alex Morgan</h3>
              <p className="text-gray-500 mb-3">Founder & CEO</p>
              <p className="text-gray-600">
                Former hackathon organizer with a passion for AI and event management.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-heading font-semibold mb-2">Jamie Taylor</h3>
              <p className="text-gray-500 mb-3">CTO</p>
              <p className="text-gray-600">
                AI specialist with expertise in Azure services and agent-based systems.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-heading font-semibold mb-2">Sam Wilson</h3>
              <p className="text-gray-500 mb-3">Head of Product</p>
              <p className="text-gray-600">
                Product manager with experience in event tech and user experience design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Our Partners
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-md h-24 flex items-center justify-center">
                <span className="text-gray-400 font-semibold">Partner Logo</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-md h-24 flex items-center justify-center">
                <span className="text-gray-400 font-semibold">Partner Logo</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-md h-24 flex items-center justify-center">
                <span className="text-gray-400 font-semibold">Partner Logo</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-md h-24 flex items-center justify-center">
                <span className="text-gray-400 font-semibold">Partner Logo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-6">
            Join the Revolution
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Experience the future of hackathon management with our AI-powered platform. Whether you're an organizer, sponsor, or participant, we're here to make your hackathon journey exceptional.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="btn-primary bg-white text-secondary hover:bg-gray-100 py-3 px-8 rounded-md font-semibold transition-colors">
              Get Started
            </Link>
            <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-secondary py-3 px-8 rounded-md font-semibold transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
