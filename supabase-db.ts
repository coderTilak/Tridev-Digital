/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Database as LocalDatabase } from './server-db';
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

// Read variables from environment
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabaseConfig = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

console.log(`[Database Init] Supabase configured: ${hasSupabaseConfig ? 'YES' : 'NO'}`);

// Initialize client if configured
export const supabase = hasSupabaseConfig 
  ? createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!) 
  : null;

// Tracking flags for single-execution synchronization attempts to keep logs spotless
let attemptedServicesSync = false;
let attemptedPackagesSync = false;

// SQL Script description that user can run in Supabase's SQL Editor
export const SETUP_SQL_SCRIPT = `-- ==========================================
-- SUPABASE SCHEMA SETUP FOR TRIDEV DIGITAL
-- Paste this script into your Supabase SQL Editor
-- ==========================================

-- 1. Create 'users' table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  company_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE
);

-- 2. Create 'inquiries' table
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  company_name TEXT,
  service_type TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  project_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TEXT NOT NULL,
  admin_remarks TEXT
);

-- 3. Create 'services' table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  starting_price TEXT NOT NULL,
  features TEXT[] NOT NULL,
  type TEXT NOT NULL
);

-- 4. Create 'portfolio' table
CREATE TABLE IF NOT EXISTS portfolio (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tools_used TEXT[] NOT NULL,
  image_url TEXT NOT NULL
);

-- 5. Create 'marketing_packages' table
CREATE TABLE IF NOT EXISTS marketing_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  features TEXT[] NOT NULL
);

-- 6. Create 'contact_messages' table
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Unread',
  created_at TEXT NOT NULL
);

-- 7. Create 'employees' table
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  post TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  spec TEXT NOT NULL,
  thoughts TEXT NOT NULL,
  init TEXT NOT NULL
);

-- Disable Row Level Security (RLS) on all tables to ensure public/anonymous read/write API requests succeed
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio DISABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;

-- Dynamic Fallback: Just in case RLS remains active or is re-enabled, 
-- create broad public policies that guarantee any anonymous or authenticated request can do read/write actions (all ops).
DROP POLICY IF EXISTS "Allow All Public Users" ON users;
CREATE POLICY "Allow All Public Users" ON users FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Public Inquiries" ON inquiries;
CREATE POLICY "Allow All Public Inquiries" ON inquiries FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Public Services" ON services;
CREATE POLICY "Allow All Public Services" ON services FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Public Portfolio" ON portfolio;
CREATE POLICY "Allow All Public Portfolio" ON portfolio FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Public Marketing Packages" ON marketing_packages;
CREATE POLICY "Allow All Public Marketing Packages" ON marketing_packages FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Public Contact Messages" ON contact_messages;
CREATE POLICY "Allow All Public Contact Messages" ON contact_messages FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Public Employees" ON employees;
CREATE POLICY "Allow All Public Employees" ON employees FOR ALL TO public USING (true) WITH CHECK (true);

-- Seed Default Data (Runs only if empty)

INSERT INTO users (id, email, password_hash, full_name, phone_number, company_name, is_admin)
VALUES 
('admin-1', 'tilak@tridevdigital.com', 'CHANGE_ME_ADMIN_PASSWORD', 'Tilak Kanojiya', '9812453147', 'Tridev Digital', TRUE),
('user-1', 'client@example.com', 'CHANGE_ME_CLIENT_PASSWORD', 'Sanjay Sharma', '9848011223', 'Lumbini Bakery', FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, subtitle, starting_price, features, type)
VALUES 
('s1', 'Website Development', 'Starting: NPR 12,000+', 'NPR 12,000+', ARRAY['Up to 5 Pages', 'Responsive Design (Mobile + Tablet)', 'Contact Inquiry Form', 'Speed & SEO Optimization', 'Basic Hosting Setup'], 'Website Development'),
('s2', 'Dynamic Website', 'Starting: NPR 15,000+', 'NPR 15,000+', ARRAY['Unlimited Pages', 'Admin Dashboard Panel', 'Blog or Product Showcase', 'Client Database Integration', 'Enhanced SEO Setup'], 'Website Development'),
('s3', 'Mobile App Development', 'Starting: NPR 20,000+', 'NPR 20,000+', ARRAY['Android + iOS Deployment', 'Clean Flutter/React Native Core', 'Push Notifications Integration', 'User Auth & Profiles', 'Offline Capability Support'], 'Mobile App Development'),
('s4', 'Digital Marketing', 'Starting: NPR 5,000/month', 'NPR 5,000/month', ARRAY['Social Media Account Setup', 'Targeted Facebook & TikTok Ad Campaigns', 'Lead Generation Systems', 'Weekly Performance Analytics', 'Ad Creative Asset Planning'], 'Digital Marketing'),
('s5', 'Branding & Graphic Design', 'Custom pricing', 'Custom pricing', ARRAY['Unique Corporate Logo Suite', 'Color Palette & Typography System', 'Letterheads, Business Cards & Brochures', 'Social Media Branding templates', 'Brand Identity Guideline Document'], 'Branding')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  starting_price = EXCLUDED.starting_price,
  features = EXCLUDED.features,
  type = EXCLUDED.type;

INSERT INTO marketing_packages (id, name, price, features)
VALUES 
('m1', 'Basic Package', 'NPR 5,000/month', ARRAY['4 Facebook posts', '4 TikTok posts', '1 boosted post']),
('m2', 'Standard Package', 'NPR 10,000/month', ARRAY['8 Facebook posts', '8 TikTok posts', '2 boosted posts']),
('m3', 'Premium Package', 'NPR 15,000/month', ARRAY['12 Facebook posts', '12 TikTok posts', '4 boosted posts', 'Reels creation', 'Lead generation support']),
('m4', 'Business Growth Package', 'NPR 25,000/month', ARRAY['Full social media management', 'Facebook + TikTok marketing', 'Instagram posting (manual content planning only, no tracking integration)', 'Ad campaign management', 'Lead generation'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  features = EXCLUDED.features;

INSERT INTO portfolio (id, title, description, category, tools_used, image_url)
VALUES 
('p1', 'Nepalgunj E-Cart Portal', 'A robust multi-vendor e-commerce platform built specifically for local traders inside Nepalgunj, featuring vendor dashboards and order tracking.', 'Websites', ARRAY['React', 'Node.js', 'Tailwind CSS', 'PostgreSQL'], 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80'),
('p2', 'Gulma Grocery Delivery App', 'A native-feel mobile application designed for grocery businesses in Banke district, featuring rapid loading, offline caching, and instant notifications.', 'Mobile Apps', ARRAY['React Native', 'Firebase', 'Node.js', 'Tailwind'], 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80'),
('p3', 'Heera Sweets Branding Identity', 'A complete branding renewal for one of Nepalgunj’s landmark modern confectionaries, including logo, packaging, signage, and design templates.', 'Branding', ARRAY['Figma', 'Adobe Illustrator', 'Adobe Photoshop'], 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80'),
('p4', 'Tridev Digital Social Launch Campaign', 'A structured local viral commercial campaign that generated over 5,000 organic leads and queries in under 30 days for local hardware businesses.', 'Marketing', ARRAY['Facebook Ads', 'TikTok Ads Manager', 'Canva Pro'], 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO inquiries (id, user_id, full_name, email, phone_number, company_name, service_type, budget_range, project_description, status, created_at, admin_remarks)
VALUES
('inquiry-1', 'user-1', 'Sanjay Sharma', 'client@example.com', '9848011223', 'Lumbini Bakery', 'Website Development', 'NPR 15,000 - 30,000', 'We need a gorgeous, mobile-responsive dynamic web catalog to display our artisanal bread varieties and allow pre-ordering for daily delivery inside Nepalgunj.', 'In Progress', '2026-06-10T10:15:30Z', 'Assigned to dev team. Discussion about color palette completed.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, role, post, phone_number, address, spec, thoughts, init)
VALUES
('emp-1', 'Nirajan Shrestha', 'Lead Frontend Engineer', 'Associate', '9812453147', 'Nepalgunj, Banke', 'Specialist in Tailwind CSS layouts & responsive React setups.', 'Drafting scalable interfaces is an art.', 'NS'),
('emp-2', 'Prerna Rokaya', 'UI/UX System Architect', 'Associate', '9812453148', 'Nepalgunj, Banke', 'Creates high-fidelity wireframes & customized typography guides.', 'Simplicity is the ultimate sophistication.', 'PR'),
('emp-3', 'Sushil Chaudhary', 'Backend Architect', 'Associate', '9812453149', 'Nepalgunj, Banke', 'Optimizes scalable Node.js servers, API routing & Firestore DBs.', 'Systems must be robust and secure first.', 'SC'),
('emp-4', 'Aliza Bajracharya', 'Digital Media strategist', 'Associate', '9812453150', 'Nepalgunj, Banke', 'Leads High-ROI target campaigns on Facebook, Instagram & TikTok.', 'ROI matters more than vanity counts.', 'AB'),
('emp-5', 'Rohan Thapa', 'QA Engineering Lead', 'Associate', '9812453151', 'Nepalgunj, Banke', 'Maintains cross-device safety standards and stress resolution testing.', 'Bugs don''t survive standard testing.', 'RT')
ON CONFLICT (id) DO NOTHING;
`;

