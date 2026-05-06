'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, IndianRupee } from 'lucide-react';

interface ApplicationFormProps {
  loanType?: string;
}

const ApplicationForm = ({ loanType = 'personal' }: ApplicationFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    employmentType: 'salaried',
    monthlyIncome: '',
    loanAmount: '',
    pincode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isValid = () => {
    return !!(
      formData.fullName.trim() &&
      formData.mobileNumber.trim() && formData.mobileNumber.length === 10 &&
      (formData.employmentType === 'salaried' || formData.employmentType === 'self-employed') &&
      formData.monthlyIncome.trim() && !isNaN(parseFloat(formData.monthlyIncome)) &&
      formData.loanAmount.trim() && !isNaN(parseFloat(formData.loanAmount)) &&
      formData.pincode.trim() && formData.pincode.length === 6
    );
  };

  const prepareApplicationData = () => ({
    loanType,
    personalInfo: {
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      pincode: formData.pincode
    },
    employmentInfo: {
      employmentType: formData.employmentType,
      monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
      annualIncome: (parseFloat(formData.monthlyIncome) || 0) * 12
    },
    loanRequirement: {
      loanAmount: parseFloat(formData.loanAmount) || 0
    }
  });

  const handleSubmit = async () => {
    if (!isValid() || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/applications/loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prepareApplicationData())
      });

      const result = await response.json();
      if (result.success) {
        setApplicationId(result.applicationId || 'N/A');
        setShowSuccessPopup(true);
        setTimeout(() => router.push('/'), 3500);
      } else {
        setSubmitError(result.error || 'Failed to submit application');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => router.push('/');

  return (
    <>
      <div className="bg-white w-full rounded-t-[2rem] md:rounded-3xl shadow-2xl overflow-hidden h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-10 duration-500">
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-800 transition-colors z-20">
          <X className="w-5 h-5" />
        </button>

        <div className="bg-gray-50 border-b border-gray-200 px-4 py-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center mb-2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Loan Application</h1>
            <p className="text-sm text-gray-500 mt-1">Provide the 5 required fields to apply</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Customer name <span className="text-red-500">*</span></label>
              <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" placeholder="Full name" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Mobile no <span className="text-red-500">*</span></label>
              <input name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} maxLength={10} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" placeholder="10-digit mobile" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Salaries / Self employed <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.employmentType === 'salaried' ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 bg-gray-50/50 hover:bg-white'}`}>
                  <input type="radio" name="employmentType" value="salaried" checked={formData.employmentType === 'salaried'} onChange={handleInputChange} className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" /> <span className="ml-3 font-medium text-gray-900">Salaried</span>
                </label>
                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.employmentType === 'self-employed' ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 bg-gray-50/50 hover:bg-white'}`}>
                  <input type="radio" name="employmentType" value="self-employed" checked={formData.employmentType === 'self-employed'} onChange={handleInputChange} className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" /> <span className="ml-3 font-medium text-gray-900">Self-employed</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Monthly income <span className="text-red-500">*</span></label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleInputChange} className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" placeholder="Monthly income" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Loan amount <span className="text-red-500">*</span></label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleInputChange} className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" placeholder="Required loan amount" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Pincode <span className="text-red-500">*</span></label>
              <input name="pincode" value={formData.pincode} onChange={handleInputChange} maxLength={6} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" placeholder="6-digit pincode" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-white p-4 z-20">
          {submitError && <div className="max-w-4xl mx-auto mb-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{submitError}</div>}
          <div className="max-w-3xl mx-auto flex justify-end">
            <button onClick={handleSubmit} disabled={!isValid() || isSubmitting} className={`flex items-center justify-center bg-blue-900 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all ${(!isValid() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0'}`}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-in zoom-in-95 duration-300 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4 w-full">
              <p className="text-sm text-gray-600 mb-1">Your Reference ID:</p>
              <p className="text-lg font-bold text-blue-600">{applicationId}</p>
            </div>
            <p className="text-gray-600 mb-6">Our team will contact you shortly with updates.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationForm;
