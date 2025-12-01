import React from 'react';
import { Building2, Landmark } from 'lucide-react';

const Partners = () => {
  const partners = [
    { name: 'HDFC Bank' },
    { name: 'ICICI Bank' },
    { name: 'Axis Bank' },
    { name: 'Bajaj Finserv' },
    { name: 'Kotak Mahindra' },
  ];

  return (
    <div className="bg-white py-6 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-gray-500 tracking-wider uppercase mb-8">
          We facilitate loans through India's leading partners
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center gap-2 text-xl font-bold text-gray-400 hover:text-blue-900 transition-colors cursor-default">
              <Landmark className="h-6 w-6" />
              <span>{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;

