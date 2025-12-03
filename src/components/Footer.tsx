import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.jpeg" alt="Loan Sarathi Logo" className="h-12 w-auto bg-white rounded-md p-1" />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for all financial needs. We make borrowing simple, transparent, and fast.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-orange-500">Products</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Personal Loan</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Business Loan</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Home Loan</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Loan Against Property</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-orange-500">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/track-status" className="hover:text-white transition-colors">Track Status</Link></li>
              <li><Link href="/apply" className="hover:text-white transition-colors">Apply Now</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-orange-500">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li>Email: support@loansarathi.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: 123 Finance Hub, Mumbai, India 400001</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Loan Sarathi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
