/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LogIn, AlertCircle, Eye, EyeOff, X, Mail, CheckCircle } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError('Please enter your email address.');
      return;
    }
    setForgotLoading(true);
    setForgotError(null);
    setForgotMessage(null);
    try {
      const data = await api.resetPassword(forgotEmail);
      setForgotMessage(data.message);
    } catch (err: any) {
      setForgotError(err.message || 'Failed to send reset email.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <>
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
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 h-11 bg-[#E10600] hover:bg-black text-white text-xs font-mono font-bold tracking-widest uppercase cursor-pointer transition-none disabled:opacity-50"
        >
          <LogIn className="h-4 w-4" />
          {loading ? 'Authenticating...' : 'Sign In Session'}
        </button>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              setShowForgot(true);
              setForgotEmail(email);
              setForgotError(null);
              setForgotMessage(null);
            }}
            className="text-xs text-[#E10600] hover:underline hover:text-black font-semibold cursor-pointer"
          >
            Forgot Password?
          </button>
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

    {/* Forgot Password Modal */}
    {showForgot && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white max-w-md w-full p-6 relative">
          <button
            onClick={() => setShowForgot(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-12 w-12 bg-[#E10600] text-white mb-3">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900">Reset Password</h3>
            <p className="text-gray-500 text-xs mt-1">Enter your email and we'll send you a reset link.</p>
          </div>

          {forgotError && (
            <div className="p-3 mb-4 border border-red-200 bg-red-50 text-red-800 text-xs flex gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{forgotError}</p>
            </div>
          )}

          {forgotMessage && (
            <div className="p-3 mb-4 border border-green-200 bg-green-50 text-green-800 text-xs flex gap-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <p>{forgotMessage}</p>
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                placeholder="name@email.com"
                className="w-full h-10 px-3 border border-gray-300 focus:outline-none focus:border-[#E10600] text-sm bg-gray-50"
              />
            </div>

            <button
              type="submit"
              disabled={forgotLoading}
              className="w-full h-11 bg-[#E10600] hover:bg-black text-white text-xs font-mono font-bold tracking-widest uppercase cursor-pointer transition-none disabled:opacity-50"
            >
              {forgotLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    )}
  </>);
}
