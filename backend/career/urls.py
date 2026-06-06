from django.urls import path
from .views import (
    roadmap, get_resources, get_timetable,
    get_progress, update_progress,
    get_interview_topics, start_interview,
    submit_interview, get_interview_history
)

urlpatterns = [
    path("roadmap/", roadmap),
    path("resources/<int:session_id>/", get_resources),
    path("timetable/", get_timetable),
    path("progress/<int:session_id>/", get_progress),
    path("progress/update/", update_progress),
    path("interview/topics/<int:session_id>/", get_interview_topics),
    path("interview/start/", start_interview),
    path("interview/submit/", submit_interview),
    path("interview/history/<int:session_id>/", get_interview_history),
]