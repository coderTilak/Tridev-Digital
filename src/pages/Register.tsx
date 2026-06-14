/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserPlus, Sparkles, AlertCircle, Phone, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../types';
import { api } from '../lib/api';

interface RegisterProps {
  onNavigate: (path: string) => void;
  onRegisterSuccess: (user: UserProfile) => void;
}

export default function Register({ onNavigate, onRegisterSuccess }: RegisterProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phoneNumber || !password) {
      setError('Please fill in all mandatory marked registration fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.register(email, password, fullName, phoneNumber, companyName || undefined);
      onRegisterSuccess(data.user);
      onNavigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Choose a different email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white border border-gray-200" id="tridev-register-box">
      
      {/* Title Segment */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center justify-center h-12 w-12 bg-[#00C853] text-white font-black text-xl">
          R
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900">Create Secure Profile</h2>
        <p className="text-gray-500 text-xs text-center leading-relaxed">
          Unlock your personal inquiry control deck. Log demands, coordinate budget brackets, and track project status logs easily.
        </p>
      </div>

      {error && (
        <div className="p-4 mb-4 border border-red-200 bg-red-50 text-red-800 text-xs flex gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Full Name <span className="text-[#E10600]">*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="E.g., Sanjay Sharma"
            className="w-full h-10 px-3 border border-gray-300 focus:outline-none focus:border-[#E10600] text-sm bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
              Active Cell Phone <span className="text-[#E10600]">*</span>
            </label>
            <input
              type="text"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="98XXXXXXXX"
              className="w-full h-10 px-3 border border-gray-300 focus:outline-none focus:border-[#E10600] text-sm bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
              Company <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="E.g., Bakery Shop"
              className="w-full h-10 px-3 border border-gray-300 focus:outline-none focus:border-[#E10600] text-sm bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Email Address <span className="text-[#E10600]">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@gmail.com"
            className="w-full h-10 px-3 border border-gray-300 focus:outline-none focus:border-[#E10600] text-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Choose Secure Password <span className="text-[#E10600]">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 pr-10 border border-gray-300 focus:outline-none focus:border-[#E10600] text-sm bg-gray-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#E10600] cursor-pointer p-1"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="bg-[#00C853]/5 border border-[#00C853]/30 p-3 text-[11px] text-[#00C853] flex gap-2">
          <HelpCircle className="h-4 w-4 shrink-0" />
          <span>Rest assured, we strictly validate input logs. Tridev Digital will never transmit your details with third-party pixels.</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 h-11 bg-gray-950 hover:bg-[#E10600] text-white text-xs font-mono font-bold tracking-widest uppercase cursor-pointer transition-none disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
          {loading ? 'Creating Credentials...' : 'Register Secure Account'}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="text-xs text-[#E10600] hover:underline hover:text-black font-semibold cursor-pointer"
          >
            Already have an account? Sign In
          </button>
        </div>
      </form>

    </div>
  );
}
