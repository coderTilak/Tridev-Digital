/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, HelpCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-100 border-t border-green-200 mt-auto text-black" id="tridev-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Intro */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="flex items-center justify-center h-8 w-8 text-white bg-black">
                <span className="font-bold text-sm">T</span>
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-black">TRIDEV DIGITAL</span>
            </div>
            <p className="text-black text-sm leading-relaxed">
              Leading Tech & Digital Agency in Nepalgunj, Banke. We build premium websites, Android/iOS mobile applications, and high-conversion marketing funnels.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-black font-mono text-xs uppercase tracking-wider mb-4 border-l-2 border-black pl-2 font-bold">
              Our Agency
            </h4>
            <ul className="space-y-2 text-xs text-black">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:underline transition-none cursor-pointer font-medium text-black">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:underline transition-none cursor-pointer font-medium text-black">
                  Services & Packages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/portfolio')} className="hover:underline transition-none cursor-pointer font-medium text-black">
                  Work Showcase
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:underline transition-none cursor-pointer font-medium text-black">
                  About Us (Tilak Kanojiya)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:underline transition-none cursor-pointer font-medium text-black">
                  Get In Touch
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Info */}
          <div>
            <h4 className="text-black font-mono text-xs uppercase tracking-wider mb-4 border-l-2 border-black pl-2 font-bold">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-xs text-black animate-none">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-black shrink-0 mt-0.5" />
                <span>Nepalgunj, Banke,<br />Near Gulma, Nepal</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-black" />
                <a href="tel:9812453147" className="hover:underline text-black font-medium">9812453147</a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-black" />
                <a href="tel:9769277257" className="hover:underline text-black font-medium">9769277257</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Corporate Info & Support */}
          <div>
            <h4 className="text-black font-mono text-xs uppercase tracking-wider mb-4 border-l-2 border-black pl-2 font-bold">
              Business Coordinates
            </h4>
            <div className="space-y-3 text-xs text-black">
              <div>
                <p className="font-semibold text-black">Director:</p>
                <p>Tilak Kanojiya</p>
              </div>
              <div className="flex items-start space-x-2">
                <HelpCircle className="h-4 w-4 text-black shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-black">
                  Support: Business inquiry based support standard. Feel free to register or submit an inquiry, and our support team will respond promptly.
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-green-300 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-black space-y-4 sm:space-y-0 text-center sm:text-left font-mono">
          <p>© {currentYear} Tridev Digital. Nepalgunj, Banke, Near Gulma.</p>
          <div className="flex space-x-4">
            <span className="flex items-center gap-1 text-[10px] text-black">
              <ShieldCheck className="h-4 w-4 text-black" />
              Verified Local Agency
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
