'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Check email directly if role isn't populated yet
      const isAdmin = session.user.role === 'admin' || session.user.email === 'workwithneeraj.01@gmail.com';
      
      if (isAdmin) {
        router.replace('/admin'); // Use replace to prevent back navigation
      } else {
        router.replace('/');
      }
    }
  }, [status, session, router]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      // Removing callbackUrl to let the client-side useEffect handle the redirect
      // This prevents the server from overriding our custom logic
      await signIn('google', { redirect: false }); 
    } catch (error) {
      console.error("Login failed", error);
      setIsLoggingIn(false);
    }
  };

  if (status === 'loading' || status === 'authenticated') {
     return (
       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
         <Loader2 className="h-10 w-10 animate-spin text-blue-900" />
         <p className="text-gray-500 font-medium">Redirecting...</p>
       </div>
     );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-8 w-8 text-blue-900" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome to Loan Sarathi
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Sign in to manage your loan applications and view offers.
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3.5 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
            >
              {isLoggingIn ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-900" />
              ) : (
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="w-5 h-5" 
                />
              )}
              <span>{isLoggingIn ? 'Connecting...' : 'Continue with Google'}</span>
            </button>
            
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs">Secure Login</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="text-center text-xs text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link href="/apply" className="text-blue-600 font-semibold hover:underline">
                Apply for Loan
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
