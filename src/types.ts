/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ServiceType = 
  | 'Website Development' 
  | 'Mobile App Development' 
  | 'Digital Marketing' 
  | 'Branding' 
  | 'Graphic Design' 
  | 'Video Editing';

export type InquiryStatus = 'Pending' | 'Reviewing' | 'In Progress' | 'Completed' | 'Cancelled';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  companyName?: string;
  isAdmin: boolean;
}

export interface Inquiry {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  serviceType: ServiceType;
  budgetRange: string;
  projectDescription: string;
  status: InquiryStatus;
  createdAt: string;
  adminRemarks?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: 'Websites' | 'Mobile Apps' | 'Branding' | 'Marketing';
  toolsUsed: string[];
  imageUrl: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  subtitle: string;
  startingPrice: string;
  features: string[];
  type: ServiceType;
}

export interface MarketingPackage {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
  status: 'Unread' | 'Read' | 'Resolved';
  createdAt: string;
}

export interface SessionData {
  user: UserProfile | null;
  token: string | null;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  post: string;
  phoneNumber: string;
  address: string;
  spec: string;
  thoughts: string;
  init: string;
}

