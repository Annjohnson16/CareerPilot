from rest_framework.decorators import api_view
from rest_framework.response import Response

from .gemini_service import generate_roadmap


@api_view(["POST"])
def roadmap(request):

    result = generate_roadmap(
        request.data
    )

    return Response({
        "roadmap": result
    })

# Create your views here.
