import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchResources } from '../services/api';

export default function Resources({ sessionId }) {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchResources(sessionId);
        setResources(data);
      } catch (err) {
        setErrorMsg('Failed to load resources.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId]);

  return (
    <div className="roadmap-container animate-fadeIn">
      <div className="roadmap-header-group">
        <h2 className="roadmap-main-title">Your Learning Resources</h2>
        <p className="roadmap-subtitle">Curated resources mapped to each month of your roadmap.</p>
      </div>

      <button
        onClick={() => navigate('/roadmap')}
        className="mb-8 text-xs font-semibold uppercase tracking-wider text-brand-muted hover:text-brand-navy transition"
      >
        ← Generate New Roadmap
      </button>

      {loading && (
        <div className="loading-wrapper">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your resources...</p>
        </div>
      )}

      {errorMsg && <div className="form-error">⚠️ {errorMsg}</div>}

      {!loading && [1, 2, 3, 4, 5, 6].map(month => {
        const monthResources = resources.filter(r => r.month === month);
        if (!monthResources.length) return null;
        return (
          <div key={month} className="mb-10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-3 border-b border-brand-navy/10 pb-2">
              Month {month}
            </h4>
            <div className="space-y-3">
              {monthResources.map((r, i) => (
                <div key={i} className="flex items-start justify-between p-4 bg-white border border-brand-navy/10 hover:border-brand-navy/30 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-brand-navy">{r.title}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-brand-navy/5 text-brand-muted">
                        {r.resource_type}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted">{r.description}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className={`text-xs font-bold ${r.cost === 'Free' ? 'text-green-600' : 'text-brand-navy'}`}>
                      {r.cost}
                    </span>
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] uppercase font-semibold tracking-wider px-3 py-1.5 border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition"
                    >
                      Visit →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}