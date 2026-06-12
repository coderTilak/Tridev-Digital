/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { 
  UserProfile, 
  Inquiry, 
  PortfolioItem, 
  ServiceDetail, 
  MarketingPackage, 
  ContactMessage,
  InquiryStatus,
  ServiceType,
  Employee
} from './src/types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Define database schema
interface DatabaseSchema {
  users: Array<{ id: string; email: string; passwordHash: string; fullName: string; phoneNumber: string; companyName?: string; isAdmin: boolean }>;
  inquiries: Inquiry[];
  portfolio: PortfolioItem[];
  services: ServiceDetail[];
  marketingPackages: MarketingPackage[];
  contactMessages: ContactMessage[];
  employees: Employee[];
}

// Default Seed Data
const DEFAULT_SERVICES: ServiceDetail[] = [
  {
    id: 's1',
    title: 'Website Development',
    subtitle: 'Starting: NPR 12,000+',
    startingPrice: 'NPR 12,000+',
    features: ['Up to 5 Pages', 'Responsive Design (Mobile + Tablet)', 'Contact Inquiry Form', 'Speed & SEO Optimization', 'Basic Hosting Setup'],
    type: 'Website Development'
  },
  {
    id: 's2',
    title: 'Dynamic Website',
    subtitle: 'Starting: NPR 15,000+',
    startingPrice: 'NPR 15,000+',
    features: ['Unlimited Pages', 'Admin Dashboard Panel', 'Blog or Product Showcase', 'Client Database Integration', 'Enhanced SEO Setup'],
    type: 'Website Development'
  },
  {
    id: 's3',
    title: 'Mobile App Development',
    subtitle: 'Starting: NPR 20,000+',
    startingPrice: 'NPR 20,000+',
    features: ['Android + iOS Deployment', 'Clean Flutter/React Native Core', 'Push Notifications Integration', 'User Auth & Profiles', 'Offline Capability Support'],
    type: 'Mobile App Development'
  },
  {
    id: 's4',
    title: 'Digital Marketing',
    subtitle: 'Starting: NPR 5,000/month',
    startingPrice: 'NPR 5,000/month',
    features: ['Social Media Account Setup', 'Targeted Facebook & TikTok Ad Campaigns', 'Lead Generation Systems', 'Weekly Performance Analytics', 'Ad Creative Asset Planning'],
    type: 'Digital Marketing'
  },
  {
    id: 's5',
    title: 'Branding & Graphic Design',
    subtitle: 'Custom pricing',
    startingPrice: 'Custom pricing',
    features: ['Unique Corporate Logo Suite', 'Color Palette & Typography System', 'Letterheads, Business Cards & Brochures', 'Social Media Branding templates', 'Brand Identity Guideline Document'],
    type: 'Branding'
  }
];

const DEFAULT_MARKETING_PACKAGES: MarketingPackage[] = [
  {
    id: 'm1',
    name: 'Basic Package',
    price: 'NPR 5,000/month',
    features: ['4 Facebook posts', '4 TikTok posts', '1 boosted post']
  },
  {
    id: 'm2',
    name: 'Standard Package',
    price: 'NPR 10,000/month',
    features: ['8 Facebook posts', '8 TikTok posts', '2 boosted posts']
  },
  {
    id: 'm3',
    name: 'Premium Package',
    price: 'NPR 15,000/month',
    features: ['12 Facebook posts', '12 TikTok posts', '4 boosted posts', 'Reels creation', 'Lead generation support']
  },
  {
    id: 'm4',
    name: 'Business Growth Package',
    price: 'NPR 25,000/month',
    features: [
      'Full social media management',
      'Facebook + TikTok marketing',
      'Instagram posting (manual content planning only, no tracking integration)',
      'Ad campaign management',
      'Lead generation'
    ]
  }
];

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'Nepalgunj E-Cart Portal',
    description: 'A robust multi-vendor e-commerce platform built specifically for local traders inside Nepalgunj, featuring vendor dashboards and order tracking.',
    category: 'Websites',
    toolsUsed: ['React', 'Node.js', 'Tailwind CSS', 'PostgreSQL'],
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p2',
    title: 'Gulma Grocery Delivery App',
    description: 'A native-feel mobile application designed for grocery businesses in Banke district, featuring rapid loading, offline caching, and instant notifications.',
    category: 'Mobile Apps',
    toolsUsed: ['React Native', 'Firebase', 'Node.js', 'Tailwind'],
    imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p3',
    title: 'Heera Sweets Branding Identity',
    description: 'A complete branding renewal for one of Nepalgunj’s landmark modern confectionaries, including logo, packaging, signage, and design templates.',
    category: 'Branding',
    toolsUsed: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop'],
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p4',
    title: 'Tridev Digital Social Launch Campaign',
    description: 'A structured local viral commercial campaign that generated over 5,000 organic leads and queries in under 30 days for local hardware businesses.',
    category: 'Marketing',
    toolsUsed: ['Facebook Ads', 'TikTok Ads Manager', 'Canva Pro'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  }
];

