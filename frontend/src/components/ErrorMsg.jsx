import React from 'react';

export default function ErrorMsg({ message }) {
  if (!message) return null;
  return <div className="error-msg">⚠️ {message}</div>;
}