import os
import json
import re
from google import genai
from dotenv import load_dotenv

load_dotenv()


def generate_roadmap(data):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    prompt = f"""You are an expert career mentor. Return ONLY a raw JSON object. No markdown. No backticks. No explanation. Just the JSON.

{{
  "roadmap_text": "6 month roadmap with weekly milestones, projects, internship prep as plain text",
  "resources": [
    {{
      "month": 1,
      "title": "Resource Name",
      "resource_type": "Course or Book or Tool or Video or Documentation",
      "cost": "Free or $XX",
      "link": "https://...",
      "description": "One line on why this resource matters"
    }}
  ]
}}

Rules:
- Return ONLY the JSON object above. Nothing before it. Nothing after it.
- Include 3 to 5 resources for each of the 6 months.
- All JSON keys must be exactly as shown above.

Student details:
Goal: {data['goal']}
Level: {data['level']}
Style: {data['style']}
Hours: {data['hours']}
Budget: {data['budget']}"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text.strip()
    text = re.sub(r'^```json\s*', '', text)
    text = re.sub(r'^```\s*', '', text)
    text = re.sub(r'\s*```$', '', text)

    return json.loads(text)