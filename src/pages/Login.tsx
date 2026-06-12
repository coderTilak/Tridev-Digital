/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { api } from '../lib/api';

interface LoginProps {
  onNavigate: (path: string) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function Login({ onNavigate, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your registered email and passwords.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.login(email, password);
      onLoginSuccess(data.user);
      
      // Navigate to dashboard based on role
      if (data.user.isAdmin) {
        onNavigate('/admin');
      } else {
        onNavigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white border border-gray-200" id="tridev-login-box">
      
      {/* Header Panel */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center justify-center h-12 w-12 bg-[#E10600] text-white font-black text-xl">
          T
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900">Sign In to Tridev</h2>
        <p className="text-gray-500 text-xs">Access your personal inquiry logs or administrative console.</p>
      </div>

      {error && (
        <div className="p-4 mb-4 border border-red-200 bg-red-50 text-red-800 text-xs flex gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="name@email.com"
            className="w-full h-10 px-3 border border-gray-300 focus:outline-none focus:border-[#E10600] text-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Secure Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full h-10 px-3 border border-gray-300 focus:outline-none focus:border-[#E10600] text-sm bg-gray-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 h-11 bg-[#E10600] hover:bg-black text-white text-xs font-mono font-bold tracking-widest uppercase cursor-pointer transition-none disabled:opacity-50"
        >
          <LogIn className="h-4 w-4" />
          {loading ? 'Authenticating...' : 'Sign In Session'}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onNavigate('/register')}
            className="text-xs text-[#E10600] hover:underline hover:text-black font-semibold cursor-pointer"
          >
            Don't have an account? Sign Up Now
          </button>
        </div>
      </form>

    </div>
  );
}
