import React from 'react';
import { SCORE_COLORS } from '../config/interviewConfig';

export default function InterviewResult({ result, onRetry }) {
  const color = SCORE_COLORS[result.score]?.color;

  return (
    <div className="result-wrapper">

      <div className="score-card">
        <div className="score-circle" style={{ borderColor: color }}>
          <span className="score-number" style={{ color }}>{result.score}/5</span>
          <span className="score-label" style={{ color }}>{result.score_label}</span>
        </div>
        <p className="score-feedback">{result.overall_feedback}</p>
      </div>

      {result.weak_areas?.length > 0 && (
        <div className="areas-card">
          <h4 className="areas-title">Areas to Improve</h4>
          <div className="areas-list">
            {result.weak_areas.map((w, i) => (
              <div key={i} className="area-item weak">
                <span className="area-topic">{w.topic}</span>
                <p className="area-reason">{w.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.strong_areas?.length > 0 && (
        <div className="areas-card">
          <h4 className="areas-title">Strong Areas</h4>
          <div className="areas-list">
            {result.strong_areas.map((topic, i) => (
              <div key={i} className="area-item strong">
                <span className="area-topic">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onRetry} className="interview-btn-secondary">
        Take Another Interview
      </button>

    </div>
  );
}