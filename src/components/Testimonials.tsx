'use client';
import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, TrendingUp, Clock, BadgeCheck } from 'lucide-react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      role: 'Small Business Owner',
      location: 'Mumbai',
      content: 'Loan Sarathi helped me secure a business loan within 48 hours. The process was seamless and the interest rate was much lower than I expected. Highly recommended for any entrepreneur.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      loanType: 'Business Loan',
      amount: '₹25 Lakhs',
      time: '48 Hours',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Software Engineer',
      location: 'Bangalore',
      content: 'I was struggling with my home loan application due to documentation issues. The team at Loan Sarathi guided me through every step, and I got my sanction letter in a week!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      loanType: 'Home Loan',
      amount: '₹75 Lakhs',
      time: '7 Days',
    },
    {
      id: 3,
      name: 'Amit Verma',
      role: 'Freelance Designer',
      location: 'Delhi',
      content: 'The best part about Loan Sarathi is their transparency. No hidden charges, no fake promises. They got me a personal loan when others rejected my application.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      loanType: 'Personal Loan',
      amount: '₹5 Lakhs',
      time: '24 Hours',
    },
    {
      id: 4,
      name: 'Sneha Patel',
      role: 'Restaurant Owner',
      location: 'Ahmedabad',
      content: 'Expanding my restaurant chain seemed impossible until I found Loan Sarathi. They understood my business needs and got me the perfect financing solution with minimal documentation.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      loanType: 'Business Loan',
      amount: '₹40 Lakhs',
      time: '3 Days',
    },
    {
      id: 5,
      name: 'Vikram Singh',
      role: 'IT Consultant',
      location: 'Pune',
      content: 'I needed a loan against property urgently for a family medical emergency. Loan Sarathi team worked overtime to ensure I got the disbursement within 5 days. Forever grateful!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      loanType: 'Loan Against Property',
      amount: '₹1.2 Crore',
      time: '5 Days',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '₹500Cr+', label: 'Loans Disbursed' },
    { value: '4.9/5', label: 'Customer Rating' },
    { value: '48 Hrs', label: 'Avg. Approval Time' },
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-12 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4 border border-blue-200">
            <BadgeCheck className="w-4 h-4" />
            VERIFIED SUCCESS STORIES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Real People, Real Results
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Join thousands who have transformed their financial dreams into reality
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-900 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Testimonial - Mobile Carousel / Desktop Grid */}
        <div className="relative">
          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} featured={index === 1} />
            ))}
          </div>

          {/* Mobile/Tablet Carousel */}
          <div className="lg:hidden">
            <div className="relative">
              <TestimonialCard testimonial={testimonials[activeIndex]} featured />
              
              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button 
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {/* Dots */}
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === activeIndex 
                          ? 'bg-blue-600 w-8' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Desktop Only */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6 mt-6">
          {testimonials.slice(3, 5).map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} compact />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Ready to write your own success story?</p>
          <a 
            href="/apply" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Apply Now - It&apos;s Free
            <TrendingUp className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ 
  testimonial, 
  featured = false,
  compact = false 
}: { 
  testimonial: any; 
  featured?: boolean;
  compact?: boolean;
}) => {
  return (
    <div 
      className={`relative group ${
        featured 
          ? 'bg-gradient-to-br from-white to-blue-50 lg:scale-105 lg:-my-4 shadow-2xl border border-gray-900' 
          : 'bg-white border border-gray-900 shadow-lg'
      } ${compact ? 'p-6' : 'p-8'} rounded-2xl transition-all duration-300 hover:shadow-xl`}
    >
      {/* Quote Icon */}
      <Quote className={`absolute ${compact ? 'top-4 right-4 h-8 w-8' : 'top-6 right-6 h-10 w-10'} text-blue-100 transform group-hover:scale-110 transition-transform`} />
      
      {/* Verified Badge */}
      <div className="absolute -top-3 left-6 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
        <BadgeCheck className="w-3 h-3" />
        Verified
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4 mb-6 mt-2">
        <div className="relative">
          <img 
            src={testimonial.image} 
            alt={testimonial.name} 
            className={`${compact ? 'h-12 w-12' : 'h-14 w-14'} rounded-full object-cover ring-4 ring-white shadow-lg`}
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <BadgeCheck className="w-3 h-3 text-white" />
          </div>
        </div>
        <div>
          <h4 className={`${compact ? 'text-base' : 'text-lg'} font-bold text-gray-900`}>{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.role} • {testimonial.location}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-600">{testimonial.rating}.0</span>
      </div>

      {/* Content */}
      <p className={`text-gray-600 leading-relaxed ${compact ? 'text-sm line-clamp-3' : ''} mb-6`}>
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Loan Details */}
      <div className={`grid ${compact ? 'grid-cols-3' : 'grid-cols-3'} gap-3 pt-4 border-t border-gray-100`}>
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Loan Type</div>
          <div className={`${compact ? 'text-xs' : 'text-sm'} font-bold text-gray-800`}>{testimonial.loanType}</div>
        </div>
        <div className="text-center border-l border-gray-100">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Amount</div>
          <div className={`${compact ? 'text-xs' : 'text-sm'} font-bold text-green-600`}>{testimonial.amount}</div>
        </div>
        <div className="text-center border-l border-gray-100">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Time</div>
          <div className={`${compact ? 'text-xs' : 'text-sm'} font-bold text-blue-600 flex items-center justify-center gap-1`}>
            <Clock className="w-3 h-3" />
            {testimonial.time}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
