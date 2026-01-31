import os
import json
from groq import Groq


# ---------------------------------------------------------------------------
# CLIENT
# ---------------------------------------------------------------------------

def get_client():

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError("GROQ_API_KEY not found in .env")

    return Groq(api_key=api_key)


# ---------------------------------------------------------------------------
# MAIN AI ANALYZER
# ---------------------------------------------------------------------------

def analyze_document_ai(text: str, audience: str = "general") -> dict:
    """
    Uses Groq LLM to analyze medical/legal documents.
    Returns structured JSON.
    """

    client = get_client()

    prompt = f"""
You are an expert medical and legal document analyst.

Analyze the following document:

{text}

Tasks:

1. Detect document type: medical / legal / general

2. If MEDICAL:
   - Extract test values
   - Highlight abnormal values
   - Explain in simple language for {audience}

3. If LEGAL:
   - List rights
   - List obligations
   - Detect penalties
   - Determine urgency (low / medium / high)

Return ONLY valid JSON in this format:

{{
  "type": "medical | legal | general",

  "medical": {{
    "normal": [],
    "abnormal": [],
    "explanation": ""
  }},

  "legal": {{
    "rights": [],
    "obligations": [],
    "penalties": [],
    "urgency": ""
  }}
}}
"""

    response = client.chat.completions.create(

        model="llama-3.1-8b-instant",

        messages=[
            {"role": "system", "content": "You are a professional document analyst."},
            {"role": "user", "content": prompt}
        ],

        temperature=0.2,
        max_tokens=700
    )

    raw_output = response.choices[0].message.content.strip()

    # Try parsing JSON safely
    try:
        return json.loads(raw_output)

    except Exception:

        # Fallback if model doesn't obey format
        return {
            "error": "Failed to parse LLM output",
            "raw_output": raw_output
        }
