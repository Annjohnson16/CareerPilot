import React from 'react';

export default function ProgressBar({ percent }) {
  return (
    <div className="progress-bar-bg">
      <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
    </div>
  );
}