import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FaqPage = () => {
  // FAQ categories
  const categories = [
    'General',
    'Registration',
    'Teams',
    'Submissions',
    'Judging',
    'Technical'
  ];

  // FAQ items with category
  const faqItems = [
    {
      id: 1,
      category: 'General',
      question: 'What is Hack the Hackathon?',
      answer: 'Hack the Hackathon is an AI-powered platform designed to streamline hackathon management. Our system uses Azure OpenAI and AI Foundry to automate complex workflows, making it easier for organizers to plan and run successful hackathons while enhancing the experience for participants and sponsors.'
    },
    {
      id: 2,
      category: 'General',
      question: 'What types of hackathons can be managed on this platform?',
      answer: 'Our platform supports hackathons of all types and sizes, from small 2-day events to extended 3-month innovation challenges. It works for virtual, in-person, and hybrid formats with up to 30 participants. The AI agents adapt to the specific needs of each hackathon format.'
    },
    {
      id: 3,
      category: 'Registration',
      question: 'How do I register for a hackathon?',
      answer: 'To register for a hackathon, browse the available events on our Hackathons page, select the one you\'re interested in, and click the "Register" button. You\'ll need to create an account if you don\'t already have one, and then complete the registration form with your information and preferences.'
    },
    {
      id: 4,
      category: 'Registration',
      question: 'Can I update my registration information after submitting?',
      answer: 'Yes, you can update your registration information at any time by logging into your account, navigating to the dashboard, and selecting the hackathon registration you want to modify. Changes can be made until the registration deadline for that specific event.'
    },
    {
      id: 5,
      category: 'Teams',
      question: 'How do team formations work?',
      answer: 'Teams can be formed in several ways: you can create your own team and invite others to join, join an existing team that\'s looking for members, or use our AI-powered team matching system that suggests potential teammates based on skills, interests, and goals. The platform supports teams of various sizes depending on the hackathon requirements.'
    },
    {
      id: 6,
      category: 'Teams',
      question: 'What if I don\'t have a team?',
      answer: 'If you don\'t have a team, our AI-powered matching system can help you find potential teammates based on complementary skills and shared interests. You can browse team listings in the "Team Formation" section of your dashboard, or attend virtual team formation events if they\'re offered for your hackathon.'
    },
    {
      id: 7,
      category: 'Submissions',
      question: 'How do I submit my project?',
      answer: 'Project submissions are handled through your team dashboard. Navigate to the "Submissions" section, select the hackathon, and follow the guided submission process. You\'ll typically need to provide a project title, description, repository link, demo link or video, and any other materials specified in the hackathon guidelines.'
    },
    {
      id: 8,
      category: 'Submissions',
      question: 'Can I update my submission after the deadline?',
      answer: 'Generally, submissions cannot be updated after the deadline. However, some hackathons may allow minor updates during a grace period. Check the specific rules for your event. We recommend finalizing your submission well before the deadline to avoid any last-minute technical issues.'
    },
    {
      id: 9,
      category: 'Judging',
      question: 'How does the judging process work?',
      answer: 'The judging process varies by hackathon, but typically involves a panel of judges evaluating projects based on predetermined criteria. Our platform supports both live presentations and asynchronous judging. Judges use our system to review submissions, provide scores and feedback, and determine winners. The AI Judging Agent helps ensure fair and consistent evaluation.'
    },
    {
      id: 10,
      category: 'Judging',
      question: 'When and how are winners announced?',
      answer: 'Winners are typically announced at the closing ceremony for in-person events, or through a virtual announcement for online hackathons. All participants will also receive notifications through the platform and by email. Results and feedback are made available in your dashboard after the announcement.'
    },
    {
      id: 11,
      category: 'Technical',
      question: 'What technologies does the platform use?',
      answer: 'Our platform is built using Azure services, particularly Azure OpenAI Service and Azure AI Foundry. The frontend is developed with React, while the backend uses Express and Node.js. The AI agents are powered by Azure\'s advanced AI models, enabling natural language understanding, intelligent automation, and personalized experiences.'
    },
    {
      id: 12,
      category: 'Technical',
      question: 'Is my data secure on this platform?',
      answer: 'Yes, we take data security seriously. All data is encrypted both in transit and at rest. We use Azure\'s robust security features, including network isolation, identity and access controls, and continuous monitoring. The platform complies with relevant data protection regulations, and we never share your personal information without your consent.'
    }
  ];

  // State for active category
  const [activeCategory, setActiveCategory] = useState('General');
  
  // Filter FAQ items by active category
  const filteredFaqs = faqItems.filter(item => item.category === activeCategory);
  
  // State for expanded FAQ items
  const [expandedItems, setExpandedItems] = useState([]);
  
  // Toggle FAQ item expansion
  const toggleItem = (id) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter(item => item !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Find answers to common questions about our hackathon management platform.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category Tabs */}
            <div className="flex flex-wrap mb-8">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 mr-2 mb-2 rounded-md ${
                    activeCategory === category 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* FAQ Accordion */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="border-b border-gray-200 last:border-b-0">
                  <button
                    className="w-full text-left px-6 py-4 focus:outline-none flex justify-between items-center"
                    onClick={() => toggleItem(faq.id)}
                  >
                    <span className="font-heading font-semibold text-lg">{faq.question}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform ${
                        expandedItems.includes(faq.id) ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`px-6 pb-4 transition-all duration-300 ${
                      expandedItems.includes(faq.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* No FAQs Message */}
            {filteredFaqs.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-700">No FAQs available for this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Our AI assistant is available 24/7 to answer any specific questions you might have about the platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="btn-primary flex items-center justify-center mx-auto sm:mx-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Chat with AI Assistant
              </button>
              <Link to="/contact" className="btn-outline flex items-center justify-center mx-auto sm:mx-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FaqPage;
