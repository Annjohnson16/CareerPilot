import os
import json
import re
from google import genai
from dotenv import load_dotenv

load_dotenv()


def generate_questions(goal, level, completed_topics):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    topics_str = ', '.join(completed_topics[:15])

    prompt = f"""You are a technical interviewer. Return ONLY a raw JSON array. No markdown. No backticks. No explanation.

[
  {{
    "id": 1,
    "question": "Question text here",
    "topic": "Which topic this tests"
  }}
]

Rules:
- Return ONLY the JSON array. Nothing before or after.
- Generate exactly 5 questions.
- Questions must be based ONLY on these topics: {topics_str}
- Difficulty must match this level: {level}
- Questions must be relevant to this career goal: {goal}
- Mix conceptual and practical questions.
- Questions should be answerable in 2-4 sentences.
- No coding questions — text answers only.
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


def evaluate_answers(goal, level, questions, answers):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    qa_pairs = '\n'.join([
        f"Q{i+1} (Topic: {q['topic']}): {q['question']}\nAnswer: {answers.get(str(i+1), 'No answer provided')}"
        for i, q in enumerate(questions)
    ])

    prompt = f"""You are a technical interviewer evaluating answers. Return ONLY a raw JSON object. No markdown. No backticks. No explanation.

{{
  "score": 4,
  "score_label": "Good",
  "overall_feedback": "2-3 sentence overall assessment",
  "weak_areas": [
    {{
      "topic": "Topic name",
      "reason": "What was weak or missing in the answer"
    }}
  ],
  "strong_areas": ["topic1", "topic2"]
}}

Rules:
- Return ONLY the JSON object. Nothing before or after.
- score must be integer 0-5.
- score_label: "Excellent" (5), "Good" (4), "Average" (3), "Needs Work" (2), "Poor" (0-1)
- weak_areas: only topics where the answer was wrong, incomplete, or missing.
- strong_areas: topics answered well.
- Be honest but encouraging.
- Consider the candidate level is: {level}
- Career goal is: {goal}

Questions and Answers to evaluate:
{qa_pairs}
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