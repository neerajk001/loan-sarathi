'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';

export default function TrackStatusPage() {
  const [searchId, setSearchId] = useState('');
  const [status, setStatus] = useState<null | 'found' | 'not_found'>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock logic
    if (searchId === '12345') {
      setStatus('found');
    } else {
      setStatus('not_found');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Track Application</h1>
          <p className="mt-2 text-gray-600">Enter your Reference ID or Mobile Number to check status.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-8">
            <input
              type="text"
              placeholder="Enter Reference ID (e.g., 12345)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              Track
            </button>
          </form>

          {status === 'found' && (
            <div className="border rounded-lg p-6 bg-blue-50 border-blue-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Application #12345 Found</h3>
                  <p className="text-sm text-gray-500">Applied on 26 Nov, 2025</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>Current Status</span>
                    <span className="text-blue-600">Verification In Progress</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Your documents are currently being verified by our team. Next step: Credit Appraisal.
                </p>
              </div>
            </div>
          )}

          {status === 'not_found' && (
            <div className="border rounded-lg p-6 bg-red-50 border-red-100 flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-bold text-gray-900">No Application Found</h3>
                <p className="text-sm text-gray-600">Please check the Reference ID and try again.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

