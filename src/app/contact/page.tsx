'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    companyName: '',
    loanType: 'Personal Loan'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const loanTypes = [
    'Personal Loan',
    'Business Loan',
    'Home Loan',
    'Property Loan',
    'Education Loan'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header Banner */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80)',
            filter: 'blur(3px) brightness(0.7)'
          }}
        />
        <div className="absolute inset-0 bg-blue-900/40" />
        <div className="relative h-full flex items-center justify-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
            Contact Us
          </h1>
        </div>
      </div>

      {/* Request Call Back Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-3">
            Request a call back now
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Embark on your journey towards financial empowerment today! Contact us at 95888 33303 to schedule a consultation or learn more about our services.
          </p>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Phone */}
            <div className="bg-white rounded-lg p-6 shadow-md flex items-start gap-4">
              <div className="bg-blue-600 rounded-full p-3 shrink-0">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+91 9588833303</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-lg p-6 shadow-md flex items-start gap-4">
              <div className="bg-blue-600 rounded-full p-3 shrink-0">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">sales@smartsolutionsmumbai.com</p>
                <p className="text-gray-600">sales@ssolutions.com</p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-gray-100 rounded-lg p-6 shadow-md flex items-start gap-4">
              <div className="bg-blue-600 rounded-full p-3 shrink-0">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Working Hours</h3>
                <p className="text-gray-600">Mon - Sat 10:00 AM – 6:30 PM</p>
              </div>
            </div>
          </div>

          {/* Branch Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vasai Branch */}
            <div className="bg-white rounded-lg p-6 shadow-md flex items-start gap-4">
              <div className="bg-blue-600 rounded-full p-3 shrink-0">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 uppercase">Vasai Branch</h3>
                <p className="text-gray-600">
                  B-101, Lawrence Trade Center Vasai West Pincode 401202
                </p>
              </div>
            </div>

            {/* Dadar Branch */}
            <div className="bg-white rounded-lg p-6 shadow-md flex items-start gap-4">
              <div className="bg-blue-600 rounded-full p-3 shrink-0">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 uppercase">Dadar Branch</h3>
                <p className="text-gray-600">
                  Office No. 236/238/240 Hind Rajasthan Building 2nd floor Near Kailas Lassi, Dadar East Mumbai 400014
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form and Map Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder="Your contact number"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="companyName"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Loan Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {loanTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Submit
                </button>
              </form>
            </div>

            {/* Google Maps */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Us</h2>
              <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.1234567890123!2d72.82345678901234!3d19.456789012345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDI3JzI0LjQiTiA3MsKwNDknMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Lawrence Trade Center</h3>
                <p className="text-sm text-gray-600 mb-2">
                  9RHH+J7H, Panchal Nagar, Anand Nagar, Vasai West, Navghar-Manikpur, Vasai-Virar, Maharashtra 401202
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-yellow-500">★★★★☆</span>
                  <span>3.5</span>
                  <span className="text-gray-400">•</span>
                  <span>59 reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

