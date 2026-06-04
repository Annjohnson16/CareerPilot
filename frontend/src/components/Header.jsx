import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between bg-transparent">

      <Link to="/" className="flex items-center space-x-2 select-none">
        <span className="text-2xl font-bold font-serif text-brand-navy">CareerPilot</span>
        <span className="bg-brand-navy text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">AI</span>
      </Link>

      <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
        <Link
          to="/roadmap"
          className={`transition font-medium ${
            pathname === '/roadmap'
              ? 'text-brand-navy border-b border-brand-navy'
              : 'text-brand-muted hover:opacity-70'
          }`}
        >
          ROADMAP
        </Link>
        <Link
          to="/resources"
          className={`transition font-medium ${
            pathname === '/resources'
              ? 'text-brand-navy border-b border-brand-navy'
              : 'text-brand-muted hover:opacity-70'
          }`}
        >
          RESOURCES
        </Link>
        <button className="text-brand-muted/40 cursor-not-allowed border-none bg-transparent font-medium" disabled>PROJECTS</button>
        <button className="text-brand-muted/40 cursor-not-allowed border-none bg-transparent font-medium" disabled>RESUME ANALYZER</button>
        <button className="text-brand-muted/40 cursor-not-allowed border-none bg-transparent font-medium" disabled>MOCK INTERVIEW</button>
      </nav>

      <Link to="/roadmap">
        <button className="bg-brand-navy text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-opacity-90 transition cursor-pointer border-none">
          Get Started
        </button>
      </Link>

    </header>
  );
}