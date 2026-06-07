from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .gemini_service import generate_roadmap
from .models import RoadmapSession, MonthlyResource, Timetable,Progress, Interview
from .timetable_service import generate_timetable
from .interview_service import generate_questions, evaluate_answers


@api_view(["POST"])
def roadmap(request):
    try:
        result = generate_roadmap(request.data)
    except Exception as e:
        import traceback
        print("ROADMAP ERROR:", traceback.format_exc())
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

@api_view(["GET"])
def get_progress(request, session_id):
    try:
        session = RoadmapSession.objects.get(id=session_id)
    except RoadmapSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)

    timetables = Timetable.objects.filter(session=session)
    if not timetables.exists():
        return Response({"error": "No timetable found. Generate a timetable first."}, status=404)

    progress_records = Progress.objects.filter(session=session)
    completed_set = set(
        (p.month, p.week, p.topic) for p in progress_records if p.completed
    )

    result = {}
    for timetable in timetables:
        month = timetable.month
        result[month] = {}
        for week_data in timetable.schedule:
            week = week_data['week']
            topics = []
            for day, cell in week_data['days'].items():
                topic = cell['topic']
                if topic not in ['Review & Practice', 'Rest or Revision', 'Revision & Problem Solving']:
                    if topic not in [t['topic'] for t in topics]:
                        topics.append({
                            "topic": topic,
                            "completed": (month, week, topic) in completed_set
                        })
            result[month][week] = topics

    return Response({"progress": result})


@api_view(["POST"])
def update_progress(request):
    session_id = request.data.get('session_id')
    month = request.data.get('month')
    week = request.data.get('week')
    topic = request.data.get('topic')
    completed = request.data.get('completed', True)

    try:
        session = RoadmapSession.objects.get(id=session_id)
    except RoadmapSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)

    progress, _ = Progress.objects.update_or_create(
        session=session,
        month=month,
        week=week,
        topic=topic,
        defaults={'completed': completed}
    )

    return Response({
        "month": month,
        "week": week,
        "topic": topic,
        "completed": progress.completed
    })

@api_view(["GET"])
def get_interview_topics(request, session_id):
    """Get completed topics for this session to use in interview"""
    try:
        session = RoadmapSession.objects.get(id=session_id)
    except RoadmapSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)

    completed = Progress.objects.filter(
        session=session,
        completed=True
    ).values_list('topic', flat=True)

    if not completed:
        return Response({
            "error": "No completed topics found. Complete some topics in Progress Tracker first."
        }, status=404)

    return Response({
        "goal": session.goal,
        "level": session.level,
        "completed_topics": list(completed)
    })


@api_view(["POST"])
def start_interview(request):
    """Generate 5 questions based on completed topics"""
    session_id = request.data.get('session_id')

    try:
        session = RoadmapSession.objects.get(id=session_id)
    except RoadmapSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)

    completed_topics = list(
        Progress.objects.filter(session=session, completed=True)
        .values_list('topic', flat=True)
    )

    if not completed_topics:
        return Response({
            "error": "No completed topics found."
        }, status=400)

    try:
        questions = generate_questions(session.goal, session.level, completed_topics)
    except Exception as e:
        return Response({"error": f"Failed to generate questions: {str(e)}"}, status=500)

    return Response({
        "questions": questions,
        "completed_topics": completed_topics
    })


@api_view(["POST"])
def submit_interview(request):
    """Evaluate answers and save result"""
    session_id = request.data.get('session_id')
    questions = request.data.get('questions', [])
    answers = request.data.get('answers', {})

    try:
        session = RoadmapSession.objects.get(id=session_id)
    except RoadmapSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)

    try:
        result = evaluate_answers(session.goal, session.level, questions, answers)
    except Exception as e:
        return Response({"error": f"Failed to evaluate answers: {str(e)}"}, status=500)

    # Save to DB
    interview = Interview.objects.create(
        session=session,
        topics_covered=[q['topic'] for q in questions],
        questions=questions,
        answers=answers,
        score=result['score'],
        weak_areas=result['weak_areas'],
        feedback=result['overall_feedback']
    )

    return Response({
        "interview_id": interview.id,
        "score": result['score'],
        "score_label": result['score_label'],
        "overall_feedback": result['overall_feedback'],
        "weak_areas": result['weak_areas'],
        "strong_areas": result['strong_areas']
    })


@api_view(["GET"])
def get_interview_history(request, session_id):
    """Get past interview results"""
    try:
        session = RoadmapSession.objects.get(id=session_id)
    except RoadmapSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)

    interviews = Interview.objects.filter(session=session).order_by('-created_at')
    data = [
        {
            "id": i.id,
            "score": i.score,
            "feedback": i.feedback,
            "weak_areas": i.weak_areas,
            "topics_covered": i.topics_covered,
            "created_at": i.created_at.strftime('%Y-%m-%d %H:%M')
        }
        for i in interviews
    ]

    return Response({"interviews": data})