// Helper: Handle query failure and log clear message
async function runQuery<T>(promise: Promise<{ data: T | null; error: any }>, localFallback: () => T | Promise<T>): Promise<T> {
  if (!supabase) {
    return localFallback();
  }
  try {
    const { data, error } = await promise;
    if (error) {
      console.warn('[Supabase Warning] Query failed, falling back to local storage:', error.message || error);
      return localFallback();
    }
    if (data === null) {
      return localFallback();
    }
    return data;
  } catch (err) {
    console.warn('[Supabase Warning] Fatal exception connecting to Supabase, falling back to local DB:', err);
    return localFallback();
  }
}

export const SupabaseDB = {
  // --- Auth & Users ---
  async findUserByEmail(email: string): Promise<any> {
    if (!supabase) return LocalDatabase.findUserByEmail(email);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (error) {
        console.warn('[Supabase findUserByEmail] falling back:', error.message);
        return LocalDatabase.findUserByEmail(email);
      }
      if (!data) return null;
      // Convert database snake_case to camelCase
      return {
        id: data.id,
        email: data.email,
        passwordHash: data.password_hash,
        fullName: data.full_name,
        phoneNumber: data.phone_number,
        companyName: data.company_name,
        isAdmin: data.is_admin
      };
    } catch {
      return LocalDatabase.findUserByEmail(email);
    }
  },

  async createUser(email: string, passwordHash: string, fullName: string, phoneNumber: string, companyName?: string, isAdmin: boolean = false, id?: string): Promise<any> {
    if (!supabase) return LocalDatabase.createUser(email, passwordHash, fullName, phoneNumber, companyName, isAdmin, id);
    try {
      const newUser = {
        id: id || `user-${Date.now()}`,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        full_name: fullName,
        phone_number: phoneNumber,
        company_name: companyName || null,
        is_admin: isAdmin
      };

      const { data, error } = await supabase
        .from('users')
        .insert([newUser])
        .select()
        .single();

      if (error) {
        console.warn('[Supabase createUser] falling back to local file write:', error.message);
        return LocalDatabase.createUser(email, passwordHash, fullName, phoneNumber, companyName, isAdmin, id);
      }

      // Also mirror locally so syncing/fallbacks are always up to date
      try { LocalDatabase.createUser(email, passwordHash, fullName, phoneNumber, companyName, isAdmin, id); } catch {}

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        phoneNumber: data.phone_number,
        companyName: data.company_name,
        isAdmin: data.is_admin
      };
    } catch {
      return LocalDatabase.createUser(email, passwordHash, fullName, phoneNumber, companyName, isAdmin);
    }
  },

  async getUsers(): Promise<any[]> {
    if (!supabase) return LocalDatabase.getUsers();
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, phone_number, company_name, is_admin');

      if (error) {
        console.warn('[Supabase getUsers] falling back:', error.message);
        return LocalDatabase.getUsers();
      }
      return data.map(u => ({
        id: u.id,
        email: u.email,
        fullName: u.full_name,
        phoneNumber: u.phone_number,
        companyName: u.company_name,
        isAdmin: u.is_admin
      }));
    } catch {
      return LocalDatabase.getUsers();
    }
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    if (!supabase) return LocalDatabase.getProfile(userId);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) {
        return LocalDatabase.getProfile(userId);
      }

      // Safeguard override for admin personnel
      const userEmailLower = (data.email || '').toLowerCase();
      const isUserAdmin = 
        data.id === '4ff35d7f-125b-4f98-a398-f947290ac32f' ||
        userEmailLower === 'sunbeamschool077@gmail.com' ||
        userEmailLower === 'tilak@tridevdigital.com' ||
        userEmailLower.includes('admin') ||
        data.is_admin === true;

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        phoneNumber: data.phone_number,
        companyName: data.company_name,
        isAdmin: isUserAdmin
      };
    } catch {
      return LocalDatabase.getProfile(userId);
    }
  },

  async updateProfile(userId: string, updateData: { fullName: string; phoneNumber: string; companyName?: string }): Promise<UserProfile | null> {
    if (!supabase) return LocalDatabase.updateProfile(userId, updateData);
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          full_name: updateData.fullName,
          phone_number: updateData.phoneNumber,
          company_name: updateData.companyName || null
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.warn('[Supabase updateProfile] falling back:', error.message);
        return LocalDatabase.updateProfile(userId, updateData);
      }

      // Sync local as well 
      try { LocalDatabase.updateProfile(userId, updateData); } catch {}

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        phoneNumber: data.phone_number,
        companyName: data.company_name,
        isAdmin: data.is_admin
      };
    } catch {
      return LocalDatabase.updateProfile(userId, updateData);
    }
  },

  // --- Inquiries ---
  async getInquiries(userId?: string): Promise<Inquiry[]> {
    if (!supabase) return LocalDatabase.getInquiries(userId);
    try {
      let query = supabase.from('inquiries').select('*');
      if (userId) {
        // Find if user is admin First
        const profile = await this.getProfile(userId);
        if (profile && !profile.isAdmin) {
          query = query.eq('user_id', userId);
        }
      }
      const { data, error } = await query;
      if (error) {
        console.warn('[Supabase getInquiries] falling back:', error.message);
        return LocalDatabase.getInquiries(userId);
      }
      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        fullName: item.full_name,
        email: item.email,
        phoneNumber: item.phone_number,
        companyName: item.company_name,
        serviceType: item.service_type as ServiceType,
        budgetRange: item.budget_range,
        projectDescription: item.project_description,
        status: item.status as InquiryStatus,
        createdAt: item.created_at,
        adminRemarks: item.admin_remarks
      }));
    } catch {
      return LocalDatabase.getInquiries(userId);
    }
  },

  async createInquiry(userId: string, data: Omit<Inquiry, 'id' | 'userId' | 'status' | 'createdAt' | 'adminRemarks'>): Promise<Inquiry> {
    if (!supabase) return LocalDatabase.createInquiry(userId, data);
    try {
      const newInq = {
        id: `inquiry-${Date.now()}`,
        user_id: userId,
        full_name: data.fullName,
        email: data.email,
        phone_number: data.phoneNumber,
        company_name: data.companyName || null,
        service_type: data.serviceType,
        budget_range: data.budgetRange,
        project_description: data.projectDescription,
        status: 'Pending',
        created_at: new Date().toISOString()
      };

      const { data: result, error } = await supabase
        .from('inquiries')
        .insert([newInq])
        .select()
        .single();

      if (error) {
        console.warn('[Supabase createInquiry] falling back:', error.message);
        return LocalDatabase.createInquiry(userId, data);
      }

      // Sync local
      try { LocalDatabase.createInquiry(userId, data); } catch {}

      return {
        id: result.id,
        userId: result.user_id,
        fullName: result.full_name,
        email: result.email,
        phoneNumber: result.phone_number,
        companyName: result.company_name,
        serviceType: result.service_type as ServiceType,
        budgetRange: result.budget_range,
        projectDescription: result.project_description,
        status: result.status as InquiryStatus,
        createdAt: result.created_at,
        adminRemarks: result.admin_remarks
      };
    } catch {
      return LocalDatabase.createInquiry(userId, data);
    }
  },

  async updateInquiryStatus(id: string, status: InquiryStatus, adminRemarks?: string): Promise<Inquiry | null> {
    if (!supabase) return LocalDatabase.updateInquiryStatus(id, status, adminRemarks);
    try {
      const updates: any = { status };
      if (adminRemarks !== undefined) {
        updates.admin_remarks = adminRemarks;
      }

      const { data, error } = await supabase
        .from('inquiries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('[Supabase updateInquiry] falling back:', error.message);
        return LocalDatabase.updateInquiryStatus(id, status, adminRemarks);
      }

      // Sync local
      try { LocalDatabase.updateInquiryStatus(id, status, adminRemarks); } catch {}

      return {
        id: data.id,
        userId: data.user_id,
        fullName: data.full_name,
        email: data.email,
        phoneNumber: data.phone_number,
        companyName: data.company_name,
        serviceType: data.service_type as ServiceType,
        budgetRange: data.budget_range,
        projectDescription: data.project_description,
        status: data.status as InquiryStatus,
        createdAt: data.created_at,
        adminRemarks: data.admin_remarks
      };
    } catch {
      return LocalDatabase.updateInquiryStatus(id, status, adminRemarks);
    }
  },

  async deleteInquiry(id: string): Promise<boolean> {
    if (!supabase) return LocalDatabase.deleteInquiry(id);
    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('[Supabase deleteInquiry] falling back:', error.message);
        return LocalDatabase.deleteInquiry(id);
      }

      try { LocalDatabase.deleteInquiry(id); } catch {}
      return true;
    } catch {
      return LocalDatabase.deleteInquiry(id);
    }
  },

  // --- Services ---
  async getServices(): Promise<ServiceDetail[]> {
    if (!supabase) return LocalDatabase.getServices();
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*');

      if (error) {
        console.warn('[Supabase getServices] falling back:', error.message);
        return LocalDatabase.getServices();
      }

      // Self-healing check for outdated elements or old titles/prices
      const needsSync = !data || data.length === 0 || data.some(item => 
        (item.id === 's1' && item.title !== 'Website Development') ||
        (item.id === 's2' && item.title !== 'Dynamic Website') ||
        (item.id === 's4' && item.title !== 'Digital Marketing') ||
        (item.id === 's5' && item.starting_price !== 'Custom pricing')
      );

      if (needsSync && !attemptedServicesSync) {
        attemptedServicesSync = true;
        console.log('[Supabase DB Sync] Mapped outdated template services, updating database...');
        const defaultServicesUpsert = [
          { id: 's1', title: 'Website Development', subtitle: 'Starting: NPR 12,000+', starting_price: 'NPR 12,000+', features: ['Up to 5 Pages', 'Responsive Design (Mobile + Tablet)', 'Contact Inquiry Form', 'Speed & SEO Optimization', 'Basic Hosting Setup'], type: 'Website Development' },
          { id: 's2', title: 'Dynamic Website', subtitle: 'Starting: NPR 15,000+', starting_price: 'NPR 15,000+', features: ['Unlimited Pages', 'Admin Dashboard Panel', 'Blog or Product Showcase', 'Client Database Integration', 'Enhanced SEO Setup'], type: 'Website Development' },
          { id: 's3', title: 'Mobile App Development', subtitle: 'Starting: NPR 20,000+', starting_price: 'NPR 20,000+', features: ['Android + iOS Deployment', 'Clean Flutter/React Native Core', 'Push Notifications Integration', 'User Auth & Profiles', 'Offline Capability Support'], type: 'Mobile App Development' },
          { id: 's4', title: 'Digital Marketing', subtitle: 'Starting: NPR 5,000/month', starting_price: 'NPR 5,000/month', features: ['Social Media Account Setup', 'Targeted Facebook & TikTok Ad Campaigns', 'Lead Generation Systems', 'Weekly Performance Analytics', 'Ad Creative Asset Planning'], type: 'Digital Marketing' },
          { id: 's5', title: 'Branding & Graphic Design', subtitle: 'Custom pricing', starting_price: 'Custom pricing', features: ['Unique Corporate Logo Suite', 'Color Palette & Typography System', 'Letterheads, Business Cards & Brochures', 'Social Media Branding templates', 'Brand Identity Guideline Document'], type: 'Branding' }
        ];
        
        try {
          const { error: upsertErr } = await supabase.from('services').upsert(defaultServicesUpsert);
          if (upsertErr) {
            const isRLS = (upsertErr.message || '').toLowerCase().includes('security') || (upsertErr.message || '').toLowerCase().includes('policy');
            if (isRLS) {
              console.info('[Supabase getServices] Sync skipped because table Row-Level Security policies are active.');
            } else {
              console.info('[Supabase getServices] Sync bypassed:', upsertErr.message);
            }
            if (data && data.length > 0) {
              return data.map(item => ({
                id: item.id,
                title: item.title,
                subtitle: item.subtitle,
                startingPrice: item.starting_price,
                features: Array.isArray(item.features) ? item.features : [],
                type: item.type as ServiceType
              }));
            }
            return LocalDatabase.getServices();
          }
        } catch (err: any) {
          const errMsg = err?.message || '';
          const isRLS = errMsg.toLowerCase().includes('security') || errMsg.toLowerCase().includes('policy');
          if (isRLS) {
            console.info('[Supabase getServices] Sync exception skipped due to table policy security rules.');
          } else {
            console.info('[Supabase getServices] Sync bypassed exception:', errMsg);
          }
          if (data && data.length > 0) {
            return data.map(item => ({
              id: item.id,
              title: item.title,
              subtitle: item.subtitle,
              startingPrice: item.starting_price,
              features: Array.isArray(item.features) ? item.features : [],
              type: item.type as ServiceType
            }));
          }
          return LocalDatabase.getServices();
        }
        
        // Re-fetch correct data
        const { data: refetched } = await supabase.from('services').select('*');
        if (refetched && refetched.length > 0) {
          return refetched.map(item => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            startingPrice: item.starting_price,
            features: Array.isArray(item.features) ? item.features : [],
            type: item.type as ServiceType
          }));
        }
      }

      if (!data || data.length === 0) {
        console.warn('[Supabase getServices] Empty content in Supabase services table, falling back to Local Database.');
        return LocalDatabase.getServices();
      }

      return data.map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        startingPrice: item.starting_price,
        features: Array.isArray(item.features) ? item.features : [],
        type: item.type as ServiceType
      }));
    } catch {
      return LocalDatabase.getServices();
    }
  },

  async createService(data: Omit<ServiceDetail, 'id'>): Promise<ServiceDetail> {
    if (!supabase) return LocalDatabase.createService(data);
    try {
      const newItem = {
        id: `s-${Date.now()}`,
        title: data.title,
        subtitle: data.subtitle,
        starting_price: data.startingPrice,
        features: data.features,
        type: data.type
      };

      const { data: result, error } = await supabase
        .from('services')
        .insert([newItem])
        .select()
        .single();

      if (error) {
        console.error('[Supabase createService] failed:', error.message);
        throw new Error(`Supabase Insert Failed: ${error.message}. Please make sure you pasted the SQL setup script and disabled Row Level Security (RLS) on your services table.`);
      }

      try { LocalDatabase.createService(data); } catch {}

      return {
        id: result.id,
        title: result.title,
        subtitle: result.subtitle,
        startingPrice: result.starting_price,
        features: result.features,
        type: result.type as ServiceType
      };
    } catch (err: any) {
      console.error('[Supabase createService] exceptional failure:', err);
      throw new Error(err.message || 'database transaction failed');
    }
  },

  async updateService(id: string, data: Partial<Omit<ServiceDetail, 'id'>>): Promise<ServiceDetail | null> {
    if (!supabase) return LocalDatabase.updateService(id, data);
    try {
      const updates: any = {};
      if (data.title) updates.title = data.title;
      if (data.subtitle) updates.subtitle = data.subtitle;
      if (data.startingPrice) updates.starting_price = data.startingPrice;
      if (data.features) updates.features = data.features;
      if (data.type) updates.type = data.type;

      const { data: result, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[Supabase updateService] failed:', error.message);
        throw new Error(`Supabase Update Failed: ${error.message}. Please make sure you pasted the SQL setup script and disabled Row Level Security (RLS) on your services table.`);
      }

      try { LocalDatabase.updateService(id, data); } catch {}

      return {
        id: result.id,
        title: result.title,
        subtitle: result.subtitle,
        startingPrice: result.starting_price,
        features: result.features,
        type: result.type as ServiceType
      };
    } catch (err: any) {
      console.error('[Supabase updateService] exceptional failure:', err);
      throw new Error(err.message || 'database transaction failed');
    }
  },

  async deleteService(id: string): Promise<boolean> {
    if (!supabase) return LocalDatabase.deleteService(id);
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[Supabase deleteService] failed:', error.message);
        throw new Error(`Supabase Delete Failed: ${error.message}. Please make sure you pasted the SQL setup script and disabled Row Level Security (RLS) on your services table.`);
      }

      try { LocalDatabase.deleteService(id); } catch {}
      return true;
    } catch (err: any) {
      console.error('[Supabase deleteService] exceptional failure:', err);
      throw new Error(err.message || 'database transaction failed');
    }
  },

  // --- Portfolio ---
  async getPortfolio(): Promise<PortfolioItem[]> {
    if (!supabase) return LocalDatabase.getPortfolio();
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*');

      if (error) {
        console.warn('[Supabase getPortfolio] falling back:', error.message);
        return LocalDatabase.getPortfolio();
      }

      if (!data || data.length === 0) {
        console.warn('[Supabase getPortfolio] Empty portfolio table, falling back to Local Database.');
        return LocalDatabase.getPortfolio();
      }

      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category as any,
        toolsUsed: Array.isArray(item.tools_used) ? item.tools_used : [],
        imageUrl: item.image_url
      }));
    } catch {
      return LocalDatabase.getPortfolio();
    }
  },

  async createPortfolioItem(data: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem> {
    if (!supabase) return LocalDatabase.createPortfolioItem(data);
    try {
      const newItem = {
        id: `p-${Date.now()}`,
        title: data.title,
        description: data.description,
        category: data.category,
        tools_used: data.toolsUsed,
        image_url: data.imageUrl
      };

      const { data: result, error } = await supabase
        .from('portfolio')
        .insert([newItem])
        .select()
        .single();

      if (error) {
        console.error('[Supabase createPortfolioItem] failed:', error.message);
        throw new Error(`Supabase Insert Failed: ${error.message}. Please make sure you pasted the SQL setup script and disabled Row Level Security (RLS) on your portfolio table.`);
      }

      try { LocalDatabase.createPortfolioItem(data); } catch {}

      return {
        id: result.id,
        title: result.title,
        description: result.description,
        category: result.category as any,
        toolsUsed: result.tools_used,
        imageUrl: result.image_url
      };
    } catch (err: any) {
      console.error('[Supabase createPortfolioItem] exceptional failure:', err);
      throw new Error(err.message || 'database transaction failed');
    }
  },

  async updatePortfolioItem(id: string, data: Partial<Omit<PortfolioItem, 'id'>>): Promise<PortfolioItem | null> {
    if (!supabase) return LocalDatabase.updatePortfolioItem(id, data);
    try {
      const updates: any = {};
      if (data.title) updates.title = data.title;
      if (data.description) updates.description = data.description;
      if (data.category) updates.category = data.category;
      if (data.toolsUsed) updates.tools_used = data.toolsUsed;
      if (data.imageUrl) updates.image_url = data.imageUrl;

      const { data: result, error } = await supabase
        .from('portfolio')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[Supabase updatePortfolioItem] failed:', error.message);
        throw new Error(`Supabase Update Failed: ${error.message}. Please make sure you pasted the SQL setup script and disabled Row Level Security (RLS) on your portfolio table.`);
      }

      try { LocalDatabase.updatePortfolioItem(id, data); } catch {}

      return {
        id: result.id,
        title: result.title,
        description: result.description,
        category: result.category as any,
        toolsUsed: result.tools_used,
        imageUrl: result.image_url
      };
    } catch (err: any) {
      console.error('[Supabase updatePortfolioItem] exceptional failure:', err);
      throw new Error(err.message || 'database transaction failed');
    }
  },

  async deletePortfolioItem(id: string): Promise<boolean> {
    if (!supabase) return LocalDatabase.deletePortfolioItem(id);
    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[Supabase deletePortfolio] failed:', error.message);
        throw new Error(`Supabase Delete Failed: ${error.message}. Please make sure you pasted the SQL setup script and disabled Row Level Security (RLS) on your portfolio table.`);
      }

      try { LocalDatabase.deletePortfolioItem(id); } catch {}
      return true;
    } catch (err: any) {
      console.error('[Supabase deletePortfolio] exceptional failure:', err);
      throw new Error(err.message || 'database transaction failed');
    }
  },

  // --- Marketing Packages ---
  async getMarketingPackages(): Promise<MarketingPackage[]> {
    if (!supabase) return LocalDatabase.getMarketingPackages();
    try {
      const { data, error } = await supabase
        .from('marketing_packages')
        .select('*');

      if (error) {
        console.warn('[Supabase getMarketingPackages] falling back:', error.message);
        return LocalDatabase.getMarketingPackages();
      }

      // Self-healing check for outdated marketing packages
      const needsSync = !data || data.length === 0 || data.some(item => 
        (item.id === 'm1' && item.features.some((f: string) => f.includes('Professional Facebook') || f.includes('Creative TikTok'))) ||
        (item.id === 'm4' && item.features.some((f: string) => f.includes('managed Facebook') || f.includes('Continuous Ad')))
      );

      if (needsSync && !attemptedPackagesSync) {
        attemptedPackagesSync = true;
        console.log('[Supabase DB Sync] Mapped outdated template packages, updating database...');
        const defaultPackagesUpsert = [
          { id: 'm1', name: 'Basic Package', price: 'NPR 5,000/month', features: ['4 Facebook posts', '4 TikTok posts', '1 boosted post'] },
          { id: 'm2', name: 'Standard Package', price: 'NPR 10,000/month', features: ['8 Facebook posts', '8 TikTok posts', '2 boosted posts'] },
          { id: 'm3', name: 'Premium Package', price: 'NPR 15,000/month', features: ['12 Facebook posts', '12 TikTok posts', '4 boosted posts', 'Reels creation', 'Lead generation support'] },
          { id: 'm4', name: 'Business Growth Package', price: 'NPR 25,000/month', features: ['Full social media management', 'Facebook + TikTok marketing', 'Instagram posting (manual content planning only, no tracking integration)', 'Ad campaign management', 'Lead generation'] }
        ];
        
        try {
          const { error: upsertErr } = await supabase.from('marketing_packages').upsert(defaultPackagesUpsert);
          if (upsertErr) {
            const isRLS = (upsertErr.message || '').toLowerCase().includes('security') || (upsertErr.message || '').toLowerCase().includes('policy');
            if (isRLS) {
              console.info('[Supabase getMarketingPackages] Sync skipped because table Row-Level Security policies are active.');
            } else {
              console.info('[Supabase getMarketingPackages] Sync bypassed:', upsertErr.message);
            }
            if (data && data.length > 0) {
              return data.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                features: Array.isArray(item.features) ? item.features : []
              }));
            }
            return LocalDatabase.getMarketingPackages();
          }
        } catch (err: any) {
          const errMsg = err?.message || '';
          const isRLS = errMsg.toLowerCase().includes('security') || errMsg.toLowerCase().includes('policy');
          if (isRLS) {
            console.info('[Supabase getMarketingPackages] Sync exception skipped due to table policy security rules.');
          } else {
            console.info('[Supabase getMarketingPackages] Sync bypassed exception:', errMsg);
          }
          if (data && data.length > 0) {
            return data.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              features: Array.isArray(item.features) ? item.features : []
            }));
          }
          return LocalDatabase.getMarketingPackages();
        }

        // Re-fetch correct data
        const { data: refetched } = await supabase.from('marketing_packages').select('*');
        if (refetched && refetched.length > 0) {
          return refetched.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            features: Array.isArray(item.features) ? item.features : []
          }));
        }
      }

      if (!data || data.length === 0) {
        console.warn('[Supabase getMarketingPackages] Empty packages table, falling back to Local Database.');
        return LocalDatabase.getMarketingPackages();
      }

      return data.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        features: Array.isArray(item.features) ? item.features : []
      }));
    } catch {
      return LocalDatabase.getMarketingPackages();
    }
  },

  async createMarketingPackage(data: Omit<MarketingPackage, 'id'>): Promise<MarketingPackage> {
    if (!supabase) return LocalDatabase.createMarketingPackage(data);
    try {
      const newItem = {
        id: `m-${Date.now()}`,
        name: data.name,
        price: data.price,
        features: data.features
      };

      const { data: result, error } = await supabase
        .from('marketing_packages')
        .insert([newItem])
        .select()
        .single();

      if (error) {
        console.error('[Supabase createMarketingPackage] failed:', error.message);
        throw new Error(`Supabase Insert Failed: ${error.message}. Please make sure you pasted the SQL setup script and disabled Row Level Security (RLS) on your marketing_packages table.`);
      }

      try { LocalDatabase.createMarketingPackage(data); } catch {}

      return {
        id: result.id,
        name: result.name,
        price: result.price,
        features: result.features
      };
    } catch (err: any) {
      console.error('[Supabase createMarketingPackage] exceptional failure:', err);
      throw new Error(err.message || 'database transaction failed');
    }
  },

  async updateMarketingPackage(id: string, data: Partial<Omit<MarketingPackage, 'id'>>): Promise<MarketingPackage | null> {
    if (!supabase) return LocalDatabase.updateMarketingPackage(id, data);
    try {
      const updates: any = {};
      if (data.name) updates.name = data.name;
      if (data.price) updates.price = data.price;
      if (data.features) updates.features = data.features;

      const { data: result, error } = await supabase
        .from('marketing_packages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[Supabase updateMarketingPackage] failed:', error.message);
        throw new Error(`Supabase Update Failed: ${error.message}. Please make sure you pasted the SQL setup script and disabled Row Level Security (RLS) on your marketing_packages table.`);
      }

      try { LocalDatabase.updateMarketingPackage(id, data); } catch {}

      return {
        id: result.id,
        name: result.name,
        price: result.price,
        features: result.features
      };
    } catch (err: any) {
      console.error('[Supabase updateMarketingPackage] exceptional failure:', err);
      throw new Error(err.message || 'database transaction failed');
    }
  },

  async deleteMarketingPackage(id: string): Promise<boolean> {
    if (!supabase) return LocalDatabase.deleteMarketingPackage(id);
    try {
      const { error } = await supabase
        .from('marketing_packages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[Supabase deleteMarketingPackage] failed:', error.message);
        throw new Error(`Supabase Delete Failed: ${error.message}. Please make sure you pasted the SQL setup script and disabled Row Level Security (RLS) on your marketing_packages table.`);
      }

      try { LocalDatabase.deleteMarketingPackage(id); } catch {}
      return true;
    } catch (err: any) {
      console.error('[Supabase deleteMarketingPackage] exceptional failure:', err);
      throw new Error(err.message || 'database transaction failed');
    }
  },

  // --- Contact Messages ---
  async getContactMessages(): Promise<ContactMessage[]> {
    if (!supabase) return LocalDatabase.getContactMessages();
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*');

      if (error) {
        console.warn('[Supabase getContactMessages] falling back:', error.message);
        return LocalDatabase.getContactMessages();
      }
      return data.map(item => ({
        id: item.id,
        fullName: item.full_name,
        email: item.email,
        phoneNumber: item.phone_number,
        message: item.message,
        status: item.status as any,
        createdAt: item.created_at
      }));
    } catch {
      return LocalDatabase.getContactMessages();
    }
  },

  async createContactMessage(data: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<ContactMessage> {
    if (!supabase) return LocalDatabase.createContactMessage(data);
    try {
      const newItem = {
        id: `msg-${Date.now()}`,
        full_name: data.fullName,
        email: data.email,
        phone_number: data.phoneNumber,
        message: data.message,
        status: 'Unread',
        created_at: new Date().toISOString()
      };

      const { data: result, error } = await supabase
        .from('contact_messages')
        .insert([newItem])
        .select()
        .single();

      if (error) {
        console.warn('[Supabase createContactMessage] falling back:', error.message);
        return LocalDatabase.createContactMessage(data);
      }

      try { LocalDatabase.createContactMessage(data); } catch {}

      return {
        id: result.id,
        fullName: result.full_name,
        email: result.email,
        phoneNumber: result.phone_number,
        message: result.message,
        status: result.status as any,
        createdAt: result.created_at
      };
    } catch {
      return LocalDatabase.createContactMessage(data);
    }
  },

  async updateContactMessageStatus(id: string, status: 'Unread' | 'Read' | 'Resolved'): Promise<ContactMessage | null> {
    if (!supabase) return LocalDatabase.updateContactMessageStatus(id, status);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('[Supabase updateContactMessage] falling back:', error.message);
        return LocalDatabase.updateContactMessageStatus(id, status);
      }

      try { LocalDatabase.updateContactMessageStatus(id, status); } catch {}

      return {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        phoneNumber: data.phone_number,
        message: data.message,
        status: data.status as any,
        createdAt: data.created_at
      };
    } catch {
      return LocalDatabase.updateContactMessageStatus(id, status);
    }
  },

  async deleteContactMessage(id: string): Promise<boolean> {
    if (!supabase) return LocalDatabase.deleteContactMessage(id);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('[Supabase deleteContactMessage] falling back:', error.message);
        return LocalDatabase.deleteContactMessage(id);
      }

      try { LocalDatabase.deleteContactMessage(id); } catch {}
      return true;
    } catch {
      return LocalDatabase.deleteContactMessage(id);
    }
  },

  // --- Employees ---
  async getEmployees(): Promise<Employee[]> {
    if (!supabase) {
      // In local database, let's load them
      // We can extend LocalDatabase or read/write employees from LocalDatabase!
      // Let's implement employees helper in LocalDatabase OR read it here dynamically.
      return LocalDatabase.getEmployees ? LocalDatabase.getEmployees() : [];
    }
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*');

      if (error) {
        console.warn('[Supabase getEmployees] falling back:', error.message);
        return LocalDatabase.getEmployees ? LocalDatabase.getEmployees() : [];
      }

      if (!data || data.length === 0) {
        console.warn('[Supabase getEmployees] Empty employees directory structure, falling back to Local Database.');
        return LocalDatabase.getEmployees ? LocalDatabase.getEmployees() : [];
      }

      return data.map(item => ({
        id: item.id,
        name: item.name,
        role: item.role,
        post: item.post,
        phoneNumber: item.phone_number,
        address: item.address,
        spec: item.spec,
        thoughts: item.thoughts,
        init: item.init
      }));
    } catch {
      return LocalDatabase.getEmployees ? LocalDatabase.getEmployees() : [];
    }
  },

  async createEmployee(data: Omit<Employee, 'id'>): Promise<Employee> {
    if (!supabase) {
      return LocalDatabase.createEmployee ? LocalDatabase.createEmployee(data) : { id: `emp-${Date.now()}`, ...data };
    }
    try {
      const newItem = {
        id: `emp-${Date.now()}`,
        name: data.name,
        role: data.role,
        post: data.post,
        phone_number: data.phoneNumber,
        address: data.address,
        spec: data.spec,
        thoughts: data.thoughts,
        init: data.init
      };

      const { data: result, error } = await supabase
        .from('employees')
        .insert([newItem])
        .select()
        .single();

      if (error) {
        console.warn('[Supabase createEmployee] Web client update failed:', error.message);
        const isRLS = (error.message || '').toLowerCase().includes('security') || (error.message || '').toLowerCase().includes('policy');
        if (isRLS) {
          console.info('[Supabase createEmployee] Falling back to local database write because Row-Level Security policies are active.');
        } else {
          console.info('[Supabase createEmployee] Falling back to local database write.');
        }
        return LocalDatabase.createEmployee ? LocalDatabase.createEmployee(data) : { id: newItem.id, ...data };
      }

      try { if (LocalDatabase.createEmployee) LocalDatabase.createEmployee(data); } catch {}

      return {
        id: result.id,
        name: result.name,
        role: result.role,
        post: result.post,
        phoneNumber: result.phone_number,
        address: result.address,
        spec: result.spec,
        thoughts: result.thoughts,
        init: result.init
      };
    } catch (err: any) {
      console.warn('[Supabase createEmployee] Exceptional failure, falling back:', err?.message || err);
      return LocalDatabase.createEmployee ? LocalDatabase.createEmployee(data) : { id: `emp-${Date.now()}`, ...data };
    }
  },

  async updateEmployee(id: string, data: Partial<Omit<Employee, 'id'>>): Promise<Employee | null> {
    if (!supabase) {
      return LocalDatabase.updateEmployee ? LocalDatabase.updateEmployee(id, data) : null;
    }
    try {
      const updates: any = {};
      if (data.name) updates.name = data.name;
      if (data.role) updates.role = data.role;
      if (data.post) updates.post = data.post;
      if (data.phoneNumber) updates.phone_number = data.phoneNumber;
      if (data.address) updates.address = data.address;
      if (data.spec) updates.spec = data.spec;
      if (data.thoughts) updates.thoughts = data.thoughts;
      if (data.init) updates.init = data.init;

      const { data: result, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('[Supabase updateEmployee] Web client update failed:', error.message);
        const isRLS = (error.message || '').toLowerCase().includes('security') || (error.message || '').toLowerCase().includes('policy');
        if (isRLS) {
          console.info('[Supabase updateEmployee] Falling back to local database edit because Row-Level Security policies are active.');
        } else {
          console.info('[Supabase updateEmployee] Falling back to local database edit.');
        }
        return LocalDatabase.updateEmployee ? LocalDatabase.updateEmployee(id, data) : null;
      }

      try { if (LocalDatabase.updateEmployee) LocalDatabase.updateEmployee(id, data); } catch {}

      return {
        id: result.id,
        name: result.name,
        role: result.role,
        post: result.post,
        phoneNumber: result.phone_number,
        address: result.address,
        spec: result.spec,
        thoughts: result.thoughts,
        init: result.init
      };
    } catch (err: any) {
      console.warn('[Supabase updateEmployee] Exceptional failure, falling back:', err?.message || err);
      return LocalDatabase.updateEmployee ? LocalDatabase.updateEmployee(id, data) : null;
    }
  },

  async deleteEmployee(id: string): Promise<boolean> {
    if (!supabase) {
      return LocalDatabase.deleteEmployee ? LocalDatabase.deleteEmployee(id) : false;
    }
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('[Supabase deleteEmployee] Web client delete failed:', error.message);
        const isRLS = (error.message || '').toLowerCase().includes('security') || (error.message || '').toLowerCase().includes('policy');
        if (isRLS) {
          console.info('[Supabase deleteEmployee] Falling back to local database delete because Row-Level Security policies are active.');
        } else {
          console.info('[Supabase deleteEmployee] Falling back to local database delete.');
        }
        return LocalDatabase.deleteEmployee ? LocalDatabase.deleteEmployee(id) : false;
      }

      try { if (LocalDatabase.deleteEmployee) LocalDatabase.deleteEmployee(id); } catch {}
      return true;
    } catch (err: any) {
      console.warn('[Supabase deleteEmployee] Exceptional failure, falling back:', err?.message || err);
      return LocalDatabase.deleteEmployee ? LocalDatabase.deleteEmployee(id) : false;
    }
  },

  async resetEmployees(defaultEmployees: Employee[]): Promise<Employee[]> {
    if (!supabase) {
      return LocalDatabase.resetEmployees ? LocalDatabase.resetEmployees(defaultEmployees) : defaultEmployees;
    }
    try {
      // Clear and seed
      await supabase.from('employees').delete().neq('id', 'dummy_safeguard');
      
      const payload = defaultEmployees.map(emp => ({
        id: emp.id,
        name: emp.name,
        role: emp.role,
        post: emp.post,
        phone_number: emp.phoneNumber,
        address: emp.address,
        spec: emp.spec,
        thoughts: emp.thoughts,
        init: emp.init
      }));

      const { data, error } = await supabase
        .from('employees')
        .insert(payload)
        .select();

      if (error) {
        console.warn('[Supabase resetEmployees] seeding failure, falling back:', error.message);
        return LocalDatabase.resetEmployees ? LocalDatabase.resetEmployees(defaultEmployees) : defaultEmployees;
      }

      try { if (LocalDatabase.resetEmployees) LocalDatabase.resetEmployees(defaultEmployees); } catch {}

      return data.map(item => ({
        id: item.id,
        name: item.name,
        role: item.role,
        post: item.post,
        phoneNumber: item.phone_number,
        address: item.address,
        spec: item.spec,
        thoughts: item.thoughts,
        init: item.init
      }));
    } catch (e) {
      console.warn('Fallback reset employees error:', e);
      return LocalDatabase.resetEmployees ? LocalDatabase.resetEmployees(defaultEmployees) : defaultEmployees;
    }
  }
};
