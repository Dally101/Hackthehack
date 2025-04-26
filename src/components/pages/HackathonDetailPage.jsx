import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function HackathonDetailPage() {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    skills: '',
    interests: '',
    team: 'none',
    lookingForTeam: false
  });

  // Mock data for AI Innovation Challenge
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // This would be replaced with actual API call in production
      if (id === '1' || id === 1) {
        setHackathon({
          id: 1,
          title: 'AI Innovation Challenge',
          startDate: '2025-05-15',
          endDate: '2025-05-17',
          location: 'Virtual',
          participants: 28,
          maxParticipants: 30,
          status: 'upcoming',
          image: '/images/hackathon1.jpg',
          banner: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          description: 'Build innovative AI solutions using Azure services. Open to developers of all skill levels.',
          longDescription: 'The AI Innovation Challenge invites developers, data scientists, and enthusiasts to create cutting-edge AI solutions that address real-world problems. Participants will have access to Azure OpenAI services, mentorship from industry experts, and opportunities to showcase their work to potential employers and investors.',
          tags: ['AI', 'Azure', 'Innovation'],
          prizes: [
            {
              name: 'First Place',
              amount: '$5,000',
              description: 'For the team with the most innovative and well-executed AI solution'
            },
            {
              name: 'Second Place',
              amount: '$2,500',
              description: 'For the runner-up team demonstrating technical excellence'
            },
            {
              name: 'Best Use of Azure Services',
              amount: '$1,500',
              description: 'For the solution that best leverages Azure AI capabilities'
            }
          ],
          schedule: [
            {
              day: 'Day 1 - May 15, 2025',
              events: [
                { time: '9:00 AM - 10:00 AM', name: 'Opening Ceremony & Challenge Presentation' },
                { time: '10:00 AM - 11:00 AM', name: 'Azure AI Services Workshop' },
                { time: '11:00 AM - 12:00 PM', name: 'Team Formation for Solo Participants' },
                { time: '12:00 PM - 1:00 PM', name: 'Lunch Break' },
                { time: '1:00 PM', name: 'Hacking Begins!' },
                { time: '3:00 PM - 4:00 PM', name: 'Mentor Office Hours' },
                { time: '8:00 PM', name: 'Day 1 Check-in & Progress Updates' }
              ]
            },
            {
              day: 'Day 2 - May 16, 2025',
              events: [
                { time: '9:00 AM', name: 'Day 2 Kickoff' },
                { time: '10:00 AM - 11:00 AM', name: 'Technical Workshop: AI Model Fine-tuning' },
                { time: '12:00 PM - 1:00 PM', name: 'Lunch Break' },
                { time: '2:00 PM - 3:00 PM', name: 'Mentor Office Hours' },
                { time: '6:00 PM', name: 'Dinner' },
                { time: '8:00 PM', name: 'Demo Preparation Workshop' }
              ]
            },
            {
              day: 'Day 3 - May 17, 2025',
              events: [
                { time: '9:00 AM', name: 'Final Day Kickoff' },
                { time: '12:00 PM', name: 'Submission Deadline' },
                { time: '1:00 PM - 3:00 PM', name: 'Project Presentations' },
                { time: '3:00 PM - 4:00 PM', name: 'Judging Deliberation' },
                { time: '4:00 PM - 5:00 PM', name: 'Awards Ceremony & Closing' }
              ]
            }
          ],
          judges: [
            {
              name: 'Dr. Sarah Chen',
              role: 'AI Research Lead, Microsoft',
              image: 'https://randomuser.me/api/portraits/women/22.jpg',
              bio: 'Dr. Chen leads AI research at Microsoft and has published extensively on large language models and their applications.'
            },
            {
              name: 'Marcus Johnson',
              role: 'CTO, AI Innovations',
              image: 'https://randomuser.me/api/portraits/men/32.jpg',
              bio: 'Marcus has founded multiple AI startups and specializes in computer vision and generative AI technologies.'
            },
            {
              name: 'Priya Sharma',
              role: 'Principal Data Scientist, Google',
              image: 'https://randomuser.me/api/portraits/women/46.jpg',
              bio: 'Priya leads data science initiatives at Google and has expertise in machine learning model deployment at scale.'
            }
          ],
          sponsors: [
            {
              name: 'Microsoft',
              logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png',
              tier: 'Platinum'
            },
            {
              name: 'Google Cloud',
              logo: 'https://www.gstatic.com/devrel-devsite/prod/v7cbba9dda0293bf7e3c2578ea0c82564025f8c9b53e4ffe49a4e7e502937044e/cloud/images/cloud-logo.svg',
              tier: 'Gold'
            },
            {
              name: 'NVIDIA',
              logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/Nvidia_logo.svg/512px-Nvidia_logo.svg.png',
              tier: 'Silver'
            }
          ],
          faq: [
            {
              question: 'Who can participate?',
              answer: 'This hackathon is open to developers, data scientists, designers, and entrepreneurs of all skill levels who are interested in AI technologies.'
            },
            {
              question: 'Do I need a team to participate?',
              answer: 'You can register as an individual or as a team. Solo participants will have opportunities to form teams during the event.'
            },
            {
              question: 'What kinds of projects are expected?',
              answer: 'We welcome projects that leverage AI for solving real-world problems. This can include applications using natural language processing, computer vision, predictive analytics, or generative AI.'
            },
            {
              question: 'What resources will be provided?',
              answer: 'All participants will receive free credits for Azure services, including access to Azure OpenAI API, mentorship from industry experts, and workshops on relevant technologies.'
            }
          ]
        });
      } else {
        // For other hackathons (simplified, would be API data in production)
        setHackathon({
          id: parseInt(id),
          title: 'Hackathon Details',
          startDate: '2025-06-15',
          endDate: '2025-06-17',
          location: 'TBD',
          status: 'upcoming',
          image: '/images/hackathon1.jpg',
          description: 'Hackathon details will be loaded from the server.',
          longDescription: 'This is a placeholder for hackathon details. In a production environment, this data would come from an API call.',
          tags: ['Hackathon', 'Coding'],
        });
      }
      setLoading(false);
    }, 800);
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegistrationForm({
      ...registrationForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This would handle the registration submission
    alert('Registration submitted! In a real implementation, this would be saved to the database.');
    console.log(registrationForm);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading hackathon details...</p>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Hackathon Not Found</h2>
        <p className="text-gray-600 mb-8">The hackathon you're looking for doesn't exist or has been removed.</p>
        <Link to="/hackathons" className="btn-primary">
          Browse Hackathons
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner Image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img 
          src={hackathon.banner || hackathon.image} 
          alt={hackathon.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://via.placeholder.com/1200x400?text=${encodeURIComponent(hackathon.title)}`;
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{hackathon.title}</h1>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg px-4 py-2 text-white">
                <span className="font-medium">{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg px-4 py-2 text-white">
                <span className="font-medium">{hackathon.location}</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg px-4 py-2 text-white">
                <span className="font-medium">{hackathon.participants}/{hackathon.maxParticipants} Participants</span>
              </div>
            </div>
            {hackathon.status === 'upcoming' && (
              <button 
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors"
                onClick={() => setActiveTab('register')}
              >
                Register Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-4 space-x-8">
            <button 
              className={`font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`font-medium whitespace-nowrap ${activeTab === 'schedule' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('schedule')}
            >
              Schedule
            </button>
            <button 
              className={`font-medium whitespace-nowrap ${activeTab === 'prizes' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('prizes')}
            >
              Prizes
            </button>
            <button 
              className={`font-medium whitespace-nowrap ${activeTab === 'judges' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('judges')}
            >
              Judges
            </button>
            <button 
              className={`font-medium whitespace-nowrap ${activeTab === 'sponsors' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('sponsors')}
            >
              Sponsors
            </button>
            <button 
              className={`font-medium whitespace-nowrap ${activeTab === 'faq' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('faq')}
            >
              FAQ
            </button>
            {hackathon.status === 'upcoming' && (
              <button 
                className={`font-medium whitespace-nowrap ${activeTab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">About This Hackathon</h2>
                <p className="text-gray-700 mb-6">{hackathon.longDescription}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {hackathon.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold mb-4">Key Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-gray-600">{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-gray-600">{hackathon.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <div>
                        <p className="font-medium">Team Size</p>
                        <p className="text-gray-600">2-5 members</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-medium">Duration</p>
                        <p className="text-gray-600">48 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Registration</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Spots Remaining</span>
                  <span className="font-semibold">{hackathon.maxParticipants - hackathon.participants}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(hackathon.participants / hackathon.maxParticipants) * 100}%` }}></div>
                </div>
                <button 
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md transition-colors mb-4"
                  onClick={() => setActiveTab('register')}
                >
                  Register Now
                </button>
                <p className="text-sm text-gray-600">Registration closes on May 10, 2025</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Contact</h3>
                <p className="text-gray-700 mb-4">Have questions about this hackathon? Reach out to the organizers:</p>
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:hackathon@example.com" className="text-primary hover:underline">hackathon@example.com</a>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <a href="https://discord.gg/hackathon" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Discord Community</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Event Schedule</h2>
            <div className="space-y-8">
              {hackathon.schedule?.map((day, dayIndex) => (
                <div key={dayIndex}>
                  <h3 className="text-xl font-semibold mb-4 bg-gray-50 p-3 rounded-lg">{day.day}</h3>
                  <div className="space-y-4">
                    {day.events.map((event, eventIndex) => (
                      <div key={eventIndex} className="flex border-l-4 border-primary pl-4">
                        <div className="w-32 flex-shrink-0 font-medium">{event.time}</div>
                        <div>
                          <p className="font-medium">{event.name}</p>
                          {event.description && <p className="text-gray-600 text-sm">{event.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prizes Tab */}
        {activeTab === 'prizes' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Prizes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hackathon.prizes?.map((prize, index) => (
                <div key={index} className={`bg-gradient-to-br rounded-lg p-6 shadow-md ${
                  index === 0 ? 'from-yellow-50 to-yellow-100 border-yellow-200' :
                  index === 1 ? 'from-gray-50 to-gray-100 border-gray-200' :
                  'from-orange-50 to-orange-100 border-orange-200'
                } border`}>
                  <h3 className="text-xl font-bold mb-2">{prize.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-4">{prize.amount}</p>
                  <p className="text-gray-700">{prize.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Judges Tab */}
        {activeTab === 'judges' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Judges</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {hackathon.judges?.map((judge, index) => (
                <div key={index} className="text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src={judge.image} 
                      alt={judge.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/128?text=${encodeURIComponent(judge.name.charAt(0))}`;
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold">{judge.name}</h3>
                  <p className="text-gray-600 mb-2">{judge.role}</p>
                  <p className="text-sm text-gray-700">{judge.bio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sponsors Tab */}
        {activeTab === 'sponsors' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Sponsors</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-center">Platinum Sponsors</h3>
                <div className="flex justify-center items-center flex-wrap gap-8">
                  {hackathon.sponsors?.filter(s => s.tier === 'Platinum').map((sponsor, index) => (
                    <div key={index} className="text-center">
                      <img 
                        src={sponsor.logo} 
                        alt={sponsor.name} 
                        className="h-24 object-contain mx-auto mb-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/200x100?text=${encodeURIComponent(sponsor.name)}`;
                        }}
                      />
                      <p className="font-medium">{sponsor.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-center">Gold Sponsors</h3>
                <div className="flex justify-center items-center flex-wrap gap-8">
                  {hackathon.sponsors?.filter(s => s.tier === 'Gold').map((sponsor, index) => (
                    <div key={index} className="text-center">
                      <img 
                        src={sponsor.logo} 
                        alt={sponsor.name} 
                        className="h-16 object-contain mx-auto mb-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/160x80?text=${encodeURIComponent(sponsor.name)}`;
                        }}
                      />
                      <p className="font-medium">{sponsor.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-center">Silver Sponsors</h3>
                <div className="flex justify-center items-center flex-wrap gap-8">
                  {hackathon.sponsors?.filter(s => s.tier === 'Silver').map((sponsor, index) => (
                    <div key={index} className="text-center">
                      <img 
                        src={sponsor.logo} 
                        alt={sponsor.name} 
                        className="h-12 object-contain mx-auto mb-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/120x60?text=${encodeURIComponent(sponsor.name)}`;
                        }}
                      />
                      <p className="font-medium">{sponsor.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {hackathon.faq?.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                  <h3 className="text-lg font-bold mb-2">{item.question}</h3>
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registration Tab */}
        {activeTab === 'register' && hackathon.status === 'upcoming' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Register for {hackathon.title}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={registrationForm.name} 
                    onChange={handleInputChange} 
                    className="input-field w-full" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={registrationForm.email} 
                    onChange={handleInputChange} 
                    className="input-field w-full" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                <input 
                  type="text" 
                  id="skills" 
                  name="skills" 
                  value={registrationForm.skills} 
                  onChange={handleInputChange} 
                  className="input-field w-full" 
                  placeholder="e.g., Python, React, Data Analysis" 
                />
              </div>
              <div>
                <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">Areas of Interest (comma separated)</label>
                <input 
                  type="text" 
                  id="interests" 
                  name="interests" 
                  value={registrationForm.interests} 
                  onChange={handleInputChange} 
                  className="input-field w-full" 
                  placeholder="e.g., AI, Web Development, Healthcare" 
                />
              </div>
              <div>
                <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">Team Status</label>
                <select 
                  id="team" 
                  name="team" 
                  value={registrationForm.team} 
                  onChange={handleInputChange} 
                  className="input-field w-full"
                >
                  <option value="none">I don't have a team yet</option>
                  <option value="forming">I'm forming a team</option>
                  <option value="joining">I'm joining an existing team</option>
                </select>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="lookingForTeam" 
                  name="lookingForTeam" 
                  checked={registrationForm.lookingForTeam} 
                  onChange={handleInputChange} 
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                />
                <label htmlFor="lookingForTeam" className="ml-2 block text-sm text-gray-700">
                  I'm looking to join a team or find teammates
                </label>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-md transition-colors">
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default HackathonDetailPage; 