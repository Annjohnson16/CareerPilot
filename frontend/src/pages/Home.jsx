import React from 'react';
import '../styles/home.css';

export default function Home({ setCurrentPage }) {
  return (
    <section className="home-hero-section animate-fadeIn">
      
      <div className="home-hero-overlay"></div>

      {/* Main Left-Aligned Text Content Block */}
      <div className="home-content-wrapper">
        <h1 className="home-title">
          LEARN SKILLS <br />THAT MATTER.
        </h1>
        <p className="home-subtitle">
          Practical training to upgrade your career, confidence, and opportunities.
        </p>
        
        <div className="home-button-group">
          <button 
            onClick={() => setCurrentPage('roadmap')} 
            className="bg-brand-navy text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-opacity-90 transition cursor-pointer border-none"
          >
            Get Started
          </button>
          <button 
            onClick={() => setCurrentPage('roadmap')}
            className="border border-brand-navy text-brand-navy bg-transparent px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-brand-navy hover:text-white transition cursor-pointer"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  );
}