/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { UserProfile, ServiceType } from './types';
import { api } from './lib/api';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [preselectedService, setPreselectedService] = useState<ServiceType>('Website Development');

  // Load previous auth sessions on startup
  useEffect(() => {
    const user = api.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    // Capture standard browser hash changes if any
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        // Enforce prefix route formatting
        const route = hash.startsWith('/') ? hash : '/' + hash;
        setCurrentPath(route);
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Check original hash
    if (window.location.hash) {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Central Router Dispatcher
  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    // Sync browser URL hash to support simple bookmarked navigation within iframes
    window.location.hash = path.substring(1) || '/';
    // Smooth scroll to top of page on navigation
    window.scrollTo({ top: 0 });
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const handleRegisterSuccess = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    handleNavigate('/');
  };

  const handleSetPreselectedService = (service: ServiceType) => {
    setPreselectedService(service);
  };

  // Render Route Component matching active state
  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <Home currentUser={currentUser} onNavigate={handleNavigate} />;
      case '/about':
        return <About onNavigate={handleNavigate} currentUser={currentUser} />;
      case '/services':
        return (
          <Services 
            onNavigate={handleNavigate} 
            currentUser={currentUser} 
            onSetPreselectedService={handleSetPreselectedService} 
          />
        );
      case '/portfolio':
        return <Portfolio onNavigate={handleNavigate} currentUser={currentUser} />;
      case '/contact':
        return <Contact onNavigate={handleNavigate} currentUser={currentUser} />;
      case '/login':
        return <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />;
      case '/register':
        return <Register onNavigate={handleNavigate} onRegisterSuccess={handleRegisterSuccess} />;
      case '/dashboard':
        return (
          <UserDashboard 
            onNavigate={handleNavigate} 
            currentUser={currentUser} 
            onUpdateCurrentUser={(updated) => setCurrentUser(updated)}
            onLogout={handleLogout} 
          />
        );
      case '/admin':
        return (
          <AdminDashboard 
            onNavigate={handleNavigate} 
            currentUser={currentUser} 
            onLogout={handleLogout} 
          />
        );
      default:
        return (
          <div className="max-w-md mx-auto my-16 text-center space-y-4">
            <h2 className="font-display text-2xl font-bold">404 - Section Not Found</h2>
            <p className="text-gray-500 text-sm">The route you requested could not be resolved inside Tridev Digital.</p>
            <button 
              onClick={() => handleNavigate('/')}
              className="px-4 py-2 bg-[#E10600] text-white font-bold"
            >
              Return Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" id="app-viewport">
      {/* Integrated top header bar */}
      <Header 
        currentPath={currentPath} 
        onNavigate={handleNavigate} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />

      {/* Main active work workspace */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Corporate footer info */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
