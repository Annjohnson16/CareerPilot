import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Get API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(
    api_key=GEMINI_API_KEY
)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_roadmap(data):

    prompt = f"""
    You are an expert career mentor.

    Student Goal:
    {data['goal']}

    Current Level:
    {data['level']}

    Learning Style:
    {data['style']}

    Daily Hours:
    {data['hours']}

    Budget:
    {data['budget']}

    Generate:
    1. 6 Month Roadmap
    2. Weekly Milestones
    3. Free Resources
    4. Recommended Projects
    5. Internship Preparation
    """

    response = model.generate_content(prompt)

    return response.text