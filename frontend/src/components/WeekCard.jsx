import React from 'react';
import ProgressBar from './ProgressBar';

export default function WeekCard({ week, topics, weekPercent, onToggle }) {
  return (
    <div className="week-card">

      <div className="week-card-header">
        <div className="week-card-title-row">
          <h4 className="week-card-title">Week {week}</h4>
          <span className="week-percent">{weekPercent}%</span>
        </div>
        <ProgressBar percent={weekPercent} />
      </div>

      <div className="topic-list">
        {topics.map((t, i) => (
          <div
            key={i}
            className={`topic-item ${t.completed ? 'topic-done' : ''}`}
            onClick={() => onToggle(t.topic, t.completed)}
          >
            <div className={`checkbox ${t.completed ? 'checkbox-checked' : ''}`}>
              {t.completed && <span className="checkmark">✓</span>}
            </div>
            <span className="topic-text">{t.topic}</span>
          </div>
        ))}
      </div>

    </div>
  );
}