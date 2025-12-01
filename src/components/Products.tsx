'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { User, Building2, Home, FileText, RefreshCcw, CreditCard, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const ProductCard = ({ product }: { product: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative group bg-blue-50 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-black overflow-hidden flex flex-col">
       {/* Decorative Gradient Overlay */}
       <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

       <div className="relative z-10 flex-1">
          {/* Icon Container */}
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300 shadow-sm border border-orange-100">
            {product.icon}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
            {product.title}
          </h3>

          <div className="text-gray-600 mb-4 text-sm leading-relaxed">
             <p>{product.shortDescription}</p>
             
             <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
               <p className="text-gray-500 text-xs leading-relaxed border-t border-gray-200 pt-4">
                 {product.fullDescription}
               </p>
             </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className="text-blue-600 font-bold text-xs uppercase tracking-wide flex items-center gap-1 mb-8 hover:text-orange-600 transition-colors"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
       </div>

       <div className="relative z-10 mt-auto">
          <Link
            href={product.href}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-bold py-3.5 rounded-xl hover:bg-orange-700 transition-all shadow-md hover:shadow-lg transform group-hover:translate-y-0"
          >
            Apply Now
            <ArrowRight className="h-4 w-4" />
          </Link>
       </div>
    </div>
  );
};

const Products = () => {
  const products = [
    {
      title: 'Personal Loans',
      shortDescription: 'Unsecured funds for travel, medical, or weddings. Quick disbursal.',
      fullDescription: 'Described as a quick, unsecured option for urgent needs like medical expenses, travel, weddings, debt consolidation, or other personal uses, with flexible tenures and minimal documentation. Loan Sarathi highlights multiple lender choices, minimal paperwork, expert file preparation, end-to-end assistance, and explains eligibility factors (income, credit score, company category, existing loans, age and job stability) and required documents such as Aadhaar/PAN, income proof, bank statements, employment/business proof, and address proof.',
      icon: <User className="h-7 w-7 text-orange-600" />,
      href: '/apply?type=personal',
    },
    {
      title: 'Business Loans',
      shortDescription: 'Capital for SME growth & working capital. GST required.',
      fullDescription: 'Aimed at entrepreneurs, self-employed individuals, and companies for growth, operations, or working capital, including unsecured options. Promises wide lender network, professional file preparation, transparent and fast processing, full assistance till disbursement, with eligibility based on business vintage, turnover, ITR and profitability, banking stability, and CIBIL score, plus documents like owner KYC, business registration, GST returns or sales reports, ITR, bank statements, and office address proof.',
      icon: <Building2 className="h-7 w-7 text-orange-600" />,
      href: '/apply?type=business',
    },
    {
      title: 'Home Loans',
      shortDescription: 'Lowest rates for new homes or construction. Max tenure 30 years.',
      fullDescription: 'Designed to help customers buy or construct homes with affordable EMIs and long tenures, also suitable for balance transfer. Key points include low interest rates, tenure up to 30 years, high eligibility, and benefits such as multi-bank comparison, expert eligibility assessment, strong file preparation, and support till disbursement.',
      icon: <Home className="h-7 w-7 text-orange-600" />,
      href: '/apply?type=home',
    },
    {
      title: 'Loan Against Property',
      shortDescription: 'Unlock high value funds using your residential or commercial property.',
      fullDescription: 'Allows customers to unlock property value for personal or business purposes with high loan amounts and relatively low rates. Features include lower interest, higher eligibility, flexible end use, long tenure, and Loan Sarathi’s support on property valuation, multiple lenders, fast processing, and transparent service.',
      icon: <FileText className="h-7 w-7 text-orange-600" />,
      href: '/apply?type=lap',
    },
    {
      title: 'Balance Transfer',
      shortDescription: 'Switch your existing loan to a lower interest rate and reduce EMI.',
      fullDescription: 'Switch your existing loan to a lower interest rate and reduce EMI. We assist in calculating your savings and facilitating the transfer process to ensuring you get the best possible deal from top lenders.',
      icon: <RefreshCcw className="h-7 w-7 text-orange-600" />,
      href: '/calculator?tab=balance',
    },
    {
      title: 'Credit Cards',
      shortDescription: 'Exclusive rewards, cashback, and lifestyle cards tailored to you.',
      fullDescription: 'Service focuses on helping customers select the right card based on lifestyle, income, and spending habits. Highlights benefits like purchasing power, rewards and cashback, credit score building, secure payments, plus card recommendations, quick applications, sometimes zero documentation, and support till activation.',
      icon: <CreditCard className="h-7 w-7 text-orange-600" />,
      href: '/apply?type=cc',
    },
  ];

  return (
    <div id="products" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4 tracking-wide">
            OUR PRODUCTS
          </span>
          <h2 className="text-3xl font-bold text-blue-900 sm:text-4xl">Solutions for Every Need</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our wide range of financial products tailored to your requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
