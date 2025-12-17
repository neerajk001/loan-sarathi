'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, ShieldCheck, X, Phone } from 'lucide-react';

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    '/loan/personal loan (1).png',
    '/loan/BUSINESS-LOAN1 (2).png',
    '/loan/home loan (2).png',
    '/loan/car-LOAN (1).png',
    '/loan/loan against property (1).png',
  ];

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
                href="tel:+919665248445"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mb-3"
              >
                <Phone className="h-5 w-5" />
                Call +91 96652 48445
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
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            
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

          {/* Right Image - Auto Rotating Slideshow */}
          <div className="mt-12 lg:-mt-12 lg:col-span-6 flex items-center justify-center lg:justify-end">
            <div className="relative w-full">
              {heroImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`Loan Service ${index + 1}`}
                  className={`w-full h-auto rounded-2xl shadow-2xl object-cover transition-opacity duration-700 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'
                  }`}
                />
              ))}
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-orange-600 w-6' 
                        : 'bg-white/70 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Hero;
