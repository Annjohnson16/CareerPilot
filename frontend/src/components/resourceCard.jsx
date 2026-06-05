import React from 'react';

export default function ResourceCard({ resource: r }) {
  return (
    <div className="resource-card">
      <div className="card-info">
        <div className="card-title-row">
          <span className="card-title">{r.title}</span>
          <span className="card-type">{r.resource_type}</span>
        </div>
        <p className="card-desc">{r.description}</p>
      </div>
      <div className="card-actions">
        <span className={r.cost === 'Free' ? 'cost-free' : 'cost-paid'}>{r.cost}</span>
        <a href={r.link} target="_blank" rel="noopener noreferrer" className="visit-btn">
          Visit →
        </a>
      </div>
    </div>
  );
}