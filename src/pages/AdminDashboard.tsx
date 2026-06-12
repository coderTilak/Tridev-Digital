/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Users, Shield, Layout, Settings, FileSpreadsheet, 
  Trash2, Edit, CheckCircle2, ChevronRight, MessageSquare, Plus, RefreshCw, 
  Compass, AlertTriangle, TrendingUp, Info, ShieldAlert, KanbanSquare,
  UserPlus, RotateCcw, Check, X, Edit2
} from 'lucide-react';
import { 
  UserProfile, Inquiry, PortfolioItem, ServiceDetail, MarketingPackage, ContactMessage, InquiryStatus, ServiceType 
} from '../types';
import { api } from '../lib/api';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

type AdminTab = 'inquiries' | 'portfolio' | 'services' | 'packages' | 'contacts' | 'users' | 'analytics' | 'employees';

const DEFAULT_EMPLOYEES = [
  { 
    id: "emp-001", 
    name: "Tilak Kanojiya", 
    role: "Director & Tech Lead", 
    post: "Director",
    phoneNumber: "9812453147",
    address: "Nepalgunj, Banke (Near Gulma)",
    spec: "Under Tilak's command, Tridev Digital has established a strict protocol for software quality: fully hand-typed templates, standard mobile dimensions, and resilient query resolution.",
    thoughts: "We believe that every organization in Nepalgunj—from a small family-run confectionery to an expansive trade firm—merits robust corporate integrity. We do not design static code that remains dusty; we engineer active web portfolios that generate leads, establish authority, and survive high-traffic cleanly.",
    init: "TK" 
  },
  { 
    id: "emp-002", 
    name: "Aryan Rajbashi", 
    role: "Project Manager", 
    post: "Project Manager",
    phoneNumber: "9769277257",
    address: "Nepalgunj, Banke",
    spec: "Coordinates immediate support queries, design feedback, estimates, and project schedules, guaranteeing direct communication lines.",
    thoughts: "Clear communication is key. We ensure that our clients in Nepalgunj, Kohalpur, and across Lumbini province are updated with exact mockups and timelines.",
    init: "AR" 
  },
  { 
    id: "emp-1", 
    name: "Nirajan Shrestha", 
    role: "Lead Frontend Engineer", 
    post: "Associate",
    phoneNumber: "9800000001",
    address: "Nepalgunj, Banke",
    spec: "Specialist in Tailwind CSS layouts & responsive React setups.", 
    thoughts: "Building interface experiences with flawless responsive transitions and fast 3G loading.",
    init: "NS" 
  },
  { 
    id: "emp-2", 
    name: "Prerna Rokaya", 
    role: "UI/UX System Architect", 
    post: "Associate",
    phoneNumber: "9800000002",
    address: "Nepalgunj, Banke",
    spec: "Creates high-fidelity wireframes & customized typography guides.", 
    thoughts: "Good design is architecturally honest. Every pixel has a purpose.",
    init: "PR" 
  },
  { 
    id: "emp-3", 
    name: "Sushil Chaudhary", 
    role: "Backend Architect", 
    post: "Associate",
    phoneNumber: "9800000003",
    address: "Kohalpur, Banke",
    spec: "Optimizes scalable Node.js servers, API routing & Firestore DBs.", 
    thoughts: "Data structures should be designed early and persist cleanly.",
    init: "SC" 
  },
  { 
    id: "emp-4", 
    name: "Aliza Bajracharya", 
    role: "Digital Media strategist", 
    post: "Associate",
    phoneNumber: "9800000004",
    address: "Nepalgunj, Banke",
    spec: "Leads High-ROI target campaigns on Facebook, Instagram & TikTok.", 
    thoughts: "Ads must tell a story that resonates with Midwestern Nepal's custom markets.",
    init: "AB" 
  },
  { 
    id: "emp-5", 
    name: "Rohan Thapa", 
    role: "QA Engineering Lead", 
    post: "Associate",
    phoneNumber: "9800000005",
    address: "Nepalgunj, Banke",
    spec: "Maintains cross-device safety standards and stress resolution testing.", 
    thoughts: "Every form must validation-test flawlessly before deployment.",
    init: "RT" 
  },
  { 
    id: "emp-6", 
    name: "Binisha Dixit", 
    role: "Lead Copywriter", 
    post: "Associate",
    phoneNumber: "9800000006",
    address: "Nepalgunj, Banke",
    spec: "Produces targeted regional sales copies and dynamic metadata.", 
    thoughts: "A compelling copy speaks directly to the reader's needs.",
    init: "BD" 
  },
  { 
    id: "emp-7", 
    name: "Kiran Sunar", 
    role: "Creative Graphic Lead", 
    post: "Associate",
    phoneNumber: "9800000007",
    address: "Nepalgunj, Banke",
    spec: "Directs visual asset creation and pixel-perfect vector files.", 
    thoughts: "Translating corporate statements into beautiful layouts and icons.",
    init: "KS" 
  },
  { 
    id: "emp-8", 
    name: "Asmita G.C.", 
    role: "App Developer", 
    post: "Associate",
    phoneNumber: "9800000008",
    address: "Kohalpur, Banke",
    spec: "Engineers hybrid mobile applications with low latency 3G settings.", 
    thoughts: "Mobile applications should be fast and available on any connection speed.",
    init: "AG" 
  },
  { 
    id: "emp-9", 
    name: "Devendra Yogi", 
    role: "Organic SEO Analyst", 
    post: "Associate",
    phoneNumber: "9800000009",
    address: "Nepalgunj, Banke",
    spec: "Optimizes localized web ranks inside Banke & Kohalpur markets.", 
    thoughts: "Organic ranking is a marathon, but the ROI is unbeatable.",
    init: "DY" 
  },
  { 
    id: "emp-10", 
    name: "Samyak Shakya", 
    role: "Systems Engineer", 
    post: "Associate",
    phoneNumber: "9800000010",
    address: "Nepalgunj, Banke",
    spec: "Configures secure hosting, region CDN buffers & custom domains.", 
    thoughts: "Securing modern hostings with custom CDN routes to run offline fast.",
    init: "SS" 
  }
];

