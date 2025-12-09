'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';

interface ApplicationData {
  applicationId: string;
  type: 'loan' | 'insurance';
  status: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  statusHistory: Array<{
    status: string;
    date: string;
    notes?: string;
  }>;
  applicantName?: string;
  loanType?: string;
  loanAmount?: number;
  tenure?: number;
  insuranceType?: string;
  sumInsured?: number;
  email?: string;
  phone?: string;
  nextSteps?: string;
}

export default function TrackStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchId, setSearchId] = useState('');
  const [searchType, setSearchType] = useState<'referenceId' | 'mobile'>('referenceId');
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [error, setError] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/track-status');
    }
  }, [status, router]);

  // Auto-search if reference ID provided in URL
  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam && session) {
      setSearchId(idParam);
      setSearchType('referenceId');
      handleSearch(null, idParam, 'referenceId');
    }
  }, [searchParams, session]);

  const handleSearch = async (e: React.FormEvent | null, id?: string, type?: 'referenceId' | 'mobile') => {
    if (e) e.preventDefault();
    
    const searchValue = id || searchId;
    const searchMode = type || searchType;
    
    if (!searchValue.trim()) {
      setError('Please enter a reference ID or mobile number');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setApplicationData(null);
    
    try {
      const queryParam = searchMode === 'referenceId' 
        ? `referenceId=${encodeURIComponent(searchValue)}`
        : `mobile=${encodeURIComponent(searchValue)}`;
      
      const response = await fetch(`/api/track?${queryParam}`);
      const result = await response.json();
      
      if (result.success) {
        setApplicationData(result.application);
      } else {
        setError(result.error || 'Application not found');
      }
    } catch (err) {
      console.error('Error tracking application:', err);
      setError('Failed to fetch application status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      reviewing: 'text-blue-600 bg-blue-50 border-blue-200',
      'in-review': 'text-blue-600 bg-blue-50 border-blue-200',
      verified: 'text-purple-600 bg-purple-50 border-purple-200',
      approved: 'text-green-600 bg-green-50 border-green-200',
      'quote-sent': 'text-indigo-600 bg-indigo-50 border-indigo-200',
      rejected: 'text-red-600 bg-red-50 border-red-200',
      disbursed: 'text-green-600 bg-green-50 border-green-200',
      purchased: 'text-green-600 bg-green-50 border-green-200',
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Track Application</h1>
          <p className="mt-2 text-gray-600">Enter your Reference ID or Mobile Number to check status</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSearchType('referenceId')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchType === 'referenceId'
                  ? 'bg-blue-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Reference ID
            </button>
            <button
              onClick={() => setSearchType('mobile')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchType === 'mobile'
                  ? 'bg-blue-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Mobile Number
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder={
                searchType === 'referenceId'
                  ? 'Enter Reference ID (e.g., LOAN-2025-00001)'
                  : 'Enter 10-digit Mobile Number'
              }
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-900 text-white px-6 md:px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              {isLoading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="mt-6 border rounded-lg p-6 bg-red-50 border-red-100 flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900">Not Found</h3>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            </div>
          )}
        </div>

        {applicationData && (
          <div className="space-y-6">
            {/* Application Header */}
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900">
                    Application {applicationData.applicationId}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Applied on {new Date(applicationData.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  {applicationData.applicantName && (
                    <p className="text-sm text-gray-600 mt-1">
                      Applicant: <span className="font-medium">{applicationData.applicantName}</span>
                    </p>
                  )}
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase border ${getStatusColor(applicationData.status)}`}>
                  {applicationData.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Application Progress</span>
                  <span className="text-blue-600">{applicationData.progress}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${applicationData.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Application Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                {applicationData.type === 'loan' ? (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Loan Type</p>
                      <p className="font-bold text-gray-900 capitalize">{applicationData.loanType} Loan</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Loan Amount</p>
                      <p className="font-bold text-gray-900">₹{applicationData.loanAmount?.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Tenure</p>
                      <p className="font-bold text-gray-900">{applicationData.tenure} Years</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Insurance Type</p>
                      <p className="font-bold text-gray-900 capitalize">{applicationData.insuranceType?.replace('-', ' ')}</p>
                    </div>
                    {applicationData.sumInsured && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium mb-1">Sum Insured</p>
                        <p className="font-bold text-gray-900">₹{applicationData.sumInsured?.toLocaleString('en-IN')}</p>
                      </div>
                    )}
                  </>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Contact</p>
                  <p className="font-bold text-gray-900">{applicationData.phone}</p>
                </div>
              </div>

              {/* Next Steps */}
              {applicationData.nextSteps && (
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">What's Next?</h4>
                      <p className="text-sm text-gray-700">{applicationData.nextSteps}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status History */}
            {applicationData.statusHistory && applicationData.statusHistory.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <h3 className="font-bold text-xl text-gray-900 mb-6">Application Timeline</h3>
                <div className="space-y-4">
                  {applicationData.statusHistory.map((entry, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        {index < applicationData.statusHistory.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-900 capitalize">{entry.status.replace('-', ' ')}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-gray-600">{entry.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

