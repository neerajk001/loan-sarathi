'use client';
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Mail, 
  Bell, 
  Shield, 
  Database,
  Save,
  CheckCircle,
  Loader2,
  Globe,
  UserCog,
  DollarSign,
  Edit2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface SettingsData {
  emailNotifications: {
    newApplication: boolean;
    newConsultancy: boolean;
    statusUpdate: boolean;
  };
  adminEmails: string[];
  systemSettings: {
    maintenanceMode: boolean;
    allowPublicApplications: boolean;
  };
}

interface LoanProduct {
  slug: string;
  title: string;
  maxAmount: string;
  interestRate: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    emailNotifications: {
      newApplication: true,
      newConsultancy: true,
      statusUpdate: true,
    },
    adminEmails: ['workwithneeraj.01@gmail.com', 'shashichanyal@gmail.com'],
    systemSettings: {
      maintenanceMode: false,
      allowPublicApplications: true,
    },
  });
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editMaxAmount, setEditMaxAmount] = useState('');
  const [editInterestRate, setEditInterestRate] = useState('');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchLoanProducts();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdminEmail = () => {
    if (newAdminEmail && !settings.adminEmails.includes(newAdminEmail)) {
      setSettings({
        ...settings,
        adminEmails: [...settings.adminEmails, newAdminEmail],
      });
      setNewAdminEmail('');
    }
  };

  const handleRemoveAdminEmail = (email: string) => {
    setSettings({
      ...settings,
      adminEmails: settings.adminEmails.filter(e => e !== email),
    });
  };

  const fetchLoanProducts = async () => {
    try {
      const response = await fetch('/api/loan-products');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.products) {
          setLoanProducts(data.products);
        }
      }
    } catch (error) {
      console.error('Error fetching loan products:', error);
    }
  };

  const handleEditProduct = (product: LoanProduct) => {
    setEditingProduct(product.slug);
    setEditMaxAmount(product.maxAmount);
    setEditInterestRate(product.interestRate);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditMaxAmount('');
    setEditInterestRate('');
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess(false);
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const response = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(false), 5000);
      } else {
        setPasswordError(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveProduct = async (slug: string) => {
    try {
      const response = await fetch('/api/loan-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          maxAmount: editMaxAmount,
          interestRate: editInterestRate,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setLoanProducts(prev => prev.map(p => 
          p.slug === slug 
            ? { ...p, maxAmount: editMaxAmount, interestRate: editInterestRate }
            : p
        ));
        handleCancelEdit();
        alert('Loan product updated successfully!');
      } else {
        alert(data.error || 'Failed to update loan product');
      }
    } catch (error) {
      console.error('Error saving loan product:', error);
      alert('Failed to update loan product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage system settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Email Notifications */}
      <div className="bg-white border border-gray-900 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Email Notifications</h2>
            <p className="text-sm text-gray-500">Configure email notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-semibold text-gray-900">New Application Notifications</p>
              <p className="text-sm text-gray-500">Receive emails when new loan/insurance applications are submitted</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications.newApplication}
              onChange={(e) => setSettings({
                ...settings,
                emailNotifications: {
                  ...settings.emailNotifications,
                  newApplication: e.target.checked,
                },
              })}
              className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-semibold text-gray-900">New Consultancy Requests</p>
              <p className="text-sm text-gray-500">Receive emails when new consultancy requests are submitted</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications.newConsultancy}
              onChange={(e) => setSettings({
                ...settings,
                emailNotifications: {
                  ...settings.emailNotifications,
                  newConsultancy: e.target.checked,
                },
              })}
              className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-semibold text-gray-900">Status Update Notifications</p>
              <p className="text-sm text-gray-500">Receive emails when application statuses are updated</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications.statusUpdate}
              onChange={(e) => setSettings({
                ...settings,
                emailNotifications: {
                  ...settings.emailNotifications,
                  statusUpdate: e.target.checked,
                },
              })}
              className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
          </label>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-gray-900 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <Lock className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Change Admin Password</h2>
            <p className="text-sm text-gray-500">Update your admin panel login password</p>
          </div>
        </div>

        <div className="space-y-4">
          {passwordError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {passwordError}
            </div>
          )}
          
          {passwordSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Password changed successfully!
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={passwordLoading}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {passwordLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Changing Password...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Change Password
              </>
            )}
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Note: After changing the password, you&apos;ll need to use the new password for future logins.
            The initial password is set in the ADMIN_PASSWORD environment variable.
          </p>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white border border-gray-900 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Settings className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
            <p className="text-sm text-gray-500">Configure system-wide settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-semibold text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Enable maintenance mode to temporarily disable the system</p>
            </div>
            <input
              type="checkbox"
              checked={settings.systemSettings.maintenanceMode}
              onChange={(e) => setSettings({
                ...settings,
                systemSettings: {
                  ...settings.systemSettings,
                  maintenanceMode: e.target.checked,
                },
              })}
              className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-semibold text-gray-900">Allow Public Applications</p>
              <p className="text-sm text-gray-500">Allow users to submit applications without login</p>
            </div>
            <input
              type="checkbox"
              checked={settings.systemSettings.allowPublicApplications}
              onChange={(e) => setSettings({
                ...settings,
                systemSettings: {
                  ...settings.systemSettings,
                  allowPublicApplications: e.target.checked,
                },
              })}
              className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
          </label>
        </div>
      </div>

      {/* Loan Products Management */}
      <div className="bg-white border border-gray-900 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Loan Products</h2>
            <p className="text-sm text-gray-500">Manage loan amounts and interest rates for product cards and detail pages</p>
          </div>
        </div>

        <div className="space-y-4">
          {loanProducts.map((product) => (
            <div
              key={product.slug}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">{product.title}</h3>
                {editingProduct === product.slug ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveProduct(product.slug)}
                      className="px-4 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {editingProduct === product.slug ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Amount <span className="text-xs text-gray-500">(shown on card subtitle)</span>
                    </label>
                    <input
                      type="text"
                      value={editMaxAmount}
                      onChange={(e) => setEditMaxAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                      placeholder="e.g., Loans up to ₹50 Lakhs or Up to ₹2 Crores"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interest Rate <span className="text-xs text-gray-500">(shown on card tag as ROI)</span>
                    </label>
                    <input
                      type="text"
                      value={editInterestRate}
                      onChange={(e) => setEditInterestRate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                      placeholder="e.g., Interest rates starting @ 10.49% p.a. (will show as @10.49% ROI on card)"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-32">Max Amount:</span>
                    <span className="text-gray-900 font-medium">{product.maxAmount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-32">Interest Rate:</span>
                    <span className="text-gray-900 font-medium">{product.interestRate}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Database Info */}
      <div className="bg-white border border-gray-900 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Database className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Database Information</h2>
            <p className="text-sm text-gray-500">View database connection and statistics</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-700 font-medium">Database</span>
            <span className="text-gray-900 font-semibold">MongoDB</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-700 font-medium">Database Name</span>
            <span className="text-gray-900 font-semibold">loan-sarathi</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-700 font-medium">Status</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

