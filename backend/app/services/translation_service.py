import re
from app.services.sarvam_wrapper import translate_text
from app.config import SUPPORTED_LANGUAGES


def clean_text(text: str) -> str:
    """
    Cleans OCR or raw text before translation.
    """
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()


def translate_pipeline(
    text: str,
    target_lang: str,
    source_language_code: str = "auto"
) -> str:
    """
    Translates text into the requested target language.

    Args:
        text (str): Input text to translate.
        target_lang (str): Target language key (e.g., hi, te, ta).
        source_language_code (str): Source language code or 'auto'.

    Returns:
        str: Translated text.

    Raises:
        ValueError: If language is not supported.
    """

    text = clean_text(text)

    if not text or len(text) < 3:
        return "No readable text detected."

    if target_lang not in SUPPORTED_LANGUAGES:
        raise ValueError(
            f"Language '{target_lang}' not supported. "
            f"Supported languages: {list(SUPPORTED_LANGUAGES.keys())}"
        )

    target_language_code = SUPPORTED_LANGUAGES[target_lang]["sarvam_code"]

    return translate_text(
        text=text,
        source_language_code=source_language_code,
        target_language_code=target_language_code
    )
