/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Target, Eye, UserCheck, ShieldAlert, ArrowRight, Award, Compass, MessageSquare, Plus, Trash2, Edit2, Check, X, RotateCcw, UserPlus, Sliders, Server, Database, Code, ShieldCheck, AlertTriangle } from 'lucide-react';
import { UserProfile, Employee } from '../types';
import { api } from '../lib/api';

interface AboutProps {
  onNavigate: (path: string) => void;
  currentUser: UserProfile | null;
}

const DEFAULT_EMPLOYEES: Employee[] = [
  { id: "emp-1", name: "Nirajan Shrestha", role: "Lead Frontend Engineer", post: "Associate", phoneNumber: "9812453147", address: "Nepalgunj, Banke", spec: "Specialist in Tailwind CSS layouts & responsive React setups.", thoughts: "Drafting scalable interfaces is an art.", init: "NS" },
  { id: "emp-2", name: "Prerna Rokaya", role: "UI/UX System Architect", post: "Associate", phoneNumber: "9812453148", address: "Nepalgunj, Banke", spec: "Creates high-fidelity wireframes & customized typography guides.", thoughts: "Simplicity is the ultimate sophistication.", init: "PR" },
  { id: "emp-3", name: "Sushil Chaudhary", role: "Backend Architect", post: "Associate", phoneNumber: "9812453149", address: "Nepalgunj, Banke", spec: "Optimizes scalable Node.js servers, API routing & Firestore DBs.", thoughts: "Systems must be robust and secure first.", init: "SC" },
  { id: "emp-4", name: "Aliza Bajracharya", role: "Digital Media strategist", post: "Associate", phoneNumber: "9812453150", address: "Nepalgunj, Banke", spec: "Leads High-ROI target campaigns on Facebook, Instagram & TikTok.", thoughts: "ROI matters more than vanity counts.", init: "AB" },
  { id: "emp-5", name: "Rohan Thapa", role: "QA Engineering Lead", post: "Associate", phoneNumber: "9812453151", address: "Nepalgunj, Banke", spec: "Maintains cross-device safety standards and stress resolution testing.", thoughts: "Bugs don't survive standard testing.", init: "RT" },
  { id: "emp-6", name: "Binisha Dixit", role: "Lead Copywriter", post: "Associate", phoneNumber: "9812453152", address: "Nepalgunj, Banke", spec: "Produces targeted regional sales copies and dynamic metadata.", thoughts: "Copywriting drives engagement, leads, and sales.", init: "BD" },
  { id: "emp-7", name: "Kiran Sunar", role: "Creative Graphic Lead", post: "Associate", phoneNumber: "9812453153", address: "Nepalgunj, Banke", spec: "Directs visual asset creation and pixel-perfect vector files.", thoughts: "Visual storytelling leaves lasting impressions.", init: "KS" },
  { id: "emp-8", name: "Asmita G.C.", role: "App Developer", post: "Associate", phoneNumber: "9812453154", address: "Nepalgunj, Banke", spec: "Engineers hybrid mobile applications with low latency 3G settings.", thoughts: "Every cell phone user deserves lag-free utility.", init: "AG" },
  { id: "emp-9", name: "Devendra Yogi", role: "Organic SEO Analyst", post: "Associate", phoneNumber: "9812453155", address: "Nepalgunj, Banke", spec: "Optimizes localized web ranks inside Banke & Kohalpur markets.", thoughts: "Search rankings are won with structured data.", init: "DY" },
  { id: "emp-10", name: "Samyak Shakya", role: "Systems Engineer", post: "Associate", phoneNumber: "9812453156", address: "Nepalgunj, Banke", spec: "Configures secure hosting, region CDN buffers & custom domains.", thoughts: "Guaranteed 99.9% network latency safety.", init: "SS" }
];

