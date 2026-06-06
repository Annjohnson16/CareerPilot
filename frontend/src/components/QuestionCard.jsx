import React from 'react';

export default function QuestionCard({ question: q, index, answer, onChange }) {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-num">Q{index + 1}</span>
        <span className="question-topic">{q.topic}</span>
      </div>
      <p className="question-text">{q.question}</p>
      <textarea
        className="answer-input"
        placeholder="Type your answer here..."
        value={answer || ''}
        onChange={e => onChange(q.id, e.target.value)}
        rows={4}
      />
    </div>
  );
}