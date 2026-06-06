import os
import json
import re
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def generate_timetable(roadmap_text, month, study_hours, preferred_time):
    prompt = f"""You are an expert study planner. Return ONLY a raw JSON array. No markdown. No backticks. No explanation. Just the JSON.

[
  {{
    "week": 1,
    "days": {{
      "Monday":    {{"topic": "Topic name", "hours": 2, "time": "Morning (6AM - 12PM)", "type": "study"}},
      "Tuesday":   {{"topic": "Topic name", "hours": 2, "time": "Morning (6AM - 12PM)", "type": "study"}},
      "Wednesday": {{"topic": "Topic name", "hours": 2, "time": "Morning (6AM - 12PM)", "type": "study"}},
      "Thursday":  {{"topic": "Topic name", "hours": 2, "time": "Morning (6AM - 12PM)", "type": "study"}},
      "Friday":    {{"topic": "Topic name", "hours": 2, "time": "Morning (6AM - 12PM)", "type": "study"}},
      "Saturday":  {{"topic": "Review & Practice", "hours": 1, "time": "Morning (6AM - 12PM)", "type": "review"}},
      "Sunday":    {{"topic": "Rest or Revision", "hours": 1, "time": "Morning (6AM - 12PM)", "type": "review"}}
    }}
  }}
]

Rules:
- Return ONLY the JSON array. Nothing before it. Nothing after it.
- Generate exactly 4 weeks.
- Each week must have all 7 days: Monday to Sunday.
- Assign topics ONLY from Month {month} of the roadmap below.
- Heavier topics (like neural networks, algorithms) get 2-3 days. Lighter topics get 1 day.
- Saturday and Sunday are always review/rest — type must be "review".
- Weekdays are type "study".
- hours must be an integer — use {study_hours} for weekdays, 1 for weekends.
- time must be exactly "{preferred_time}" for all days.
- Topic names must be short, clear, and specific (max 6 words).

Roadmap:
{roadmap_text}

Generate the timetable for Month {month} only.
Student studies {study_hours} per day, preferred time: {preferred_time}.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text.strip()
    text = re.sub(r'^```json\s*', '', text)
    text = re.sub(r'^```\s*', '', text)
    text = re.sub(r'\s*```$', '', text)

    return json.loads(text)