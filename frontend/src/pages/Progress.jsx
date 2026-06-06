import React, { useEffect, useState, useCallback } from 'react';
import { fetchProgress, updateProgress } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMsg from '../components/ErrorMsg';
import ProgressBar from '../components/ProgressBar';
import WeekCard from '../components/WeekCard';
import { calcPercent } from '../utils/calcPercent';
import { MONTHS, WEEKS } from '../config/progressConfig';
import '../styles/progress.css';

export default function Progress({ sessionId }) {
  const [progress, setProgress] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchProgress(sessionId)
      .then(setProgress)
      .catch(err => setErrorMsg(err.message || 'Failed to load progress. Generate a timetable first.'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleToggle = useCallback(async (month, week, topic, currentStatus) => {
    const newStatus = !currentStatus;

    setProgress(prev => ({
      ...prev,
      [month]: {
        ...prev[month],
        [week]: prev[month][week].map(t =>
          t.topic === topic ? { ...t, completed: newStatus } : t
        )
      }
    }));

    try {
      await updateProgress(sessionId, month, week, topic, newStatus);
    } catch {
      setProgress(prev => ({
        ...prev,
        [month]: {
          ...prev[month],
          [week]: prev[month][week].map(t =>
            t.topic === topic ? { ...t, completed: currentStatus } : t
          )
        }
      }));
    }
  }, [sessionId]);

  const monthData = progress[selectedMonth] || {};
  const monthTopics = Object.values(monthData).flat();
  const monthPercent = calcPercent(monthTopics);
  const allTopics = Object.values(progress).flatMap(m => Object.values(m).flat());
  const overallPercent = calcPercent(allTopics);

  if (loading) return <Spinner text="Loading your progress..." />;

  return (
    <div className="progress-page">

      <div className="progress-header">
        <h2 className="progress-title">Progress Tracker</h2>
        <p className="progress-subtitle">Track your weekly topics and stay on schedule.</p>
      </div>

      <ErrorMsg message={errorMsg} />

      {!errorMsg && (
        <>
          {/* Overall Progress */}
          <div className="overall-card">
            <div className="overall-top">
              <span className="overall-label">Overall Progress</span>
              <span className="overall-percent">{overallPercent}%</span>
            </div>
            <ProgressBar percent={overallPercent} />
            <p className="overall-sub">
              {allTopics.filter(t => t.completed).length} of {allTopics.length} topics completed
            </p>
          </div>

          {/* Month Selector */}
          <div className="month-selector">
            {MONTHS.map(m => {
              const mPercent = calcPercent(Object.values(progress[m] || {}).flat());
              return (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`month-btn ${selectedMonth === m ? 'month-btn-active' : ''}`}
                >
                  <span>Month {m}</span>
                  <span className="month-btn-percent">{mPercent}%</span>
                </button>
              );
            })}
          </div>

          {/* Month Progress */}
          <div className="month-progress-card">
            <div className="month-progress-top">
              <span className="month-progress-label">Month {selectedMonth} Progress</span>
              <span className="month-progress-percent">{monthPercent}%</span>
            </div>
            <ProgressBar percent={monthPercent} />
          </div>

          {/* Week Cards */}
          {Object.keys(monthData).length === 0 ? (
            <div className="no-timetable-msg">
              No timetable found for Month {selectedMonth}. Generate a timetable first.
            </div>
          ) : (
            WEEKS.map(week => {
              const topics = monthData[week] || [];
              if (!topics.length) return null;
              return (
                <WeekCard
                  key={week}
                  week={week}
                  topics={topics}
                  weekPercent={calcPercent(topics)}
                  onToggle={(topic, currentStatus) => handleToggle(selectedMonth, week, topic, currentStatus)}
                />
              );
            })
          )}
        </>
      )}

    </div>
  );
}