const DEFAULT_EMPLOYEES: Employee[] = [
  { id: "emp-1", name: "Nirajan Shrestha", role: "Lead Frontend Engineer", post: "Associate", phoneNumber: "9812453147", address: "Nepalgunj, Banke", spec: "Specialist in Tailwind CSS layouts & responsive React setups.", thoughts: "Drafting scalable interfaces is an art.", init: "NS" },
  { id: "emp-2", name: "Prerna Rokaya", role: "UI/UX System Architect", post: "Associate", phoneNumber: "9812453148", address: "Nepalgunj, Banke", spec: "Creates high-fidelity wireframes & customized typography guides.", thoughts: "Simplicity is the ultimate sophistication.", init: "PR" },
  { id: "emp-3", name: "Sushil Chaudhary", role: "Backend Architect", post: "Associate", phoneNumber: "9812453149", address: "Nepalgunj, Banke", spec: "Optimizes scalable Node.js servers, API routing & Firestore DBs.", thoughts: "Systems must be robust and secure first.", init: "SC" },
  { id: "emp-4", name: "Aliza Bajracharya", role: "Digital Media strategist", post: "Associate", phoneNumber: "9812453150", address: "Nepalgunj, Banke", spec: "Leads High-ROI target campaigns on Facebook, Instagram & TikTok.", thoughts: "ROI matters more than vanity counts.", init: "AB" },
  { id: "emp-5", name: "Rohan Thapa", role: "QA Engineering Lead", post: "Associate", phoneNumber: "9812453151", address: "Nepalgunj, Banke", spec: "Maintains cross-device safety standards and stress resolution testing.", thoughts: "Bugs don't survive standard testing.", init: "RT" }
];

function initDB() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const freshDb: DatabaseSchema = {
      users: [
        {
          id: 'admin-1',
          email: 'tilak@tridevdigital.com',
          passwordHash: 'admin123', // Hardcoded simple lookup format
          fullName: 'Tilak Kanojiya',
          phoneNumber: '9812453147',
          companyName: 'Tridev Digital',
          isAdmin: true
        },
        {
          id: 'user-1',
          email: 'client@example.com',
          passwordHash: 'client123',
          fullName: 'Sanjay Sharma',
          phoneNumber: '9848011223',
          companyName: 'Lumbini Bakery',
          isAdmin: false
        }
      ],
      inquiries: [
        {
          id: 'inquiry-1',
          userId: 'user-1',
          fullName: 'Sanjay Sharma',
          email: 'client@example.com',
          phoneNumber: '9848011223',
          companyName: 'Lumbini Bakery',
          serviceType: 'Website Development',
          budgetRange: 'NPR 15,000 - 30,000',
          projectDescription: 'We need a gorgeous, mobile-responsive dynamic web catalog to display our artisanal bread varieties and allow pre-ordering for daily delivery inside Nepalgunj and near Gulma area.',
          status: 'In Progress',
          createdAt: '2026-06-10T10:15:30Z',
          adminRemarks: 'Assigned to dev team. Discussion about color palette completed.'
        }
      ],
      portfolio: DEFAULT_PORTFOLIO,
      services: DEFAULT_SERVICES,
      marketingPackages: DEFAULT_MARKETING_PACKAGES,
      contactMessages: [
        {
          id: 'msg-1',
          fullName: 'Rita Chaudhary',
          email: 'rita.chaudhary@gmail.com',
          phoneNumber: '9769277257',
          message: 'Hello, I want to learn if you support SEO for local hotel businesses in Banke.',
          status: 'Unread',
          createdAt: '2026-06-11T04:20:00Z'
        }
      ],
      employees: DEFAULT_EMPLOYEES
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(freshDb, null, 2), 'utf-8');
  }
}

