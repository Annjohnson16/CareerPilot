import React, { useState } from 'react';
import { ROADMAP_FIELDS } from '../config/formSchemas';
import { fetchCareerRoadmap } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMsg from '../components/ErrorMsg';
import '../styles/roadmap.css';

const INITIAL_FORM = {
  goal: '',
  level: 'Beginner (No experience)',
  hours: '3-4 Hours/day',
  style: 'Visual (Videos & Interactive Labs)',
  budget: 'Free resources only'
};

export default function Roadmap({ setSessionId }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [roadmapText, setRoadmapText] = useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setRoadmapText('');
    try {
      const data = await fetchCareerRoadmap(formData);
      setSessionId(data.session_id);
      setRoadmapText(data.roadmap);
    } catch {
      setErrorMsg("Failed to reach your Django app. Make sure it's running on port 8000!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="roadmap-container animate-fadeIn">

      <div className="roadmap-header-group">
        <h2 className="roadmap-main-title">AI Career Roadmap Generator</h2>
        <p className="roadmap-subtitle">Map milestones customized directly to your learning parameters.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-grid">

          <div className="form-field-full">
            <label className="field-label">What is your Career Goal?</label>
            <input
              id="goal" type="text" required disabled={loading}
              value={formData.goal} onChange={handleChange}
              placeholder="e.g., AI Engineer, Fullstack Developer"
              className="input-field"
            />
          </div>

          {ROADMAP_FIELDS.map(({ id, label, options }) => (
            <div key={id} className="form-field-half">
              <label className="field-label">{label}</label>
              <select id={id} value={formData[id]} onChange={handleChange} disabled={loading} className="input-field">
                {options.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          ))}

        </div>

        <ErrorMsg message={errorMsg} />

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Processing Requirements...' : 'Generate Custom Path'}
        </button>
      </form>

      {loading && <Spinner text="Creating your roadmap..." />}

      {roadmapText && (
        <div className="output-display-card">
          <div className="output-header">
            <h3 className="output-title">Your Career Roadmap</h3>
          </div>
          <div className="output-text-content">{roadmapText}</div>
        </div>
      )}

    </div>
  );
}