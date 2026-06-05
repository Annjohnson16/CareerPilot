import React from 'react';

export default function Spinner({ text = 'Loading...' }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      <p className="spinner-text">{text}</p>
    </div>
  );
}