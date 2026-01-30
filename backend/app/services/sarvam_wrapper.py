"""
Sarvam Wrapper Module

This module provides a clean abstraction over Sarvam AI SDK
for core language capabilities required in the project:
1. Speech-to-Text (ASR)
2. Text Translation

All SDK-specific logic is contained here.
"""

import os
from app.sarvam_client import client


def speech_to_text(
    audio_path: str,
    language_code: str = "hi-IN",
    model: str = "saarika:v2.5"
) -> str:
    """
    Transcribes speech from an audio file into text.

    Args:
        audio_path (str): Path to the audio file (.wav).
        language_code (str): Language of the spoken audio (e.g., hi-IN, en-IN).
        model (str): ASR model identifier.

    Returns:
        str: Transcribed text.

    Raises:
        FileNotFoundError: If audio file does not exist.
        RuntimeError: If transcription fails.
    """
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    try:
        with open(audio_path, "rb") as audio_file:
            response = client.speech_to_text.transcribe(
                file=audio_file,
                model=model,
                language_code=language_code
            )

        # SDK returns a structured object; extract plain text
        return response.transcript

    except Exception as e:
        raise RuntimeError(f"Speech-to-text failed: {str(e)}") from e


def translate_text(
    text: str,
    source_language_code: str = "auto",
    target_language_code: str = "hi-IN"
) -> str:
    """
    Translates input text into a target language.

    Args:
        text (str): Input text to translate.
        source_language_code (str): Source language (auto-detect by default).
        target_language_code (str): Target language code.

    Returns:
        str: Translated text.

    Raises:
        ValueError: If input text is empty.
        RuntimeError: If translation fails.
    """
    if not text or not text.strip():
        raise ValueError("Input text cannot be empty")

    try:
        response = client.text.translate(
            input=text,
            source_language_code=source_language_code,
            target_language_code=target_language_code
        )

        return response.translated_text

    except Exception as e:
        raise RuntimeError(f"Translation failed: {str(e)}") from e
