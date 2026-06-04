import React, { useState } from 'react';
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
  const [roadmapOutput, setRoadmapOutput] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRoadmapOutput('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/roadmap/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('API server processing fault');
      const data = await response.json();
      setRoadmapOutput(data.roadmap);
    } catch (error) {
      console.error(error);
      alert("Failed to reach your Django app. Make sure it's running on port 8000!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="roadmap-container animate-fadeIn">
      <div className="roadmap-header-group">
        <h2 className="text-4xl font-bold font-serif text-brand-navy">AI Career Roadmap Generator</h2>
        <p className="text-brand-muted mt-2">Map milestones customized directly to your learning parameters.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-grid">
          <div className="form-field-full">
            <label className="field-label">What is your Career Goal?</label>
            <input 
              type="text" id="goal" required value={formData.goal} onChange={handleChange}
              placeholder="e.g., AI Engineer, Fullstack Developer" className="input-field"
            />
          </div>

          <div className="form-field-half">
            <label className="field-label">Current Skill Level</label>
            <select id="level" value={formData.level} onChange={handleChange} className="input-field">
              <option value="Beginner (No experience)">Beginner (No experience)</option>
              <option value="Intermediate (Know basics)">Intermediate (Know basics)</option>
              <option value="Advanced (Looking to specialize)">Advanced (Looking to specialize)</option>
            </select>
          </div>

          <div className="form-field-half">
            <label className="field-label">Daily Study Commitment</label>
            <select id="hours" value={formData.hours} onChange={handleChange} className="input-field">
              <option value="1-2 Hours/day">Light (1-2 Hours/day)</option>
              <option value="3-4 Hours/day">Moderate (3-4 Hours/day)</option>
              <option value="5+ Hours/day">Intensive (5+ Hours/day)</option>
            </select>
          </div>

          <div className="form-field-half">
            <label className="field-label">Preferred Learning Style</label>
            <select id="style" value={formData.style} onChange={handleChange} className="input-field">
              <option value="Visual (Videos & Interactive Labs)">Visual (Videos & Interactive Labs)</option>
              <option value="Text-based (Documentation & Books)">Text-based (Documentation & Books)</option>
              <option value="Practical (Project-first building)">Practical (Project-first building)</option>
            </select>
          </div>

          <div className="form-field-half">
            <label className="field-label">Budget Allocation</label>
            <select id="budget" value={formData.budget} onChange={handleChange} className="input-field">
              <option value="Free resources only">Strictly Free Resources</option>
              <option value="Paid courses / certifications OK">Open to Paid Courses/Certifications</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-brand-navy text-white py-4 font-semibold text-sm tracking-wider uppercase hover:bg-opacity-90 transition cursor-pointer disabled:opacity-50">
          {loading ? 'Processing Requirements...' : 'Generate Custom Path'}
        </button>
      </form>

      {loading && (
        <div className="text-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-navy mx-auto"></div>
          <p className="text-sm font-medium text-brand-muted">Compiling path with Gemini-2.5-Flash pipeline...</p>
        </div>
      )}

      {roadmapOutput && (
        <div className="output-display-card">
          <div className="output-header">
            <h3 className="font-serif text-2xl font-bold text-brand-navy">Your Generated Roadmap</h3>
            <span className="output-badge">Live Active Blueprint</span>
          </div>
          <div className="output-text-content">
            {roadmapOutput}
          </div>
        </div>
      )}
    </div>
  );
}