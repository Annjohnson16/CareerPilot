from django.urls import path
from .views import roadmap, get_resources, get_timetable

urlpatterns = [
    path("roadmap/", roadmap),
    path("resources/<int:session_id>/", get_resources),
    path("timetable/", get_timetable),
]