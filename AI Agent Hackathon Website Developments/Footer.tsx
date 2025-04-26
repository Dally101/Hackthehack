import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold mb-4">CSI Agentic AI Hackathon</h2>
            <p className="mb-4">Connected Systems Institute (CSI) | University of Wisconsin–Milwaukee</p>
            <p className="mb-4">April 25–27, 2025</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/schedule" className="hover:underline">Schedule</Link></li>
              <li><Link href="/registration" className="hover:underline">Registration</Link></li>
              <li><Link href="/sponsors" className="hover:underline">Sponsors</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/resources" className="hover:underline">Available Tools</Link></li>
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              <li><Link href="/admin" className="hover:underline">Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/20">
          <p className="text-center">&copy; {new Date().getFullYear()} Connected Systems Institute. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
