/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Send, LogIn, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { ServiceType, UserProfile } from '../types';
import { api } from '../lib/api';

interface InquiryFormProps {
  currentUser: UserProfile | null;
  onNavigate: (path: string) => void;
  onSuccess?: () => void;
  preselectedService?: ServiceType;
}

export default function InquiryForm({ currentUser, onNavigate, onSuccess, preselectedService }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    serviceType: ('Website Development' as ServiceType),
    budgetRange: '',
    projectDescription: ''
  });

  const [budgetOptions, setBudgetOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Prepopulate if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
        companyName: currentUser.companyName || ''
      }));
    }
  }, [currentUser]);

  // Set preselected service if passed
  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, serviceType: preselectedService }));
    }
  }, [preselectedService]);

  // Update budget options depending on selected service type
  useEffect(() => {
    let options: string[] = [];
    switch (formData.serviceType) {
      case 'Website Development':
        options = [
          'NPR 12,000 - 15,000 (Basic/Static Catalog)',
          'NPR 15,000 - 30,000 (Dynamic Business Portal)',
          'NPR 30,000 - 60,000 (Full E-Commerce/CMS)',
          'NPR 60,000 - 100,000+ (High-Performance Enterprise)'
        ];
        break;
      case 'Mobile App Development':
        options = [
          'NPR 20,000 - 50,000 (MVP Utility App)',
          'NPR 50,000 - 150,000 (Interactive Delivery / Core Features)',
          'NPR 150,000 - 300,000 (Custom App with Admin Dashboard)',
          'NPR 300,000 - 500,000+ (Premium Cross-Platform Solution)'
        ];
        break;
      case 'Digital Marketing':
        options = [
          'NPR 5,000 - 10,000/month (Basic Social Plan)',
          'NPR 10,000 - 15,000/month (Standard Paid Campaigns)',
          'NPR 15,000 - 25,000/month (Premium Outreach & Ads)',
          'NPR 25,000 - 50,000+/month (Full Business Growth Suite)'
        ];
        break;
      case 'Branding':
      case 'Graphic Design':
      case 'Video Editing':
        options = [
          'NPR 500 - 2,000 (Essential Banner / Layout Assets)',
          'NPR 2,000 - 5,000 (Corporate stationery/Business Card Suite)',
          'NPR 5,000 - 10,000 (Redesign / Premium Logo Suite)',
          'NPR 10,000 - 20,000+ (Complete Visual Identity Guideline)'
        ];
        break;
      default:
        options = ['NPR 5,000 - 15,000', 'NPR 15,000 - 50,000', 'NPR 50,000+'];
    }
    setBudgetOptions(options);
    
    // Auto preset the first budget option
    setFormData(prev => ({ ...prev, budgetRange: options[0] || '' }));
  }, [formData.serviceType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setMessage({ type: 'error', text: 'You must be logged in to submit an official service inquiry.' });
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.projectDescription) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await api.submitInquiry({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        companyName: formData.companyName || undefined,
        serviceType: formData.serviceType,
        budgetRange: formData.budgetRange,
        projectDescription: formData.projectDescription
      });

      setMessage({ type: 'success', text: 'Your business inquiry has been recorded! You can track its live resolution status on your active dashboard.' });
      
      // Clear description
      setFormData(prev => ({
        ...prev,
        projectDescription: ''
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error occurred while saving inquiry.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-none" id="tridev-inquiry-box">
      <div className="mb-6">
        <span className="text-[10px] uppercase font-mono bg-black text-white px-2.5 py-1 tracking-widest font-bold">Inquiry Pipeline</span>
        <h3 className="font-display text-2xl font-bold tracking-tight mt-2 text-gray-900">Request a Free Consultation</h3>
        <p className="text-gray-500 text-xs font-mono mt-1">Submit your specific project idea, and we will formulate an optimal roadmap for Nepalgunj & Banke region.</p>
      </div>

      {message && (
        <div className={`p-4 mb-6 border font-mono text-xs ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-850 border-red-200'
        }`}>
          <div className="flex gap-2 items-start">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="font-medium">{message.text}</p>
          </div>
        </div>
      )}

      {!currentUser ? (
        <div className="text-center p-8 bg-zinc-50 border border-zinc-200">
          <Lock className="h-8 w-8 text-black mx-auto mb-3" />
          <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-gray-900">Inquiry System is Secured</h4>
          <p className="text-gray-500 text-xs mt-2 mb-6 max-w-sm mx-auto leading-relaxed">
            In order to view live updates, assign statuses, and converse with Director Tilak Kanojiya, please create a free secure account or log in first.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center font-mono text-xs">
            <button
              onClick={() => onNavigate('/login')}
              className="px-5 py-2.5 bg-black hover:bg-[#E10600] text-white uppercase tracking-wider font-bold cursor-pointer"
            >
              Sign In Now
            </button>
            <button
              onClick={() => onNavigate('/register')}
              className="px-5 py-2.5 border border-black bg-white hover:bg-zinc-50 text-black uppercase tracking-wider font-bold cursor-pointer"
            >
              Register (Instant)
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Full Name <span className="text-[#E10600]">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Tilak Prasad"
                className="w-full px-3 py-2 border border-zinc-200 focus:outline-none focus:border-black text-sm bg-zinc-50/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Email Address <span className="text-[#E10600]">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="client@gmail.com"
                className="w-full px-3 py-2 border border-zinc-200 focus:outline-none focus:border-black text-sm bg-zinc-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Phone Number <span className="text-[#E10600]">*</span>
              </label>
              <input
                type="text"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="98XXXXXXXX / 97XXXXXXXX"
                className="w-full px-3 py-2 border border-zinc-200 focus:outline-none focus:border-black text-sm bg-zinc-50/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Company Name <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="E.g., Bageshwori Traders"
                className="w-full px-3 py-2 border border-zinc-200 focus:outline-none focus:border-black text-sm bg-zinc-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Service of Interest <span className="text-[#E10600]">*</span>
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-zinc-200 focus:outline-none focus:border-black text-sm bg-white"
              >
                <option value="Website Development">Website Development</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Branding">Branding & Corporate Identity</option>
                <option value="Graphic Design">Graphic Design Assets</option>
                <option value="Video Editing">Creative Video Editing</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Dynamic Budget Bracket (NPR) <span className="text-[#E10600]">*</span>
              </label>
              <select
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-zinc-200 focus:outline-none focus:border-black text-sm bg-white"
              >
                {budgetOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Project Summary & Goals <span className="text-[#E10600]">*</span>
            </label>
            <textarea
              name="projectDescription"
              required
              rows={4}
              value={formData.projectDescription}
              onChange={handleChange}
              placeholder="Provide exact expectations, page numbers, business sector, desired launch date, or package of choice..."
              className="w-full px-3 py-2 border border-zinc-200 focus:outline-none focus:border-black text-sm bg-zinc-50/50"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 cursor-pointer bg-black hover:bg-[#E10600] text-white text-xs font-mono font-bold tracking-widest uppercase transition-none disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {loading ? 'Submitting Inquiry...' : 'Submit Inquiry & Alert Director'}
          </button>
        </form>
      )}
    </div>
  );
}
