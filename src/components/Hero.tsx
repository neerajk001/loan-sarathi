import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-700 mb-6 border border-orange-100">
              <ShieldCheck className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Trusted by 5,000+ Customers</span>
            </div>
            
            <h1 className="text-4xl tracking-tight font-extrabold text-blue-900 sm:text-5xl md:text-6xl lg:text-6xl">
              <span className="block">The Right Loan,</span>
              <span className="block text-orange-600">Faster.</span>
            </h1>
            
            <p className="mt-4 text-lg text-gray-600 sm:mt-5 max-w-lg mx-auto lg:mx-0">
              Compare offers from top Banks & NBFCs. We handle the paperwork, facilitate the process, and get you the funds with zero hassle.
            </p>
            
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/apply" className="bg-orange-600 text-white px-8 py-3.5 rounded-md font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 text-center">
                  Apply Now
                </Link>
                <button className="bg-white text-blue-900 border-2 border-blue-900 px-8 py-3.5 rounded-md font-bold text-lg hover:bg-blue-50 transition-colors">
                  Talk to an Expert
                </button>
              </div>
              
              <div className="mt-6 flex items-center gap-6 text-sm text-gray-600 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-900" />
                  <span>20+ Lender Partners</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-900" />
                  <span>Quick Approval</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="mt-12 lg:mt-0 lg:col-span-5">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-blue-900 mb-6">Get a Call Back</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="loanType" className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
                  <select
                    id="loanType"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option>Personal Loan</option>
                    <option>Home Loan</option>
                    <option>Business Loan</option>
                    <option>Loan Against Property</option>
                  </select>
                </div>
                
                <div className="flex items-start gap-3 mt-2">
                  <input
                    id="auth"
                    type="checkbox"
                    defaultChecked
                    className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="auth" className="text-xs text-gray-500">
                    I authorize Loan Sarathi to contact me via Call/SMS/WhatsApp regarding my loan inquiry.
                  </label>
                </div>
                
                <button type="submit" className="w-full bg-blue-900 text-white font-bold py-3.5 rounded-md hover:bg-blue-800 transition-colors mt-2 shadow-lg">
                  Get Started
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Hero;
