'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, ChevronLeft, ShieldCheck, X, Heart, Shield, Car, Bike, Calendar, User, Phone, IndianRupee, MapPin, Hash } from 'lucide-react';

interface InsuranceApplicationFormProps {
  insuranceType?: string;
}

const InsuranceApplicationForm = ({ insuranceType = 'health' }: InsuranceApplicationFormProps) => {
  const router = useRouter();
  
  const isHealthInsurance = insuranceType === 'health';
  const isTermLife = insuranceType === 'term-life';
  const isCarInsurance = insuranceType === 'car';
  const isBikeInsurance = insuranceType === 'bike';
  
  // Get form title and icon
  const getFormDetails = () => {
    if (isHealthInsurance) return { title: 'Health Insurance', icon: <Heart className="w-6 h-6 text-rose-600" />, color: 'rose' };
    if (isTermLife) return { title: 'Term Life Insurance', icon: <Shield className="w-6 h-6 text-blue-600" />, color: 'blue' };
    if (isCarInsurance) return { title: 'Car Insurance', icon: <Car className="w-6 h-6 text-green-600" />, color: 'green' };
    if (isBikeInsurance) return { title: 'Bike Insurance', icon: <Bike className="w-6 h-6 text-orange-600" />, color: 'orange' };
    return { title: 'Insurance Application', icon: <Shield className="w-6 h-6 text-blue-600" />, color: 'blue' };
  };

  const formDetails = getFormDetails();

  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { id: 1, title: 'Basic Details' },
    { id: 2, title: 'Review & Submit' },
  ];

  const [formData, setFormData] = useState({
    // Common Fields
    fullName: '',
    mobileNumber: '',
    dob: '',
    // Health & Term Life specific
    sumInsured: '',
    // Car & Bike specific
    pincode: '',
    vehicleNumber: '',
    policyTerm: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleClose = () => {
    router.push('/');
  };

  const handleSubmit = () => {
    // Handle form submission
    alert('Application submitted successfully! We will contact you shortly.');
    router.push('/');
  };

  const showBasicDetails = currentStep === 1;
  const showReview = currentStep === 2;

  return (
    <div className="bg-white w-full rounded-t-[2rem] md:rounded-3xl shadow-2xl overflow-hidden h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-10 duration-500">
      {/* Close Button */}
      <button 
        onClick={handleClose}
        className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-800 transition-colors z-20"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header Section */}
      <div className={`border-b border-gray-200 px-4 py-6 md:px-8 ${
        formDetails.color === 'rose' ? 'bg-rose-50' :
        formDetails.color === 'blue' ? 'bg-blue-50' :
        formDetails.color === 'green' ? 'bg-green-50' :
        'bg-orange-50'
      }`}>
        <div className="max-w-4xl mx-auto text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              formDetails.color === 'rose' ? 'bg-rose-100' :
              formDetails.color === 'blue' ? 'bg-blue-100' :
              formDetails.color === 'green' ? 'bg-green-100' :
              'bg-orange-100'
            }`}>
              {formDetails.icon}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {formDetails.title} Application
            </h1>
          </div>
          <p className="text-gray-500 text-sm">Fill in your details to get the best quotes</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center relative z-10 w-1/2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-sm
                  ${step.id <= currentStep 
                    ? `${formDetails.color === 'rose' ? 'bg-rose-600' : 
                        formDetails.color === 'blue' ? 'bg-blue-600' : 
                        formDetails.color === 'green' ? 'bg-green-600' : 
                        'bg-orange-600'} text-white scale-110 ring-2 ring-white` 
                    : 'bg-white border-2 border-gray-200 text-gray-400'}`}
              >
                {step.id < currentStep ? <Check className="h-5 w-5" /> : step.id}
              </div>
              <span className={`text-[10px] md:text-xs mt-2 font-semibold text-center tracking-wide uppercase w-full
                ${step.id <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.title}
              </span>
            </div>
          ))}
          {/* Progress Line */}
          <div className="absolute top-5 left-1/4 w-1/2 h-0.5 bg-gray-200 -z-0">
            <div 
              className={`h-full transition-all duration-500 ${
                formDetails.color === 'rose' ? 'bg-rose-600' :
                formDetails.color === 'blue' ? 'bg-blue-600' :
                formDetails.color === 'green' ? 'bg-green-600' :
                'bg-orange-600'
              }`}
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-white">
        
        {/* Step 1: Basic Details */}
        {showBasicDetails && (
          <div className="space-y-6 max-w-2xl mx-auto pb-20">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-2xl font-bold text-gray-900">Basic Details</h3>
              <p className="text-gray-500 text-sm mt-1">
                {(isHealthInsurance || isTermLife) 
                  ? 'Enter your personal information for insurance' 
                  : 'Enter your details and vehicle information'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <User className="w-4 h-4 inline mr-2 text-gray-400" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                  placeholder="Enter your full name" 
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <Phone className="w-4 h-4 inline mr-2 text-gray-400" />
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                  placeholder="10-digit mobile number" 
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <Calendar className="w-4 h-4 inline mr-2 text-gray-400" />
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium" 
                />
              </div>

              {/* Sum Insured - For Health & Term Life */}
              {(isHealthInsurance || isTermLife) && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <IndianRupee className="w-4 h-4 inline mr-2 text-gray-400" />
                    Sum Insured <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="sumInsured"
                    value={formData.sumInsured}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                  >
                    <option value="">Select sum insured</option>
                    {isHealthInsurance ? (
                      <>
                        <option value="500000">₹5 Lakh</option>
                        <option value="1000000">₹10 Lakh</option>
                        <option value="2500000">₹25 Lakh</option>
                        <option value="5000000">₹50 Lakh</option>
                        <option value="10000000">₹1 Crore</option>
                      </>
                    ) : (
                      <>
                        <option value="5000000">₹50 Lakh</option>
                        <option value="10000000">₹1 Crore</option>
                        <option value="20000000">₹2 Crore</option>
                        <option value="50000000">₹5 Crore</option>
                        <option value="100000000">₹10 Crore</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              {/* Pincode - For Car & Bike */}
              {(isCarInsurance || isBikeInsurance) && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <MapPin className="w-4 h-4 inline mr-2 text-gray-400" />
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    maxLength={6}
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="Enter 6-digit pincode" 
                  />
                </div>
              )}

              {/* Vehicle Number - For Car & Bike */}
              {(isCarInsurance || isBikeInsurance) && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <Hash className="w-4 h-4 inline mr-2 text-gray-400" />
                    Vehicle Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium uppercase" 
                    placeholder="E.g., MH12AB1234" 
                  />
                </div>
              )}

              {/* Policy Term - For Car & Bike */}
              {(isCarInsurance || isBikeInsurance) && (
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <Calendar className="w-4 h-4 inline mr-2 text-gray-400" />
                    Policy Term <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="policyTerm"
                    value={formData.policyTerm}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                  >
                    <option value="">Select policy term</option>
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                  </select>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className={`rounded-xl p-4 text-sm font-medium ${
              formDetails.color === 'rose' ? 'bg-rose-50 border border-rose-100 text-rose-800' :
              formDetails.color === 'blue' ? 'bg-blue-50 border border-blue-100 text-blue-800' :
              formDetails.color === 'green' ? 'bg-green-50 border border-green-100 text-green-800' :
              'bg-orange-50 border border-orange-100 text-orange-800'
            }`}>
              {(isHealthInsurance || isTermLife) 
                ? '* Your information is secure. We will use it to provide personalized quotes.'
                : '* Vehicle registration details help us provide accurate premium quotes.'}
            </div>
          </div>
        )}

        {/* Step 2: Review & Submit */}
        {showReview && (
          <div className="space-y-6 max-w-2xl mx-auto pb-20">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto animate-bounce mb-4 ${
                formDetails.color === 'rose' ? 'bg-rose-100' :
                formDetails.color === 'blue' ? 'bg-blue-100' :
                formDetails.color === 'green' ? 'bg-green-100' :
                'bg-orange-100'
              }`}>
                <ShieldCheck className={`h-10 w-10 ${
                  formDetails.color === 'rose' ? 'text-rose-600' :
                  formDetails.color === 'blue' ? 'text-blue-600' :
                  formDetails.color === 'green' ? 'text-green-600' :
                  'text-orange-600'
                }`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Review Your Details</h3>
              <p className="text-gray-500">Please verify your information before submission</p>
            </div>

            {/* Review Card */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className={`px-6 py-3 border-b border-gray-200 flex justify-between items-center ${
                formDetails.color === 'rose' ? 'bg-rose-50' :
                formDetails.color === 'blue' ? 'bg-blue-50' :
                formDetails.color === 'green' ? 'bg-green-50' :
                'bg-orange-50'
              }`}>
                <h4 className="font-bold text-gray-900">{formDetails.title} Details</h4>
                <button onClick={() => setCurrentStep(1)} className={`text-sm font-medium hover:underline ${
                  formDetails.color === 'rose' ? 'text-rose-600' :
                  formDetails.color === 'blue' ? 'text-blue-600' :
                  formDetails.color === 'green' ? 'text-green-600' :
                  'text-orange-600'
                }`}>Edit</button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <ReviewField label="Full Name" value={formData.fullName} />
                <ReviewField label="Mobile Number" value={formData.mobileNumber} />
                <ReviewField label="Date of Birth" value={formData.dob} />
                
                {(isHealthInsurance || isTermLife) && (
                  <ReviewField 
                    label="Sum Insured" 
                    value={formData.sumInsured ? `₹${parseInt(formData.sumInsured).toLocaleString('en-IN')}` : '-'} 
                  />
                )}
                
                {(isCarInsurance || isBikeInsurance) && (
                  <>
                    <ReviewField label="Pincode" value={formData.pincode} />
                    <ReviewField label="Vehicle Number" value={formData.vehicleNumber} />
                    <ReviewField label="Policy Term" value={formData.policyTerm ? `${formData.policyTerm} Year(s)` : '-'} />
                  </>
                )}
              </div>
            </div>

            {/* Terms Notice */}
            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to our Terms & Conditions and Privacy Policy. 
              Insurance is subject to verification and approval.
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions - Sticky Bottom */}
      <div className="border-t border-gray-100 bg-white p-3 md:p-4 z-20">
        <div className="flex justify-between max-w-2xl mx-auto">
          <button 
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-2.5 rounded-lg font-bold transition-all text-sm
              ${currentStep === 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:text-blue-900 hover:bg-gray-100'}`}
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" />
            Back
          </button>

          <button 
            onClick={currentStep === steps.length ? handleSubmit : handleNext}
            className={`flex items-center text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 ${
              formDetails.color === 'rose' ? 'bg-rose-600 hover:bg-rose-700' :
              formDetails.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
              formDetails.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
              'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {currentStep === steps.length ? 'Submit Application' : 'Review Details'}
            {currentStep !== steps.length && <ChevronRight className="h-4 w-4 ml-1.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewField = ({ label, value }: { label: string, value: string }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{label}</p>
    <p className="text-base font-semibold text-gray-900">{value || '-'}</p>
  </div>
);

export default InsuranceApplicationForm;

