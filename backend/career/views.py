from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .gemini_service import generate_roadmap
from .models import RoadmapSession, MonthlyResource, Timetable
from .timetable_service import generate_timetable


@api_view(["POST"])
def roadmap(request):
    try:
        result = generate_roadmap(request.data)
    except Exception as e:
        return Response(
            {"error": f"Gemini error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    session = RoadmapSession.objects.create(
        goal=request.data.get('goal', ''),
        level=request.data.get('level', ''),
        style=request.data.get('style', ''),
        hours=request.data.get('hours', ''),
        budget=request.data.get('budget', ''),
        roadmap_text=result['roadmap_text']
    )

    MonthlyResource.objects.bulk_create([
        MonthlyResource(
            session=session,
            month=r['month'],
            title=r['title'],
            resource_type=r['resource_type'],
            cost=r['cost'],
            link=r['link'],
            description=r['description']
        )
        for r in result.get('resources', [])
    ])

    return Response({
        "session_id": session.id,
        "roadmap": result['roadmap_text'],
    })


@api_view(["GET"])
def get_resources(request, session_id):
    try:
        session = RoadmapSession.objects.get(id=session_id)
    except RoadmapSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)

    resources = session.resources.all().order_by('month')
    data = [
        {
            "month": r.month,
            "title": r.title,
            "resource_type": r.resource_type,
            "cost": r.cost,
            "link": r.link,
            "description": r.description
        }
        for r in resources
    ]
    return Response({"session_id": session_id, "resources": data})


@api_view(["POST"])
def get_timetable(request):
    session_id = request.data.get('session_id')
    month = int(request.data.get('month', 1))
    study_hours = request.data.get('study_hours', '2 Hours')
    preferred_time = request.data.get('preferred_time', 'Morning (6AM - 12PM)')

    try:
        session = RoadmapSession.objects.get(id=session_id)
    except RoadmapSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)

    existing = Timetable.objects.filter(
        session=session,
        month=month,
        study_hours=study_hours,
        preferred_time=preferred_time
    ).first()

    if existing:
        return Response({
            "month": month,
            "study_hours": study_hours,
            "preferred_time": preferred_time,
            "schedule": existing.schedule,
            "cached": True
        })

    try:
        schedule = generate_timetable(
            session.roadmap_text,
            month,
            study_hours,
            preferred_time
        )
    except Exception as e:
        return Response(
            {"error": f"Timetable generation failed: {str(e)}"},
            status=500
        )

    Timetable.objects.create(
        session=session,
        month=month,
        study_hours=study_hours,
        preferred_time=preferred_time,
        schedule=schedule
    )

    return Response({
        "month": month,
        "study_hours": study_hours,
        "preferred_time": preferred_time,
        "schedule": schedule,
        "cached": False
    })