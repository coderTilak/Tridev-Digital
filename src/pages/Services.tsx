/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Layers, Smartphone, Megaphone, Palette, HelpCircle, CheckCircle2, ArrowRight, Video, ListCollapse } from 'lucide-react';
import { ServiceDetail, MarketingPackage, UserProfile, ServiceType } from '../types';
import { api } from '../lib/api';

interface ServicesProps {
  onNavigate: (path: string) => void;
  currentUser: UserProfile | null;
  onSetPreselectedService?: (service: ServiceType) => void;
}

export default function Services({ onNavigate, currentUser, onSetPreselectedService }: ServicesProps) {
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [packages, setPackages] = useState<MarketingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [srvData, pkgData] = await Promise.all([
          api.getServices(),
          api.getMarketingPackages()
        ]);
        setServices(srvData);
        setPackages(pkgData);
      } catch (err) {
        console.error('Error fetching services/packages:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleInquiryAction = (serviceType: ServiceType) => {
    if (onSetPreselectedService) {
      onSetPreselectedService(serviceType);
    }
    onNavigate('/');
    // Let the user scroll to the form element
    setTimeout(() => {
      const element = document.getElementById('inquiry-anchor');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div className="space-y-16 py-8" id="tridev-services-page">
      
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black border border-zinc-850 p-8 md:p-12 text-center max-w-3xl mx-auto rounded-none">
          <span className="text-[10px] uppercase font-mono tracking-widest bg-[#E10600] text-white px-3 py-1 font-bold">
            Services & Pricing Matrices
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#E10600] mt-4">
            Digital Engineering & Social Packages
          </h1>
          <p className="text-white text-xs font-mono mt-5 leading-relaxed">
            Clear pricing. <span className="text-[#E10600] font-bold">Hand-crafted responsive coding layouts.</span> Fully managed local Facebook & TikTok target promotions starting from <span className="text-[#E10600] font-bold">NPR 5,000/month.</span>
          </p>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="border-l-2 border-black pl-4">
          <h2 className="font-display text-2xl font-bold text-gray-950">1. Software & App Engineering Core</h2>
          <p className="text-gray-500 text-xs font-mono mt-1">High speed, SEO standard settings, offline buffers, and integrated profile tools.</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm font-mono text-gray-400">Loading catalog items...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => (
              <div key={srv.id} className="bg-white p-6 border border-zinc-200 hover:border-black flex flex-col justify-between transition-none">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold bg-zinc-100 text-zinc-650 border border-zinc-200/50 px-2 py-0.5">
                      {srv.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-900 border-b border-black pb-0.5">
                      {srv.startingPrice}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-gray-900">{srv.title}</h3>
                  <p className="text-gray-450 text-[11px] font-mono leading-relaxed">{srv.subtitle}</p>
                  
                  <ul className="space-y-2 pt-2 border-t border-zinc-100">
                    {srv.features.map((feat, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-gray-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleInquiryAction(srv.type)}
                    className="w-full text-center py-2.5 bg-black hover:bg-[#E10600] text-white text-xs font-mono font-bold uppercase tracking-wider transition-none cursor-pointer"
                  >
                    Select & Send Inquiry
                  </button>
                </div>
              </div>
            ))}

            {/* Injected custom design block */}
            <div className="bg-zinc-950 text-white p-6 border border-zinc-900 border-b-2 border-b-[#E10600] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold bg-[#E10600] text-white px-2 py-0.5">
                    Design / Media
                  </span>
                  <span className="text-xs font-mono font-bold text-[#00C853] border-b border-zinc-800 pb-0.5">
                    Custom Quotation
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold tracking-tight">Graphic Design & Video</h3>
                <p className="text-zinc-450 text-[11px] font-mono leading-relaxed">Visual assets, professional flyers, multi-platform Reels, and corporate layouts.</p>
                
                <ul className="space-y-2 pt-2 border-t border-zinc-900">
                  <li className="flex gap-2 items-start text-xs text-zinc-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-zinc-650 shrink-0 mt-0.5" />
                    <span>NPR 500 – 20,000+ choice</span>
                  </li>
                  <li className="flex gap-2 items-start text-xs text-zinc-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-zinc-650 shrink-0 mt-0.5" />
                    <span>In-studio color calibration</span>
                  </li>
                  <li className="flex gap-2 items-start text-xs text-zinc-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-zinc-650 shrink-0 mt-0.5" />
                    <span>Content outline planning</span>
                  </li>
                  <li className="flex gap-2 items-start text-xs text-zinc-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-zinc-650 shrink-0 mt-0.5" />
                    <span>Vector master sources shared</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleInquiryAction('Graphic Design')}
                  className="w-full text-center py-2.5 bg-white text-black hover:bg-[#E10600] hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-none cursor-pointer"
                >
                  Send Design Request
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. Detailed Marketing Packages */}
      <section className="bg-zinc-50/50 py-16 border-y border-zinc-200" id="marketing-packages">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="border-l-2 border-black pl-4">
            <h2 className="font-display text-2xl font-bold text-gray-950">2. Social Media Promotion Packages</h2>
            <p className="text-gray-500 text-xs font-mono mt-1">Fixed-price monthly campaigns linking directly to business engagement inside Banke district.</p>
          </div>

          {loading ? (
            <div className="text-center font-mono text-xs text-gray-400">Loading social plans...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => {
                // Determine highlight style
                const isPremium = pkg.name.toLowerCase().includes('premium');
                const isGrowth = pkg.name.toLowerCase().includes('growth');
                
                return (
                  <div 
                    key={pkg.id} 
                    className={`bg-white p-6 border flex flex-col justify-between transition-none ${
                      isPremium 
                        ? 'border-zinc-300 border-t-4 border-t-black' 
                        : isGrowth 
                        ? 'border-zinc-200 border-t-4 border-t-zinc-400'
                        : 'border-zinc-200'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-zinc-400 block">
                          Subscription Plan
                        </span>
                        <h3 className="font-display text-lg font-bold text-gray-950">{pkg.name}</h3>
                      </div>

                      <div className="bg-zinc-50 border border-zinc-150 p-3">
                        <span className="block text-xl font-mono font-bold text-gray-950 tracking-tight">
                          {pkg.price}
                        </span>
                      </div>

                      <ul className="space-y-2 pt-2 text-xs text-gray-500 font-mono">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex gap-2 items-start text-[11px] leading-relaxed">
                            <span className="text-black font-bold shrink-0">·</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8">
                      <button
                        onClick={() => handleInquiryAction('Digital Marketing')}
                        className={`w-full py-2.5 text-center text-xs font-mono font-bold uppercase tracking-wider transition-none cursor-pointer ${
                          isPremium 
                            ? 'bg-black text-white hover:bg-[#E10600]' 
                            : isGrowth 
                            ? 'bg-zinc-800 text-white hover:bg-[#E10600]' 
                            : 'bg-zinc-100 text-zinc-800 hover:bg-black hover:text-white'
                        }`}
                      >
                        Order {pkg.name}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Corporate Support Note Segment */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-zinc-50/50 p-8 border border-zinc-200 border-l-2 border-l-black" id="pricing-disclaimer">
        <h3 className="font-display text-lg font-bold text-gray-950">Custom Business Solutions</h3>
        <p className="text-gray-500 text-xs font-mono mt-2 leading-relaxed">
          The costs declared above cover standard business demands inside the Kohalpur/Nepalgunj market. If your operations require dedicated database scaling, secure multi-branch integrations, API integrations with local banks (e.g. eSewa, Khalti), or on-site studio photography, Director Tilak Kanojiya will coordinate with your team to frame a customized commercial contract.
        </p>
        <div className="flex gap-4 mt-4 text-xs font-mono font-bold uppercase tracking-widest">
          <button onClick={() => onNavigate('/contact')} className="text-black hover:text-[#E10600] hover:underline cursor-pointer">
            Browse Address Details
          </button>
          <span className="text-zinc-300">|</span>
          <span className="text-zinc-500">Contact Line: 9812453147</span>
        </div>
      </section>

    </div>
  );
}
