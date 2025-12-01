'use client';
import React from 'react';
import Link from 'next/link';
import { Heart, Shield, Car, Plane, Bike, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const InsuranceProducts = () => {
  const router = useRouter();

  const products = [
    {
      id: 'health-insurance',
      title: 'Health Insurance',
      subtitle: 'Up to ₹1Cr cover',
      tag: 'Cashless',
      icon: <Heart className="h-8 w-8 text-rose-600" />,
      applyHref: '/apply-insurance?type=health',
      detailsHref: '/insurance/health-insurance',
      color: 'rose',
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      tagBg: 'bg-rose-100'
    },
    {
      id: 'term-life-insurance',
      title: 'Term Life',
      subtitle: 'Tax benefits 80C',
      tag: '₹10Cr+',
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      applyHref: '/apply-insurance?type=term-life',
      detailsHref: '/insurance/term-life-insurance',
      color: 'blue',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      tagBg: 'bg-blue-100'
    },
    {
      id: 'car-insurance',
      title: 'Car Insurance',
      subtitle: 'Instant policy',
      tag: 'Zero Dep',
      icon: <Car className="h-8 w-8 text-green-600" />,
      applyHref: '/apply-insurance?type=car',
      detailsHref: '/insurance/car-insurance',
      color: 'green',
      bg: 'bg-green-50',
      text: 'text-green-600',
      tagBg: 'bg-green-100'
    },
    {
      id: 'travel-insurance',
      title: 'Travel Insurance',
      subtitle: 'Medical cover',
      tag: 'Worldwide',
      icon: <Plane className="h-8 w-8 text-purple-600" />,
      applyHref: '/apply-insurance?type=travel',
      detailsHref: '/insurance/travel-insurance',
      color: 'purple',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      tagBg: 'bg-purple-100'
    },
    {
      id: 'bike-insurance',
      title: 'Bike Insurance',
      subtitle: 'Third party',
      tag: 'Comprehensive',
      icon: <Bike className="h-8 w-8 text-orange-600" />,
      applyHref: '/apply-insurance?type=bike',
      detailsHref: '/insurance/bike-insurance',
      color: 'orange',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      tagBg: 'bg-orange-100'
    },
  ];

  const handleCardClick = (e: React.MouseEvent, href: string) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(href);
  };

  return (
    <div id="insurance" className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Comprehensive protection for you and your family
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <div 
              key={product.id}
              onClick={(e) => handleCardClick(e, product.detailsHref)}
              className="group flex flex-col items-center text-center p-6 bg-white border border-gray-200 rounded-3xl hover:shadow-xl hover:border-transparent transition-all duration-300 hover:-translate-y-1 cursor-pointer relative"
            >
              {/* Top Tag */}
              <div className={`px-4 py-1 rounded-full text-[10px] md:text-xs font-bold mb-6 ${product.tagBg} ${product.text}`}>
                {product.tag}
              </div>

              {/* Icon Box */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${product.bg}`}>
                {product.icon}
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {product.title}
              </h3>

              {/* Subtitle */}
              <p className="text-xs md:text-sm text-gray-500 mb-4">
                {product.subtitle}
              </p>

              {/* Apply Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(product.applyHref);
                }}
                className={`mt-auto px-6 py-2 rounded-full text-xs font-bold text-white transition-transform hover:scale-105 flex items-center gap-1 ${
                  product.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                  product.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                  product.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                  product.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
                  'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Apply <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsuranceProducts;

