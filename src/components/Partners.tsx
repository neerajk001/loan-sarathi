import React from 'react';
import { Building2, Landmark } from 'lucide-react';

const Partners = () => {
  const partners = [
    { 
      name: 'HDFC Bank',
      iconColor: 'text-blue-700', // HDFC Blue
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50' // Light blue background
    },
    { 
      name: 'ICICI Bank',
      iconColor: 'text-blue-800', // ICICI Blue
      textColor: 'text-blue-800',
      bgColor: 'bg-orange-50' // Light orange background (ICICI has orange accent)
    },
    { 
      name: 'Axis Bank',
      iconColor: 'text-indigo-900', // Axis Deep Blue
      textColor: 'text-indigo-900',
      bgColor: 'bg-indigo-50' // Light indigo background
    },
    { 
      name: 'Bajaj Finserv',
      iconColor: 'text-blue-900', // Bajaj Blue
      textColor: 'text-blue-900',
      bgColor: 'bg-blue-50' // Light blue background
    },
    { 
      name: 'Kotak Mahindra',
      iconColor: 'text-green-600', // Kotak Green
      textColor: 'text-green-600',
      bgColor: 'bg-green-50' // Light green background
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white/80 to-blue-50/20 py-6 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-gray-500 tracking-wider uppercase mb-8">
          We facilitate loans through India's leading partners
        </p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 items-center">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-lg cursor-default group ${partner.bgColor}`}
            >
              <Landmark 
                className={`h-6 w-6 transition-transform duration-300 group-hover:scale-110 ${partner.iconColor}`}
              />
              <span 
                className={`text-lg font-bold transition-colors ${partner.textColor}`}
              >
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;

