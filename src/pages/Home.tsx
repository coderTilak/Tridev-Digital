/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Layers, Smartphone, Megaphone, Palette, ArrowRight, CheckCircle2, Award, Calendar, ShieldAlert, Users } from 'lucide-react';
import { ServiceType, UserProfile, Employee } from '../types';
import InquiryForm from '../components/InquiryForm';
import { api } from '../lib/api';

interface HomeProps {
  currentUser: UserProfile | null;
  onNavigate: (path: string) => void;
}

export default function Home({ currentUser, onNavigate }: HomeProps) {
  const [selectedService, setSelectedService] = useState<ServiceType>('Website Development');
  
  const defaultServicesSummary = [
    {
      title: 'Website Development',
      pricing: 'Starting NPR 12,000',
      icon: <Layers className="h-6 w-6 text-[#E10600]" />,
      desc: 'Static portfolio catalogs, full-fledged multi-page business dynamic corporate sites, or customized high-speed local e-commerce stores.',
      serviceType: 'Website Development' as ServiceType
    },
    {
      title: 'Mobile App Development',
      pricing: 'Starting NPR 20,000',
      icon: <Smartphone className="h-6 w-6 text-[#E10600]" />,
      desc: 'Seamless mobile utilities designed on React Native and Flutter with cloud databases, push indicators, and optimal offline states.',
      serviceType: 'Mobile App Development' as ServiceType
    },
    {
      title: 'Digital Marketing (Ads)',
      pricing: 'Starting NPR 5,000/month',
      icon: <Megaphone className="h-6 w-6 text-[#E10600]" />,
      desc: 'Direct Facebook + TikTok promotion, target-audience funnel setups, creatives publishing, and lead generation cycles in Lumbini Province.',
      serviceType: 'Digital Marketing' as ServiceType
    },
    {
      title: 'Branding & graphic designs',
      pricing: 'Custom pricing',
      icon: <Palette className="h-6 w-6 text-[#E10600]" />,
      desc: 'Stunning logos, layout templates, letterheads, packaging design, and complete visual identity systems that build market trust.',
      serviceType: 'Branding' as ServiceType
    }
  ];

  const defaultEmployees: Employee[] = [
    { id: "emp-1", name: "Nirajan Shrestha", role: "Lead Frontend Engineer", post: "Associate", phoneNumber: "9812453147", address: "Nepalgunj, Banke", spec: "Specialist in Tailwind CSS layouts & responsive React setups.", thoughts: "Drafting scalable interfaces is an art.", init: "NS" },
    { id: "emp-2", name: "Prerna Rokaya", role: "UI/UX System Architect", post: "Associate", phoneNumber: "9812453148", address: "Nepalgunj, Banke", spec: "Creates high-fidelity wireframes & customized typography guides.", thoughts: "Simplicity is the ultimate sophistication.", init: "PR" },
    { id: "emp-3", name: "Sushil Chaudhary", role: "Backend Architect", post: "Associate", phoneNumber: "9812453149", address: "Nepalgunj, Banke", spec: "Optimizes scalable Node.js servers, API routing & Firestore DBs.", thoughts: "Systems must be robust and secure first.", init: "SC" },
    { id: "emp-4", name: "Aliza Bajracharya", role: "Digital Media strategist", post: "Associate", phoneNumber: "9812453150", address: "Nepalgunj, Banke", spec: "Leads High-ROI target campaigns on Facebook, Instagram & TikTok.", thoughts: "ROI matters more than vanity counts.", init: "AB" },
    { id: "emp-5", name: "Rohan Thapa", role: "QA Engineering Lead", post: "Associate", phoneNumber: "9812453151", address: "Nepalgunj, Banke", spec: "Maintains cross-device safety standards and stress resolution testing.", thoughts: "Bugs don't survive standard testing.", init: "RT" }
  ];

  const [servicesSummary, setServicesSummary] = useState<{
    title: string;
    pricing: string;
    icon: React.ReactNode;
    desc: string;
    serviceType: ServiceType;
  }[]>(defaultServicesSummary);

  const [employees, setEmployees] = useState<Employee[]>(defaultEmployees);

  const getIconForType = (type: ServiceType) => {
    switch (type) {
      case 'Website Development':
        return <Layers className="h-6 w-6 text-[#E10600]" />;
      case 'Mobile App Development':
        return <Smartphone className="h-6 w-6 text-[#E10600]" />;
      case 'Digital Marketing':
        return <Megaphone className="h-6 w-6 text-[#E10600]" />;
      case 'Branding':
      case 'Graphic Design':
      case 'Video Editing':
      default:
        return <Palette className="h-6 w-6 text-[#E10600]" />;
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const srvs = await api.getServices();
        if (srvs && srvs.length > 0) {
          const mapped = srvs.map(srv => ({
            title: srv.title,
            pricing: srv.startingPrice.toLowerCase().includes('starting') ? srv.startingPrice : `Starting: ${srv.startingPrice}`,
            icon: getIconForType(srv.type),
            desc: srv.subtitle || (srv.features && srv.features.length > 0 ? srv.features.slice(0, 3).join(', ') : ''),
            serviceType: srv.type
          }));
          setServicesSummary(mapped);
        } else {
          setServicesSummary(defaultServicesSummary);
        }
      } catch (err) {
        console.error('Error loading dynamic services summary:', err);
        setServicesSummary(defaultServicesSummary);
      }

      try {
        const roster = await api.getEmployees();
        if (roster && roster.length > 0) {
          setEmployees(roster);
        } else {
          setEmployees(defaultEmployees);
        }
      } catch (err) {
        console.error('Error loading database employees:', err);
        setEmployees(defaultEmployees);
      }
    }
    loadData();
  }, []);

  const valueProps = [
    {
      title: 'Local Presence & Reliability',
      desc: 'Located physically in Nepalgunj, Banke near Gulma. We understand local corporate behaviors, commercial seasons, and client patterns thoroughly.'
    },
    {
      title: 'Cost-Competitive Delivery',
      desc: 'Professional engineering starting at affordable price points like NPR 12,000. Transparent milestones and zero hidden commissions.'
    },
    {
      title: 'End-to-End Campaign Setup',
      desc: 'Whether it is a custom catalog design, a complete iOS app store submission, or physical TikTok post designs, we manage everything in-house.'
    },
    {
      title: 'Director-Backed Quality Guarantee',
      desc: 'Directed directly by Tilak Kanojiya, ensuring robust security protocols, customized communication support, and prompt revisions.'
    }
  ];

  const handleCTAInquiry = (service: ServiceType) => {
    setSelectedService(service);
    const element = document.getElementById('inquiry-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16" id="tridev-home-page">
      
      {/* 1. Hero Segment (No animations) */}
      <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-850" id="home-hero">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase font-mono tracking-widest border border-zinc-800 text-zinc-400 font-bold bg-zinc-900/50">
            Nepalgunj’s Premier Technology Platform
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
            Professional Web Development & <span className="text-[#E10600]">Digital Marketing</span> Elite Agency.
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
            We empower startups and traditional businesses in Banke through modern responsive websites, high-conversion ad campaigns, mobile applications, and visual branding assets.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 font-mono">
            <button
              onClick={() => handleCTAInquiry('Website Development')}
              className="px-6 py-3 bg-[#E10600] hover:bg-white hover:text-black font-bold uppercase text-xs tracking-widest cursor-pointer text-center transition-none"
            >
              Get Free Consultation
            </button>
            <button
              onClick={() => onNavigate('/services')}
              className="px-6 py-3 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white font-bold uppercase text-xs tracking-widest cursor-pointer text-center transition-none"
            >
              Explore Packages
            </button>
          </div>

        </div>
      </section>

      {/* 2. Company Introduction (Static text, high readability) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="company-introduction">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-[2px] w-6 bg-black"></div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">About Our Core Mission</span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 leading-tight">
              Establishing Professional Digital Credibility & Brand Authority in Mid-Western Nepal.
            </h2>
            <p className="text-gray-500 leading-relaxed text-sm">
              Tridev Digital was founded with an objective to lift the local corporate community of Western Region into high-performing commercial websites. Led by Director Tilak Kanojiya, we provide clean coding practices, modern layouts, cost-competitive quotes, and fully traceable in-house campaigns.
            </p>
            <p className="text-gray-500 leading-relaxed text-sm">
              We stand apart in Banke district through transparency. Whether you are ordering a single landing page corporate portal or deploying a complete hybrid application, we back every milestone with rigorous safety codes and prompt director-level responses.
            </p>
            <div>
              <button
                onClick={() => onNavigate('/about')}
                className="inline-flex items-center gap-1 text-xs font-mono font-bold text-black hover:text-[#E10600] hover:underline uppercase tracking-wider cursor-pointer"
              >
                Read more about Tilak Kanojiya <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 border border-zinc-200 border-t-2 border-t-black space-y-1">
              <span className="block text-3xl font-display font-black text-gray-950">12K+</span>
              <span className="block text-[10px] uppercase font-mono text-zinc-400 font-bold tracking-wider">Websites Starting (NPR)</span>
              <p className="text-xs text-gray-400 leading-relaxed">Highly customized and fully SEO optimized to draw immediate local queries.</p>
            </div>
            <div className="bg-white p-6 border border-zinc-200 border-t-2 border-t-black space-y-1">
              <span className="block text-3xl font-display font-black text-gray-950">5K+</span>
              <span className="block text-[10px] uppercase font-mono text-zinc-400 font-bold tracking-wider">Marketing Start (NPR)</span>
              <p className="text-xs text-gray-400 leading-relaxed">Cost-effective professional posting and paid booster cycles on Facebook/TikTok.</p>
            </div>
            <div className="bg-white p-6 border border-zinc-200 border-t-2 border-t-[#E10600] space-y-1">
              <span className="block text-3xl font-display font-black text-[#E10600]">100%</span>
              <span className="block text-[10px] uppercase font-mono text-zinc-400 font-bold tracking-wider">Client Visibility</span>
              <p className="text-xs text-gray-400 leading-relaxed">Monitor active inquiries, tracking statuses, and team notes instantly.</p>
            </div>
            <div className="bg-white p-6 border border-zinc-200 border-t-2 border-t-black space-y-1">
              <span className="block text-3xl font-display font-black text-gray-950">Near</span>
              <span className="block text-[10px] uppercase font-mono text-zinc-400 font-bold tracking-wider">Gulma, Nepalgunj</span>
              <p className="text-xs text-gray-400 leading-relaxed">Physical office presence for ease of live meetings and updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Overview Card Grid */}
      <section className="bg-zinc-50/50 py-16 border-y border-zinc-200" id="services-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight text-gray-950">Professional Services Built For Success</h2>
            <p className="text-gray-500 text-xs font-mono mt-2">
              Every digital asset produced by Tridev Digital is customized to your corporate needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesSummary.map((srv, idx) => (
              <div key={idx} className="bg-white p-6 border border-zinc-200 hover:border-black flex flex-col justify-between transition-none">
                <div className="space-y-4">
                  <div className="bg-zinc-100 border border-zinc-200/50 h-10 w-10 flex items-center justify-center rounded-none text-black">
                    {React.cloneElement(srv.icon, { className: 'h-5 w-5 text-black' })}
                  </div>
                  <h3 className="font-display font-bold text-lg text-gray-900 block">{srv.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{srv.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-gray-900">{srv.pricing}</span>
                  <button
                    onClick={() => handleCTAInquiry(srv.serviceType)}
                    className="text-black hover:text-[#E10600] hover:underline font-mono text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Send Query <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('/services')}
              className="px-6 py-3 bg-black hover:bg-[#E10600] text-white text-xs font-mono font-bold tracking-widest uppercase inline-flex items-center gap-2 cursor-pointer transition-none"
            >
              See Digital Marketing Packages <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="why-choose-us">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold bg-zinc-100 border border-zinc-200/50 px-2.5 py-1">Value Propositions</span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-gray-950 mt-4">Why Local Companies Partner with Tridev Digital</h2>
          <p className="text-gray-500 text-xs font-mono mt-2">We commit physically and digitally to establishing sustainable commerce flows for our clients.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {valueProps.map((prop, idx) => (
            <div key={idx} className="bg-zinc-55/40 p-6 border border-zinc-200 border-l-2 border-l-black space-y-2">
              <h3 className="font-display font-bold text-gray-950 text-base">{prop.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{prop.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4.5 Core Engineering & Solution Team */}
      <section className="bg-zinc-50/50 py-16 border-y border-zinc-200" id="home-team-showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#E10600] font-bold bg-[#E10600]/10 px-2.5 py-1">
              Active Database Core Team
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-gray-950 mt-4">
              Our Professional Associates & Tech Innovators
            </h2>
            <p className="text-gray-500 text-xs font-mono mt-2">
              Every staff member listed here is actively synchronized from Tridev Digital’s persistent database roster.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {employees.slice(0, 5).map((emp) => (
              <div 
                key={emp.id} 
                className="bg-white p-5 border border-zinc-200 hover:border-black flex flex-col justify-between space-y-4 transition-none"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 bg-zinc-100 border border-zinc-200/50 flex items-center justify-center font-mono font-bold text-xs text-black">
                      {emp.init || emp.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[9px] uppercase font-mono font-bold tracking-wide text-zinc-400 bg-zinc-50 border border-zinc-100 px-1.5 py-0.5">
                      {emp.post || 'Associate'}
                    </span>
                  </div>

                  <div className="space-y-1 text-left">
                    <h3 className="font-display font-bold text-gray-950 text-sm">{emp.name}</h3>
                    <p className="text-[#E10600] font-mono text-[10px] uppercase tracking-wider font-bold">
                      {emp.role}
                    </p>
                  </div>

                  <p className="text-gray-500 text-[11px] leading-relaxed text-left border-t border-zinc-100 pt-2 font-mono">
                    {emp.spec}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-150 text-[10px] font-mono text-zinc-400 text-left space-y-1">
                  <div className="flex justify-between">
                    <span>Base Office:</span>
                    <span className="text-gray-900 font-bold">{emp.address || 'Nepalgunj'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact Line:</span>
                    <span className="text-gray-900 font-semibold">{emp.phoneNumber}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('/about')}
              className="text-black hover:text-[#E10600] text-xs font-mono font-bold uppercase tracking-widest hover:underline inline-flex items-center gap-1.5 cursor-pointer"
            >
              Learn More about Tilak Kanojiya & associates <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Central Inquiry Form Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8" id="inquiry-anchor">
        <InquiryForm 
          currentUser={currentUser} 
          onNavigate={onNavigate} 
          preselectedService={selectedService} 
        />
      </section>

    </div>
  );
}
