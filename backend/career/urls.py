from django.urls import path
from .views import roadmap, get_resources, get_timetable, get_progress, update_progress

urlpatterns = [
    path("roadmap/", roadmap),
    path("resources/<int:session_id>/", get_resources),
    path("timetable/", get_timetable),
    path("progress/<int:session_id>/", get_progress),
    path("progress/update/", update_progress),
]