export default function About({ onNavigate, currentUser }: AboutProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConfig, setDbConfig] = useState<{ configured: boolean; type: string; url: string; host: string; tutorialScript: string } | null>(null);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  // Management Form states
  const [isManageMode, setIsManageMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // States for Editing in-place
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editSpec, setEditSpec] = useState('');
  const [editInit, setEditInit] = useState('');
  const [editPost, setEditPost] = useState('Associate');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editThoughts, setEditThoughts] = useState('');

  // States for Adding a new employee
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newSpec, setNewSpec] = useState('');
  const [newInit, setNewInit] = useState('');
  const [newPost, setNewPost] = useState('Associate');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('Nepalgunj, Banke');
  const [newThoughts, setNewThoughts] = useState('');
  
  // Show message banner for actions
  const [notice, setNotice] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  const askConfirmation = (title: string, message: string, onConfirm: () => void | Promise<void>) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        await onConfirm();
        setConfirmModal(null);
      }
    });
  };

  const fetchEmployees = async () => {
    try {
      const roster = await api.getEmployees();
      setEmployees(roster);
    } catch (err: any) {
      console.error('Error loading employees:', err);
      triggerNotice("Warning: Loaded fallback roster from local memory.");
    }
  };

  const fetchDbConfig = async () => {
    try {
      const cfg = await api.getDbConfig();
      setDbConfig(cfg);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([fetchEmployees(), fetchDbConfig()]);
      setLoading(false);
    }
    init();
  }, []);

  const triggerNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => {
      setNotice(null);
    }, 5000);
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim() || !newSpec.trim()) {
      triggerNotice("Please fill in Name, Role, and Specialty details.");
      return;
    }
    const finalInit = newInit.trim() ? newInit.trim().toUpperCase().slice(0, 2) : newName.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    try {
      const newEmpPayload = {
        name: newName.trim(),
        role: newRole.trim(),
        spec: newSpec.trim(),
        init: finalInit || "EE",
        post: newPost,
        phoneNumber: newPhone.trim() || '9812453147',
        address: newAddress.trim() || 'Nepalgunj, Banke',
        thoughts: newThoughts.trim() || `Excelling in the ${newRole.trim()} domain at Tridev.`
      };
      
      const created = await api.createEmployee(newEmpPayload);
      setEmployees(prev => [...prev, created]);
      
      setNewName('');
      setNewRole('');
      setNewSpec('');
      setNewInit('');
      setNewPost('Associate');
      setNewPhone('');
      setNewAddress('Nepalgunj, Banke');
      setNewThoughts('');
      triggerNotice(`Added associate "${created.name}" successfully to database!`);
    } catch (err: any) {
      triggerNotice(`Error: ${err.message || "Failed to commit to server."}`);
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    askConfirmation(
      'Remove Staff Associate',
      `Are you sure you want to delete staff member "${name}"?`,
      async () => {
        try {
          await api.deleteEmployee(id);
          setEmployees(prev => prev.filter(emp => emp.id !== id));
          if (editingId === id) {
            setEditingId(null);
          }
          triggerNotice(`Removed associate "${name}" successfully from database.`);
        } catch (err: any) {
          triggerNotice(`Error deleting associate: ${err.message}`);
        }
      }
    );
  };

  const handleStartEdit = (emp: any) => {
    setEditingId(emp.id);
    setEditName(emp.name);
    setEditRole(emp.role);
    setEditSpec(emp.spec);
    setEditInit(emp.init);
    setEditPost(emp.post || 'Associate');
    setEditPhone(emp.phoneNumber || '');
    setEditAddress(emp.address || '');
    setEditThoughts(emp.thoughts || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim() || !editRole.trim() || !editSpec.trim()) {
      triggerNotice("Name, Role, and Specialty fields cannot be left empty.");
      return;
    }
    const finalInit = editInit.trim() ? editInit.trim().toUpperCase().slice(0, 2) : editName.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    try {
      const updatedPayload = {
        name: editName.trim(),
        role: editRole.trim(),
        spec: editSpec.trim(),
        init: finalInit || "EE",
        post: editPost,
        phoneNumber: editPhone.trim(),
        address: editAddress.trim(),
        thoughts: editThoughts.trim()
      };
      
      const updated = await api.updateEmployee(id, updatedPayload);
      setEmployees(prev => prev.map(emp => emp.id === id ? updated : emp));
      setEditingId(null);
      triggerNotice(`Updated & renamed associate "${updated.name}" successfully in database.`);
    } catch (err: any) {
      triggerNotice(`Error updating associate: ${err.message}`);
    }
  };

  const handleResetToDefaults = async () => {
    askConfirmation(
      'Restore Default Associate Team Roster',
      'Are you sure you want to restore the default 10-member roster? This will overwrite your current changes in Supabase/database.',
      async () => {
        try {
          const resetList = await api.resetEmployees(DEFAULT_EMPLOYEES);
          setEmployees(resetList);
          setEditingId(null);
          triggerNotice("Restored original 10-member associate team to database.");
        } catch (err: any) {
          triggerNotice(`Failed to reset: ${err.message}`);
        }
      }
    );
  };

  return (
    <div className="space-y-16 py-8" id="tridev-about-page">
      
      {/* 1. Header Segment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black border border-zinc-500 p-8 md:p-12 text-center max-w-3xl mx-auto rounded-none">
          <span className="text-[10px] uppercase font-mono tracking-widest bg-[#E10600] text-white px-3 py-1 font-bold animate-none">
            Corporate Profile
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#E10600] mt-4 font-extrabold">
            About Tridev Digital
          </h1>
          <p className="text-white text-xs font-mono mt-5 leading-relaxed">
            Established in <span className="text-[#E10600] font-bold">Nepalgunj, Banke near Gulma</span>, Tridev Digital is a specialized software agency delivering premium <span className="text-[#E10600] font-bold">web, mobile, and digital advertising</span> infrastructure.
          </p>
        </div>
      </section>

      {/* 2. Leadership Segment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Executive & PM Cards */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-zinc-400 block mb-2">Executive Leadership</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Tilak Kanojiya */}
              <div className="bg-zinc-50/50 border border-zinc-200 p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-gray-950">Tilak Kanojiya</h3>
                  <p className="text-[11px] uppercase tracking-wider font-mono text-black font-bold">Director & Tech Lead</p>
                </div>
                <div className="border-t border-zinc-200 pt-3 space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Direct Line:</span>
                    <span className="text-gray-950 font-bold">9812453147</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Office Base:</span>
                    <span className="text-gray-900">Nepalgunj</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Aryan Rajbashi */}
              <div className="bg-zinc-50/50 border border-zinc-200 p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-gray-950">Aryan Rajbashi</h3>
                  <p className="text-[11px] uppercase tracking-wider font-mono text-zinc-900 font-bold">Project Manager</p>
                </div>
                <div className="border-t border-zinc-200 pt-3 space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Direct Line:</span>
                    <span className="text-gray-950 font-bold">9769277257</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Office Base:</span>
                    <span className="text-gray-900">Nepalgunj</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/40 border border-emerald-100 p-4 text-xs flex gap-2 font-mono">
              <UserCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="text-emerald-950 leading-relaxed">
                Aryan Rajbashi coordinates immediate support queries, estimates, and project schedules, guaranteeing direct communication lines.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-display text-3xl font-bold tracking-tight text-gray-950">Director’s Statement</h2>
            <blockquote className="border-l-2 border-black pl-4 italic text-gray-700 leading-relaxed text-sm bg-zinc-50/20 py-1">
              "We believe that every organization in Nepalgunj—from a small family-run confectionery to an expansive trade firm—merits robust corporate integrity. We do not design static code that remains dusty; we engineer active web portfolios that generate leads, establish local authority, and survive high-traffic events cleanly."
            </blockquote>
            <p className="text-gray-500 leading-relaxed text-sm">
              Under Tilak’s command, Tridev Digital has established a strict protocol for software quality: fully hand-typed templates (avoiding heavy external libraries), standard mobile dimensions optimization for 3G/4G connectivity, clear local SEO optimization for Lumbini markets, and a resilient inquiry resolution desk.
            </p>
            <p className="text-gray-500 leading-relaxed text-sm">
              We operate physically right near Gulma in Nepalgunj. This allows us to hold convenient in-person requirements meetings, sign binding agreements securely, and provide consistent, face-to-face assistance that virtual agencies simply cannot mimic.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="bg-zinc-50/50 py-16 border-y border-zinc-200" id="mission-vision">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="bg-white p-8 border border-zinc-200 hover:border-black text-left space-y-4 transition-none">
            <div className="h-10 w-10 bg-zinc-100 flex items-center justify-center rounded-none text-black">
              <Target className="h-5 w-5 text-black" />
            </div>
            <h3 className="font-display text-2xl font-bold text-gray-900">Our Strategic Mission</h3>
            <p className="text-gray-550 text-xs leading-relaxed">
              To deliver highly accessible, robust, and search-optimized digital tools for businesses across Nepalgunj and Kohalpur, dismantling complex technology hurdles, and maximizing lead counts via creative ad packages.
            </p>
            <ul className="space-y-2 text-xs font-mono text-gray-500 pt-2 border-t border-zinc-100">
              <li className="flex gap-2">
                <span className="text-black font-bold">✔</span> 100% transparent pricing for peace of mind.
              </li>
              <li className="flex gap-2">
                <span className="text-black font-bold">✔</span> Focus on business ROI and direct local leads.
              </li>
              <li className="flex gap-2">
                <span className="text-black font-bold">✔</span> Simple coding standards that scale easily.
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 border border-zinc-200 hover:border-black text-left space-y-4 transition-none">
            <div className="h-10 w-10 bg-zinc-100 flex items-center justify-center rounded-none text-black">
              <Eye className="h-5 w-5 text-black" />
            </div>
            <h3 className="font-display text-2xl font-bold text-gray-900">Our Strategic Vision</h3>
            <p className="text-gray-550 text-xs leading-relaxed">
              To become the most reliable and trusted technology partner in Midwestern Nepal, establishing digital literacy and professional-grade hosting security protocols for commercial enterprises.
            </p>
            <ul className="space-y-2 text-xs font-mono text-gray-500 pt-2 border-t border-zinc-100">
              <li className="flex gap-2">
                <span className="text-black font-bold">✔</span> Pioneer native tech hubs inside Banke district.
              </li>
              <li className="flex gap-2">
                <span className="text-black font-bold">✔</span> Support local youth through direct tech skills.
              </li>
              <li className="flex gap-2">
                <span className="text-black font-bold">✔</span> Foster highly robust offline-capable local software.
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3.5 Professional Team Segment (Dynamic and Manageable) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="agency-team-section">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest bg-black text-white px-2.5 py-1 font-bold">
              Engineering & Strategy Core
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 pt-2">Our Specialized Associates</h2>
            <p className="text-gray-500 text-xs font-mono">
              Meet and manage the handpicked in-house professionals powering Tridev Digital's deployment pipelines in Nepalgunj.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {dbConfig && (
              <button
                onClick={() => setShowSqlGuide(true)}
                className={`px-3 py-2 border flex items-center gap-1.5 uppercase font-bold tracking-wider cursor-pointer transition-colors ${
                  dbConfig.configured 
                    ? 'border-[#00C853] text-[#00C853] bg-[#00C853]/5 hover:bg-[#00C853]/10' 
                    : 'border-amber-600 text-amber-600 bg-amber-50/5 hover:bg-amber-100/50'
                }`}
                title="View Database Sync Panel & Setup guide"
              >
                <Database className={`h-3.5 w-3.5 ${dbConfig.configured ? 'animate-pulse' : ''}`} />
                {dbConfig.configured ? 'Supabase Connected' : 'Setup Database'}
              </button>
            )}
            <button
              onClick={() => setIsManageMode(prev => !prev)}
              className={`px-4 py-2 flex items-center gap-1.5 font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                isManageMode ? 'bg-[#E10600] text-white border-[#E10600]' : 'bg-white text-zinc-900 border-zinc-300 hover:border-black'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              {isManageMode ? 'Close Management Mode' : 'Open Edit/Management Mode'}
            </button>
            <button
              onClick={handleResetToDefaults}
              title="Restore original 10 default employees"
              className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border border-zinc-300 hover:text-black cursor-pointer flex items-center gap-1 uppercase tracking-wider"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Roster
            </button>
          </div>
        </div>

        {/* Action Notice toast/banner */}
        {notice && (
          <div className="bg-zinc-900 text-[#00C853] text-[11px] font-mono p-4 border-l-4 border-[#00C853] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00C853] animate-ping" />
              <span>[SYSTEM NOTICE] {notice}</span>
            </div>
            <button onClick={() => setNotice(null)} className="text-zinc-400 hover:text-white cursor-pointer">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Add Employee Form Panel */}
        {isManageMode && (
          <div className="bg-zinc-50 border border-zinc-200 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-zinc-900" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-gray-900">Add New Associate</h3>
            </div>
            <form onSubmit={handleAddEmployee} className="space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase font-bold text-gray-500">Full Name *</label>
                  <input
                    type="text" required
                    placeholder="e.g. Samir KC"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 bg-white border border-zinc-300 text-gray-900 focus:outline-none focus:border-black"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase font-bold text-gray-500">Corporate Role *</label>
                  <input
                    type="text" required
                    placeholder="e.g. Support Specialist"
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 bg-white border border-zinc-300 text-gray-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase font-bold text-gray-500">Post Category</label>
                  <select
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 bg-white border border-zinc-300 text-gray-900 focus:outline-none"
                  >
                    <option value="Director">Director</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Associate">Associate</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Support Staff">Support Staff</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase font-bold text-gray-500">Direct Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 9812453147"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 bg-white border border-zinc-300 text-gray-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-[10px] font-mono uppercase font-bold text-gray-500">Technical Specialty & Bio *</label>
                  <input
                    type="text" required
                    placeholder="e.g. Specialist in localized web search indexes & 3G optimization."
                    value={newSpec}
                    onChange={e => setNewSpec(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 bg-white border border-zinc-300 text-gray-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase font-bold text-gray-500">Office Location Base</label>
                  <input
                    type="text"
                    placeholder="e.g. Gulma, Nepalgunj"
                    value={newAddress}
                    onChange={e => setNewAddress(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 bg-white border border-zinc-300 text-gray-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase font-bold text-gray-400">Initials Override</label>
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="Initials"
                    value={newInit}
                    onChange={e => setNewInit(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 bg-white border border-zinc-300 uppercase text-center font-bold text-gray-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase font-bold text-gray-500">Thoughts or Corporate Quote</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 'Strive to build robust client connections physically.'"
                  value={newThoughts}
                  onChange={e => setNewThoughts(e.target.value)}
                  className="w-full text-xs font-mono p-2 bg-white border border-zinc-300 text-gray-900 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-zinc-950 hover:bg-[#E10600] text-white font-mono text-xs uppercase font-bold tracking-wider cursor-pointer transition-none"
                >
                  Add Tridev staff Associate
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Associates Directory Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {employees.map((emp) => {
            const isEditing = editingId === emp.id;
            return (
              <div
                key={emp.id}
                className={`p-5 border flex flex-col justify-between transition-all space-y-4 rounded-none ${
                  isEditing 
                    ? 'bg-zinc-50 border-black ring-2 ring-black/10' 
                    : 'bg-white border-zinc-200 hover:border-black'
                }`}
              >
                {isEditing ? (
                  // Edit Form Mode
                  <div className="space-y-3 text-left">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                      <span className="text-[9px] font-mono font-bold uppercase text-[#E10600]">
                        Editing Associate
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400">ID: {emp.id.slice(-5)}</span>
                    </div>

                    <div className="space-y-2.5 font-mono text-xs">
                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase font-bold text-gray-400">Initials</label>
                        <input
                          type="text"
                          maxLength={2}
                          value={editInit}
                          onChange={e => setEditInit(e.target.value)}
                          className="w-full p-1.5 bg-white border border-zinc-300 text-gray-950 text-xs font-bold focus:outline-none uppercase"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase font-bold text-gray-400">Full Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="w-full p-1.5 bg-white border border-zinc-300 text-gray-950 text-xs font-bold focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase font-bold text-gray-400">Corporate Role</label>
                        <input
                          type="text"
                          value={editRole}
                          onChange={e => setEditRole(e.target.value)}
                          className="w-full p-1.5 bg-white border border-zinc-300 text-gray-950 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase font-bold text-gray-400">Specialty</label>
                        <textarea
                          rows={2}
                          value={editSpec}
                          onChange={e => setEditSpec(e.target.value)}
                          className="w-full p-1.5 bg-white border border-zinc-300 text-gray-950 text-xs focus:outline-none resize-none leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase font-bold text-gray-400">Post Category</label>
                        <select
                          value={editPost}
                          onChange={e => setEditPost(e.target.value)}
                          className="w-full p-1.5 bg-white border border-zinc-300 text-gray-950 text-xs font-bold focus:outline-none"
                        >
                          <option value="Director">Director</option>
                          <option value="Project Manager">Project Manager</option>
                          <option value="Associate">Associate</option>
                          <option value="Consultant">Consultant</option>
                          <option value="Support Staff">Support Staff</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase font-bold text-gray-400">Direct Phone</label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={e => setEditPhone(e.target.value)}
                          className="w-full p-1.5 bg-white border border-zinc-300 text-gray-950 text-xs focus:outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase font-bold text-gray-400">Address Base</label>
                        <input
                          type="text"
                          value={editAddress}
                          onChange={e => setEditAddress(e.target.value)}
                          className="w-full p-1.5 bg-white border border-zinc-300 text-gray-950 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase font-bold text-gray-400">Personal Thoughts</label>
                        <textarea
                          rows={2}
                          value={editThoughts}
                          onChange={e => setEditThoughts(e.target.value)}
                          className="w-full p-1.5 bg-white border border-zinc-300 text-gray-950 text-xs focus:outline-none resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(emp.id)}
                        className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1"
                        title="Save Changes"
                      >
                        <Check className="h-3 w-3" /> Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2.5 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-mono text-[9px] uppercase cursor-pointer flex items-center justify-center"
                        title="Cancel"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Read Mode Card
                  <div className="space-y-3 flex flex-col justify-between h-full text-left">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="h-8 w-8 bg-zinc-100 border border-zinc-200 flex items-center justify-center font-mono text-xs font-bold text-gray-900 uppercase">
                          {emp.init}
                        </div>
                        {isManageMode && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleStartEdit(emp)}
                              className="p-1 hover:bg-zinc-100 border border-transparent hover:border-zinc-300 text-zinc-500 hover:text-black cursor-pointer"
                              title="Rename / Edit details"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                              className="p-1 hover:bg-zinc-100 border border-transparent hover:border-[#E10600] text-zinc-500 hover:text-[#E10600] cursor-pointer"
                              title="Delete from list"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5 text-left">
                        <h4 className="font-display font-bold text-sm text-gray-900 tracking-tight leading-tight">
                          {emp.name}
                        </h4>
                        <div className="flex flex-wrap gap-1 items-center">
                          <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-900 font-bold">
                            {emp.role}
                          </p>
                          {emp.post && emp.post !== 'Associate' && (
                            <span className="text-[8px] tracking-wider uppercase font-mono px-1 bg-red-50 text-red-700 font-extrabold border border-red-100">
                              {emp.post}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-500 text-[11px] leading-relaxed font-light text-left">
                        {emp.spec}
                      </p>

                      {emp.thoughts && (
                        <p className="text-[10px] text-zinc-500 italic pl-1.5 border-l border-zinc-200 py-0.5 bg-zinc-50/30 text-left">
                          "{emp.thoughts}"
                        </p>
                      )}

                      {emp.phoneNumber && (
                        <p className="text-[9px] font-mono text-zinc-400 text-left">
                          Ph: <span className="text-zinc-650 font-bold">{emp.phoneNumber}</span>
                        </p>
                      )}
                    </div>

                    <div className="border-t border-zinc-100 pt-2 text-[9px] font-mono text-zinc-400 flex justify-between items-center">
                      <span>{emp.address || 'Nepalgunj, Banke'}</span>
                      <span className="text-[8px] uppercase font-bold tracking-wider bg-zinc-50 text-zinc-400 border border-zinc-100 px-1 py-0.5">Lumbini</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {employees.length === 0 && (
          <div className="text-center py-12 border border-dashed border-zinc-300 bg-zinc-50/50 space-y-3">
            <p className="text-zinc-500 text-xs font-mono">No specialized associates current on file.</p>
            <button
              onClick={() => {
                setEmployees(DEFAULT_EMPLOYEES);
                triggerNotice("Roster reset to primary 10-member staff.");
              }}
              className="px-4 py-2 border border-zinc-400 text-xs font-mono uppercase bg-white hover:border-black cursor-pointer"
            >
              Load Default Associates
            </button>
          </div>
        )}
      </section>

      {/* 4. Why Choose Us Segment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="values-grid">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-display text-3xl font-bold text-gray-900">Agency Working Standards</h2>
          <p className="text-gray-500 text-xs font-mono">We enforce strict design and management principles that filter into all client projects.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-zinc-200 bg-white space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400">STANDARD 01</span>
            <h4 className="font-display font-bold text-gray-950 text-base">Absolute Layout Performance</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              We never utilize bloated client-side code packages or animations that can cause delays on weak mobile internet cells. Our files render statically and load instantly.
            </p>
          </div>
          
          <div className="p-6 border border-zinc-200 bg-white space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400">STANDARD 02</span>
            <h4 className="font-display font-bold text-gray-950 text-base">Sovereignty of Data</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              We write secure, clean databases with clear credentials isolation. Clients possess their source repositories, avoiding dynamic locked-in traps.
            </p>
          </div>

          <div className="p-6 border border-zinc-200 bg-white space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400">STANDARD 03</span>
            <h4 className="font-display font-bold text-gray-950 text-base">Measurable Organic SEO</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Every website catalog lists correct metatags, structured layout arrays, and local address tags, pushing visibility inside Google searches for Banke district.
            </p>
          </div>
        </div>

        <div className="bg-zinc-950 text-white p-8 text-center max-w-3xl mx-auto border border-zinc-900 space-y-4">
          <h4 className="font-display font-bold text-white text-lg">Ready to review pricing schemas?</h4>
          <p className="text-zinc-400 text-xs font-mono">We provide tailored budgets starting at NPR 12,000, and comprehensive social media boosting campaigns starting at NPR 5,000/month.</p>
          <div className="flex justify-center gap-4 font-mono text-xs">
            <button
              onClick={() => onNavigate('/services')}
              className="px-5 py-2.5 bg-[#E10600] text-white font-bold uppercase tracking-wider cursor-pointer"
            >
              See Service Catalog
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-5 py-2.5 border border-zinc-800 bg-transparent hover:border-white text-zinc-350 uppercase tracking-wider cursor-pointer"
            >
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* Supabase SQL and setup tutorial modal */}
      {showSqlGuide && dbConfig && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-300 w-full max-w-2xl text-left overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-[#E10600]" />
                <h3 className="font-display font-bold text-gray-950 text-sm uppercase tracking-wide">
                  Database Integration Manager
                </h3>
              </div>
              <button 
                onClick={() => setShowSqlGuide(false)}
                className="text-gray-400 hover:text-black cursor-pointer p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Dynamic Status Section */}
              <div className={`p-4 border font-mono text-xs flex items-start gap-3 ${
                dbConfig.configured 
                  ? 'bg-[#00C853]/5 border-[#00C853]/30 text-green-950' 
                  : 'bg-amber-500/5 border-amber-500/35 text-amber-950'
              }`}>
                {dbConfig.configured ? (
                  <ShieldCheck className="h-5 w-5 text-[#00C853] shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-bold uppercase tracking-wide">
                    {dbConfig.configured ? 'Supabase Connection Active' : 'Operating on Fallback Storage'}
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Type: <span className="font-bold underline">{dbConfig.type}</span>
                  </p>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {dbConfig.configured 
                      ? `Your platform has established a real-time remote connection with Supabase Cloud Router. Schema values are managed live.` 
                      : `The server currently falls back to a persistent local JSON database, because connection secrets are missing from the environment.`}
                  </p>
                </div>
              </div>

              {/* Instructions on how to set secrets */}
              {!dbConfig.configured && (
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5 font-mono">
                    <Server className="h-4 w-4" /> 1. Connect to Supabase Cloud
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    To link standard Supabase persistence, open the **AI Studio Settings (Secrets Panel)** and register the following environment variables:
                  </p>
                  <div className="bg-zinc-50 border border-zinc-200 p-3 font-mono text-xs text-gray-700 select-all space-y-1">
                    <p>SUPABASE_URL="https://your-project-id.supabase.co"</p>
                    <p>SUPABASE_ANON_KEY="your-supabase-public-anon-key"</p>
                  </div>
                </div>
              )}

              {/* Setup Schema Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5 font-mono">
                    <Code className="h-4 w-4" /> {dbConfig.configured ? 'Database SQL Schema' : '2. Initialize SQL Script'}
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(dbConfig.tutorialScript);
                      alert("SQL Script successfully copied to clipboard!");
                    }}
                    className="text-xs font-mono font-bold text-[#E10600] hover:underline cursor-pointer"
                  >
                    Copy SQL Code
                  </button>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Run the SQL script below inside your Supabase **SQL Editor** board. It builds correct tables (users, inquiries, services, portfolio, marketing packages, contact messages, and employees) and pre-populates initial seed rosters:
                </p>
                <div className="relative">
                  <pre className="bg-zinc-950 text-emerald-400 font-mono text-[10px] p-4 overflow-auto max-h-60 border border-zinc-900 select-all leading-normal whitespace-pre">
                    {dbConfig.tutorialScript}
                  </pre>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-200 bg-zinc-50 text-right">
              <button
                onClick={() => setShowSqlGuide(false)}
                className="px-4 py-2 bg-black text-white text-xs font-mono font-bold uppercase hover:bg-zinc-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom State-driven Deletion / Prompt Confirmation Dialog Modal (Iframe-safe) */}
      {confirmModal && (
        <div 
          id="confirm-modal-overlay"
          className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-[100] p-4 animate-fade-in"
          onClick={() => setConfirmModal(null)}
        >
          <div 
            id="confirm-modal-card"
            className="bg-white border-4 border-[#E10600] max-w-md w-full shadow-2xl p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-red-100 text-[#E10600] shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-black text-lg text-gray-900 uppercase tracking-tight">
                  {confirmModal.title}
                </h3>
                <p className="mt-2 text-sm text-gray-700 font-sans leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-150 pt-4">
              <button
                id="confirm-modal-cancel"
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-xs font-bold uppercase cursor-pointer"
              >
                No, Disregard
              </button>
              <button
                id="confirm-modal-submit"
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 bg-[#E10600] text-white hover:bg-red-700 text-xs font-bold uppercase cursor-pointer transition-none flex items-center gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" /> Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
