import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchResources } from '../services/api';
import '../styles/resources.css';

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
    <div className="resources-page">

      {/* Page Header */}
      <div className="resources-header">
        <h2 className="resources-title">Your Learning Resources</h2>
        <p className="resources-subtitle">Curated resources mapped to each month of your roadmap.</p>
      </div>

      {/* Back Button */}
      <button onClick={() => navigate('/roadmap')} className="back-btn">
        ← Generate New Roadmap
      </button>

      {/* Loading Spinner */}
      {loading && (
        <div className="spinner-wrapper">
          <div className="spinner"></div>
          <p className="spinner-text">Loading your resources...</p>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="error-msg">⚠️ {errorMsg}</div>
      )}

      {/* Resources grouped by Month */}
      {!loading && [1, 2, 3, 4, 5, 6].map(month => {
        const monthResources = resources.filter(r => r.month === month);
        if (!monthResources.length) return null;

        return (
          <div key={month} className="month-block">

            {/* Month Label */}
            <h4 className="month-label">Month {month}</h4>

            {/* Cards */}
            <div className="card-list">
              {monthResources.map((r, i) => (
                <div key={i} className="resource-card">

                  {/* Left side */}
                  <div className="card-info">
                    <div className="card-title-row">
                      <span className="card-title">{r.title}</span>
                      <span className="card-type">{r.resource_type}</span>
                    </div>
                    <p className="card-desc">{r.description}</p>
                  </div>

                  {/* Right side */}
                  <div className="card-actions">
                    <span className={r.cost === 'Free' ? 'cost-free' : 'cost-paid'}>
                      {r.cost}
                    </span>
                    <a href={r.link} target="_blank" rel="noopener noreferrer" className="visit-btn">
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