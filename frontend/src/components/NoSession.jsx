import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NoSession() {
  const navigate = useNavigate();
  return (
    <div className="text-center py-24 space-y-4">
      <p className="text-brand-muted text-sm">No roadmap generated yet.</p>
      <button
        onClick={() => navigate('/roadmap')}
        className="bg-brand-navy text-white px-6 py-3 text-xs font-semibold uppercase tracking-wider"
      >
        Generate Your Roadmap First
      </button>
    </div>
  );
}