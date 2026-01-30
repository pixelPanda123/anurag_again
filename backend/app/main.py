from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import tempfile
import os

from app.services.sarvam_wrapper import translate_text, speech_to_text
from app.services.ocr_service import extract_text_from_image
from app.services.translation_service import translate_pipeline
from app.services.llm_service import summarize_text, explain_for_audience
from app.config import SUPPORTED_LANGUAGES

app = FastAPI(
    title="Multilingual Document Accessibility API",
    description="Backend API for speech, OCR, translation, summarization, and document understanding",
    version="1.0.0"
)

# -------------------------
# Request / Response Models
# -------------------------

class TranslateRequest(BaseModel):
    text: str
    source_language_code: str = "auto"
    target_language_code: str = "hi-IN"


class TranslatePipelineRequest(BaseModel):
    text: str
    target_lang: str
    source_language_code: str = "auto"


class TranslateResponse(BaseModel):
    translated_text: str


class SpeechToTextResponse(BaseModel):
    transcript: str


class OCRResponse(BaseModel):
    text: str


# -------- LLM MODELS --------

class TextRequest(BaseModel):
    text: str
    audience: str = "student"


# -------------------------
# Routes
# -------------------------

@app.get("/health")
def health_check():
    return {"status": "ok"}


# -------- BASIC TRANSLATION --------

@app.post("/translate", response_model=TranslateResponse)
def translate_endpoint(request: TranslateRequest):
    try:
        translated = translate_text(
            text=request.text,
            source_language_code=request.source_language_code,
            target_language_code=request.target_language_code
        )
        return {"translated_text": translated}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------- MULTILINGUAL PIPELINE --------

@app.post("/translate-pipeline", response_model=TranslateResponse)
def translate_pipeline_endpoint(request: TranslatePipelineRequest):
    try:
        translated = translate_pipeline(
            text=request.text,
            target_lang=request.target_lang,
            source_language_code=request.source_language_code
        )
        return {"translated_text": translated}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------- SUPPORTED LANGUAGES --------

@app.get("/languages")
def list_supported_languages():
    return {
        "languages": [
            {"code": code, "name": meta["name"]}
            for code, meta in SUPPORTED_LANGUAGES.items()
        ]
    }


# -------- SPEECH TO TEXT --------

@app.post("/speech-to-text", response_model=SpeechToTextResponse)
def speech_to_text_endpoint(
    file: UploadFile = File(...),
    language_code: str = "hi-IN"
):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            temp_audio.write(file.file.read())
            temp_audio_path = temp_audio.name

        transcript = speech_to_text(
            audio_path=temp_audio_path,
            language_code=language_code
        )

        return {"transcript": transcript}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'temp_audio_path' in locals() and os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)


# -------- OCR --------

@app.post("/image-to-text", response_model=OCRResponse)
def image_to_text(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_image:
            temp_image.write(file.file.read())
            temp_image_path = temp_image.name

        extracted_text = extract_text_from_image(temp_image_path)

        return {"text": extracted_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'temp_image_path' in locals() and os.path.exists(temp_image_path):
            os.remove(temp_image_path)


# -------- SUMMARIZE --------

@app.post("/summarize")
def summarize_endpoint(request: TextRequest):
    try:
        summary = summarize_text(request.text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------- EXPLAIN FOR AUDIENCE --------

@app.post("/explain")
def explain_endpoint(request: TextRequest):
    try:
        explanation = explain_for_audience(request.text, request.audience)
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
