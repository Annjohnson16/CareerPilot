import React from 'react';
import { HERO_CONTENT } from '../config/homeContent';
import '../styles/home.css';

export default function Home({ setCurrentPage }) {
  const { title, subtitle, buttons } = HERO_CONTENT;

  return (
    <section className="home-hero-section animate-fadeIn">
      {/* Background Image Text Protection Overlay */}
      <div className="home-hero-overlay"></div>

      {/* Main Content Block */}
      <div className="home-content-wrapper">
        <h1 className="home-title">
          {title.highlight} <br /> {title.subtext}
        </h1>
        
        <p className="home-subtitle">
          {subtitle}
        </p>
        
        {/* Dynamic Optimized Button Group Loop */}
        <div className="home-button-group">
          {buttons.map((btn) => (
            <button 
              key={btn.id}
              onClick={() => setCurrentPage(btn.actionType)} 
              className={btn.styleClass}
            >
              {btn.text}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}