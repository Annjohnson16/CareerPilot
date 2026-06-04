import React, { useState } from 'react';
import { ROADMAP_FIELDS } from '../config/formSchemas';
import { fetchCareerRoadmap } from '../services/api';
import '../styles/roadmap.css';

export default function Roadmap() {
  const [formData, setFormData] = useState({
    goal: '',
    level: 'Beginner (No experience)',
    hours: '3-4 Hours/day',
    style: 'Visual (Videos & Interactive Labs)',
    budget: 'Free resources only'
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [roadmapOutput, setRoadmapOutput] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setRoadmapOutput('');

    try {
      const roadmap = await fetchCareerRoadmap(formData);
      setRoadmapOutput(roadmap);
    } catch (err) {
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
              type="text" id="goal" required disabled={loading}
              value={formData.goal} onChange={handleChange}
              placeholder="e.g., AI Engineer, Fullstack Developer" className="input-field"
            />
          </div>

          {ROADMAP_FIELDS.map((field) => (
            <div key={field.id} className="form-field-half">
              <label className="field-label">{field.label}</label>
              <select id={field.id} value={formData[field.id]} onChange={handleChange} disabled={loading} className="input-field">
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
          
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded">
            ⚠️ {errorMsg}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Processing Requirements...' : 'Generate Custom Path'}
        </button>
      </form>

      {loading && (
        <div className="loading-wrapper">
          <div className="loading-spinner"></div>
          <p className="loading-text">Compiling path with Gemini-2.5-Flash pipeline...</p>
        </div>
      )}

      {roadmapOutput && (
        <div className="output-display-card">
          <div className="output-header">
            <h3 className="output-title">Your Generated Roadmap</h3>
            <span className="output-badge">Live Active Blueprint</span>
          </div>
          <div className="output-text-content">{roadmapOutput}</div>
        </div>
      )}
    </div>
  );
}