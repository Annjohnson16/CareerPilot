import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchResources } from '../services/api';
import ResourceCard from '../components/resourceCard';
import Spinner from '../components/Spinner';
import ErrorMsg from '../components/ErrorMsg';
import { MONTHS } from '../config/resourcesConfig';
import '../styles/resources.css';

export default function Resources({ sessionId }) {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchResources(sessionId)
      .then(setResources)
      .catch(() => setErrorMsg('Failed to load resources.'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <div className="resources-page">

      <div className="resources-header">
        <h2 className="resources-title">Your Learning Resources</h2>
        <p className="resources-subtitle">Curated resources mapped to each month of your roadmap.</p>
      </div>

      <button onClick={() => navigate('/roadmap')} className="back-btn">
        ← Generate New Roadmap
      </button>

      {loading && <Spinner text="Loading your resources..." />}
      <ErrorMsg message={errorMsg} />

      {!loading && MONTHS.map(month => {
        const monthResources = resources.filter(r => r.month === month);
        if (!monthResources.length) return null;
        return (
          <div key={month} className="month-block">
            <h4 className="month-label">Month {month}</h4>
            <div className="card-list">
              {monthResources.map((r, i) => <ResourceCard key={i} resource={r} />)}
            </div>
          </div>
        );
      })}

    </div>
  );
}