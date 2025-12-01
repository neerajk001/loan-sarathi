'use client';
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal
} from 'lucide-react';

export default function ApplicationsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filters = [
    { id: 'all', label: 'All', count: 124 },
    { id: 'pending', label: 'Pending', count: 18 },
    { id: 'reviewing', label: 'In Review', count: 12 },
    { id: 'approved', label: 'Approved', count: 86 },
    { id: 'rejected', label: 'Rejected', count: 8 },
  ];

  const applications = [
    { 
      id: 'APP-2025001', 
      name: 'Rahul Sharma', 
      email: 'rahul.sharma@email.com',
      phone: '+91 98765 43210',
      type: 'Personal Loan', 
      amount: '₹5,00,000', 
      status: 'pending', 
      date: 'Nov 27, 2025',
      documents: { verified: 3, total: 4 }
    },
    { 
      id: 'APP-2025002', 
      name: 'Priya Patel', 
      email: 'priya.p@email.com',
      phone: '+91 87654 32109',
      type: 'Home Loan', 
      amount: '₹45,00,000', 
      status: 'approved', 
      date: 'Nov 27, 2025',
      documents: { verified: 6, total: 6 }
    },
    { 
      id: 'APP-2025003', 
      name: 'Amit Kumar', 
      email: 'amit.k@email.com',
      phone: '+91 76543 21098',
      type: 'Business Loan', 
      amount: '₹12,00,000', 
      status: 'reviewing', 
      date: 'Nov 26, 2025',
      documents: { verified: 4, total: 5 }
    },
    { 
      id: 'APP-2025004', 
      name: 'Sneha Gupta', 
      email: 'sneha.g@email.com',
      phone: '+91 65432 10987',
      type: 'Personal Loan', 
      amount: '₹3,50,000', 
      status: 'pending', 
      date: 'Nov 26, 2025',
      documents: { verified: 2, total: 4 }
    },
    { 
      id: 'APP-2025005', 
      name: 'Vikram Singh', 
      email: 'vikram.s@email.com',
      phone: '+91 54321 09876',
      type: 'Loan Against Property', 
      amount: '₹25,00,000', 
      status: 'approved', 
      date: 'Nov 25, 2025',
      documents: { verified: 5, total: 5 }
    },
    { 
      id: 'APP-2025006', 
      name: 'Neha Verma', 
      email: 'neha.v@email.com',
      phone: '+91 43210 98765',
      type: 'Personal Loan', 
      amount: '₹2,00,000', 
      status: 'rejected', 
      date: 'Nov 24, 2025',
      documents: { verified: 4, total: 4 }
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'reviewing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter !== 'all' && app.status !== filter) return false;
    if (search && !app.name.toLowerCase().includes(search.toLowerCase()) && !app.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-500 mt-1">Manage and review loan applications</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-gray-900 rounded-2xl p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === f.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
                <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs ${
                  filter === f.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & More Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1 lg:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-gray-900 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Loan Details</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documents</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-600">
                        {app.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{app.name}</p>
                        <p className="text-sm text-gray-500">{app.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{app.amount}</p>
                    <p className="text-sm text-gray-500">{app.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{app.email}</p>
                    <p className="text-sm text-gray-500">{app.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[80px]">
                        <div 
                          className={`h-full rounded-full ${app.documents.verified === app.documents.total ? 'bg-green-500' : 'bg-amber-500'}`}
                          style={{ width: `${(app.documents.verified / app.documents.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {app.documents.verified}/{app.documents.total}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusStyle(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-green-100 rounded-lg text-gray-500 hover:text-green-600 transition-colors" title="Approve">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg text-gray-500 hover:text-red-600 transition-colors" title="Reject">
                        <X className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors" title="More">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">1</span> to <span className="font-semibold text-gray-700">{filteredApplications.length}</span> of <span className="font-semibold text-gray-700">124</span> applications
          </p>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold bg-gray-900 text-white">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">3</button>
              <span className="px-2 text-gray-400">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">12</button>
            </div>
            <button className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
