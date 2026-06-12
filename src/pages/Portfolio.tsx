/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, ArrowUpRight, Filter, AlertTriangle } from 'lucide-react';
import { PortfolioItem, UserProfile } from '../types';
import { api } from '../lib/api';

interface PortfolioProps {
  onNavigate: (path: string) => void;
  currentUser: UserProfile | null;
}

type CategoryType = 'All' | 'Websites' | 'Mobile Apps' | 'Branding' | 'Marketing';

export default function Portfolio({ onNavigate, currentUser }: PortfolioProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const data = await api.getPortfolio();
        setPortfolioItems(data);
      } catch (err) {
        console.error('Failed to load portfolio items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, []);

  const categories: CategoryType[] = ['All', 'Websites', 'Mobile Apps', 'Branding', 'Marketing'];

  const filteredItems = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-12 py-8" id="tridev-portfolio-page">
      
      {/* Header Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black border border-zinc-500 p-8 md:p-12 text-center max-w-3xl mx-auto rounded-none">
          <span className="text-[10px] uppercase font-mono tracking-widest bg-[#E10600] text-white px-3 py-1 font-bold">
            Project Showcase
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#E10600] mt-4 font-extrabold">
            Real Work, Real Local Traction
          </h1>
          <p className="text-white text-xs font-mono mt-5 leading-relaxed">
            Explore authentic system rollouts deployed for organizations inside <span className="text-[#E10600] font-bold">Banke district.</span> We build responsive systems focused on <span className="text-[#E10600] font-bold">client generation</span> and maximum <span className="text-[#E10600] font-bold">brand durability.</span>
          </p>
        </div>
      </section>

      {/* Filter Tabs (Absolutely static, no transitions) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2" id="portfolio-filters">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer border transition-none ${
                  isActive
                    ? 'bg-[#E10600] border-[#E10600] text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Projects Grid Display */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="text-center font-mono text-sm text-gray-500 py-12">
            Querying server portfolio records...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center bg-gray-50 border border-gray-200 p-12 max-w-md mx-auto">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-gray-900 font-bold font-display">No projects found</p>
            <p className="text-gray-500 text-xs mt-1">There are no items currently categorized under "{activeCategory}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="portfolio-grid">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-gray-200 hover:border-gray-950 flex flex-col md:flex-row transition-none overflow-hidden"
              >
                {/* Simulated screenshot placeholder using standard unsplash */}
                <div className="w-full md:w-5/12 bg-gray-100 aspect-video md:aspect-auto">
                  <img
                    src={item.imageUrl}
                    alt={`${item.title} Demo`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-95"
                  />
                </div>

                {/* Details Side panel */}
                <div className="w-full md:w-7/12 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="inline-block text-[10px] font-mono font-bold tracking-widest text-[#E10600] uppercase bg-red-50 px-2 py-0.5">
                      {item.category}
                    </span>
                    <h3 className="font-display text-xl font-bold text-gray-950 block">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Tool Badges */}
                  <div className="space-y-3">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">
                        System Tools Applied
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.toolsUsed.map((tool, tIdx) => (
                          <span 
                            key={tIdx} 
                            className="bg-gray-100 text-gray-800 text-[10px] font-mono font-medium px-2 py-0.5"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Deployed & Live
                      </span>
                      <button 
                        onClick={() => {
                          onNavigate('/');
                          setTimeout(() => {
                            const elem = document.getElementById('inquiry-anchor');
                            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                          }, 150);
                        }}
                        className="text-xs font-bold text-[#E10600] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        Request Quote <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Static client logos/mentions */}
      <section className="bg-gray-50 border-t border-gray-200 py-12" id="client-logos-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs uppercase font-mono tracking-widest text-gray-400 font-bold">Trusted by firms across Banke</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 filter grayscale font-display font-black text-gray-400 text-sm tracking-wider">
            <span>BAGESHWORI TRADERS</span>
            <span>NEPALGUNJ AUTOMOBILES</span>
            <span>GULMA SUPER STORE</span>
            <span>HEERA CONFECTIONERS</span>
          </div>
        </div>
      </section>

    </div>
  );
}
