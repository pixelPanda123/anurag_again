
import os
import json
import re
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
# JSON EXTRACTOR (Fallback Parser)
# ---------------------------------------------------------------------------

def extract_json_from_text(text: str) -> dict:
    """
    Extract JSON object from LLM output safely.
    Handles markdown, explanations, etc.
    """

    # Remove markdown blocks
    text = text.replace("```json", "").replace("```", "").strip()

    # Find first { and last }
    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1:
        raise ValueError("No JSON object found")

    json_str = text[start:end + 1]

    return json.loads(json_str)


# ---------------------------------------------------------------------------
# MAIN AI ANALYZER
# ---------------------------------------------------------------------------

def analyze_document_ai(text: str, audience: str = "general") -> dict:
    """
    Uses Groq LLM to analyze medical/legal documents.
    Returns structured JSON.
    """

    client = get_client()

    # ----------------------------
    # STRICT PROMPT (IMPORTANT)
    # ----------------------------

    prompt = f"""
You are a senior medical and legal analysis AI.

You MUST return ONLY valid JSON.
No markdown.
No explanation outside JSON.
No extra text.

Your job is to give PRACTICAL, DETAILED analysis.

--------------------------------

OUTPUT FORMAT:

{{
  "type": "medical" | "legal" | "general",

  "medical": {{
    "normal": [
      "Test name: value (reference range)"
    ],

    "abnormal": [
      "Test name: value (HIGH/LOW → medical meaning)"
    ],

    "explanation": "Simple explanation, risks, and advice"
  }},

  "legal": {{
    "rights": [],
    "obligations": [],
    "penalties": [],
    "urgency": "low" | "medium" | "high"
  }}
}}

--------------------------------

MEDICAL RULES:

1. Always include:
   - Test name
   - Actual value
   - Normal range
   - Meaning

2. For abnormal results:
   - Explain possible cause
   - Mention health risk

3. In explanation:
   - Summarize condition
   - Suggest next step (doctor, test, diet, etc.)

4. If document is unclear → say so.

--------------------------------

Analyze this document carefully:

{text}
"""


    # ----------------------------
    # CALL LLM
    # ----------------------------

    response = client.chat.completions.create(

        model="llama-3.1-8b-instant",

        messages=[
            {
                "role": "system",
                "content": "You are a strict JSON-only API. Never output anything except valid JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0.0,   # 🔴 Force deterministic output
        max_tokens=700
    )

    raw_output = response.choices[0].message.content.strip()


    # ----------------------------
    # PARSE OUTPUT (SAFE)
    # ----------------------------

    try:
        # First try direct parse (fast path)
        return json.loads(raw_output)

    except Exception:

        try:
            # Fallback: extract JSON from messy output
            return extract_json_from_text(raw_output)

        except Exception:

            # Final fallback
            return {
                "error": "Failed to parse LLM output",
                "raw_output": raw_output
            }
