from django.db import models


class RoadmapSession(models.Model):
    goal = models.TextField()
    level = models.CharField(max_length=100)
    style = models.CharField(max_length=100)
    hours = models.CharField(max_length=50)
    budget = models.CharField(max_length=100)
    roadmap_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.goal[:50]} — {self.created_at.strftime('%Y-%m-%d')}"


class MonthlyResource(models.Model):
    session = models.ForeignKey(
        RoadmapSession,
        on_delete=models.CASCADE,
        related_name='resources'
    )
    month = models.IntegerField()
    title = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=100)
    cost = models.CharField(max_length=50)
    link = models.URLField()
    description = models.TextField()

    def __str__(self):
        return f"Month {self.month} — {self.title}"


class Timetable(models.Model):
    session = models.ForeignKey(
        RoadmapSession,
        on_delete=models.CASCADE,
        related_name='timetables'
    )
    month = models.IntegerField()
    study_hours = models.CharField(max_length=50)
    preferred_time = models.CharField(max_length=50)
    schedule = models.JSONField()  # stores the generated weekly table
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.session_id} — Month {self.month}"