export default function AdminDashboard({ onNavigate, currentUser, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [packages, setPackages] = useState<MarketingPackage[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Editing state for inquiries status/remarks
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [inquiryStatusInput, setInquiryStatusInput] = useState<InquiryStatus>('Pending');
  const [inquiryRemarksInput, setInquiryRemarksInput] = useState('');

  // Creation forms states
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [portfolioInput, setPortfolioInput] = useState({
    title: '',
    description: '',
    category: 'Websites' as 'Websites' | 'Mobile Apps' | 'Branding' | 'Marketing',
    toolsUsed: '',
    imageUrl: ''
  });

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceInput, setServiceInput] = useState({
    title: '',
    subtitle: '',
    startingPrice: '',
    features: '',
    type: 'Website Development' as ServiceType
  });

  const [showPackageForm, setShowPackageForm] = useState(false);
  const [packageInput, setPackageInput] = useState({
    name: '',
    price: '',
    features: ''
  });

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

  // Editing forms states
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [portfolioEditInput, setPortfolioEditInput] = useState({
    title: '',
    description: '',
    category: 'Websites' as 'Websites' | 'Mobile Apps' | 'Branding' | 'Marketing',
    toolsUsed: '',
    imageUrl: ''
  });

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceEditInput, setServiceEditInput] = useState({
    title: '',
    subtitle: '',
    startingPrice: '',
    features: '',
    type: 'Website Development' as ServiceType
  });

  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [packageEditInput, setPackageEditInput] = useState({
    name: '',
    price: '',
    features: ''
  });

  // Employee management states
  const [employees, setEmployees] = useState<any[]>([]);

  const [empEditingId, setEmpEditingId] = useState<string | null>(null);
  
  // Add Employee Form Inputs
  const [empNameInput, setEmpNameInput] = useState('');
  const [empRoleInput, setEmpRoleInput] = useState('');
  const [empPostInput, setEmpPostInput] = useState('Associate');
  const [empPhoneInput, setEmpPhoneInput] = useState('');
  const [empAddressInput, setEmpAddressInput] = useState('Nepalgunj, Banke');
  const [empSpecInput, setEmpSpecInput] = useState('');
  const [empThoughtsInput, setEmpThoughtsInput] = useState('');
  const [empInitInput, setEmpInitInput] = useState('');

  // Edit Employee Form Inputs
  const [empEditName, setEmpEditName] = useState('');
  const [empEditRole, setEmpEditRole] = useState('');
  const [empEditPost, setEmpEditPost] = useState('Associate');
  const [empEditPhone, setEmpEditPhone] = useState('');
  const [empEditAddress, setEmpEditAddress] = useState('');
  const [empEditSpec, setEmpEditSpec] = useState('');
  const [empEditThoughts, setEmpEditThoughts] = useState('');
  const [empEditInit, setEmpEditInit] = useState('');

  const [showAddEmpForm, setShowAddEmpForm] = useState(false);
  const [empSearchQuery, setEmpSearchQuery] = useState('');

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empNameInput.trim() || !empRoleInput.trim() || !empSpecInput.trim()) {
      setError("Please provide Name, Role, and Specialty details for the new employee.");
      return;
    }
    const finalInit = empInitInput.trim() ? empInitInput.trim().toUpperCase().slice(0, 2) : empNameInput.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    try {
      const payload = {
        name: empNameInput.trim(),
        role: empRoleInput.trim(),
        post: empPostInput,
        phoneNumber: empPhoneInput.trim() || '9812453147',
        address: empAddressInput.trim() || 'Nepalgunj, Banke',
        spec: empSpecInput.trim(),
        thoughts: empThoughtsInput.trim() || `Excelling in the ${empRoleInput.trim()} domain at Tridev.`,
        init: finalInit || "EE"
      };
      
      const created = await api.createEmployee(payload);
      setEmployees(prev => [...prev, created]);
      
      setEmpNameInput('');
      setEmpRoleInput('');
      setEmpPostInput('Associate');
      setEmpPhoneInput('');
      setEmpAddressInput('Nepalgunj, Banke');
      setEmpSpecInput('');
      setEmpThoughtsInput('');
      setEmpInitInput('');
      setShowAddEmpForm(false);
      showSuccessFeedback(`Added staff member "${created.name}" successfully to database!`);
    } catch (err: any) {
      setError(err.message || 'Failed to add employee to database.');
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    askConfirmation(
      'Remove Staff Member',
      `Are you sure you want to delete staff member "${name}" from Tridev Digital's directory?`,
      async () => {
        try {
          await api.deleteEmployee(id);
          setEmployees(prev => prev.filter(emp => emp.id !== id));
          if (empEditingId === id) {
            setEmpEditingId(null);
          }
          showSuccessFeedback(`Removed staff member "${name}" successfully from database.`);
        } catch (err: any) {
          setError(err.message || 'Failed to remove employee.');
        }
      }
    );
  };

  const handleStartEditEmployee = (emp: any) => {
    setEmpEditingId(emp.id);
    setEmpEditName(emp.name);
    setEmpEditRole(emp.role);
    setEmpEditPost(emp.post || 'Associate');
    setEmpEditPhone(emp.phoneNumber || '');
    setEmpEditAddress(emp.address || '');
    setEmpEditSpec(emp.spec || '');
    setEmpEditThoughts(emp.thoughts || '');
    setEmpEditInit(emp.init || '');
  };

  const handleSaveEditEmployee = async (id: string) => {
    if (!empEditName.trim() || !empEditRole.trim() || !empEditSpec.trim()) {
      setError("Name, Role, and Specialty fields are required.");
      return;
    }
    const finalInit = empEditInit.trim() ? empEditInit.trim().toUpperCase().slice(0, 2) : empEditName.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    try {
      const payload = {
        name: empEditName.trim(),
        role: empEditRole.trim(),
        post: empEditPost,
        phoneNumber: empEditPhone.trim(),
        address: empEditAddress.trim(),
        spec: empEditSpec.trim(),
        thoughts: empEditThoughts.trim(),
        init: finalInit || "EE"
      };

      const updated = await api.updateEmployee(id, payload);
      setEmployees(prev => prev.map(emp => emp.id === id ? updated : emp));
      setEmpEditingId(null);
      showSuccessFeedback(`Successfully updated and saved details for "${updated.name}" in database.`);
    } catch (err: any) {
      setError(err.message || 'Failed to update employee details.');
    }
  };

  const handleResetEmployees = async () => {
    askConfirmation(
      'Restore Default Associates',
      'Restore dynamic employee database to default values? This resets any customized names, posts, and details in your database schema.',
      async () => {
        try {
          const resetList = await api.resetEmployees(DEFAULT_EMPLOYEES);
          setEmployees(resetList);
          setEmpEditingId(null);
          showSuccessFeedback("Dynamic employee structure has been reset to defaults in database.");
        } catch (err: any) {
          setError(err.message || 'Failed to restore default associates.');
        }
      }
    );
  };

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      onNavigate('/login');
      return;
    }
    loadAllAdminData();
  }, [currentUser]);

  const loadAllAdminData = async () => {
    setLoading(true);
    setError(null);

    const safeFetch = async <T,>(fn: () => Promise<T>, fallback: T, tableName: string): Promise<T> => {
      try {
        return await fn();
      } catch (err: any) {
        console.warn(`[Admin Dashboard Warning] Failed to fetch table '${tableName}':`, err.message || err);
        return fallback;
      }
    };

    try {
      const [
        inqsData, portData, srvsData, pkgsData, msgsData, usersData, statsData, empData
      ] = await Promise.all([
        safeFetch(() => api.getInquiries(), [], 'Inquiries'),
        safeFetch(() => api.getPortfolio(), [], 'Portfolio'),
        safeFetch(() => api.getServices(), [], 'Services'),
        safeFetch(() => api.getMarketingPackages(), [], 'MarketingPackages'),
        safeFetch(() => api.getContactMessages(), [], 'ContactMessages'),
        safeFetch(() => api.getUsers(), [], 'Users'),
        safeFetch(() => api.getAnalytics(), {
          totalInquiries: 0,
          pendingInquiries: 0,
          approvedInquiries: 0,
          scaleInquiryTypes: {},
          budgetDistribution: {}
        } as any, 'Analytics'),
        safeFetch(() => api.getEmployees(), [], 'Employees')
      ]);

      setInquiries(inqsData);
      setPortfolio(portData);
      setServices(srvsData);
      setPackages(pkgsData);
      setContacts(msgsData);
      setUsers(usersData);
      setAnalytics(statsData);
      setEmployees(empData);
    } catch (err: any) {
      setError(err.message || 'Error occurred loading administrative datastore.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessFeedback = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Inquiry actions
  const handleSelectInquiryForEdit = (inq: Inquiry) => {
    setSelectedInquiryId(inq.id);
    setInquiryStatusInput(inq.status);
    setInquiryRemarksInput(inq.adminRemarks || '');
  };

  const handleUpdateInquiry = async () => {
    if (!selectedInquiryId) return;
    try {
      await api.updateInquiryStatus(selectedInquiryId, inquiryStatusInput, inquiryRemarksInput);
      showSuccessFeedback(`Inquiry Serial ${selectedInquiryId} updated securely!`);
      setSelectedInquiryId(null);
      await loadAllAdminData();
    } catch (err: any) {
      setError(err.message || 'Error saving inquiry updates.');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    askConfirmation(
      'Delete Inquiry',
      'Are you absolutely sure you want to delete this client inquiry?',
      async () => {
        try {
          await api.deleteInquiry(id);
          showSuccessFeedback('Inquiry record deleted.');
          await loadAllAdminData();
        } catch (err: any) {
          setError(err.message);
        }
      }
    );
  };

  // Portfolio items actions
  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const toolsArray = portfolioInput.toolsUsed.split(',').map(s => s.trim()).filter(Boolean);
      await api.createPortfolioItem({
        title: portfolioInput.title,
        description: portfolioInput.description,
        category: portfolioInput.category,
        toolsUsed: toolsArray,
        imageUrl: portfolioInput.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
      });
      showSuccessFeedback('New portfolio showcase item added.');
      setShowPortfolioForm(false);
      setPortfolioInput({ title: '', description: '', category: 'Websites', toolsUsed: '', imageUrl: '' });
      await loadAllAdminData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    askConfirmation(
      'Delete Portfolio Item',
      'Delete this portfolio item from live catalogs?',
      async () => {
        try {
          await api.deletePortfolioItem(id);
          showSuccessFeedback('Item deleted successfully.');
          await loadAllAdminData();
        } catch (err: any) {
          setError(err.message);
        }
      }
    );
  };

  // Services actions
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const featuresArray = serviceInput.features.split('\n').map(s => s.trim()).filter(Boolean);
      await api.createService({
        title: serviceInput.title,
        subtitle: serviceInput.subtitle,
        startingPrice: serviceInput.startingPrice,
        features: featuresArray,
        type: serviceInput.type
      });
      showSuccessFeedback('Digital service option saved.');
      setShowServiceForm(false);
      setServiceInput({ title: '', subtitle: '', startingPrice: '', features: '', type: 'Website Development' });
      await loadAllAdminData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteService = async (id: string) => {
    askConfirmation(
      'Delete Service Option',
      'Formally delete this service item?',
      async () => {
        try {
          await api.deleteService(id);
          showSuccessFeedback('Service option deleted.');
          await loadAllAdminData();
        } catch (err: any) {
          setError(err.message);
        }
      }
    );
  };

  // Packages actions
  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const featuresArray = packageInput.features.split('\n').map(s => s.trim()).filter(Boolean);
      await api.createMarketingPackage({
        name: packageInput.name,
        price: packageInput.price,
        features: featuresArray
      });
      showSuccessFeedback('Social marketing package saved.');
      setShowPackageForm(false);
      setPackageInput({ name: '', price: '', features: '' });
      await loadAllAdminData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeletePackage = async (id: string) => {
    askConfirmation(
      'Delete Marketing Package',
      'Delete this monthly package selection?',
      async () => {
        try {
          await api.deleteMarketingPackage(id);
          showSuccessFeedback('Promotion package deleted.');
          await loadAllAdminData();
        } catch (err: any) {
          setError(err.message);
        }
      }
    );
  };

  // Portfolio items editing actions
  const handleStartEditPortfolio = (item: PortfolioItem) => {
    setEditingPortfolioId(item.id);
    setPortfolioEditInput({
      title: item.title,
      description: item.description,
      category: item.category,
      toolsUsed: (item.toolsUsed || []).join(', '),
      imageUrl: item.imageUrl
    });
  };

  const handleSaveEditPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPortfolioId) return;
    try {
      const toolsArray = portfolioEditInput.toolsUsed.split(',').map(s => s.trim()).filter(Boolean);
      await api.updatePortfolioItem(editingPortfolioId, {
        title: portfolioEditInput.title,
        description: portfolioEditInput.description,
        category: portfolioEditInput.category,
        toolsUsed: toolsArray,
        imageUrl: portfolioEditInput.imageUrl
      });
      showSuccessFeedback('Portfolio item updated successfully.');
      setEditingPortfolioId(null);
      await loadAllAdminData();
    } catch (err: any) {
      setError(err.message || 'Failed to update portfolio item.');
    }
  };

  // Services editing actions
  const handleStartEditService = (srv: ServiceDetail) => {
    setEditingServiceId(srv.id);
    setServiceEditInput({
      title: srv.title,
      subtitle: srv.subtitle,
      startingPrice: srv.startingPrice,
      features: (srv.features || []).join('\n'),
      type: srv.type
    });
  };

  const handleSaveEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceId) return;
    try {
      const featuresArray = serviceEditInput.features.split('\n').map(s => s.trim()).filter(Boolean);
      await api.updateService(editingServiceId, {
        title: serviceEditInput.title,
        subtitle: serviceEditInput.subtitle,
        startingPrice: serviceEditInput.startingPrice,
        features: featuresArray,
        type: serviceEditInput.type
      });
      showSuccessFeedback('Service details verified and updated.');
      setEditingServiceId(null);
      await loadAllAdminData();
    } catch (err: any) {
      setError(err.message || 'Failed to update service details.');
    }
  };

  // Marketing Packages editing actions
  const handleStartEditPackage = (pkg: MarketingPackage) => {
    setEditingPackageId(pkg.id);
    setPackageEditInput({
      name: pkg.name,
      price: pkg.price,
      features: (pkg.features || []).join('\n')
    });
  };

  const handleSaveEditPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackageId) return;
    try {
      const featuresArray = packageEditInput.features.split('\n').map(s => s.trim()).filter(Boolean);
      await api.updateMarketingPackage(editingPackageId, {
        name: packageEditInput.name,
        price: packageEditInput.price,
        features: featuresArray
      });
      showSuccessFeedback('Marketing package subscription updated.');
      setEditingPackageId(null);
      await loadAllAdminData();
    } catch (err: any) {
      setError(err.message || 'Failed to update marketing package.');
    }
  };

  // Contact actions
  const handleResolveContact = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'Unread' ? 'Read' : 'Resolved';
      await api.updateContactMessageStatus(id, nextStatus);
      showSuccessFeedback('Contact record status updated.');
      await loadAllAdminData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteContact = async (id: string) => {
    askConfirmation(
      'Delete Contact Message',
      'Delete this contact message permanently?',
      async () => {
        try {
          await api.deleteContactMessage(id);
          showSuccessFeedback('Message removed.');
          await loadAllAdminData();
        } catch (err: any) {
          setError(err.message);
        }
      }
    );
  };

  if (!currentUser || !currentUser.isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="tridev-admin-dashboard">
      
      {/* 1. Header Admin Suite */}
      <div className="border-b-4 border-[#E10600] pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono bg-red-100 text-[#E10600] px-2 py-0.5 font-bold tracking-widest flex items-center gap-1">
              <Shield className="h-3 w-3 shrink-0" />
              Administrative Root
            </span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-gray-950 mt-1">Tridev Digital Control Suite</h1>
          <p className="text-gray-500 text-xs">Official portal managed by director Tilak Kanojiya.</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={loadAllAdminData}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold uppercase transition-none cursor-pointer bg-white"
          >
            <RefreshCw className="h-3 w-3" /> Reload Database
          </button>
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-gray-900 border border-gray-900 text-white hover:bg-[#E10600] text-xs font-bold uppercase transition-none cursor-pointer"
          >
            Log Out Session
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 mb-6 bg-emerald-50 border border-[#00C853] text-emerald-800 text-xs font-bold uppercase">
          ✔ {successMsg}
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
          ⚠ {error}
        </div>
      )}

      {/* 2. Admin Nav bar Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left tabs menu panel */}
        <aside className="lg:col-span-3 space-y-1">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-left border cursor-pointer transition-none ${
              activeTab === 'inquiries' ? 'bg-[#E10600] text-white border-[#E10600]' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <span>Manage Inquiries</span>
            <span className="font-mono bg-black bg-opacity-20 px-1.5 py-0.5 text-[9px] text-white font-bold">{inquiries.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-left border cursor-pointer transition-none ${
              activeTab === 'portfolio' ? 'bg-[#E10600] text-white border-[#E10600]' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <span>Portfolio manager</span>
            <span className="font-mono bg-black bg-opacity-20 px-1.5 py-0.5 text-[9px] text-white font-bold">{portfolio.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-left border cursor-pointer transition-none ${
              activeTab === 'services' ? 'bg-[#E10600] text-white border-[#E10600]' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <span>Service Catalog Config</span>
            <span className="font-mono bg-black bg-opacity-20 px-1.5 py-0.5 text-[9px] text-white font-bold">{services.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-left border cursor-pointer transition-none ${
              activeTab === 'packages' ? 'bg-[#E10600] text-white border-[#E10600]' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <span>Promotion Packages</span>
            <span className="font-mono bg-black bg-opacity-20 px-1.5 py-0.5 text-[9px] text-white font-bold">{packages.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-left border cursor-pointer transition-none ${
              activeTab === 'contacts' ? 'bg-[#E10600] text-white border-[#E10600]' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <span>Contact Messages</span>
            <span className="font-mono bg-black bg-opacity-20 px-1.5 py-0.5 text-[9px] text-white font-bold">{contacts.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-left border cursor-pointer transition-none ${
              activeTab === 'users' ? 'bg-[#E10600] text-white border-[#E10600]' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <span>Registered Clients</span>
            <span className="font-mono bg-black bg-opacity-20 px-1.5 py-0.5 text-[9px] text-white font-bold">{users.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-left border cursor-pointer transition-none ${
              activeTab === 'analytics' ? 'bg-[#E10600] text-white border-[#E10600]' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <span>Platform metrics</span>
            <TrendingUp className="h-4 w-4 shrink-0" />
          </button>

          <button
            onClick={() => setActiveTab('employees')}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-left border cursor-pointer transition-none ${
              activeTab === 'employees' ? 'bg-[#E10600] text-white border-[#E10600]' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <span>Employee System</span>
            <Users className="h-4 w-4 shrink-0" />
          </button>
        </aside>

        {/* Right work area (absolutely static, no transitions) */}
        <main className="lg:col-span-9 bg-white border border-gray-200 p-6 md:p-8">
          
          {/* TAB: Manage Inquiries */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-bold text-gray-950 uppercase border-b border-gray-100 pb-2">
                Client Service Inquiries ({inquiries.length})
              </h2>

              {/* Inquiry Editor Panel */}
              {selectedInquiryId && (
                <div className="p-5 border-2 border-red-200 bg-red-50/40 space-y-4">
                  <h3 className="font-display text-sm font-bold text-[#E10600] uppercase">Update Inquiry Reference: {selectedInquiryId}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">Milestone Stage</label>
                      <select
                        value={inquiryStatusInput}
                        onChange={(e) => setInquiryStatusInput(e.target.value as InquiryStatus)}
                        className="w-full h-10 px-3 border border-gray-300 focus:outline-none focus:border-[#E10600] bg-white text-sm"
                      >
                        <option value="Pending">Pending (Unreviewed)</option>
                        <option value="Reviewing">Reviewing (Requirements check)</option>
                        <option value="In Progress">In Progress (Active Coding)</option>
                        <option value="Completed">Completed (Live Deployment)</option>
                        <option value="Cancelled">Cancelled (Archived)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">Director Remarks / Resolution notes</label>
                      <textarea
                        value={inquiryRemarksInput}
                        onChange={(e) => setInquiryRemarksInput(e.target.value)}
                        placeholder="Type updates regarding phone discussions or layout confirmations..."
                        rows={3}
                        className="w-full px-3 py-1.5 border border-gray-300 focus:outline-none focus:border-[#E10600] bg-white text-xs"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateInquiry}
                      className="px-4 py-2 bg-[#E10600] text-white text-xs font-bold uppercase cursor-pointer"
                    >
                      Update Datastore Row
                    </button>
                    <button
                      onClick={() => setSelectedInquiryId(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold uppercase bg-white cursor-pointer"
                    >
                      Dismiss Editor
                    </button>
                  </div>
                </div>
              )}

              {/* Inquiries List */}
              {inquiries.length === 0 ? (
                <p className="text-gray-500 font-mono text-xs text-center py-8">No client inquiries found in database.</p>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="border border-gray-200 p-4 space-y-4 hover:border-gray-950">
                      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-100 pb-2">
                        <div>
                          <span className="text-xs font-bold font-mono text-gray-800">{inq.id}</span>
                          <span className="text-[10px] font-mono text-gray-400 block sm:inline sm:ml-4">
                            Submitted: {new Date(inq.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider border font-mono font-bold px-2 py-0.5 ${
                          inq.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          inq.status === 'Cancelled' ? 'bg-red-50 text-red-800 border-red-200' :
                          'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {inq.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-gray-400 font-bold block text-[9px] uppercase">Client Identity Coordinates</p>
                          <p className="font-bold text-gray-950 mt-0.5">
                            {inq.fullName} ({inq.companyName || 'Individual'})
                          </p>
                          <p className="text-gray-500 text-[11px] font-mono mt-0.5">
                            {inq.email} | Mobile: {inq.phoneNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-bold block text-[9px] uppercase">Technology Requirement & Budget</p>
                          <p className="font-bold text-gray-950 mt-0.5">
                            {inq.serviceType}
                          </p>
                          <p className="text-gray-500 text-[11px] font-mono mt-0.5">
                            Bracket: {inq.budgetRange}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 text-xs italic text-gray-700 border border-gray-100 leading-relaxed">
                        "{inq.projectDescription}"
                      </div>

                      {inq.adminRemarks && (
                        <div className="bg-amber-50 border border-amber-200 p-3 text-xs rounded-none">
                          <span className="font-bold text-[#E10650] block text-[9px] uppercase tracking-wider font-mono">Current Administrative Remark:</span>
                          <p className="text-gray-900 mt-0.5">{inq.adminRemarks}</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => handleSelectInquiryForEdit(inq)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-[#E10600] hover:text-white border border-transparent text-xs font-bold uppercase transition-none cursor-pointer"
                        >
                          <Edit className="h-3 w-3" /> Update Status / Remarks
                        </button>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase transition-none cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" /> Delete Inquiry
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Portfolio Manager */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h2 className="font-display text-xl font-bold text-gray-950 uppercase">Portfolio Datastore Manager ({portfolio.length})</h2>
                <button
                  onClick={() => setShowPortfolioForm(!showPortfolioForm)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#E10600] text-white text-xs font-bold uppercase cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Projects
                </button>
              </div>

              {/* Creator Form */}
              {showPortfolioForm && (
                <form onSubmit={handleCreatePortfolio} className="p-4 border border-gray-200 bg-gray-50/40 space-y-4 max-w-xl">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 font-mono">Add Showcase Item</h3>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Project Name</label>
                    <input
                      type="text" required
                      value={portfolioInput.title}
                      onChange={(e) => setPortfolioInput({ ...portfolioInput, title: e.target.value })}
                      placeholder="E.g., Nepalgunj Agro Store"
                      className="w-full h-10 px-3 border border-gray-300 text-xs bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Short Description</label>
                    <textarea
                      required
                      value={portfolioInput.description}
                      onChange={(e) => setPortfolioInput({ ...portfolioInput, description: e.target.value })}
                      placeholder="Explain features, deliverables, or objectives..."
                      rows={3}
                      className="w-full px-3 py-1.5 border border-gray-300 text-xs bg-white focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Category Choice</label>
                      <select
                        value={portfolioInput.category}
                        onChange={(e) => setPortfolioInput({ ...portfolioInput, category: e.target.value as any })}
                        className="w-full h-10 px-3 border border-gray-300 bg-white text-xs"
                      >
                        <option value="Websites">Websites</option>
                        <option value="Mobile Apps">Mobile Apps</option>
                        <option value="Branding">Branding</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Technical Tools (Comma separated)</label>
                      <input
                        type="text" required
                        value={portfolioInput.toolsUsed}
                        onChange={(e) => setPortfolioInput({ ...portfolioInput, toolsUsed: e.target.value })}
                        placeholder="React, Tailwind, Node.js"
                        className="w-full h-10 px-3 border border-gray-300 text-xs bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Unsplash Image URL</label>
                    <input
                      type="text"
                      value={portfolioInput.imageUrl}
                      onChange={(e) => setPortfolioInput({ ...portfolioInput, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full h-10 px-3 border border-gray-300 text-xs bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-gray-950 text-white text-xs font-bold uppercase cursor-pointer">
                      Save Item
                    </button>
                    <button type="button" onClick={() => setShowPortfolioForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 bg-white text-xs font-bold uppercase cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Editing Form */}
              {editingPortfolioId && (
                <form onSubmit={handleSaveEditPortfolio} className="p-4 border-2 border-red-200 bg-red-50/10 space-y-4 max-w-xl">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-red-700 font-mono flex items-center gap-1.5">
                    <Edit className="h-4 w-4" /> Edit Showcase Item ({editingPortfolioId})
                  </h3>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Project Name</label>
                    <input
                      type="text" required
                      value={portfolioEditInput.title}
                      onChange={(e) => setPortfolioEditInput({ ...portfolioEditInput, title: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 text-xs bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Short Description</label>
                    <textarea
                      required
                      value={portfolioEditInput.description}
                      onChange={(e) => setPortfolioEditInput({ ...portfolioEditInput, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-1.5 border border-gray-300 text-xs bg-white focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Category Choice</label>
                      <select
                        value={portfolioEditInput.category}
                        onChange={(e) => setPortfolioEditInput({ ...portfolioEditInput, category: e.target.value as any })}
                        className="w-full h-10 px-3 border border-gray-300 bg-white text-xs"
                      >
                        <option value="Websites">Websites</option>
                        <option value="Mobile Apps">Mobile Apps</option>
                        <option value="Branding">Branding</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Technical Tools (Comma separated)</label>
                      <input
                        type="text" required
                        value={portfolioEditInput.toolsUsed}
                        onChange={(e) => setPortfolioEditInput({ ...portfolioEditInput, toolsUsed: e.target.value })}
                        className="w-full h-10 px-3 border border-gray-300 text-xs bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Unsplash Image URL</label>
                    <input
                      type="text"
                      value={portfolioEditInput.imageUrl}
                      onChange={(e) => setPortfolioEditInput({ ...portfolioEditInput, imageUrl: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 text-xs bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-red-650 text-white bg-red-600 text-xs font-bold uppercase cursor-pointer">
                      Save Changes
                    </button>
                    <button type="button" onClick={() => setEditingPortfolioId(null)} className="px-4 py-2 border border-gray-300 text-gray-700 bg-white text-xs font-bold uppercase cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.map((item) => (
                  <div key={item.id} className="border border-gray-200 p-3 hover:border-gray-950">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#E10600]">{item.category}</span>
                        <h4 className="font-display font-bold text-gray-900 mt-0.5">{item.title}</h4>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleStartEditPortfolio(item)}
                          className="p-1 border border-gray-300 text-gray-700 hover:border-black bg-white cursor-pointer"
                          title="Edit project details"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePortfolio(item.id)}
                          className="p-1 border border-red-200 text-red-600 bg-white cursor-pointer hover:bg-red-50"
                          title="Delete project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed h-12 overflow-hidden">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.toolsUsed.map((t, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 font-mono text-[9px] px-1.5 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Services Configurations */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h2 className="font-display text-xl font-bold text-gray-950 uppercase">Services catalog ({services.length})</h2>
                <button
                  onClick={() => setShowServiceForm(!showServiceForm)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#E10600] text-white text-xs font-bold uppercase cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Create Service
                </button>
              </div>

              {showServiceForm && (
                <form onSubmit={handleCreateService} className="p-4 border border-gray-200 bg-gray-50/40 space-y-4 max-w-xl">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 font-mono">Create Standard Service Tiers</h3>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Service Title</label>
                    <input
                      type="text" required
                      value={serviceInput.title}
                      onChange={(e) => setServiceInput({ ...serviceInput, title: e.target.value })}
                      placeholder="E.g., Dynamic Portal Redesign"
                      className="w-full h-10 px-3 border border-gray-300 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Pricing Subtitle</label>
                    <input
                      type="text" required
                      value={serviceInput.subtitle}
                      onChange={(e) => setServiceInput({ ...serviceInput, subtitle: e.target.value })}
                      placeholder="E.g., Starting NPR 15,000"
                      className="w-full h-10 px-3 border border-gray-300 text-xs bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Starting Price Value</label>
                      <input
                        type="text" required
                        value={serviceInput.startingPrice}
                        onChange={(e) => setServiceInput({ ...serviceInput, startingPrice: e.target.value })}
                        placeholder="NPR 25,000"
                        className="w-full h-10 px-3 border border-gray-300 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Service category</label>
                      <select
                        value={serviceInput.type}
                        onChange={(e) => setServiceInput({ ...serviceInput, type: e.target.value as any })}
                        className="w-full h-10 px-3 border border-gray-300 bg-white text-xs"
                      >
                        <option value="Website Development">Website Development</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Branding">Branding</option>
                        <option value="Graphic Design">Graphic Design</option>
                        <option value="Video Editing">Video Editing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Scope Features (One row per item)</label>
                    <textarea
                      required
                      value={serviceInput.features}
                      onChange={(e) => setServiceInput({ ...serviceInput, features: e.target.value })}
                      placeholder="Fully dynamic layouts&#10;Includes 1 month priority maintenance&#10;Google lookup structured"
                      rows={4}
                      className="w-full px-3 py-1.5 border border-gray-300 text-xs bg-white"
                    ></textarea>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-gray-950 text-white text-xs font-bold uppercase cursor-pointer">
                      Save service
                    </button>
                    <button type="button" onClick={() => setShowServiceForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 bg-white text-xs font-bold uppercase cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Editing Form */}
              {editingServiceId && (
                <form onSubmit={handleSaveEditService} className="p-4 border-2 border-red-200 bg-red-50/10 space-y-4 max-w-xl">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-red-700 font-mono flex items-center gap-1.5">
                    <Edit className="h-4 w-4" /> Edit Service Details ({editingServiceId})
                  </h3>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Service Title</label>
                    <input
                      type="text" required
                      value={serviceEditInput.title}
                      onChange={(e) => setServiceEditInput({ ...serviceEditInput, title: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Pricing Subtitle</label>
                    <input
                      type="text" required
                      value={serviceEditInput.subtitle}
                      onChange={(e) => setServiceEditInput({ ...serviceEditInput, subtitle: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 text-xs bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Starting Price Value</label>
                      <input
                        type="text" required
                        value={serviceEditInput.startingPrice}
                        onChange={(e) => setServiceEditInput({ ...serviceEditInput, startingPrice: e.target.value })}
                        className="w-full h-10 px-3 border border-gray-300 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Service category</label>
                      <select
                        value={serviceEditInput.type}
                        onChange={(e) => setServiceEditInput({ ...serviceEditInput, type: e.target.value as any })}
                        className="w-full h-10 px-3 border border-gray-300 bg-white text-xs"
                      >
                        <option value="Website Development">Website Development</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Branding">Branding</option>
                        <option value="Graphic Design">Graphic Design</option>
                        <option value="Video Editing">Video Editing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Scope Features (One row per item)</label>
                    <textarea
                      required
                      value={serviceEditInput.features}
                      onChange={(e) => setServiceEditInput({ ...serviceEditInput, features: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-1.5 border border-gray-300 text-xs bg-white"
                    ></textarea>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-red-650 text-white bg-red-600 text-xs font-bold uppercase cursor-pointer">
                      Save Changes
                    </button>
                    <button type="button" onClick={() => setEditingServiceId(null)} className="px-4 py-2 border border-gray-300 text-gray-700 bg-white text-xs font-bold uppercase cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {services.map((srv) => (
                  <div key={srv.id} className="border border-gray-200 p-4 hover:border-gray-950 flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="bg-gray-100 text-gray-700 font-mono text-[9px] px-2 py-0.5 uppercase tracking-wider">{srv.type}</span>
                      <h4 className="font-display font-bold text-gray-950 text-base">{srv.title}</h4>
                      <p className="text-gray-500 text-xs">{srv.subtitle} | Core Value: {srv.startingPrice}</p>
                      
                      <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                        {srv.features.map((feat, idx) => (
                          <span key={idx} className="flex gap-1 items-center">
                            <span className="text-[#00C853]">✔</span> {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 self-stretch sm:self-center">
                      <button
                        onClick={() => handleStartEditService(srv)}
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 bg-white hover:border-gray-950 text-xs font-bold uppercase cursor-pointer flex items-center gap-1"
                      >
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv.id)}
                        className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase transition-none cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Monthly Packages */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h2 className="font-display text-xl font-bold text-gray-950 uppercase">Subscription Packages ({packages.length})</h2>
                <button
                  onClick={() => setShowPackageForm(!showPackageForm)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#E10600] text-white text-xs font-bold uppercase cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Create Package
                </button>
              </div>

              {showPackageForm && (
                <form onSubmit={handleCreatePackage} className="p-4 border border-gray-200 bg-gray-50/40 space-y-4 max-w-xl">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-100/90 bg-gray-900 px-2 py-1 font-mono">Create Monthly Package</h3>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Package Name</label>
                    <input
                      type="text" required
                      value={packageInput.name}
                      onChange={(e) => setPackageInput({ ...packageInput, name: e.target.value })}
                      placeholder="E.g., Silver Boost Plan"
                      className="w-full h-10 px-3 border border-gray-300 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Pricing detail label</label>
                    <input
                      type="text" required
                      value={packageInput.price}
                      onChange={(e) => setPackageInput({ ...packageInput, price: e.target.value })}
                      placeholder="E.g., NPR 12,500/month"
                      className="w-full h-10 px-3 border border-gray-300 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Package Deliverables (One row per item)</label>
                    <textarea
                      required
                      value={packageInput.features}
                      onChange={(e) => setPackageInput({ ...packageInput, features: e.target.value })}
                      placeholder="6 Facebook creative posts&#10;1 custom boosted campaign setup&#10;Instagram feed planning templates"
                      rows={4}
                      className="w-full px-3 py-1.5 border border-gray-300 text-xs bg-white"
                    ></textarea>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-gray-950 text-white text-xs font-bold uppercase cursor-pointer">
                      Save Package
                    </button>
                    <button type="button" onClick={() => setShowPackageForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 bg-white text-xs font-bold uppercase cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Editing Form */}
              {editingPackageId && (
                <form onSubmit={handleSaveEditPackage} className="p-4 border-2 border-red-200 bg-red-50/10 space-y-4 max-w-xl">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-red-700 font-mono flex items-center gap-1.5">
                    <Edit className="h-4 w-4" /> Edit Monthly Package ({editingPackageId})
                  </h3>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Package Name</label>
                    <input
                      type="text" required
                      value={packageEditInput.name}
                      onChange={(e) => setPackageEditInput({ ...packageEditInput, name: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Pricing detail label</label>
                    <input
                      type="text" required
                      value={packageEditInput.price}
                      onChange={(e) => setPackageEditInput({ ...packageEditInput, price: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Package Deliverables (One row per item)</label>
                    <textarea
                      required
                      value={packageEditInput.features}
                      onChange={(e) => setPackageEditInput({ ...packageEditInput, features: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-1.5 border border-gray-300 text-xs bg-white"
                    ></textarea>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-red-650 text-white bg-red-600 text-xs font-bold uppercase cursor-pointer">
                      Save Changes
                    </button>
                    <button type="button" onClick={() => setEditingPackageId(null)} className="px-4 py-2 border border-gray-300 text-gray-700 bg-white text-xs font-bold uppercase cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-200 p-4 hover:border-gray-950 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] tracking-wide uppercase font-mono text-gray-400">Monthly Plan</span>
                      <h4 className="font-display font-bold text-gray-900 text-lg leading-tight">{pkg.name}</h4>
                      <p className="bg-gray-100 p-2 text-xs font-extrabold text-gray-800 tracking-tight">{pkg.price}</p>
                      
                      <ul className="space-y-1 text-xs text-gray-600 pt-2 pb-4">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex gap-1.5">
                            <span className="text-[#00C853] font-bold">✔</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleStartEditPackage(pkg)}
                        className="flex-1 text-center py-2 border border-gray-300 text-gray-700 bg-white hover:border-gray-950 text-xs font-bold uppercase cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="flex-1 text-center py-2 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold uppercase cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Contact Messages */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-bold text-gray-950 uppercase border-b border-gray-100 pb-2">Incoming Contact Queries ({contacts.length})</h2>
              
              {contacts.length === 0 ? (
                <p className="text-gray-500 font-mono text-xs text-center py-8">No contact requests registered in datastore.</p>
              ) : (
                <div className="space-y-4">
                  {contacts.map((msg) => (
                    <div key={msg.id} className="border border-gray-200 p-4 space-y-3">
                      <div className="flex flex-wrap justify-between items-center bg-gray-50 p-2.5 border-b border-gray-200">
                        <div>
                          <span className="text-[10px] font-mono text-gray-500">Date: {new Date(msg.createdAt).toLocaleString()}</span>
                        </div>
                        <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 border ${
                          msg.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {msg.status}
                        </span>
                      </div>

                      <div className="text-xs space-y-1">
                        <span className="text-xs font-bold text-gray-900 block">{msg.fullName}</span>
                        <p className="text-gray-500 font-mono text-[11px]">
                          Email: {msg.email} | Phone: {msg.phoneNumber}
                        </p>
                      </div>

                      <div className="text-xs bg-gray-50 p-3 italic text-gray-800 border border-gray-100">
                        "{msg.message}"
                      </div>

                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => handleResolveContact(msg.id, msg.status)}
                          className="px-3 py-1 bg-gray-100 hover:bg-black hover:text-white text-[10px] font-bold uppercase cursor-pointer transition-none"
                        >
                          {msg.status === 'Unread' ? 'Mark Read' : msg.status === 'Read' ? 'Resolve Connection' : 'Keep resolved'}
                        </button>
                        <button
                          onClick={() => handleDeleteContact(msg.id)}
                          className="px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-bold uppercase cursor-pointer transition-none"
                        >
                          Delete message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Registered Users */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-bold text-gray-950 uppercase border-b border-gray-100 pb-2">Client Registry Directory ({users.length})</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-gray-200">
                  <thead className="bg-gray-50 border-b border-gray-200 font-bold uppercase tracking-wider text-gray-500 font-mono">
                    <tr>
                      <th className="p-3">Client Identity</th>
                      <th className="p-3">Credentials Email</th>
                      <th className="p-3">Cell Coordinates</th>
                      <th className="p-3">Company Identity</th>
                      <th className="p-3">Admin Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="p-3 font-semibold text-gray-900">{u.fullName}</td>
                        <td className="p-3 font-mono text-gray-600">{u.email}</td>
                        <td className="p-3 font-mono text-gray-600">{u.phoneNumber}</td>
                        <td className="p-3 text-gray-600">{u.companyName || '—'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest font-mono ${
                            u.isAdmin ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {u.isAdmin ? 'System Root' : 'Client user'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Analytics */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-bold text-gray-950 uppercase border-b border-gray-100 pb-2">Platform Metrics & KPIs Overview</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-5 border-l-4 border-[#E10600]">
                  <span className="block text-[10px] uppercase font-mono font-bold text-gray-400">Total User Accounts</span>
                  <span className="text-3xl font-display font-black text-gray-900 block mt-1">{analytics.totalUsers}</span>
                </div>
                <div className="bg-gray-50 p-5 border-l-4 border-gray-950">
                  <span className="block text-[10px] uppercase font-mono font-bold text-gray-400">Total Inquiries</span>
                  <span className="text-3xl font-display font-black text-gray-900 block mt-1">{analytics.totalInquiries}</span>
                </div>
                <div className="bg-gray-50 p-5 border-l-4 border-[#00C853]">
                  <span className="block text-[10px] uppercase font-mono font-bold text-gray-400">Live Support Tickets</span>
                  <span className="text-3xl font-display font-black text-gray-900 block mt-1">{analytics.totalContactMessages}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="border border-gray-200 p-4">
                  <h4 className="font-display text-xs uppercase tracking-widest font-bold text-gray-400 font-mono mb-3">Inquiries Status Partition</h4>
                  <div className="space-y-2 text-xs">
                    {Object.keys(analytics.inquiriesByStatus).length === 0 ? (
                      <p className="text-gray-500 italic">No inquiries recorded yet.</p>
                    ) : (
                      Object.entries(analytics.inquiriesByStatus).map(([status, count]: any) => (
                        <div key={status} className="flex justify-between border-b border-gray-100 pb-1">
                          <span className="font-medium text-gray-700">{status}</span>
                          <span className="font-mono font-bold">{count}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border border-gray-200 p-4">
                  <h4 className="font-display text-xs uppercase tracking-widest font-bold text-gray-400 font-mono mb-3">Service Interest Partition</h4>
                  <div className="space-y-2 text-xs">
                    {Object.keys(analytics.inquiriesByService).length === 0 ? (
                      <p className="text-gray-500 italic">No inquiries recorded yet.</p>
                    ) : (
                      Object.entries(analytics.inquiriesByService).map(([srv, count]: any) => (
                        <div key={srv} className="flex justify-between border-b border-gray-100 pb-1">
                          <span className="font-medium text-gray-700">{srv}</span>
                          <span className="font-mono font-bold">{count}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: Employee Management System */}
          {activeTab === 'employees' && (
            <div className="space-y-6" id="tridev-employee-system">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-gray-950 uppercase">
                    Employee Management System
                  </h2>
                  <p className="text-gray-500 text-xs font-mono mt-0.5">
                    Configure staff roles, contact lines, address details, and leadership statements.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowAddEmpForm(!showAddEmpForm)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E10600] text-white text-xs font-bold uppercase cursor-pointer"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {showAddEmpForm ? 'Close Registration' : 'Register New Employee'}
                  </button>
                  <button
                    onClick={handleResetEmployees}
                    className="flex items-center gap-1 px-3 py-1.5 text-gray-700 hover:bg-gray-50 border border-gray-300 text-xs font-bold uppercase cursor-pointer bg-white"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset Database Roster
                  </button>
                </div>
              </div>

              {/* SEARCH FILTER */}
              <div className="bg-gray-50 p-3 border border-gray-100">
                <input
                  type="text"
                  placeholder="Search employees by name, role, address or post..."
                  value={empSearchQuery}
                  onChange={(e) => setEmpSearchQuery(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-black"
                />
              </div>

              {/* ADD EMPLOYEE FORM PANEL */}
              {showAddEmpForm && (
                <form onSubmit={handleCreateEmployee} className="p-5 border-2 border-red-100 bg-red-50/10 space-y-4">
                  <h3 className="font-display text-xs font-extrabold uppercase tracking-widest text-[#E10600] flex items-center gap-1.5 font-mono">
                    <UserPlus className="h-4 w-4" /> Add Tridev Associate details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Full Name *</label>
                      <input
                        type="text" required
                        placeholder="e.g. Samir KC"
                        value={empNameInput}
                        onChange={(e) => setEmpNameInput(e.target.value)}
                        className="w-full h-10 px-3 border border-gray-300 text-xs bg-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Corporate Role *</label>
                      <input
                        type="text" required
                        placeholder="e.g. Senior Android Dev"
                        value={empRoleInput}
                        onChange={(e) => setEmpRoleInput(e.target.value)}
                        className="w-full h-10 px-3 border border-gray-300 text-xs bg-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Company Post Level *</label>
                      <select
                        value={empPostInput}
                        onChange={(e) => setEmpPostInput(e.target.value)}
                        className="w-full h-10 px-3 border border-gray-300 bg-white text-xs font-bold text-gray-800"
                      >
                        <option value="Director">Director (Leadership Core)</option>
                        <option value="Project Manager">Project Manager (Leadership Core)</option>
                        <option value="Associate">Associate Staff Member</option>
                        <option value="Consultant">Outside Consultant</option>
                        <option value="Support Staff">Office Support Staff</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Contact Phone Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 9812453147"
                        value={empPhoneInput}
                        onChange={(e) => setEmpPhoneInput(e.target.value)}
                        className="w-full h-10 px-3 border border-gray-300 text-xs bg-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Local Address</label>
                      <input
                        type="text"
                        placeholder="e.g. Nepalgunj-4, Banke"
                        value={empAddressInput}
                        onChange={(e) => setEmpAddressInput(e.target.value)}
                        className="w-full h-10 px-3 border border-gray-300 text-xs bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Avatar Initials (Max 2 Chars)</label>
                      <input
                        type="text"
                        maxLength={2}
                        placeholder="e.g. SK"
                        value={empInitInput}
                        onChange={(e) => setEmpInitInput(e.target.value)}
                        className="w-full h-10 px-3 border border-gray-300 text-xs bg-white focus:outline-none uppercase text-center font-bold"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Technical Specialty & Bio (Displayed on Cards) *</label>
                    <input
                      type="text" required
                      placeholder="e.g. Translates complex design specifications into robust layout components."
                      value={empSpecInput}
                      onChange={(e) => setEmpSpecInput(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 text-xs bg-white focus:outline-none"
                    />
                  </div>

                  <div className="text-xs">
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Personal Thoughts or Quotes</label>
                    <textarea
                      placeholder="e.g. 'Engineering active portfolios that generate high lead volumes physically.'"
                      value={empThoughtsInput}
                      onChange={(e) => setEmpThoughtsInput(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 text-xs bg-white focus:outline-none resize-none leading-relaxed"
                    ></textarea>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="px-5 py-2.5 bg-gray-950 text-white text-xs font-bold uppercase cursor-pointer">
                      Register Associate Record
                    </button>
                    <button type="button" onClick={() => setShowAddEmpForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 bg-white text-xs font-bold uppercase cursor-pointer">
                      Dismiss Form
                    </button>
                  </div>
                </form>
              )}

              {/* EMPLOYEES DIRECTORY DIRECT LISTING */}
              <div className="space-y-4">
                {employees
                  .filter(emp => {
                    const q = empSearchQuery.toLowerCase();
                    return (
                      emp.name.toLowerCase().includes(q) ||
                      emp.role.toLowerCase().includes(q) ||
                      (emp.post && emp.post.toLowerCase().includes(q)) ||
                      (emp.address && emp.address.toLowerCase().includes(q))
                    );
                  })
                  .map(emp => {
                    const isEditing = empEditingId === emp.id;
                    return (
                      <div key={emp.id} className={`border p-5 space-y-4 ${isEditing ? 'border-red-500 bg-red-50/5' : 'border-gray-200 hover:border-gray-950'}`}>
                        {isEditing ? (
                          // ACTIVE EDITING MODE
                          <div className="space-y-4">
                            <div className="flex justify-between items-center bg-gray-50 p-2.5 border-b border-gray-200">
                              <span className="text-[10px] font-mono font-bold uppercase text-red-700 tracking-wider">
                                Editing Tridev Roster Reference: {emp.id}
                              </span>
                              <span className="text-[10px] font-mono text-gray-400">Initials: {empEditInit}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Full Name *</label>
                                <input
                                  type="text" value={empEditName}
                                  onChange={(e) => setEmpEditName(e.target.value)}
                                  className="w-full h-10 px-3 border border-gray-300 text-xs bg-white focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Corporate Role *</label>
                                <input
                                  type="text" value={empEditRole}
                                  onChange={(e) => setEmpEditRole(e.target.value)}
                                  className="w-full h-10 px-3 border border-gray-300 text-xs bg-white focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Post / Category</label>
                                <select
                                  value={empEditPost}
                                  onChange={(e) => setEmpEditPost(e.target.value)}
                                  className="w-full h-10 px-3 border border-gray-300 bg-white text-xs font-bold animate-none"
                                >
                                  <option value="Director">Director</option>
                                  <option value="Project Manager">Project Manager</option>
                                  <option value="Associate">Associate</option>
                                  <option value="Consultant">Consultant</option>
                                  <option value="Support Staff">Support Staff</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Contact Phone</label>
                                <input
                                  type="text" value={empEditPhone}
                                  onChange={(e) => setEmpEditPhone(e.target.value)}
                                  className="w-full h-10 px-3 border border-gray-300 text-xs bg-white font-mono"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Office Address</label>
                                <input
                                  type="text" value={empEditAddress}
                                  onChange={(e) => setEmpEditAddress(e.target.value)}
                                  className="w-full h-10 px-3 border border-gray-300 text-xs bg-white"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Initials Override</label>
                                <input
                                  type="text" maxLength={2} value={empEditInit}
                                  onChange={(e) => setEmpEditInit(e.target.value)}
                                  className="w-full h-10 px-3 border border-gray-300 text-xs bg-white uppercase text-center font-bold"
                                />
                              </div>
                            </div>

                            <div className="text-xs">
                              <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Specialty & Background Detail *</label>
                              <input
                                type="text" value={empEditSpec}
                                onChange={(e) => setEmpEditSpec(e.target.value)}
                                className="w-full h-10 px-3 border border-gray-300 text-xs bg-white"
                              />
                            </div>

                            <div className="text-xs">
                              <label className="block text-[10px] font-bold text-gray-650 uppercase mb-1">Thoughts & Leader Statement Quote</label>
                              <textarea
                                value={empEditThoughts}
                                onChange={(e) => setEmpEditThoughts(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-1.5 border border-gray-300 text-xs bg-white resize-none leading-relaxed"
                              ></textarea>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveEditEmployee(emp.id)}
                                className="px-4 py-2 bg-[#E10600] text-white text-xs font-bold uppercase cursor-pointer"
                              >
                                Save Changes
                              </button>
                              <button
                                onClick={() => setEmpEditingId(null)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 bg-white text-xs font-bold uppercase cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // STANDARD STATIC DATA CARD VIEW
                          <div className="space-y-3 text-left">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gray-100 flex items-center justify-center font-mono text-sm font-bold text-gray-900 border border-gray-300 uppercase">
                                  {emp.init || emp.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <h3 className="font-display font-black text-gray-950 text-base">{emp.name}</h3>
                                  <div className="flex gap-2 mt-0.5 items-center">
                                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#E10600] font-bold">
                                      {emp.role}
                                    </span>
                                    <span className="text-gray-300 select-none">•</span>
                                    <span className="text-[9px] uppercase font-mono tracking-wider bg-gray-100 text-gray-600 px-1.5 py-0.5">
                                      Post: {emp.post || 'Associate'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 text-xs">
                                <button
                                  onClick={() => handleStartEditEmployee(emp)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-300 text-gray-800 hover:bg-gray-150 text-[11px] font-bold uppercase cursor-pointer"
                                >
                                  <Edit2 className="h-3.5 w-3.5" /> Edit Employee
                                </button>
                                <button
                                  onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold uppercase cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Delete Profile
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-gray-600">
                              <div className="space-y-1">
                                <div className="flex justify-between border-b border-gray-50 pb-0.5">
                                  <span>Phone Number Line:</span>
                                  <span className="text-gray-950 font-bold">{emp.phoneNumber || '9812453147'}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-0.5">
                                  <span>Residential Base:</span>
                                  <span className="text-gray-950">{emp.address || 'Nepalgunj, Banke'}</span>
                                </div>
                              </div>

                              <div className="bg-gray-50/50 p-2 text-[11px] border border-gray-100 italic text-gray-700 leading-relaxed">
                                <span className="text-[9px] uppercase font-bold text-gray-400 block not-italic font-mono">Specialty Core Profile:</span>
                                "{emp.spec}"
                              </div>
                            </div>

                            {emp.thoughts && (
                              <div className="bg-red-50/10 border-l-2 border-[#E10600] p-3 text-xs">
                                <span className="font-bold text-[#E10600] block text-[9px] uppercase tracking-wider font-mono">Thoughts / Corporate statement quote:</span>
                                <p className="text-gray-900 mt-0.5 italic leading-relaxed">"{emp.thoughts}"</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 8. Custom State-driven Deletion / Prompt Confirmation Dialog Modal (Iframe-safe) */}
      {confirmModal && (
        <div 
          id="confirm-modal-overlay"
          className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-[100] p-4 animate-fade-in"
          onClick={() => setConfirmModal(null)}
        >
          <div 
            id="confirm-modal-card"
            className="bg-white border-4 border-[#E10600] max-w-md w-full shadow-2xl p-6"
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