// Internal load
function loadDB(): DatabaseSchema {
  initDB();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    
    let needsWrite = false;
    
    // Backward compatibility check for existing db.json files
    if (!parsed.employees) {
      parsed.employees = DEFAULT_EMPLOYEES;
      needsWrite = true;
    }
    
    // Sync default services if they match old titles or standard old counts
    if (!parsed.services || parsed.services.length === 5 || parsed.services.some((s: any) => s.title === 'Static Website Development' || s.title.includes('Digital Marketing & Ads'))) {
      parsed.services = DEFAULT_SERVICES;
      needsWrite = true;
    }
    
    // Sync default marketing packages if they contain old detailed text arrays
    if (!parsed.marketingPackages || parsed.marketingPackages.length === 4 || parsed.marketingPackages.some((p: any) => p.features.some((f: string) => f.includes('Professional Facebook')))) {
      parsed.marketingPackages = DEFAULT_MARKETING_PACKAGES;
      needsWrite = true;
    }

    if (needsWrite) {
      try { fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8'); } catch {}
    }
    return parsed;
  } catch (error) {
    console.error('Error reading DB, re-initializing', error);
    // Return empty fallback
    return {
      users: [],
      inquiries: [],
      portfolio: DEFAULT_PORTFOLIO,
      services: DEFAULT_SERVICES,
      marketingPackages: DEFAULT_MARKETING_PACKAGES,
      contactMessages: [],
      employees: DEFAULT_EMPLOYEES
    };
  }
}

function saveDB(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving DB file:', error);
  }
}

