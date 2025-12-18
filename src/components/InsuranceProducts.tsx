'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const InsuranceProducts = () => {
  const router = useRouter();

  const products = [
    {
      id: 'health-insurance',
      title: 'Health Insurance',
      subtitle: 'Up to ₹1Cr cover',
      tag: 'Cashless',
      iconPath: '/card-logo/HealthInsurance.png',
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
      iconPath: '/card-logo/terminsurance.png',
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
      iconPath: '/card-logo/CarInsurance.png',
      applyHref: '/apply-insurance?type=car',
      detailsHref: '/insurance/car-insurance',
      color: 'green',
      bg: 'bg-green-50',
      text: 'text-green-600',
      tagBg: 'bg-green-100'
    },
    {
      id: 'bike-insurance',
      title: 'Bike Insurance',
      subtitle: 'Third party',
      tag: 'Comprehensive',
      iconPath: '/card-logo/BikeInsurance.png',
      applyHref: '/apply-insurance?type=bike',
      detailsHref: '/insurance/bike-insurance',
      color: 'orange',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      tagBg: 'bg-orange-100'
    },
    {
      id: 'loan-protector',
      title: 'Loan Protector',
      subtitle: 'Protect your loan',
      tag: 'Secure',
      iconPath: '/card-logo/LoanProtector.png',
      applyHref: '/apply-insurance?type=loan-protector',
      detailsHref: '/insurance/loan-protector',
      color: 'purple',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      tagBg: 'bg-purple-100'
    },
    {
      id: 'emi-protector',
      title: 'EMI Protector',
      subtitle: 'EMI protection',
      tag: 'Coverage',
      iconPath: '/card-logo/EMI Protector.png',
      applyHref: '/apply-insurance?type=emi-protector',
      detailsHref: '/insurance/emi-protector',
      color: 'indigo',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      tagBg: 'bg-indigo-100'
    },
  ];

  const handleCardClick = (e: React.MouseEvent, href: string) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(href);
  };

  return (
    <div id="insurance" className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-6 pl-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
            Insurance
          </h1>
          <h2 className="text-xl font-bold text-gray-900">
            Comprehensive protection for you and your family
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {products.map((product) => (
            <div 
              key={product.id}
              onClick={(e) => handleCardClick(e, product.detailsHref)}
              className={`group flex flex-col items-center text-center p-4 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer relative border bg-white ${
                product.color === 'blue' ? 'border-blue-200 hover:border-blue-300' :
                product.color === 'green' ? 'border-green-200 hover:border-green-300' :
                product.color === 'orange' ? 'border-orange-200 hover:border-orange-300' :
                product.color === 'purple' ? 'border-purple-200 hover:border-purple-300' :
                product.color === 'indigo' ? 'border-indigo-200 hover:border-indigo-300' :
                'border-rose-200 hover:border-rose-300'
              }`}
            >
              {/* Top Tag */}
              <div className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold mb-3 ${
                product.color === 'blue' ? 'bg-blue-50 text-blue-800' :
                product.color === 'green' ? 'bg-green-50 text-green-800' :
                product.color === 'orange' ? 'bg-orange-50 text-orange-800' :
                product.color === 'purple' ? 'bg-purple-50 text-purple-800' :
                product.color === 'indigo' ? 'bg-indigo-50 text-indigo-800' :
                'bg-rose-50 text-rose-800'
              }`}>
                {product.tag}
              </div>

              {/* Icon Box */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 bg-gray-100 border border-black">
                <Image 
                  src={product.iconPath} 
                  alt={product.title}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {product.title}
              </h3>

              {/* Subtitle */}
              <p className="text-xs md:text-sm text-gray-500 mb-3">
                {product.subtitle}
              </p>

              {/* Apply Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(product.applyHref);
                }}
                className="mt-auto px-6 py-2 rounded-full text-xs font-bold text-white transition-transform hover:scale-105 flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
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

