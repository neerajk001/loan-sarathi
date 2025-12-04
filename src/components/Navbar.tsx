'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, User, LogOut, Info, Calculator, Activity, CheckCircle, Home, Shield, FileText, Phone, Wallet } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Only render session-dependent content after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

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
      return pathname === '/loan' || pathname.startsWith('/loan/') ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-orange-600 font-medium';
    }
    if (path === '/insurance') {
      return pathname === '/insurance' || pathname.startsWith('/insurance/') ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-orange-600 font-medium';
    }
    return pathname === path ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-orange-600 font-medium';
  };

  // Render login button placeholder during SSR to match client initial render
  const renderAuthSection = () => {
    if (!mounted) {
      // Return a placeholder that matches the login button size to prevent layout shift
      return (
        <div className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full w-[100px] h-[36px] bg-gray-50"></div>
      );
    }

    if (session) {
      return (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 font-bold border border-blue-100">
              {session.user?.name?.[0]?.toUpperCase() || <User className="h-5 w-5" />}
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="text-gray-400 hover:text-orange-600 transition-colors p-2 rounded-full hover:bg-orange-50"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      );
    }

    return (
      <Link 
        href="/login" 
        className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full hover:bg-orange-50 hover:border-orange-200 transition-colors group"
      >
        <img 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google" 
          className="w-5 h-5" 
        />
        <span className="text-gray-700 font-medium text-sm group-hover:text-orange-700">Login</span>
      </Link>
    );
  };

  const renderMobileAuthSection = () => {
    if (!mounted) {
      return (
        <div className="px-3 py-2.5 rounded-lg bg-gray-50 h-[44px]"></div>
      );
    }

    if (session) {
      return (
        <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold text-base border border-blue-200">
              {session.user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{session.user?.name}</p>
              <p className="text-xs text-gray-500">{session.user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      );
    }

    return (
      <Link 
        href="/login" 
        className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-all"
      >
        <img 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google" 
          className="w-5 h-5" 
        />
        <span className="font-semibold text-gray-700">Login with Google</span>
      </Link>
    );
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Left: Logo */}
          <div className="shrink-0 flex items-center cursor-pointer z-50 relative">
            <Link href="/" className="flex items-center">
              <img src="/logo.jpeg" alt="Loan Sarathi Logo" className="h-12 w-auto object-contain" />
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center justify-center space-x-6 flex-1 px-4">
            <Link href="/" className={`${isActive('/')} whitespace-nowrap transition-colors`}>Home</Link>
            <Link href="/about" className={`${isActive('/about')} whitespace-nowrap transition-colors`}>About Us</Link>
            <Link href="/loan" className={`${isActive('/loan')} whitespace-nowrap transition-colors`}>Loans</Link>
            <Link href="/insurance" className={`${isActive('/insurance')} whitespace-nowrap transition-colors`}>Insurance</Link>
            <Link href="/calculator" className={`${isActive('/calculator')} whitespace-nowrap transition-colors`}>Calculator</Link>
            <Link 
              href={pathname === '/' ? '#articles' : '/#articles'} 
              className="text-gray-600 hover:text-orange-600 font-medium whitespace-nowrap transition-colors"
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
              href={pathname === '/' ? '#contact-us' : '/#contact-us'} 
              className="text-gray-600 hover:text-orange-600 font-medium whitespace-nowrap transition-colors"
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  document.getElementById('contact-us')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Contact Us
            </Link>
            <Link href="/consultancy" className="bg-orange-600 text-white px-5 py-2 rounded-full font-medium hover:bg-orange-700 transition-colors shadow-sm whitespace-nowrap text-sm">
              Get Free Consultancy
            </Link>
          </div>

          {/* Right: Login / Profile */}
          <div className="hidden md:flex items-center justify-end shrink-0 min-w-[120px]">
            {renderAuthSection()}
          </div> 

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

      {/* Mobile Menu Overlay */}
      {isOpen && (
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

                <Link 
                  href="/loan" 
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl text-lg transition-all
                    ${pathname === '/loan' || pathname.startsWith('/loan/')
                      ? 'bg-blue-50 text-blue-900 font-bold' 
                      : 'text-gray-600 font-medium hover:bg-gray-50'}`}
                >
                  <Wallet className={`h-6 w-6 ${pathname === '/loan' || pathname.startsWith('/loan/') ? 'text-blue-600' : 'text-gray-400'}`} />
                  Loans
                </Link>

                <Link 
                  href="/insurance" 
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl text-lg transition-all
                    ${pathname === '/insurance' || pathname.startsWith('/insurance/')
                      ? 'bg-blue-50 text-blue-900 font-bold' 
                      : 'text-gray-600 font-medium hover:bg-gray-50'}`}
                >
                  <Shield className={`h-6 w-6 ${pathname === '/insurance' || pathname.startsWith('/insurance/') ? 'text-blue-600' : 'text-gray-400'}`} />
                  Insurance
                </Link>

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
                  href={pathname === '/' ? '#contact-us' : '/#contact-us'} 
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-lg transition-all text-gray-600 font-medium hover:bg-gray-50"
                  onClick={(e) => {
                    if (pathname === '/') {
                      e.preventDefault();
                      document.getElementById('contact-us')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <Phone className="h-6 w-6 text-gray-400" />
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
              {renderMobileAuthSection()}
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  &copy; {new Date().getFullYear()} Loan Sarathi. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
