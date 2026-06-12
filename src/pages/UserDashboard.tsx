/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Briefcase, User, Edit, Key, LogOut, CheckCircle2, RefreshCw, Plus, ArrowRight, Loader2, ClipboardList, HelpCircle } from 'lucide-react';
import { UserProfile, Inquiry } from '../types';
import { api } from '../lib/api';
import InquiryForm from '../components/InquiryForm';

interface UserDashboardProps {
  onNavigate: (path: string) => void;
  currentUser: UserProfile | null;
  onUpdateCurrentUser: (user: UserProfile) => void;
  onLogout: () => void;
}

export default function UserDashboard({ onNavigate, currentUser, onUpdateCurrentUser, onLogout }: UserDashboardProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'inquiries' | 'profile' | 'new_inquiry'>('inquiries');
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phoneNumber: '',
    companyName: ''
  });
  
  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      onNavigate('/login');
      return;
    }

    setProfileForm({
      fullName: currentUser.fullName || '',
      phoneNumber: currentUser.phoneNumber || '',
      companyName: currentUser.companyName || ''
    });

    loadUserInquiries();
  }, [currentUser]);

  const loadUserInquiries = async () => {
    setLoading(true);
    try {
      const data = await api.getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error('Failed to loading inquiries logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.fullName || !profileForm.phoneNumber) {
      setProfileStatus({ type: 'error', text: 'Full name and phone numbers are required.' });
      return;
    }

    setProfileLoading(true);
    setProfileStatus(null);

    try {
      const updatedUser = await api.updateProfile(
        profileForm.fullName,
        profileForm.phoneNumber,
        profileForm.companyName || undefined
      );
      onUpdateCurrentUser(updatedUser);
      setProfileStatus({ type: 'success', text: 'Profile preferences updated successfully!' });
    } catch (err: any) {
      setProfileStatus({ type: 'error', text: err.message || 'Error occurred while saving profile.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Reviewing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-emerald-50 text-[#00C853] border-emerald-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="tridev-user-dashboard">
      
      {/* 1. Header segment */}
      <div className="border-b border-gray-200 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="text-xs uppercase font-mono tracking-widest text-[#E10600] font-bold">Client Area</span>
          <h1 className="font-display text-3xl font-bold text-gray-900">Welcome, {currentUser.fullName}</h1>
          <p className="text-gray-500 text-xs">
            Manage your digital assets and consult with Tilak Kanojiya near Gulma, Nepalgunj.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('new_inquiry')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E10600] hover:bg-black text-white text-xs font-bold uppercase transition-none cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Submit Inquiry
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold uppercase transition-none cursor-pointer bg-white"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* 2. Main structure: Left nav rails, Right workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side Rail Options */}
        <aside className="lg:col-span-3 space-y-2">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-left border cursor-pointer transition-none ${
              activeTab === 'inquiries'
                ? 'bg-[#111827] text-white border-[#111827]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <ClipboardList className="h-4 w-4 shrink-0" />
            My Inquiries ({inquiries.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-left border cursor-pointer transition-none ${
              activeTab === 'profile'
                ? 'bg-[#111827] text-white border-[#111827]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <User className="h-4 w-4 shrink-0" />
            Profile settings
          </button>

          <button
            onClick={() => setActiveTab('new_inquiry')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-left border cursor-pointer transition-none ${
              activeTab === 'new_inquiry'
                ? 'bg-[#111827] text-white border-[#111827]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <Plus className="h-4 w-4 shrink-0" />
            Submit New Request
          </button>
        </aside>

        {/* Right Side Workspace Pane (No animations) */}
        <main className="lg:col-span-9 bg-white border border-gray-200 p-6 md:p-8">
          
          {/* Tab 1: Inquiries Listing */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h2 className="font-display text-xl font-bold text-gray-900 uppercase">My Service Inquiries</h2>
                <button 
                  onClick={loadUserInquiries}
                  title="Reload inquiries"
                  className="p-1.5 text-gray-500 hover:text-black border border-gray-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12 font-mono text-xs text-gray-500 flex justify-center items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" /> Loader feedback logs...
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-300">
                  <Briefcase className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-display font-bold text-gray-900 text-lg">No Inquiries Found</h4>
                  <p className="text-gray-500 text-xs max-w-sm mx-auto mt-1 mb-6">
                    You have not registered any development request in our servers yet. Get a quotation easily right now.
                  </p>
                  <button
                    onClick={() => setActiveTab('new_inquiry')}
                    className="px-5 py-2.5 bg-[#E10600] text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Start First Inquiry
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="border border-gray-200 bg-white">
                      {/* Header bar */}
                      <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Inquiry Serial ID:</span>
                          <span className="font-mono text-xs font-bold text-gray-800 ml-1.5">{inq.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-gray-500">
                            Logged: {new Date(inq.createdAt).toLocaleDateString()}
                          </span>
                          <span className={`text-[10px] uppercase tracking-wider border font-mono font-bold px-2 py-0.5 ${getStatusColor(inq.status)}`}>
                            {inq.status}
                          </span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-400 font-bold uppercase block text-[10px]">Requested Tech Category</span>
                            <span className="font-bold text-gray-900 text-sm mt-0.5 block">{inq.serviceType}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 font-bold uppercase block text-[10px]">Estimated Price Bracket</span>
                            <span className="font-bold text-gray-900 text-sm mt-0.5 block">{inq.budgetRange}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-400 font-bold uppercase block text-[10px] mb-1">Your Project Outline</span>
                          <p className="text-gray-700 text-xs leading-relaxed bg-gray-50 p-3 border border-gray-100 italic">
                            "{inq.projectDescription}"
                          </p>
                        </div>

                        {/* Admin Remarks from Tilak */}
                        {inq.adminRemarks ? (
                          <div className="border-t border-dashed border-gray-200 pt-4 mt-2">
                            <div className="bg-amber-50 border border-amber-200 p-4 text-xs space-y-1">
                              <span className="font-bold uppercase tracking-wider text-[#E10600] text-[10px] block font-mono">
                                Director Review Note (Tilak Kanojiya):
                              </span>
                              <p className="text-gray-800 leading-relaxed font-sans">{inq.adminRemarks}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="border-t border-dashed border-gray-200 pt-3 flex items-center gap-2 text-[11px] text-gray-500">
                            <HelpCircle className="h-4 w-4 text-[#00C853]" />
                            <span>Awaiting initial review by Tilak. We normally touch base within 1 physical working day.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Profile Setup Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="font-display text-xl font-bold text-gray-900 uppercase">Profile Settings & Coordinates</h2>
                <p className="text-gray-500 text-xs mt-1">Keep your corporate credentials up to date to guarantee smooth communications.</p>
              </div>

              {profileStatus && (
                <div className={`p-4 border ${
                  profileStatus.type === 'success' 
                    ? 'bg-[#00C853]/10 text-emerald-950 border-[#00C853]' 
                    : 'bg-red-50 text-red-950 border-red-200'
                } text-xs font-semibold`}>
                  {profileStatus.text}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full h-10 px-3 border border-gray-300 focus:outline-none focus:border-[#E10600] text-sm bg-gray-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Active Phone Numbers
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.phoneNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 focus:outline-none focus:border-[#E10600] text-sm bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Registered Company Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.companyName}
                      onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 focus:outline-none focus:border-[#E10600] text-sm bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 font-mono">
                    System Account Email (Immutable)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.email}
                    className="w-full h-10 px-3 border border-gray-200 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-2.5 bg-[#E10600] hover:bg-black text-white text-xs font-mono font-bold tracking-widest uppercase cursor-pointer transition-none disabled:opacity-50"
                >
                  {profileLoading ? 'Storing preferences...' : 'Update Settings'}
                </button>
              </form>
            </div>
          )}

          {/* Tab 3: Embed New Inquiry Form */}
          {activeTab === 'new_inquiry' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                <h2 className="font-display text-xl font-bold text-gray-900 uppercase">Draft New Service Request</h2>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs text-gray-500 hover:text-black underline cursor-pointer"
                >
                  Return to List
                </button>
              </div>

              <InquiryForm 
                currentUser={currentUser} 
                onNavigate={onNavigate} 
                onSuccess={() => {
                  // Reload inquiries list and swap views
                  loadUserInquiries();
                  setTimeout(() => {
                    setActiveTab('inquiries');
                  }, 1200);
                }}
              />
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
