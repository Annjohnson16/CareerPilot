const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) throw new Error(`Server Error: ${response.status}`);
  return response.json();
};

export const fetchCareerRoadmap = (formData) =>
  request('/api/roadmap/', {
    method: 'POST',
    body: JSON.stringify(formData),
  });

export const fetchResources = async (sessionId) => {
  const data = await request(`/api/resources/${sessionId}/`);
  return data.resources;
};

export const fetchTimetable = (sessionId, month, studyHours, preferredTime) =>
  request('/api/timetable/', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      month,
      study_hours: studyHours,
      preferred_time: preferredTime,
    }),
  });