from django.urls import path
from .views import roadmap

urlpatterns = [
    path(
        "roadmap/",
        roadmap
    ),
]