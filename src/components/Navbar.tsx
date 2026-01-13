'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Info, Calculator, CheckCircle, Phone, ChevronDown, Home, Wallet, Shield, FileText } from 'lucide-react';
import { usePathname } from 'next/navigation';
import MovingBanner from './MovingBanner';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoanDropdown, setShowLoanDropdown] = useState(false);
  const [showInsuranceDropdown, setShowInsuranceDropdown] = useState(false);
  const [showMobileLoanDropdown, setShowMobileLoanDropdown] = useState(false);
  const [showMobileInsuranceDropdown, setShowMobileInsuranceDropdown] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isActive = (path: string) => {
    if (path === '/loan') {
      return pathname.startsWith('/loan/') ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-orange-600 font-medium';
    }
    if (path === '/insurance') {
      return pathname === '/insurance' || pathname.startsWith('/insurance/') ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-orange-600 font-medium';
    }
    return pathname === path ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-orange-600 font-medium';
  };

  // Render login button placeholder during SSR to match client initial render


  return (
    <>
      <MovingBanner />
      <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">

            {/* Left: Logo */}
            <div className="shrink-0 flex items-center cursor-pointer z-50 relative">
              <Link href="/" className="flex items-center">
                <img src="/logoc.svg" alt="Loan Sarathi Logo" className="h-32 md:h-40 lg:h-44 xl:h-48 w-auto object-contain" />
              </Link>
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden md:flex items-center justify-center space-x-4 lg:space-x-6 xl:space-x-8 2xl:space-x-12 flex-1 px-2 lg:px-4">
              <Link href="/" className={`${isActive('/')} whitespace-nowrap transition-colors text-sm lg:text-base`}>Home</Link>
              <Link href="/about" className={`${isActive('/about')} whitespace-nowrap transition-colors text-sm lg:text-base`}>About Us</Link>

              {/* Loans Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowLoanDropdown(true)}
                onMouseLeave={() => setShowLoanDropdown(false)}
              >
                <div
                  className={`${isActive('/loan')} whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer text-sm lg:text-base`}
                >
                  Loans
                  <ChevronDown className={`h-4 w-4 transition-transform ${showLoanDropdown ? 'rotate-180' : ''}`} />
                </div>

                {showLoanDropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[200px] z-50">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex flex-col">
                        <Link
                          href="/loan/personal-loan"
                          className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 transition-colors group"
                        >
                          <Image src="/card-logo/PersonalLoan.png" alt="Personal Loan" width={16} height={16} className="object-contain" />
                          <span className="text-sm font-medium text-gray-900">Personal Loan</span>
                        </Link>

                        <Link
                          href="/loan/business-loan"
                          className="flex items-center gap-2 px-3 py-2 hover:bg-purple-50 transition-colors group"
                        >
                          <Image src="/card-logo/BusinessLoan.png" alt="Business Loan" width={16} height={16} className="object-contain" />
                          <span className="text-sm font-medium text-gray-900">Business Loan</span>
                        </Link>

                        <Link
                          href="/loan/home-loan"
                          className="flex items-center gap-2 px-3 py-2 hover:bg-green-50 transition-colors group"
                        >
                          <Image src="/card-logo/HomeLoan (2).png" alt="Home Loan" width={16} height={16} className="object-contain" />
                          <span className="text-sm font-medium text-gray-900">Home Loan</span>
                        </Link>

                        <Link
                          href="/loan/loan-against-property"
                          className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 transition-colors group"
                        >
                          <Image src="/card-logo/LAP (2).png" alt="Loan Against Property" width={16} height={16} className="object-contain" />
                          <span className="text-sm font-medium text-gray-900">Loan Against Property</span>
                        </Link>

                        <Link
                          href="/loan/education-loan"
                          className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-50 transition-colors group"
                        >
                          <Image src="/card-logo/EducationLoan.png" alt="Education Loan" width={16} height={16} className="object-contain" />
                          <span className="text-sm font-medium text-gray-900">Education Loan</span>
                        </Link>

                        <Link
                          href="/loan/car-loan"
                          className="flex items-center gap-2 px-3 py-2 hover:bg-teal-50 transition-colors group"
                        >
                          <Image src="/card-logo/CarLoan (2).png" alt="Car Loan" width={16} height={16} className="object-contain" />
                          <span className="text-sm font-medium text-gray-900">Car Loan</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Insurance Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowInsuranceDropdown(true)}
                onMouseLeave={() => setShowInsuranceDropdown(false)}
              >
                <div
                  className={`${isActive('/insurance')} whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer text-sm lg:text-base`}
                >
                  Insurance
                  <ChevronDown className={`h-4 w-4 transition-transform ${showInsuranceDropdown ? 'rotate-180' : ''}`} />
                </div>

                {showInsuranceDropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[200px] z-50">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex flex-col">
                        <Link
                          href="/insurance/health-insurance"
                          className="flex items-center gap-2 px-3 py-2 hover:bg-rose-50 transition-colors group"
                        >
                          <Image src="/card-logo/HealthInsurance.png" alt="Health Insurance" width={16} height={16} className="object-contain" />
                          <span className="text-sm font-medium text-gray-900">Health Insurance</span>
                        </Link>

                        <Link
                          href="/insurance/term-life-insurance"
                          className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 transition-colors group"
                        >
                          <Image src="/card-logo/terminsurance.png" alt="Term Life" width={16} height={16} className="object-contain" />
                          <span className="text-sm font-medium text-gray-900">Term Life</span>
                        </Link>

                        <Link
                          href="/insurance/car-insurance"
                          className="flex items-center gap-2 px-3 py-2 hover:bg-green-50 transition-colors group"
                        >
                          <Image src="/card-logo/CarInsurance.png" alt="Car Insurance" width={16} height={16} className="object-contain" />
                          <span className="text-sm font-medium text-gray-900">Car Insurance</span>
                        </Link>

                        <Link
                          href="/insurance/bike-insurance"
                          className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 transition-colors group"
                        >
                          <Image src="/card-logo/BikeInsurance.png" alt="Bike Insurance" width={16} height={16} className="object-contain" />
                          <span className="text-sm font-medium text-gray-900">Bike Insurance</span>
                        </Link>

                        <Link
                          href="/insurance/loan-protector"
                          className="flex items-center gap-2 px-3 py-2 hover:bg-purple-50 transition-colors group"
                        >
                          <Image src="/card-logo/LoanProtector.png" alt="Loan Protector" width={16} height={16} className="object-contain" />
                          <span className="text-sm font-medium text-gray-900">Loan Protector</span>
                        </Link>

                        <Link
                          href="/insurance/emi-protector"
                          className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-50 transition-colors group"
                        >
                          <Image src="/card-logo/EMI Protector.png" alt="EMI Protector" width={16} height={16} className="object-contain" />
                          <span className="text-sm font-medium text-gray-900">EMI Protector</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link href="/calculator" className={`${isActive('/calculator')} whitespace-nowrap transition-colors text-sm lg:text-base`}>Calculator</Link>
              <Link
                href={pathname === '/' ? '#articles' : '/#articles'}
                className="text-gray-600 hover:text-orange-600 font-medium whitespace-nowrap transition-colors text-sm lg:text-base"
                onClick={(e) => {
                  if (pathname === '/') {
                    e.preventDefault();
                    document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Articles
              </Link>
              <Link
                href="/contact"
                className={`${isActive('/contact')} whitespace-nowrap transition-colors text-sm lg:text-base`}
              >
                Contact Us
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/consultancy" className="hidden md:block bg-orange-600 text-white px-5 lg:px-6 py-2.5 rounded-full font-medium hover:bg-orange-700 transition-colors shadow-sm whitespace-nowrap text-sm lg:text-base">
                Get Free Consultancy
              </Link>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center z-50 relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-600 hover:text-orange-600 focus:outline-none p-2 rounded-full hover:bg-orange-50 transition-colors"
                >
                  {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {
          isOpen && (
            <div className="md:hidden fixed inset-x-0 top-24 bottom-0 bg-white z-40 overflow-y-auto border-t border-gray-100 animate-in slide-in-from-top-5 duration-200">
              <div className="flex flex-col h-full">
                <div className="p-6 space-y-6">
                  {/* Menu Items */}
                  <div className="space-y-2">
                    <Link
                      href="/"
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl text-lg transition-all
                    ${pathname === '/'
                          ? 'bg-blue-50 text-blue-900 font-bold'
                          : 'text-gray-600 font-medium hover:bg-gray-50'}`}
                    >
                      <Home className={`h-6 w-6 ${pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`} />
                      Home
                    </Link>

                    <Link
                      href="/about"
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl text-lg transition-all
                    ${pathname === '/about'
                          ? 'bg-blue-50 text-blue-900 font-bold'
                          : 'text-gray-600 font-medium hover:bg-gray-50'}`}
                    >
                      <Info className={`h-6 w-6 ${pathname === '/about' ? 'text-blue-600' : 'text-gray-400'}`} />
                      About Us
                    </Link>

                    {/* Loans with Mobile Dropdown */}
                    <div>
                      <button
                        onClick={() => setShowMobileLoanDropdown(!showMobileLoanDropdown)}
                        className={`w-full flex items-center justify-between gap-4 px-4 py-4 rounded-xl text-lg transition-all
                      ${pathname.startsWith('/loan/')
                            ? 'bg-blue-50 text-blue-900 font-bold'
                            : 'text-gray-600 font-medium hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <Wallet className={`h-6 w-6 ${pathname.startsWith('/loan/') ? 'text-blue-600' : 'text-gray-400'}`} />
                          Loans
                        </div>
                        <ChevronDown className={`h-5 w-5 transition-transform ${showMobileLoanDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {showMobileLoanDropdown && (
                        <div className="ml-8 mt-2 space-y-2">
                          <Link href="/loan/personal-loan" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-blue-50 transition-colors">
                            <Image src="/card-logo/PersonalLoan.png" alt="Personal Loan" width={20} height={20} className="object-contain" />
                            Personal Loan
                          </Link>
                          <Link href="/loan/business-loan" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-purple-50 transition-colors">
                            <Image src="/card-logo/BusinessLoan.png" alt="Business Loan" width={20} height={20} className="object-contain" />
                            Business Loan
                          </Link>
                          <Link href="/loan/home-loan" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-green-50 transition-colors">
                            <Image src="/card-logo/HomeLoan (2).png" alt="Home Loan" width={20} height={20} className="object-contain" />
                            Home Loan
                          </Link>
                          <Link href="/loan/loan-against-property" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-orange-50 transition-colors">
                            <Image src="/card-logo/LAP (2).png" alt="Loan Against Property" width={20} height={20} className="object-contain" />
                            Loan Against Property
                          </Link>
                          <Link href="/loan/education-loan" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-indigo-50 transition-colors">
                            <Image src="/card-logo/EducationLoan.png" alt="Education Loan" width={20} height={20} className="object-contain" />
                            Education Loan
                          </Link>
                          <Link href="/loan/car-loan" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-teal-50 transition-colors">
                            <Image src="/card-logo/CarLoan (2).png" alt="Car Loan" width={20} height={20} className="object-contain" />
                            Car Loan
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Insurance with Mobile Dropdown */}
                    <div>
                      <button
                        onClick={() => setShowMobileInsuranceDropdown(!showMobileInsuranceDropdown)}
                        className={`w-full flex items-center justify-between gap-4 px-4 py-4 rounded-xl text-lg transition-all
                      ${pathname === '/insurance' || pathname.startsWith('/insurance/')
                            ? 'bg-blue-50 text-blue-900 font-bold'
                            : 'text-gray-600 font-medium hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <Shield className={`h-6 w-6 ${pathname === '/insurance' || pathname.startsWith('/insurance/') ? 'text-blue-600' : 'text-gray-400'}`} />
                          Insurance
                        </div>
                        <ChevronDown className={`h-5 w-5 transition-transform ${showMobileInsuranceDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {showMobileInsuranceDropdown && (
                        <div className="ml-8 mt-2 space-y-2">
                          <Link href="/insurance/health-insurance" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-rose-50 transition-colors">
                            <Image src="/card-logo/HealthInsurance.png" alt="Health Insurance" width={20} height={20} className="object-contain" />
                            Health Insurance
                          </Link>
                          <Link href="/insurance/term-life-insurance" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-blue-50 transition-colors">
                            <Image src="/card-logo/terminsurance.png" alt="Term Life" width={20} height={20} className="object-contain" />
                            Term Life
                          </Link>
                          <Link href="/insurance/car-insurance" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-green-50 transition-colors">
                            <Image src="/card-logo/CarInsurance.png" alt="Car Insurance" width={20} height={20} className="object-contain" />
                            Car Insurance
                          </Link>
                          <Link href="/insurance/bike-insurance" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-orange-50 transition-colors">
                            <Image src="/card-logo/BikeInsurance.png" alt="Bike Insurance" width={20} height={20} className="object-contain" />
                            Bike Insurance
                          </Link>
                          <Link href="/insurance/loan-protector" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-purple-50 transition-colors">
                            <Image src="/card-logo/LoanProtector.png" alt="Loan Protector" width={20} height={20} className="object-contain" />
                            Loan Protector
                          </Link>
                          <Link href="/insurance/emi-protector" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-indigo-50 transition-colors">
                            <Image src="/card-logo/EMI Protector.png" alt="EMI Protector" width={20} height={20} className="object-contain" />
                            EMI Protector
                          </Link>
                        </div>
                      )}
                    </div>

                    <Link
                      href="/calculator"
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl text-lg transition-all
                    ${pathname === '/calculator'
                          ? 'bg-blue-50 text-blue-900 font-bold'
                          : 'text-gray-600 font-medium hover:bg-gray-50'}`}
                    >
                      <Calculator className={`h-6 w-6 ${pathname === '/calculator' ? 'text-blue-600' : 'text-gray-400'}`} />
                      Calculator
                    </Link>

                    <Link
                      href={pathname === '/' ? '#articles' : '/#articles'}
                      className="flex items-center gap-4 px-4 py-4 rounded-xl text-lg transition-all text-gray-600 font-medium hover:bg-gray-50"
                      onClick={(e) => {
                        if (pathname === '/') {
                          e.preventDefault();
                          document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      <FileText className="h-6 w-6 text-gray-400" />
                      Articles
                    </Link>

                    <Link
                      href="/contact"
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl text-lg transition-all
                    ${pathname === '/contact'
                          ? 'bg-blue-50 text-blue-900 font-bold'
                          : 'text-gray-600 font-medium hover:bg-gray-50'}`}
                    >
                      <Phone className={`h-6 w-6 ${pathname === '/contact' ? 'text-blue-600' : 'text-gray-400'}`} />
                      Contact Us
                    </Link>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/consultancy"
                    className="flex items-center justify-center gap-2 w-full bg-orange-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-md"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Get Free Consultancy
                  </Link>
                </div>

                {/* Footer Section */}
                <div className="mt-auto p-6 border-t border-gray-100 bg-gray-50/50">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">
                      &copy; {new Date().getFullYear()} Loan Sarathi. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </nav >
    </>
  );
};

export default Navbar;