export const Database = {
  // --- Auth & Users Ops ---
  findUserByEmail(email: string) {
    const db = loadDB();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  createUser(email: string, passwordHash: string, fullName: string, phoneNumber: string, companyName?: string, isAdmin: boolean = false, id?: string) {
    const db = loadDB();
    const newUser = {
      id: id || `user-${Date.now()}`,
      email: email.toLowerCase(),
      passwordHash,
      fullName,
      phoneNumber,
      companyName,
      isAdmin
    };
    db.users.push(newUser);
    saveDB(db);
    return newUser;
  },

  getUsers() {
    const db = loadDB();
    return db.users.map(({ passwordHash, ...safeUser }) => safeUser);
  },

  getProfile(userId: string): UserProfile | null {
    const db = loadDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      companyName: user.companyName,
      isAdmin: user.isAdmin
    };
  },

  updateProfile(userId: string, data: { fullName: string; phoneNumber: string; companyName?: string }) {
    const db = loadDB();
    const idx = db.users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    db.users[idx] = {
      ...db.users[idx],
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      companyName: data.companyName
    };
    saveDB(db);
    return this.getProfile(userId);
  },

  // --- Inquiries Ops ---
  getInquiries(userId?: string) {
    const db = loadDB();
    if (userId) {
      const user = db.users.find(u => u.id === userId);
      // Admin gets all inquiries regardless
      if (user?.isAdmin) {
        return db.inquiries;
      }
      return db.inquiries.filter(i => i.userId === userId);
    }
    return db.inquiries;
  },

  createInquiry(userId: string, data: Omit<Inquiry, 'id' | 'userId' | 'status' | 'createdAt' | 'adminRemarks'>) {
    const db = loadDB();
    const newInquiry: Inquiry = {
      id: `inquiry-${Date.now()}`,
      userId,
      ...data,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    db.inquiries.push(newInquiry);
    saveDB(db);
    return newInquiry;
  },

  updateInquiryStatus(id: string, status: InquiryStatus, adminRemarks?: string) {
    const db = loadDB();
    const idx = db.inquiries.findIndex(i => i.id === id);
    if (idx === -1) return null;
    db.inquiries[idx] = {
      ...db.inquiries[idx],
      status,
      adminRemarks: adminRemarks !== undefined ? adminRemarks : db.inquiries[idx].adminRemarks
    };
    saveDB(db);
    return db.inquiries[idx];
  },

  deleteInquiry(id: string) {
    const db = loadDB();
    const originalLength = db.inquiries.length;
    db.inquiries = db.inquiries.filter(i => i.id !== id);
    if (db.inquiries.length !== originalLength) {
      saveDB(db);
      return true;
    }
    return false;
  },

  // --- Services Ops ---
  getServices() {
    const db = loadDB();
    return db.services;
  },

  createService(data: Omit<ServiceDetail, 'id'>) {
    const db = loadDB();
    const newService: ServiceDetail = {
      id: `s-${Date.now()}`,
      ...data
    };
    db.services.push(newService);
    saveDB(db);
    return newService;
  },

  updateService(id: string, data: Partial<Omit<ServiceDetail, 'id'>>) {
    const db = loadDB();
    const idx = db.services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    db.services[idx] = { ...db.services[idx], ...data };
    saveDB(db);
    return db.services[idx];
  },

  deleteService(id: string) {
    const db = loadDB();
    db.services = db.services.filter(s => s.id !== id);
    saveDB(db);
    return true;
  },

  // --- Portfolio Ops ---
  getPortfolio() {
    const db = loadDB();
    return db.portfolio;
  },

  createPortfolioItem(data: Omit<PortfolioItem, 'id'>) {
    const db = loadDB();
    const newItem: PortfolioItem = {
      id: `p-${Date.now()}`,
      ...data
    };
    db.portfolio.push(newItem);
    saveDB(db);
    return newItem;
  },

  updatePortfolioItem(id: string, data: Partial<Omit<PortfolioItem, 'id'>>) {
    const db = loadDB();
    const idx = db.portfolio.findIndex(p => p.id === id);
    if (idx === -1) return null;
    db.portfolio[idx] = { ...db.portfolio[idx], ...data };
    saveDB(db);
    return db.portfolio[idx];
  },

  deletePortfolioItem(id: string) {
    const db = loadDB();
    db.portfolio = db.portfolio.filter(p => p.id !== id);
    saveDB(db);
    return true;
  },

  // --- Marketing Packages Ops ---
  getMarketingPackages() {
    const db = loadDB();
    return db.marketingPackages;
  },

  createMarketingPackage(data: Omit<MarketingPackage, 'id'>) {
    const db = loadDB();
    const newPkg: MarketingPackage = {
      id: `m-${Date.now()}`,
      ...data
    };
    db.marketingPackages.push(newPkg);
    saveDB(db);
    return newPkg;
  },

  updateMarketingPackage(id: string, data: Partial<Omit<MarketingPackage, 'id'>>) {
    const db = loadDB();
    const idx = db.marketingPackages.findIndex(pkg => pkg.id === id);
    if (idx === -1) return null;
    db.marketingPackages[idx] = { ...db.marketingPackages[idx], ...data };
    saveDB(db);
    return db.marketingPackages[idx];
  },

  deleteMarketingPackage(id: string) {
    const db = loadDB();
    db.marketingPackages = db.marketingPackages.filter(pkg => pkg.id !== id);
    saveDB(db);
    return true;
  },

  // --- Contact Message Ops ---
  getContactMessages() {
    const db = loadDB();
    return db.contactMessages;
  },

  createContactMessage(data: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) {
    const db = loadDB();
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      ...data,
      status: 'Unread',
      createdAt: new Date().toISOString()
    };
    db.contactMessages.push(newMsg);
    saveDB(db);
    return newMsg;
  },

  updateContactMessageStatus(id: string, status: 'Unread' | 'Read' | 'Resolved') {
    const db = loadDB();
    const idx = db.contactMessages.findIndex(m => m.id === id);
    if (idx === -1) return null;
    db.contactMessages[idx].status = status;
    saveDB(db);
    return db.contactMessages[idx];
  },

  deleteContactMessage(id: string) {
    const db = loadDB();
    db.contactMessages = db.contactMessages.filter(m => m.id !== id);
    saveDB(db);
    return true;
  },

  // --- Employees ---
  getEmployees() {
    const db = loadDB();
    return db.employees || [];
  },

  createEmployee(data: Omit<Employee, 'id'>) {
    const db = loadDB();
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      ...data
    };
    if (!db.employees) db.employees = [];
    db.employees.push(newEmp);
    saveDB(db);
    return newEmp;
  },

  updateEmployee(id: string, data: Partial<Omit<Employee, 'id'>>) {
    const db = loadDB();
    if (!db.employees) db.employees = [];
    const idx = db.employees.findIndex(emp => emp.id === id);
    if (idx === -1) return null;
    db.employees[idx] = { ...db.employees[idx], ...data };
    saveDB(db);
    return db.employees[idx];
  },

  deleteEmployee(id: string) {
    const db = loadDB();
    if (!db.employees) db.employees = [];
    db.employees = db.employees.filter(emp => emp.id !== id);
    saveDB(db);
    return true;
  },

  resetEmployees(defaultEmployees: Employee[]) {
    const db = loadDB();
    db.employees = [...defaultEmployees];
    saveDB(db);
    return db.employees;
  }
};
