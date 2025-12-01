import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, BadgeCheck } from 'lucide-react';

const FeaturedPartners = () => {
  const offers = [
    {
      id: 1,
      partnerName: "Poonawalla Fincorp",
      productType: "Instant Personal Loan",
      amount: "up to ₹15 Lakhs",
      tags: ["Zero Pre-Payment", "No Hidden Charges", "Digital Process"],
      // Blue Theme
      wrapperClass: "bg-blue-600", 
      buttonClass: "bg-yellow-400 text-blue-900 hover:bg-yellow-300",
      logoText: "POONAWALLA FINCORP",
      logoColor: "text-blue-700",
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      highlightText: "text-yellow-400"
    },
    {
      id: 2,
      partnerName: "InCred Finance",
      productType: "Personal Loan",
      amount: "up to ₹10 Lakhs",
      tags: ["Instant Approval", "Flexible Tenure", "Quick Disbursal"],
      // Orange Theme
      wrapperClass: "bg-orange-500",
      buttonClass: "bg-white text-orange-600 hover:bg-gray-50",
      logoText: "InCred finance",
      logoColor: "text-orange-600",
      icon: <BadgeCheck className="w-6 h-6 text-white" />,
      highlightText: "text-white"
    }
  ];

  return (
    <div className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {offers.map((offer) => (
          <div 
            key={offer.id} 
            className={`rounded-2xl p-6 md:p-8 ${offer.wrapperClass} shadow-lg transition-transform duration-300 hover:-translate-y-1`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
              
              {/* Left Content */}
              <div className="flex items-start gap-6 w-full md:w-auto">
                <div className="hidden sm:flex shrink-0 w-14 h-14 bg-white/10 rounded-xl items-center justify-center backdrop-blur-sm">
                  {offer.icon}
                </div>
                
                <div className="text-center sm:text-left flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white/90">
                      {offer.partnerName}
                    </h3>
                    <span className={`hidden sm:inline-block w-1 h-1 rounded-full bg-white/40`}></span>
                    <span className={`text-lg font-bold ${offer.highlightText}`}>
                      {offer.productType}
                    </span>
                  </div>
                  
                  <div className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    {offer.amount}
                  </div>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {offer.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="bg-white/20 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Content - Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto min-w-[280px]">
                <Link 
                  href="/apply" 
                  className={`${offer.buttonClass} w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm`}
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
                
                <div className="w-full sm:w-auto bg-white py-3.5 px-6 rounded-xl flex items-center justify-center shadow-sm min-w-[140px]">
                  <span className={`font-bold text-xs uppercase tracking-wider ${offer.logoColor}`}>
                    {offer.logoText}
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPartners;
