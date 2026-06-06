import React from 'react';

export default function ReadyCard({ topicData, onStart }) {
  return (
    <div className="ready-card">
      <div className="ready-info">
        {[
          { label: 'Goal', value: topicData.goal },
          { label: 'Level', value: topicData.level },
          { label: 'Topics Available', value: `${topicData.completed_topics.length} completed topics` },
        ].map(({ label, value }) => (
          <div key={label} className="ready-row">
            <span className="ready-label">{label}</span>
            <span className="ready-value">{value}</span>
          </div>
        ))}
      </div>
      <div className="ready-note">
        5 questions will be generated from your completed topics at your skill level.
      </div>
      <button onClick={onStart} className="interview-btn">
        Start Interview
      </button>
    </div>
  );
}