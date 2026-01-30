import os
from groq import Groq


def get_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not found in .env")
    return Groq(api_key=api_key)


def summarize_text(text: str) -> str:
    client = get_client()

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",   # fast + free + good
        messages=[
            {"role": "system", "content": "Summarize this document in 4 very simple lines."},
            {"role": "user", "content": text}
        ],
        temperature=0.3,
        max_tokens=300
    )

    return response.choices[0].message.content.strip()


def explain_for_audience(text: str, audience: str) -> str:
    client = get_client()

    prompt = f"""
Explain the following document to a {audience}.
Use very simple words and short sentences.

Document:
{text}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",   # SAME MODEL HERE
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,
        max_tokens=400
    )

    return response.choices[0].message.content.strip()
