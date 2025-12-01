'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, User, LogOut } from 'lucide-react';
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

  const isActive = (path: string) => {
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
        <div className="px-3 py-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold text-sm">
              {session.user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="font-medium text-gray-900">{session.user?.name}</span>
          </div>
          <button 
            onClick={() => signOut()}
            className="text-orange-600 font-medium text-sm px-3 py-1 bg-orange-50 rounded-md"
          >
            Logout
          </button>
        </div>
      );
    }

    return (
      <Link 
        href="/login" 
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-700"
      >
        <img 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google" 
          className="w-5 h-5" 
        />
        <span className="font-medium">Login with Google</span>
      </Link>
    );
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Left: Logo */}
          <div className="shrink-0 flex items-center cursor-pointer">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Loan Sarathi Logo" className="h-40 w-auto object-contain" />
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center justify-center space-x-8 flex-1 px-8">
            <Link href="/about" className={`${isActive('/about')} whitespace-nowrap transition-colors`}>About Us</Link>
            <Link href="/calculator" className={`${isActive('/calculator')} whitespace-nowrap transition-colors`}>Calculators</Link>
            <Link href="/track-status" className={`${isActive('/track-status')} whitespace-nowrap transition-colors`}>Track Status</Link>
            <Link href="/check-eligibility" className="bg-orange-600 text-white px-5 py-2 rounded-full font-medium hover:bg-orange-700 transition-colors shadow-sm whitespace-nowrap text-sm">
              Check Eligibility
            </Link>
          </div>

          {/* Right: Login / Profile */}
          <div className="hidden md:flex items-center justify-end shrink-0 min-w-[120px]">
            {renderAuthSection()}
          </div> 

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-orange-600 focus:outline-none p-2"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link href="/about" className={`block px-3 py-2.5 rounded-lg text-base ${pathname === '/about' ? 'text-blue-600 font-bold bg-blue-50' : 'font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}>About Us</Link>
            <Link href="/calculator" className={`block px-3 py-2.5 rounded-lg text-base ${pathname === '/calculator' ? 'text-blue-600 font-bold bg-blue-50' : 'font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}>Calculators</Link>
            <Link href="/track-status" className={`block px-3 py-2.5 rounded-lg text-base ${pathname === '/track-status' ? 'text-blue-600 font-bold bg-blue-50' : 'font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}>Track Status</Link>
            <Link href="/check-eligibility" className="block px-3 py-2.5 rounded-lg text-base font-medium text-white bg-orange-600 hover:bg-orange-700">Check Eligibility</Link>
            
            <div className="border-t border-gray-100 my-2 pt-2">
              {renderMobileAuthSection()}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
