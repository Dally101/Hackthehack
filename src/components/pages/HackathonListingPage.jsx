import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HackathonListingPage = () => {
  // Mock data for hackathons - would come from API in real implementation
  const [hackathons, setHackathons] = useState([
    {
      id: 1,
      title: 'AI Innovation Challenge',
      startDate: '2025-05-15',
      endDate: '2025-05-17',
      location: 'Virtual',
      participants: 28,
      maxParticipants: 30,
      status: 'upcoming',
      image: '/images/hackathon1.jpg',
      description: 'Build innovative AI solutions using Azure services. Open to developers of all skill levels.',
      tags: ['AI', 'Azure', 'Innovation']
    },
    {
      id: 2,
      title: 'Sustainable Tech Hackathon',
      startDate: '2025-06-10',
      endDate: '2025-06-12',
      location: 'Seattle, WA',
      participants: 15,
      maxParticipants: 30,
      status: 'upcoming',
      image: '/images/hackathon2.jpg',
      description: 'Create technology solutions that address environmental challenges and promote sustainability.',
      tags: ['Sustainability', 'GreenTech', 'Climate']
    },
    {
      id: 3,
      title: 'Healthcare Innovation Jam',
      startDate: '2025-07-05',
      endDate: '2025-07-07',
      location: 'Hybrid',
      participants: 22,
      maxParticipants: 30,
      status: 'upcoming',
      image: '/images/hackathon3.jpg',
      description: 'Develop solutions to improve healthcare delivery, patient experience, and medical outcomes.',
      tags: ['Healthcare', 'MedTech', 'Innovation']
    },
    {
      id: 4,
      title: 'Web3 Development Challenge',
      startDate: '2025-04-01',
      endDate: '2025-04-03',
      location: 'Virtual',
      participants: 30,
      maxParticipants: 30,
      status: 'past',
      image: '/images/hackathon4.jpg',
      description: 'Build decentralized applications and explore blockchain technologies.',
      tags: ['Web3', 'Blockchain', 'DApps']
    },
    {
      id: 5,
      title: 'Smart City Hackathon',
      startDate: '2025-03-15',
      endDate: '2025-03-17',
      location: 'Boston, MA',
      participants: 25,
      maxParticipants: 30,
      status: 'past',
      image: '/images/hackathon5.jpg',
      description: 'Create solutions for urban challenges using IoT, data analytics, and smart technologies.',
      tags: ['SmartCity', 'IoT', 'UrbanTech']
    }
  ]);

  // Filter states
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter hackathons based on status and search term
  const filteredHackathons = hackathons.filter(hackathon => {
    const matchesFilter = filter === 'all' || hackathon.status === filter;
    const matchesSearch = hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hackathon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hackathon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Explore Hackathons
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Discover upcoming and past hackathons. Find the perfect event to showcase your skills and collaborate with others.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex mb-4 md:mb-0">
              <button 
                className={`px-4 py-2 mr-2 rounded-md ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 mr-2 rounded-md ${filter === 'upcoming' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setFilter('upcoming')}
              >
                Upcoming
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${filter === 'past' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setFilter('past')}
              >
                Past
              </button>
            </div>
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Search hackathons..."
                className="input-field w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hackathons Listing */}
      <section className="py-12 bg-neutral-light">
        <div className="container mx-auto px-4">
          {filteredHackathons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHackathons.map(hackathon => (
                <div key={hackathon.id} className="card hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={hackathon.image} 
                      alt={hackathon.title} 
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/400x200?text=${encodeURIComponent(hackathon.title)}`;
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        hackathon.status === 'upcoming' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {hackathon.status === 'upcoming' ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-semibold mb-2">{hackathon.title}</h3>
                    
                    <div className="flex items-center text-gray-500 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{hackathon.location}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{hackathon.description}</p>
                    
                    <div className="flex flex-wrap mb-4">
                      {hackathon.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mr-2 mb-2">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold">{hackathon.participants}</span>/{hackathon.maxParticipants} participants
                      </div>
                      
                      {hackathon.status === 'upcoming' && (
                        <Link 
                          to={`/hackathons/${hackathon.id}`} 
                          className="btn-primary"
                        >
                          Register
                        </Link>
                      )}
                      
                      {hackathon.status === 'past' && (
                        <Link 
                          to={`/hackathons/${hackathon.id}`} 
                          className="btn-outline"
                        >
                          View Results
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-heading font-semibold mb-2">No hackathons found</h3>
              <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
            Want to organize your own hackathon?
          </h2>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            Our AI-powered platform makes it easy to plan, run, and manage successful hackathons of any size or format.
          </p>
          <Link to="/organize" className="btn-primary bg-white text-primary hover:bg-gray-100 py-3 px-8 rounded-md font-semibold transition-colors">
            Start Organizing
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HackathonListingPage;
