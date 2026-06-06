import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/header.css';

const NAV_LINKS = [
  { to: '/roadmap', label: 'ROADMAP' },
  { to: '/resources', label: 'RESOURCES' },
  { to: '/timetable', label: 'TIMETABLE' },
  { to: '/progress', label: 'PROGRESS TRACKER' },
  { to: '/interview', label: 'MOCK INTERVIEW' },
];

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="site-header">

      {/* Logo */}
      <Link to="/" className="logo">
        <span className="logo-text">CareerPilot</span>
        <span className="logo-badge">AI</span>
      </Link>

      {/* Nav */}
      <nav className="nav">
        {NAV_LINKS.map(({ to, label }) => (
          <Link
            key={to} to={to}
            className={`nav-link ${pathname === to ? 'nav-link-active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* CTA */}
      <Link to="/roadmap">
        <button className="cta-btn">Get Started</button>
      </Link>

    </header>
  );
}