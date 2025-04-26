import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-primary font-bold text-xl">
                CSI Agentic AI Hackathon
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/about" className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                About
              </Link>
              <Link href="/schedule" className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Schedule
              </Link>
              <Link href="/registration" className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Registration
              </Link>
              <Link href="/sponsors" className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Sponsors
              </Link>
              <Link href="/resources" className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Resources
              </Link>
              <Link href="/faq" className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                FAQ
              </Link>
              <Link href="/contact" className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/admin" className="btn-primary">
              Admin Dashboard
            </Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
              <span className="sr-only">Open main menu</span>
              {/* Mobile menu button */}
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className="sm:hidden hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/" className="bg-primary text-white block pl-3 pr-4 py-2 text-base font-medium">
            Home
          </Link>
          <Link href="/about" className="text-gray-500 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium">
            About
          </Link>
          <Link href="/schedule" className="text-gray-500 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium">
            Schedule
          </Link>
          <Link href="/registration" className="text-gray-500 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium">
            Registration
          </Link>
          <Link href="/sponsors" className="text-gray-500 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium">
            Sponsors
          </Link>
          <Link href="/resources" className="text-gray-500 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium">
            Resources
          </Link>
          <Link href="/faq" className="text-gray-500 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium">
            FAQ
          </Link>
          <Link href="/contact" className="text-gray-500 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium">
            Contact
          </Link>
          <Link href="/admin" className="text-gray-500 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium">
            Admin Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
