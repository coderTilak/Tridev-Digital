/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
} from '../types';

const API_BASE_URL = 'https://tridev-digital.onrender.com';

const getHeaders = () => {
  const token = localStorage.getItem('tridev_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('tridev_token', data.token);
    localStorage.setItem('tridev_user', JSON.stringify(data.user));
    return data as { user: UserProfile; token: string };
  },

  async register(email: string, passwordHash: string, fullName: string, phoneNumber: string, companyName?: string) {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: passwordHash, fullName, phoneNumber, companyName }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    localStorage.setItem('tridev_token', data.token);
    localStorage.setItem('tridev_user', JSON.stringify(data.user));
    return data as { user: UserProfile; token: string };
  },

  logout() {
    localStorage.removeItem('tridev_token');
    localStorage.removeItem('tridev_user');
  },

  getCurrentUser(): UserProfile | null {
    const userStr = localStorage.getItem('tridev_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  async updateProfile(fullName: string, phoneNumber: string, companyName?: string) {
    const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ fullName, phoneNumber, companyName }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Profile update failed');
    localStorage.setItem('tridev_user', JSON.stringify(data.user));
    return data.user as UserProfile;
  },

  // Inquiries
  async getInquiries() {
    const res = await fetch(`${API_BASE_URL}/api/inquiries`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch inquiries');
    return data as Inquiry[];
  },

  async submitInquiry(data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    companyName?: string;
    serviceType: ServiceType;
    budgetRange: string;
    projectDescription: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit inquiry');
    return result as Inquiry;
  },

  async updateInquiryStatus(id: string, status: InquiryStatus, adminRemarks?: string) {
    const res = await fetch(`${API_BASE_URL}/api/inquiries/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, adminRemarks }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update inquiry status');
    return result as Inquiry;
  },

  async deleteInquiry(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/inquiries/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete inquiry');
    return result;
  },

  // Services
  async getServices() {
    const res = await fetch(`${API_BASE_URL}/api/services`);
    return (await res.json()) as ServiceDetail[];
  },

  async createService(data: Omit<ServiceDetail, 'id'>) {
    const res = await fetch(`${API_BASE_URL}/api/services`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to create service');
    return result as ServiceDetail;
  },

  async updateService(id: string, data: Partial<Omit<ServiceDetail, 'id'>>) {
    const res = await fetch(`${API_BASE_URL}/api/services/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update service');
    return result as ServiceDetail;
  },

  async deleteService(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete service tier');
    return result;
  },

  // Portfolio
  async getPortfolio() {
    const res = await fetch(`${API_BASE_URL}/api/portfolio`);
    return (await res.json()) as PortfolioItem[];
  },

  async createPortfolioItem(data: Omit<PortfolioItem, 'id'>) {
    const res = await fetch(`${API_BASE_URL}/api/portfolio`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to create portfolio item');
    return result as PortfolioItem;
  },

  async updatePortfolioItem(id: string, data: Partial<Omit<PortfolioItem, 'id'>>) {
    const res = await fetch(`${API_BASE_URL}/api/portfolio/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update portfolio item');
    return result as PortfolioItem;
  },

  async deletePortfolioItem(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/portfolio/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete portfolio item');
    return result;
  },

  // Marketing Packages
  async getMarketingPackages() {
    const res = await fetch(`${API_BASE_URL}/api/marketing`);
    return (await res.json()) as MarketingPackage[];
  },

  async createMarketingPackage(data: Omit<MarketingPackage, 'id'>) {
    const res = await fetch(`${API_BASE_URL}/api/marketing`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to create package');
    return result as MarketingPackage;
  },

  async updateMarketingPackage(id: string, data: Partial<Omit<MarketingPackage, 'id'>>) {
    const res = await fetch(`${API_BASE_URL}/api/marketing/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update package');
    return result as MarketingPackage;
  },

  async deleteMarketingPackage(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/marketing/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete package');
    return result;
  },

  // Contacts
  async submitContactMessage(fullName: string, email: string, phoneNumber: string, message: string) {
    const res = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, phoneNumber, message }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to send message');
    return result as ContactMessage;
  },

  async getContactMessages() {
    const res = await fetch(`${API_BASE_URL}/api/contact`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch contact messages');
    return data as ContactMessage[];
  },

  async updateContactMessageStatus(id: string, status: 'Unread' | 'Read' | 'Resolved') {
    const res = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update message status');
    return result as ContactMessage;
  },

  async deleteContactMessage(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete contact message');
    return result;
  },

  // Users Table
  async getUsers() {
    const res = await fetch(`${API_BASE_URL}/api/users`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch users list');
    return data as UserProfile[];
  },

  // Analytics
  async getAnalytics() {
    const res = await fetch(`${API_BASE_URL}/api/analytics`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load analytics dashboard');
    return data as {
      totalInquiries: number;
      totalContactMessages: number;
      totalUsers: number;
      inquiriesByStatus: Record<string, number>;
      inquiriesByService: Record<string, number>;
    };
  },

  // Db Status & Setup Tutorial
  async getDbConfig() {
    const res = await fetch(`${API_BASE_URL}/api/db-config`);
    return await res.json() as {
      configured: boolean;
      type: string;
      url: string;
      host: string;
      tutorialScript: string;
    };
  },

  // Employees List CRUD
  async getEmployees() {
    const res = await fetch(`${API_BASE_URL}/api/employees`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch team list');
    return data as Employee[];
  },

  async createEmployee(data: Omit<Employee, 'id'>) {
    const res = await fetch(`${API_BASE_URL}/api/employees`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to add employee');
    return result as Employee;
  },

  async updateEmployee(id: string, data: Partial<Omit<Employee, 'id'>>) {
    const res = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update employee details');
    return result as Employee;
  },

  async deleteEmployee(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to remove employee');
    return result;
  },

  async resetEmployees(defaultEmployees: Employee[]) {
    const res = await fetch(`${API_BASE_URL}/api/employees/reset`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ defaultEmployees })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to reset employee database roster');
    return result as Employee[];
  }
};
