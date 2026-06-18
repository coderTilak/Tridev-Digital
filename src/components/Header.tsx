/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, LogOut, Menu, X, User, Briefcase } from 'lucide-react';
import { UserProfile } from '../types';
import tridevLogo from '../assets/images/tridev_logo_1781250740712.jpg';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export default function Header({ currentPath, onNavigate, currentUser, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleItemClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200" id="tridev-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleItemClick('/')} id="brand-logo">
            <img 
              src={tridevLogo}
              alt="TRIDEV Logo"
              className="h-10 w-10 object-cover rounded-none"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight text-[#111827]">TRIDEV</span>
              <span className="text-[10px] font-bold tracking-widest text-[#E10600] uppercase -mt-1">DIGITAL</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex space-x-8 items-center" id="desktop-navigation">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleItemClick(item.path)}
                  className={`text-xs uppercase tracking-widest font-sans font-bold border-b-2 py-5 px-1 cursor-pointer transition-none ${
                    isActive
                      ? 'border-[#E10600] text-black font-bold'
                      : 'border-transparent text-gray-500 hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Area Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4" id="desktop-auth-actions">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleItemClick(currentUser.isAdmin ? '/admin' : '/dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider cursor-pointer border transition-none ${
                    currentPath === '/dashboard' || currentPath === '/admin'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-800 hover:border-black bg-white'
                  }`}
                >
                  {currentUser.isAdmin ? (
                    <>
                      <Briefcase className="h-3.5 w-3.5" />
                      Admin Suite
                    </>
                  ) : (
                    <>
                      <User className="h-3.5 w-3.5" />
                      Workspace
                    </>
                  )}
                </button>
                <button
                  onClick={handleLogoutClick}
                  title="Logout Session"
                  className="p-2 border border-gray-200 text-gray-400 hover:text-black hover:border-black cursor-pointer bg-white transition-none rounded-full"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleItemClick('/login')}
                  className="px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider text-gray-500 hover:text-black cursor-pointer transition-none"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleItemClick('/register')}
                  className="px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider text-white bg-black hover:bg-[#E10600] cursor-pointer transition-none rounded-full"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Toggle Mobile Menu indicator */}
          <div className="flex items-center md:hidden" id="mobile-hamburger">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-[#111827] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white" id="mobile-menu-drawer">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleItemClick(item.path)}
                  className={`block w-full text-left px-3 py-2 text-xs font-sans font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-gray-100 text-black border-l-4 border-black'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="border-t border-gray-200 my-2 pt-2 px-3">
              {currentUser ? (
                <div className="space-y-2 font-sans">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                    User: <span className="text-gray-850 font-bold">{currentUser.fullName}</span>
                  </div>
                  <button
                    onClick={() => handleItemClick(currentUser.isAdmin ? '/admin' : '/dashboard')}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-black text-center text-xs font-bold uppercase tracking-wider text-black bg-white"
                  >
                    {currentUser.isAdmin ? 'Admin Dashboard' : 'My Workspace'}
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-200 text-center text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 font-sans">
                  <button
                    onClick={() => handleItemClick('/login')}
                    className="px-4 py-2 border border-black text-center text-xs font-bold uppercase tracking-wider text-black bg-white"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleItemClick('/register')}
                    className="px-4 py-2 bg-black text-center text-xs font-bold uppercase tracking-wider text-white"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
