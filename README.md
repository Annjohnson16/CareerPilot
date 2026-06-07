# CareerPilot


CareerPilot is an AI-powered career planning web app that helps users create personalized learning roadmaps, discover resources, build study timetables, track progress, and practice interview questions.

## Features

- AI-generated personalized career roadmap
- Month-wise learning resources
- Custom study timetable generation
- Progress tracking by topic, week, and month
- Interview question generation from completed topics
- AI-based interview answer evaluation
- Interview history tracking

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS

### Backend
- Django
- Django REST Framework
- PostgreSQL
- Google Gemini API
- django-cors-headers
- Gunicorn

## Project Structure
CareerPilot/
├── backend/
│   ├── career/
│   ├── config/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env.example
└── README.md

#Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Create a .env file in the backend folder
GEMINI_API_KEY=your_key_here
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your_django_secret_key

Run migrations and start the server
python manage.py migrate
python manage.py runserver

Backend URL
http://127.0.0.1:8000

#Frontend Setup
cd frontend
npm install

Create a .env file in the frontend folder
VITE_API_BASE_URL=http://127.0.0.1:8000

Start the frontend
npm run dev

Frontend URL
http://localhost:5173

## API Endpoints
All backend endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/roadmap/` | Generates a personalized career roadmap |
| GET | `/api/resources/<session_id>/` | Fetches learning resources for a roadmap session |
| POST | `/api/timetable/` | Generates or retrieves a study timetable |
| GET | `/api/progress/<session_id>/` | Fetches progress data for a session |
| POST | `/api/progress/update/` | Updates completion status of a topic |
| GET | `/api/interview/topics/<session_id>/` | Gets completed topics for interview practice |
| POST | `/api/interview/start/` | Generates interview questions |
| POST | `/api/interview/submit/` | Submits answers and returns AI feedback |
| GET | `/api/interview/history/<session_id>/` | Fetches previous interview results |

#Deployment Notes
Configure all backend environment variables before deployment.
Add the frontend URL to CORS_ALLOWED_ORIGINS in Django settings.
Add the backend domain to ALLOWED_HOSTS.
Set VITE_API_BASE_URL to the deployed backend URL in the frontend environment.



