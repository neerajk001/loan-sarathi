import React from 'react';
import { Wallet, FileText, Clock, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: 'Multiple Options',
      description: 'Compare 20+ Banks & NBFCs to find the best fit for you.',
      icon: <Wallet className="h-6 w-6 text-orange-600" />,
    },
    {
      title: 'Expert File Prep',
      description: 'We optimize your application to maximize approval chances.',
      icon: <FileText className="h-6 w-6 text-orange-600" />,
    },
    {
      title: 'Quick Processing',
      description: 'Fast-track approvals for urgent financial needs.',
      icon: <Clock className="h-6 w-6 text-orange-600" />,
    },
    {
      title: 'End-to-End Support',
      description: 'Dedicated relationship managers guide you until disbursement.',
      icon: <Users className="h-6 w-6 text-orange-600" />,
    },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-4 tracking-wide">
            WHY CHOOSE US
          </span>
          <h2 className="text-3xl font-bold text-blue-900 sm:text-4xl">
            Why India Trusts Loan Sarathi
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Experience the difference in professional lending guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="group bg-blue-50 rounded-2xl p-6 border border-black shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100/50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-orange-50 transition-colors duration-300">
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
