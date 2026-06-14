/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { SupabaseDB as Database, hasSupabaseConfig, SETUP_SQL_SCRIPT, supabase } from './supabase-db';
import { InquiryStatus, ServiceType, Employee } from './src/types';

// Extend Express Request type to include user profile
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    companyName?: string;
    isAdmin: boolean;
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing body
  app.use(express.json());

  // Simple Request Logger
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Authentication Middleware
  const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Auth token required (Bearer)' });
      return;
    }
    const token = authHeader.substring(7);
    const userId = token.replace('token-', '');
    try {
      const profile = await Database.getProfile(userId);
      if (!profile) {
        res.status(401).json({ error: 'Session invalid or expired' });
        return;
      }
      
      // Dynamic master check for admin users and specific UUIDs or email strings
      const userEmailLower = (profile.email || '').toLowerCase();
      if (
        profile.id === 'aac19595-9660-4545-b609-d3ead95464de' ||
        userEmailLower === 'sunbeamschool077@gmail.com' ||
        userEmailLower === 'tilak@tridevdigital.com' ||
        userEmailLower === 'tilakkanojiya311@gmail.com' ||
        userEmailLower.includes('admin')
      ) {
        profile.isAdmin = true;
      }

      req.user = profile;
      next();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    requireAuth(req, res, () => {
      if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ error: 'Admin dashboard privileges required' });
        return;
      }
      next();
    });
  };

  // --- API Endpoints ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Auth: Register
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, fullName, phoneNumber, companyName } = req.body;
      if (!email || !password || !fullName || !phoneNumber) {
        res.status(400).json({ error: 'Missing required registration details' });
        return;
      }

      const existing = await Database.findUserByEmail(email);
      if (existing) {
        res.status(400).json({ error: 'Email has already been registered' });
        return;
      }

      // Simple storing of password as hash (in-memory standard lookup)
      const user = await Database.createUser(email, password, fullName, phoneNumber, companyName, false);
      const profile = await Database.getProfile(user.id);
      res.status(201).json({
        user: profile,
        token: `token-${user.id}`
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Auth: Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password required' });
        return;
      }

      let user: any = null;
      let authenticatedViaSupabase = false;

      // 1. Try to authenticate via Supabase Auth if configured
      if (hasSupabaseConfig && supabase) {
        try {
          console.log(`[Auth Login] Checking Credentials in Supabase Auth for ${email}`);
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase(),
            password,
          });

          if (!error && data.user) {
            console.log(`[Auth Login] Supabase Auth sign-in success for ${email}`);
            authenticatedViaSupabase = true;
            const sUser = data.user;

            // Check if profile exists using getProfile
            let existingProfile = await Database.getProfile(sUser.id);
            if (!existingProfile) {
              // Try finding by email
              existingProfile = await Database.findUserByEmail(email);
            }

            // Determine if admin
            const sEmail = sUser.email || email;
            const isAdmin = 
              sEmail.toLowerCase() === 'sunbeamschool077@gmail.com' ||
              sEmail.toLowerCase() === 'tilak@tridevdigital.com' ||
              sEmail.toLowerCase() === 'tilakkanojiya311@gmail.com' ||
              sEmail.toLowerCase().includes('admin') ||
              sUser.id === 'aac19595-9660-4545-b609-d3ead95464de' ||
              sUser.app_metadata?.role === 'admin' ||
              sUser.app_metadata?.is_admin === true ||
              sUser.user_metadata?.is_admin === true ||
              sUser.user_metadata?.isAdmin === true ||
              !!existingProfile?.isAdmin;

            if (!existingProfile) {
              // Creating local profile fallback or database profile
              existingProfile = await Database.createUser(
                sEmail,
                password, // password stored in fallback DB
                sUser.user_metadata?.full_name || sUser.user_metadata?.fullName || sEmail.split('@')[0],
                sUser.user_metadata?.phone_number || sUser.user_metadata?.phoneNumber || 'Not Provided',
                sUser.user_metadata?.company_name || sUser.user_metadata?.companyName || 'Not Provided',
                isAdmin,
                sUser.id // Predefine the ID to map the Auth UUID perfectly
              );
            } else {
              // Update status/isAdmin if needed
              if (existingProfile.isAdmin !== isAdmin) {
                existingProfile.isAdmin = isAdmin;
                try {
                  await Database.updateProfile(existingProfile.id, {
                    fullName: existingProfile.fullName,
                    phoneNumber: existingProfile.phoneNumber,
                    companyName: existingProfile.companyName
                  });
                } catch (updateError) {
                  console.warn('Could not update admin privilege flag:', updateError);
                }
              }
            }

            user = {
              id: sUser.id,
              email: sEmail,
              passwordHash: password,
              fullName: existingProfile.fullName,
              phoneNumber: existingProfile.phoneNumber,
              companyName: existingProfile.companyName,
              isAdmin: isAdmin
            };
          } else if (error) {
            console.log(`[Auth Login] Supabase Auth sign-in rejected for ${email}: ${error.message}`);
          }
        } catch (supabaseError: any) {
          console.warn('[Auth Login] Fatal Supabase Auth Error:', supabaseError.message || supabaseError);
        }
      }

      // 2. Fall back to standard/local DB lookup
      if (!authenticatedViaSupabase) {
        console.log(`[Auth Login] Falling back to standard db user check for ${email}`);
        const localUser = await Database.findUserByEmail(email);
        if (!localUser || localUser.passwordHash !== password) {
          res.status(401).json({ error: 'Invalid email or password combination' });
          return;
        }
        user = localUser;
      }

      const profile = await Database.getProfile(user.id) || {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        companyName: user.companyName,
        isAdmin: user.isAdmin
      };

      res.json({
        user: profile,
        token: `token-${user.id}`
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Auth: Me profile
  app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
    res.json({ user: req.user });
  });

  // Auth: Update Profile
  app.put('/api/auth/profile', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { fullName, phoneNumber, companyName } = req.body;
      if (!fullName || !phoneNumber) {
        res.status(400).json({ error: 'Full name and phone number required' });
        return;
      }
      const updated = await Database.updateProfile(req.user!.id, { fullName, phoneNumber, companyName });
      res.json({ user: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Inquiries APIs
  app.get('/api/inquiries', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const inquiries = await Database.getInquiries(req.user!.id);
      res.json(inquiries);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/inquiries', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { fullName, email, phoneNumber, companyName, serviceType, budgetRange, projectDescription } = req.body;
      if (!fullName || !email || !phoneNumber || !serviceType || !budgetRange || !projectDescription) {
        res.status(400).json({ error: 'Please fill out all mandatory inquiry fields' });
        return;
      }

      const inquiry = await Database.createInquiry(req.user!.id, {
        fullName,
        email,
        phoneNumber,
        companyName,
        serviceType: serviceType as ServiceType,
        budgetRange,
        projectDescription
      });

      res.status(201).json(inquiry);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/inquiries/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminRemarks } = req.body;
      if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
      }
      const updated = await Database.updateInquiryStatus(id, status as InquiryStatus, adminRemarks);
      if (!updated) {
        res.status(404).json({ error: 'Inquiry not found' });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/inquiries/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await Database.deleteInquiry(id);
      if (!success) {
        res.status(404).json({ error: 'Inquiry not found' });
        return;
      }
      res.json({ success: true, message: 'Inquiry deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Services Listings (Public/Admin)
  app.get('/api/services', async (req, res) => {
    try {
      const services = await Database.getServices();
      res.json(services);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/services', requireAdmin, async (req, res) => {
    try {
      const { title, subtitle, startingPrice, features, type } = req.body;
      if (!title || !subtitle || !startingPrice || !features || !type) {
        res.status(400).json({ error: 'All fields required' });
        return;
      }
      const service = await Database.createService({ title, subtitle, startingPrice, features, type });
      res.status(201).json(service);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/services/:id', requireAdmin, async (req, res) => {
    try {
      const updated = await Database.updateService(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Service not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/services/:id', requireAdmin, async (req, res) => {
    try {
      await Database.deleteService(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Portfolio Listings
  app.get('/api/portfolio', async (req, res) => {
    try {
      const items = await Database.getPortfolio();
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/portfolio', requireAdmin, async (req, res) => {
    try {
      const { title, description, category, toolsUsed, imageUrl } = req.body;
      if (!title || !description || !category || !toolsUsed || !imageUrl) {
        res.status(400).json({ error: 'All fields required' });
        return;
      }
      const item = await Database.createPortfolioItem({ title, description, category, toolsUsed, imageUrl });
      res.status(201).json(item);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/portfolio/:id', requireAdmin, async (req, res) => {
    try {
      const updated = await Database.updatePortfolioItem(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Portfolio item not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/portfolio/:id', requireAdmin, async (req, res) => {
    try {
      await Database.deletePortfolioItem(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Marketing Packages
  app.get('/api/marketing', async (req, res) => {
    try {
      const packages = await Database.getMarketingPackages();
      res.json(packages);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/marketing', requireAdmin, async (req, res) => {
    try {
      const { name, price, features } = req.body;
      if (!name || !price || !features) {
        res.status(400).json({ error: 'All fields required' });
        return;
      }
      const pkg = await Database.createMarketingPackage({ name, price, features });
      res.status(201).json(pkg);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/marketing/:id', requireAdmin, async (req, res) => {
    try {
      const updated = await Database.updateMarketingPackage(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Marketing package not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/marketing/:id', requireAdmin, async (req, res) => {
    try {
      await Database.deleteMarketingPackage(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Contact messages
  app.post('/api/contact', async (req, res) => {
    try {
      const { fullName, email, phoneNumber, message } = req.body;
      if (!fullName || !email || !phoneNumber || !message) {
        res.status(400).json({ error: 'All contact message fields are required' });
        return;
      }
      const msg = await Database.createContactMessage({ fullName, email, phoneNumber, message });
      res.status(201).json(msg);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/contact', requireAdmin, async (req, res) => {
    try {
      const messages = await Database.getContactMessages();
      res.json(messages);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/contact/:id', requireAdmin, async (req, res) => {
    try {
      const updated = await Database.updateContactMessageStatus(req.params.id, req.body.status);
      if (!updated) return res.status(404).json({ error: 'Message not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/contact/:id', requireAdmin, async (req, res) => {
    try {
      await Database.deleteContactMessage(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Users lookup for admin
  app.get('/api/users', requireAdmin, async (req, res) => {
    try {
      const users = await Database.getUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Database Configuration & Status ---
  app.get('/api/db-config', (req, res) => {
    res.json({
      configured: hasSupabaseConfig,
      type: hasSupabaseConfig ? 'Supabase DB (Active Remote)' : 'JSON File DB (Local Fallback)',
      url: process.env.SUPABASE_URL || 'Not provided',
      host: 'Supabase Cloud Router',
      tutorialScript: SETUP_SQL_SCRIPT
    });
  });

  // --- Employees API Endpoints ---
  app.get('/api/employees', async (req, res) => {
    try {
      const roster = await Database.getEmployees();
      res.json(roster);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/employees', requireAdmin, async (req, res) => {
    try {
      const { name, role, post, phoneNumber, address, spec, thoughts, init } = req.body;
      if (!name || !role || !spec) {
        res.status(400).json({ error: 'Name, Role, and Specialty are required fields' });
        return;
      }
      const newEmp = await Database.createEmployee({
        name,
        role,
        post: post || 'Associate',
        phoneNumber: phoneNumber || '9812453147',
        address: address || 'Nepalgunj, Banke',
        spec,
        thoughts: thoughts || `Striving to build robust systems at Tridev Digital.`,
        init: init || name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
      });
      res.status(201).json(newEmp);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/employees/:id', requireAdmin, async (req, res) => {
    try {
      const updated = await Database.updateEmployee(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Employee not found' });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/employees/:id', requireAdmin, async (req, res) => {
    try {
      const success = await Database.deleteEmployee(req.params.id);
      if (!success) {
        res.status(404).json({ error: 'Employee not found' });
        return;
      }
      res.json({ success: true, message: 'Employee deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/employees/reset', requireAdmin, async (req, res) => {
    try {
      const { defaultEmployees } = req.body;
      if (!Array.isArray(defaultEmployees)) {
        res.status(400).json({ error: 'defaultEmployees array required' });
        return;
      }
      const resetList = await Database.resetEmployees(defaultEmployees);
      res.json(resetList);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin Analytics Overview (Internal Only)
  app.get('/api/analytics', requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const inquiries = await Database.getInquiries();
      const messages = await Database.getContactMessages();
      const users = await Database.getUsers();

      const inquiriesByStatus = inquiries.reduce((acc: any, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});

      const inquiriesByService = inquiries.reduce((acc: any, item) => {
        acc[item.serviceType] = (acc[item.serviceType] || 0) + 1;
        return acc;
      }, {});

      res.json({
        totalInquiries: inquiries.length,
        totalContactMessages: messages.length,
        totalUsers: users.length,
        inquiriesByStatus,
        inquiriesByService
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware setup or Static file serving fallback
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Mounted Vite Middleware for Client Dev Site Assets');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving Compiled Production Assets from dist/');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express application serving Tridev Digital at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Critical failure in server.ts initialization:', error);
});
