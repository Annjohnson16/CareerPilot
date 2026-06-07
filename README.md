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

```text
CareerPilot/
│
├── backend/
│   ├── career/
│   ├── config/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## Backend Setup

### 1. Navigate to Backend

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
```

### 3. Activate Virtual Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux/Mac

```bash
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
GEMINI_API_KEY=your_key_here

DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

SECRET_KEY=your_django_secret_key
```

### 6. Run Migrations

```bash
python manage.py migrate
```

### 7. Start Backend Server

```bash
python manage.py runserver
```

Backend runs at:

```text
http://127.0.0.1:8000
```

---

## Frontend Setup

### 1. Navigate to Frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 4. Start Frontend

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

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

## Deployment Notes

Before deploying the application, ensure the following configurations are completed:


- Configure all required environment variables in the backend `.env` file.
- Add your frontend domain to `CORS_ALLOWED_ORIGINS` in Django settings.
- Add your backend domain to `ALLOWED_HOSTS`.




