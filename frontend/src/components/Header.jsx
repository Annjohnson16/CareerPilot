
import React from 'react';

export default function Header({ currentPage, setCurrentPage }) {
  return (
    <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between bg-transparent">
      
      {/* Brand Logo Identity */}
      <div 
        className="flex items-center space-x-2 cursor-pointer select-none" 
        onClick={() => setCurrentPage('home')}
      >
        <span className="text-2xl font-bold font-serif text-brand-navy">CareerPilot</span>
        <span className="bg-brand-navy text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">AI</span>
      </div>
      
      {/* Feature Navigation Links */}
      <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
        <button 
          onClick={() => setCurrentPage('roadmap')} 
          className={`transition cursor-pointer border-none bg-transparent font-medium ${currentPage === 'roadmap' ? 'text-brand-navy border-b border-brand-navy' : 'text-brand-muted hover:opacity-70'}`}
        >
          ROADMAP
        </button>
        <button className="text-brand-muted/40 cursor-not-allowed border-none bg-transparent font-medium" title="Coming Soon (Phase 1)" disabled>RESOURCES</button>
        <button className="text-brand-muted/40 cursor-not-allowed border-none bg-transparent font-medium" title="Coming Soon (Phase 1)" disabled>PROJECTS</button>
        <button className="text-brand-muted/40 cursor-not-allowed border-none bg-transparent font-medium" title="Coming Soon (Phase 1)" disabled>RESUME ANALYZER</button>
        <button className="text-brand-muted/40 cursor-not-allowed border-none bg-transparent font-medium" title="Coming Soon (Phase 1)" disabled>MOCK INTERVIEW</button>
      </nav>

      {/* Primary Action Button */}
      <div>
        <button 
          onClick={() => setCurrentPage('roadmap')} 
          className="bg-brand-navy text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-opacity-90 transition cursor-pointer border-none"
        >
          Get Started
        </button>
      </div>

    </header>
  );
}