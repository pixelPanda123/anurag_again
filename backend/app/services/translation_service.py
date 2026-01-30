import re
from app.services.sarvam_wrapper import translate_text

def clean_text(text: str) -> str:
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = text.strip()
    return text


def translate_pipeline(text: str,
                       source_language_code="auto",
                       target_language_code="hi-IN") -> str:

    text = clean_text(text)

    if not text or len(text) < 3:
        return "No readable text detected."

    translated = translate_text(
        text=text,
        source_language_code=source_language_code,
        target_language_code=target_language_code
    )

    # OPTIONAL DEMO POLISH
    word_map = {
        "test": "परीक्षण",
        "file": "फ़ाइल",
        "notice": "सूचना"
    }

    for eng, hin in word_map.items():
        translated = translated.replace(eng, hin)

    return translated
