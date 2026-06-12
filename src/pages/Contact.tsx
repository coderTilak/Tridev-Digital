/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Phone, MessageSquare, Mail, ShieldCheck, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { UserProfile } from '../types';
import { api } from '../lib/api';

interface ContactProps {
  onNavigate: (path: string) => void;
  currentUser: UserProfile | null;
}

export default function Contact({ onNavigate, currentUser }: ContactProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.message) {
      setStatus({ type: 'error', text: 'All contact form fields are strictly mandatory.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await api.submitContactMessage(
        formData.fullName,
        formData.email,
        formData.phoneNumber,
        formData.message
      );

      setStatus({
        type: 'success',
        text: 'Message received! Our team near Gulma will check details and respond via phone or email.'
      });

      // Reset text fields
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        message: ''
      });
    } catch (err: any) {
      setStatus({ type: 'error', text: err.message || 'Error occurred while saving message.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 py-8" id="tridev-contact-page">
      
      {/* Header Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black border border-zinc-500 p-8 md:p-12 text-center max-w-3xl mx-auto rounded-none">
          <span className="text-[10px] uppercase font-mono tracking-widest bg-[#E10600] text-white px-3 py-1 font-bold">
            Physical Headquarters & Support Desk
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#E10600] mt-4 font-extrabold">
            Contact Tridev Digital
          </h1>
          <p className="text-white text-xs font-mono mt-5 leading-relaxed">
            Have questions about standard packages? Submit your contact queries <span className="text-[#E10600] font-bold">directly.</span> Our physical office base is <span className="text-[#E10600] font-bold">always open</span> for direct commercial agreements.
          </p>
        </div>
      </section>

      {/* Main Coordinate Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left panel: Coordinates */}
          <div className="lg:col-span-5 space-y-8">
            <div className="border-l-2 border-black pl-4">
              <h2 className="font-display text-2xl font-bold text-gray-950">Communication Desk</h2>
              <p className="text-gray-500 text-xs font-mono mt-1">Talk to Director Tilak Kanojiya directly for urgent quotations.</p>
            </div>

            <div className="space-y-6">
              {/* Box 1: Address */}
              <div className="flex bg-zinc-50/50 p-5 border border-zinc-200">
                <MapPin className="h-5 w-5 text-black shrink-0 mt-0.5 mr-4" />
                <div>
                  <h4 className="font-display font-bold text-gray-950 text-sm">Physical Headquarters</h4>
                  <p className="text-gray-500 text-xs font-mono mt-2 leading-relaxed">
                    Nepalgunj, Banke, Near Gulma<br />
                    Lumbini Province, Nepal
                  </p>
                </div>
              </div>

              {/* Box 2: Voice Lines */}
              <div className="flex bg-zinc-50/50 p-5 border border-zinc-200">
                <Phone className="h-5 w-5 text-black shrink-0 mt-0.5 mr-4" />
                <div>
                  <h4 className="font-display font-bold text-gray-950 text-sm">Direct Contact Lines</h4>
                  <p className="text-gray-550 text-xs font-mono mt-2 space-y-1.5">
                    <span className="block font-bold text-zinc-900">Primary Network: 9812453147</span>
                    <span className="block font-bold text-zinc-900">Secondary Network: 9769277257</span>
                  </p>
                </div>
              </div>

              {/* Box 3: Support Standard */}
              <div className="flex bg-emerald-50/40 p-5 border border-emerald-100">
                <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5 mr-4" />
                <div>
                  <h4 className="font-display font-bold text-emerald-950 text-sm">Business Inquiry Support</h4>
                  <p className="text-emerald-900 text-xs font-mono mt-2 leading-relaxed">
                    All submitted questions register immediately into our database core. Our technical director reviews resolution milestones step-by-step.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 p-6 sm:p-8">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-zinc-100">
              Submit Direct Message
            </h3>

            {status && (
              <div className={`p-4 mb-6 border ${
                status.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                <div className="flex gap-2 items-start">
                  {status.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-650 shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs font-mono font-semibold">{status.text}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500 mb-1">
                    Your Full Name <span className="text-[#E10600]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="E.g., Tilak Prasad"
                    className="w-full px-3 py-2.5 border border-zinc-200 focus:outline-none focus:border-black text-xs font-mono bg-zinc-50/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500 mb-1">
                    Email Address <span className="text-[#E10600]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E.g., client@gmail.com"
                    className="w-full px-3 py-2.5 border border-zinc-200 focus:outline-none focus:border-black text-xs font-mono bg-zinc-50/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500 mb-1">
                  Active Phone Network Number <span className="text-[#E10600]">*</span>
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="98XXXXXXXX / 97XXXXXXXX"
                  className="w-full px-3 py-2.5 border border-zinc-200 focus:outline-none focus:border-black text-xs font-mono bg-zinc-50/20"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500 mb-1">
                  Message Details <span className="text-[#E10600]">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your questions..."
                  className="w-full px-3 py-2.5 border border-zinc-200 focus:outline-none focus:border-black text-xs font-mono bg-zinc-50/20"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-[#E10600] text-white text-xs font-mono font-bold uppercase tracking-widest cursor-pointer transition-none disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {loading ? 'Transmitting...' : 'Transmit Message to Director'}
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}
