
from google import genai
import os
import json
import re
from dotenv import load_dotenv


load_dotenv()




def generate_roadmap(data):
  client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    prompt = f"""
You are an expert career mentor. Generate a structured career roadmap.

Student Goal: {data['goal']}
Current Level: {data['level']}
Learning Style: {data['style']}
Daily Hours: {data['hours']}
Budget: {data['budget']}

Return ONLY a valid JSON object with this exact structure (no markdown, no backticks):
{{
  "roadmap_text": "Full 6-month roadmap as readable text with weekly milestones, projects, internship prep",
  "resources": [
    {{
      "month": 1,
      "title": "Resource Name",
      "resource_type": "Course | Book | Tool | Video | Documentation",
      "cost": "Free | $XX",
      "link": "https://...",
      "description": "One line on why this resource matters"
    }}
  ]
}}

Include 3-5 resources per month, for all 6 months.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text.strip()
   
    text = re.sub(r'^```json\s*', '', text)
    text = re.sub(r'\s*```$', '', text)

    return json.loads(text)