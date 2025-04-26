import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">CSI Agentic AI Hackathon</h1>
            <p className="text-xl md:text-2xl mb-8">April 25-27, 2025 | University of Wisconsin–Milwaukee</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/registration" className="btn-primary text-center">
                Register Now
              </Link>
              <Link href="/about" className="bg-white text-primary px-6 py-2 rounded-md hover:bg-gray-100 transition-all text-center">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="section-container">
        <h2 className="section-title">Hack the Hackathon: Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg mb-4">
              Planning a hackathon is a complex, resource-intensive effort involving dozens of interconnected
              tasks, many of which require manual coordination, constant updates, and tight deadlines.
            </p>
            <p className="text-lg mb-4">
              For this challenge, your goal is to design an agentic AI system that can take initiative, communicate
              across workflows, and help manage the event lifecycle with minimal human intervention.
            </p>
            <p className="text-lg">
              A successful solution will reduce the overhead of running hackathons and make it easier for an
              organization like CSI to scale these events in the future.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-primary">Key Dates</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-primary text-white px-2 py-1 rounded mr-3 text-sm">Apr 25</span>
                <div>
                  <p className="font-semibold">Launch Day</p>
                  <p className="text-sm text-gray-600">Welcome, Challenge Overview, Team Formation</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-white px-2 py-1 rounded mr-3 text-sm">Apr 26</span>
                <div>
                  <p className="font-semibold">Hacking Day</p>
                  <p className="text-sm text-gray-600">CSI open 9:00 AM – 9:00 PM, Mentors available</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-white px-2 py-1 rounded mr-3 text-sm">Apr 27</span>
                <div>
                  <p className="font-semibold">Presentation Day</p>
                  <p className="text-sm text-gray-600">Solutions due by 12:30 PM, Final Presentations 1:00–3:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Hackathon Lifecycle Section */}
      <section className="bg-gray-50 py-12">
        <div className="section-container">
          <h2 className="section-title">Hackathon Lifecycle – Actions for Agentic AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pre-Planning & Setup */}
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Pre-Planning & Setup</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create and maintain project timelines</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Draft personalized outreach emails</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Post announcements across platforms</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/admin/pre-planning" className="text-primary hover:underline flex items-center">
                  <span>Access Planning Tools</span>
                  <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Registration & Communication */}
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Registration & Communication</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Monitor registration submissions</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Send confirmation and reminder emails</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Generate rosters and name tags</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/registration" className="text-primary hover:underline flex items-center">
                  <span>Register Now</span>
                  <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Logistics Management */}
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Logistics Management</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create campus signage</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Coordinate with UWM catering</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Schedule workshop facilitators</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/admin/logistics" className="text-primary hover:underline flex items-center">
                  <span>View Logistics Dashboard</span>
                  <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Sponsor & Partner Engagement */}
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Sponsor & Partner Engagement</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Track communication history</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Send reminders about deliverables</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Gather bios, logos, and talk titles</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/sponsors" className="text-primary hover:underline flex items-center">
                  <span>View Sponsors</span>
                  <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Participant Support */}
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Participant Support</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Manage Q&A or help desk workflows</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Remind participants about deadlines</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Log and route mentor check-ins</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/resources" className="text-primary hover:underline flex items-center">
                  <span>Access Resources</span>
                  <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Post-Event Wrap-Up */}
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Post-Event Wrap-Up</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Generate and distribute feedback surveys</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Compile summary reports</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Archive materials and outcomes</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/admin/post-event" className="text-primary hover:underline flex items-center">
                  <span>View Wrap-Up Tools</span>
                  <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prize Categories Section */}
      <section className="section-container">
        <h2 className="section-title">Prize Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6 border-t-4 border-primary">
            <h3 className="text-xl font-bold mb-2">Best Overall Agentic AI Solution</h3>
            <p className="text-2xl font-bold text-primary mb-4">$1,500</p>
            <p className="text-gray-600">Awarded to the team that delivers the most complete, innovative, and technically sound solution across all judging dimensions.</p>
          </div>
          <div className="card p-6 border-t-4 border-secondary">
            <h3 className="
(Content truncated due to size limit. Use line ranges to read in chunks)