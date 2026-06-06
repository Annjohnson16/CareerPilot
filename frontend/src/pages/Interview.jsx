import React, { useEffect, useState } from 'react';
import { fetchInterviewTopics, startInterview, submitInterview, fetchInterviewHistory } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMsg from '../components/ErrorMsg';
import ReadyCard from '../components/ReadyCard';
import QuestionCard from '../components/QuestionCard';
import InterviewResult from '../components/InterviewResult';
import { SCORE_COLORS } from '../config/interviewConfig';
import '../styles/interview.css';

const STAGE = {
  LOADING: 'loading',
  READY: 'ready',
  GENERATING: 'generating',
  ANSWERING: 'answering',
  SUBMITTING: 'submitting',
  RESULT: 'result',
};

const SPINNERS = {
  [STAGE.LOADING]: 'Loading your topics...',
  [STAGE.GENERATING]: 'Generating your questions...',
  [STAGE.SUBMITTING]: 'Evaluating your answers...',
};

export default function Interview({ sessionId }) {
  const [stage, setStage] = useState(STAGE.LOADING);
  const [topicData, setTopicData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    Promise.all([
      fetchInterviewTopics(sessionId),
      fetchInterviewHistory(sessionId)
    ])
      .then(([topics, hist]) => {
        setTopicData(topics);
        setHistory(hist.interviews || []);
        setStage(STAGE.READY);
      })
      .catch(err => {
        setErrorMsg(err.message || 'Complete some topics in Progress Tracker first.');
        setStage(STAGE.READY);
      });
  }, [sessionId]);

  const handleStart = async () => {
    setStage(STAGE.GENERATING);
    setErrorMsg('');
    try {
      const data = await startInterview(sessionId);
      setQuestions(data.questions);
      setAnswers({});
      setStage(STAGE.ANSWERING);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate questions.');
      setStage(STAGE.READY);
    }
  };

  const handleSubmit = async () => {
    if (questions.some(q => !answers[q.id]?.trim())) {
      setErrorMsg('Please answer all questions before submitting.');
      return;
    }
    setStage(STAGE.SUBMITTING);
    setErrorMsg('');
    try {
      const data = await submitInterview(sessionId, questions, answers);
      setResult(data);
      setHistory(prev => [{
        id: data.interview_id,
        score: data.score,
        feedback: data.overall_feedback,
        weak_areas: data.weak_areas,
        created_at: 'Just now'
      }, ...prev]);
      setStage(STAGE.RESULT);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to evaluate answers.');
      setStage(STAGE.ANSWERING);
    }
  };

  const handleRetry = () => {
    setStage(STAGE.READY);
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setErrorMsg('');
  };

  const handleAnswerChange = (id, value) =>
    setAnswers(prev => ({ ...prev, [id]: value }));

  return (
    <div className="interview-page">

      <div className="interview-header">
        <h2 className="interview-title">Mock Interview</h2>
        <p className="interview-subtitle">Personalized questions based on your completed topics.</p>
      </div>

      {SPINNERS[stage] && <Spinner text={SPINNERS[stage]} />}
      <ErrorMsg message={errorMsg} />

      {stage === STAGE.READY && topicData && (
        <ReadyCard topicData={topicData} onStart={handleStart} />
      )}

      {stage === STAGE.ANSWERING && (
        <div className="questions-wrapper">
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i}
              answer={answers[q.id]}
              onChange={handleAnswerChange}
            />
          ))}
          <button onClick={handleSubmit} className="interview-btn">
            Submit All Answers
          </button>
        </div>
      )}

      {stage === STAGE.RESULT && result && (
        <InterviewResult result={result} onRetry={handleRetry} />
      )}

      {history.length > 0 && stage !== STAGE.ANSWERING && (
        <div className="history-wrapper">
          <h4 className="history-title">Past Interviews</h4>
          <div className="history-list">
            {history.map((h, i) => (
              <div key={i} className="history-item">
                <div className="history-left">
                  <span className="history-score" style={{ color: SCORE_COLORS[h.score]?.color }}>
                    {h.score}/5
                  </span>
                  <span className="history-date">{h.created_at}</span>
                </div>
                <p className="history-feedback">{h.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}