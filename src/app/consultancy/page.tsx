'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export default function ConsultancyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Content */}
          <div className="lg:col-span-7">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
              Get Expert Financial Advice, <span className="text-orange-600">Absolutely Free.</span>
            </h1>
            
            <p className="text-base text-gray-600 mb-4">
              Our team of financial experts is here to guide you through your loan journey. Fill out the form to request a callback and get personalized consultancy.
            </p>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why Consult with Us?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-1.5 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">Unbiased Recommendations</h4>
                    <p className="text-gray-600 text-sm mt-0.5">We compare offers from 20+ partner banks to find the best fit for your profile.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-orange-50 p-1.5 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">Higher Approval Chances</h4>
                    <p className="text-gray-600 text-sm mt-0.5">We match your profile with the right lender criteria to minimize rejection risk.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-green-50 p-1.5 rounded-lg">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">Fast Track Processing</h4>
                    <p className="text-gray-600 text-sm mt-0.5">Dedicated relationship managers ensure your application moves quickly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-5 sticky top-24">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Request Free Consultancy</h3>
              <form className="space-y-3">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-0.5">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-0.5">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-0.5">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="your.email@example.com"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                
                <div>
                  <label htmlFor="loanType" className="block text-xs font-medium text-gray-700 mb-0.5">Interested In</label>
                  <select
                    id="loanType"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option>Personal Loan</option>
                    <option>Home Loan</option>
                    <option>Business Loan</option>
                    <option>Loan Against Property</option>
                    <option>Health Insurance</option>
                    <option>Term Insurance</option>
                    <option>General Investment Advice</option>
                  </select>
                </div>

                <div>
                    <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-0.5">Message (Optional)</label>
                    <textarea
                        id="message"
                        rows={2}
                        placeholder="Any specific requirements?"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                    ></textarea>
                </div>
                
                <div className="flex items-start gap-2 mt-1">
                  <input
                    id="auth"
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 h-3.5 w-3.5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="auth" className="text-[10px] text-gray-500 leading-tight">
                    I authorize Loan Sarathi to contact me via Call/SMS/WhatsApp.
                  </label>
                </div>
                
                <button type="submit" className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700 transition-colors mt-1 shadow-md text-sm">
                  Get Free Advice
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

