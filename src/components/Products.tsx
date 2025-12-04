'use client';
import React from 'react';
import Link from 'next/link';
import { Building2, Home, FileText, GraduationCap, Wallet, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Products = () => {
  const router = useRouter();

  const products = [
    {
      id: 'personal-loan',
      title: 'Personal Loan',
      subtitle: 'Up to ₹50 Lakhs',
      tag: '@10.49% ROI',
      icon: <Wallet className="h-8 w-8 text-blue-600" />,
      applyHref: '/apply?type=personal',
      detailsHref: '/loan/personal-loan',
      color: 'blue',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      tagBg: 'bg-blue-100'
    },
    {
      id: 'business-loan',
      title: 'Business Loan',
      subtitle: 'Quick Approval',
      tag: 'Up to ₹2 Cr',
      icon: <Building2 className="h-8 w-8 text-purple-600" />,
      applyHref: '/apply?type=business',
      detailsHref: '/loan/business-loan',
      color: 'purple',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      tagBg: 'bg-purple-100'
    },
    {
      id: 'home-loan',
      title: 'Home Loan',
      subtitle: 'Up to ₹5 Cr',
      tag: 'Low Interest',
      icon: <Home className="h-8 w-8 text-green-600" />,
      applyHref: '/apply?type=home',
      detailsHref: '/loan/home-loan',
      color: 'green',
      bg: 'bg-green-50',
      text: 'text-green-600',
      tagBg: 'bg-green-100'
    },
    {                             
      id: 'loan-against-property',
      title: 'Loan Against Property',
      subtitle: 'Unlock Value',
      tag: 'High Amount',
      icon: <FileText className="h-8 w-8 text-orange-600" />,
      applyHref: '/apply?type=lap',
      detailsHref: '/loan/loan-against-property',
      color: 'orange',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      tagBg: 'bg-orange-100'
    },
    {
      id: 'education-loan',
      title: 'Education Loan',
      subtitle: 'Study Abroad',
      tag: 'Low Interest',
      icon: <GraduationCap className="h-8 w-8 text-indigo-600" />,
      applyHref: '/apply?type=education',
      detailsHref: '/loan/education-loan',
      color: 'indigo',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      tagBg: 'bg-indigo-100'
    },
  ];

  const handleCardClick = (e: React.MouseEvent, href: string) => {
    // Prevent navigation if the click originated from the Apply button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(href);
  };

  return (
    <div id="products" className="py-6 bg-gradient-to-br from-blue-50/30 to-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Choose from our wide range of loan products
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <div 
              key={product.id}
              onClick={(e) => handleCardClick(e, product.detailsHref)}
              className={`group flex flex-col items-center text-center p-6 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer relative border-2 ${
                product.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200' :
                product.color === 'purple' ? 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200' :
                product.color === 'green' ? 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200' :
                product.color === 'orange' ? 'bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200' :
                'bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-200'
              }`}
            >
              {/* Top Tag */}
              <div className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold mb-6 shadow-sm ${
                product.color === 'blue' ? 'bg-blue-200 text-blue-800' :
                product.color === 'purple' ? 'bg-purple-200 text-purple-800' :
                product.color === 'green' ? 'bg-green-200 text-green-800' :
                product.color === 'orange' ? 'bg-orange-200 text-orange-800' :
                'bg-indigo-200 text-indigo-800'
              }`}>
                {product.tag}
              </div>

              {/* Icon Box */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-md ${
                product.color === 'blue' ? 'bg-white border-2 border-blue-300' :
                product.color === 'purple' ? 'bg-white border-2 border-purple-300' :
                product.color === 'green' ? 'bg-white border-2 border-green-300' :
                product.color === 'orange' ? 'bg-white border-2 border-orange-300' :
                'bg-white border-2 border-indigo-300'
              }`}>
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
                  e.stopPropagation(); // Stop bubble to parent div
                  router.push(product.applyHref);
                }}
                className={`mt-auto px-6 py-2 rounded-full text-xs font-bold text-white transition-transform hover:scale-105 flex items-center gap-1 ${
                  product.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                  product.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                  product.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                  product.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
                  'bg-indigo-600 hover:bg-indigo-700'
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

export default Products;
