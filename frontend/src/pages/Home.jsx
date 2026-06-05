import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HERO_CONTENT } from '../config/homeContent';
import '../styles/home.css';

export default function Home() {
  const navigate = useNavigate();
  const { title, subtitle, buttons } = HERO_CONTENT;

  return (
    <section className="home-hero-section animate-fadeIn">
      <div className="home-hero-overlay" />
      <div className="home-content-wrapper">
        <h1 className="home-title">{title.highlight} <br /> {title.subtext}</h1>
        <p className="home-subtitle">{subtitle}</p>
        <div className="home-button-group">
          {buttons.map(({ id, text, styleClass }) => (
            <button key={id} onClick={() => navigate('/roadmap')} className={styleClass}>
              {text}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}