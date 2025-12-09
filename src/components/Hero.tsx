'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, ShieldCheck, X, Phone } from 'lucide-react';

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (    
    <div className="relative overflow-hidden">
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Talk to an Expert</h3>
              <p className="text-gray-500 mb-6">
                Get instant guidance on your loan requirements. Our experts are available 10 AM - 7 PM.
              </p>
              
              <a 
                href="tel:+919876543210"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mb-3"
              >
                <Phone className="h-5 w-5" />
                Call +91 98765 43210
              </a>
              
              <p className="text-xs text-gray-400">
                Standard calling charges may apply
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 lg:pt-10 lg:pb-14">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left">
            
            <h1 className="text-4xl tracking-tight font-extrabold text-blue-900 sm:text-5xl md:text-6xl lg:text-6xl">
              <span className="block">Empowering your</span>
              <span className="block">dreams with simple</span>
              <span className="block text-orange-600">Smart financing.</span>
            </h1>
            
            <p className="mt-4 text-lg text-gray-600 sm:mt-5 max-w-lg mx-auto lg:mx-0">
              Find the best loan options in just a few simple steps. Check your eligibility instantly, calculate your EMIs, and compare interest savings with our part-payment tools — all in one place.
            </p>
            
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start">
                <Link href="/apply" className="w-full sm:w-auto bg-orange-600 text-white px-6 py-3 rounded-md font-bold text-base hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 text-center">
                  Apply Now
                </Link>
                <Link href="/check-eligibility" className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-md font-bold text-base hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 text-center">
                  Check Eligibility
                </Link>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto bg-white text-blue-900 border-2 border-blue-900 px-6 py-3 rounded-md font-bold text-base hover:bg-blue-50 transition-colors"
                >
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
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-900" />
                  <span>500+Cr Disbursement</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="mt-12 lg:mt-0 lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
              <img
                src="/loan.jpg"
                alt="Hero"
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Hero;
