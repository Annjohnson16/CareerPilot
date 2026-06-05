import React, { useState } from 'react';
import { fetchTimetable } from '../services/api';
import { MONTHS, STUDY_HOURS_OPTIONS, PREFERRED_TIME_OPTIONS, DAYS } from '../config/timetableConfig';
import Spinner from '../components/Spinner';
import ErrorMsg from '../components/ErrorMsg';
import '../styles/timetable.css';

export default function Timetable({ sessionId }) {
  const [month, setMonth] = useState(1);
  const [studyHours, setStudyHours] = useState('2 Hours');
  const [preferredTime, setPreferredTime] = useState('Morning (6AM - 12PM)');
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg('');
    setSchedule(null);
    try {
      const data = await fetchTimetable(sessionId, month, studyHours, preferredTime);
      setSchedule(data.schedule);
    } catch {
      setErrorMsg('Failed to generate timetable. Make sure your roadmap is generated first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="timetable-page">

      <div className="timetable-header">
        <h2 className="timetable-title">Study Timetable</h2>
        <p className="timetable-subtitle">Get a personalized weekly schedule based on your roadmap.</p>
      </div>

      <div className="timetable-form">

        <div className="timetable-field">
          <label className="timetable-label">Select Month</label>
          <select value={month} onChange={e => setMonth(Number(e.target.value))} className="timetable-select">
            {MONTHS.map(m => <option key={m} value={m}>Month {m}</option>)}
          </select>
        </div>

        <div className="timetable-field">
          <label className="timetable-label">Daily Study Hours</label>
          <select value={studyHours} onChange={e => setStudyHours(e.target.value)} className="timetable-select">
            {STUDY_HOURS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="timetable-field">
          <label className="timetable-label">Preferred Study Time</label>
          <select value={preferredTime} onChange={e => setPreferredTime(e.target.value)} className="timetable-select">
            {PREFERRED_TIME_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="timetable-btn">
          {loading ? 'Generating...' : 'Generate Timetable'}
        </button>

      </div>

      <ErrorMsg message={errorMsg} />
      {loading && <Spinner text="Building your schedule..." />}

      {schedule && (
        <div className="schedule-wrapper">
          {schedule.map(({ week, days }) => (
            <div key={week} className="week-block">
              <h4 className="week-label">Week {week}</h4>
              <div className="week-table-wrapper">
                <table className="week-table">
                  <thead>
                    <tr>
                      {DAYS.map(day => (
                        <th key={day} className={`table-head ${day === 'Saturday' || day === 'Sunday' ? 'weekend-head' : ''}`}>
                          {day.slice(0, 3)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {DAYS.map(day => {
                        const cell = days[day];
                        return (
                          <td key={day} className={`table-cell ${cell.type === 'review' ? 'cell-review' : 'cell-study'}`}>
                            <span className="cell-topic">{cell.topic}</span>
                            <span className="cell-meta">{cell.hours}h • {cell.time}</span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}