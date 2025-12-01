'use client';
import React from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  IndianRupee,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

const StatCard = ({ title, value, change, changeType, icon: Icon, subtitle }: any) => (
  <div className="bg-white border border-gray-900 rounded-2xl p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
        <Icon className="h-6 w-6 text-gray-700" />
      </div>
      {change && (
        <div className={`flex items-center gap-1 text-sm font-medium ${changeType === 'up' ? 'text-green-600' : 'text-red-500'}`}>
          {changeType === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {change}
        </div>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
    </div>
  </div>
);

export default function AdminDashboard() {
  const recentApplications = [
    { id: 'APP-2025001', name: 'Rahul Sharma', type: 'Personal Loan', amount: '₹5,00,000', status: 'pending', date: 'Today, 2:30 PM' },
    { id: 'APP-2025002', name: 'Priya Patel', type: 'Home Loan', amount: '₹45,00,000', status: 'approved', date: 'Today, 11:15 AM' },
    { id: 'APP-2025003', name: 'Amit Kumar', type: 'Business Loan', amount: '₹12,00,000', status: 'reviewing', date: 'Yesterday' },
    { id: 'APP-2025004', name: 'Sneha Gupta', type: 'Personal Loan', amount: '₹3,50,000', status: 'pending', date: 'Yesterday' },
    { id: 'APP-2025005', name: 'Vikram Singh', type: 'LAP', amount: '₹25,00,000', status: 'approved', date: 'Nov 25, 2025' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'reviewing':
        return 'bg-blue-100 text-blue-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Leads" 
          value="1,284" 
          change="+12.5%" 
          changeType="up"
          icon={Users} 
          subtitle="vs last month"
        />
        <StatCard 
          title="New Applications" 
          value="42" 
          change="+8.2%" 
          changeType="up"
          icon={FileText} 
          subtitle="This week"
        />
        <StatCard 
          title="Approved Loans" 
          value="₹2.4Cr" 
          change="+23.1%" 
          changeType="up"
          icon={CheckCircle} 
          subtitle="This month"
        />
        <StatCard 
          title="Pending Review" 
          value="18" 
          change="-5.4%" 
          changeType="down"
          icon={Clock} 
          subtitle="Requires action"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications - Spans 2 columns */}
        <div className="lg:col-span-2 bg-white border border-gray-900 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
              <p className="text-sm text-gray-500">Latest loan applications received</p>
            </div>
            <Link 
              href="/admin/applications"
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="divide-y divide-gray-50">
            {recentApplications.map((app) => (
              <div key={app.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-600">
                    {app.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{app.name}</p>
                    <p className="text-sm text-gray-500">{app.id} • {app.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{app.amount}</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-gray-900 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                href="/admin/applications"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Review Applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-lg">18</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </div>
              </Link>
              <Link 
                href="/admin/users"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Manage Users</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
              <Link 
                href="/"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">View Website</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-gray-900 border border-gray-900 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold">This Month</h3>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Applications</span>
                  <span className="font-semibold">86 / 100</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '86%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Approvals</span>
                  <span className="font-semibold">62 / 86</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Disbursed</span>
                  <span className="font-semibold">₹2.4Cr</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white border border-gray-900 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-500">Latest actions on the platform</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            { action: 'Application APP-2025002 was approved', time: '2 minutes ago', type: 'success' },
            { action: 'New lead received from website', time: '15 minutes ago', type: 'info' },
            { action: 'Documents verified for Amit Kumar', time: '1 hour ago', type: 'info' },
            { action: 'Application APP-2025001 submitted', time: '2 hours ago', type: 'default' },
            { action: 'User Sneha Gupta registered', time: '3 hours ago', type: 'default' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-2.5 h-2.5 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' : 
                activity.type === 'info' ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{activity.action}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
