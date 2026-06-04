const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const fetchCareerRoadmap = async (formData) => {
  const response = await fetch(`${BASE_URL}/api/roadmap/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error(`Server Error: ${response.status}`);
  return await response.json();  // returns { session_id, roadmap }
};

export const fetchResources = async (sessionId) => {
  const response = await fetch(`${BASE_URL}/api/resources/${sessionId}/`);
  if (!response.ok) throw new Error(`Server Error: ${response.status}`);
  const data = await response.json();
  return data.resources;
};