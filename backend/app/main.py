from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import os
from app.services.llm_analyzer import analyze_document_ai


from app.services.sarvam_wrapper import translate_text, speech_to_text
from app.services.ocr_service import extract_text_from_document
from app.services.translation_service import translate_pipeline
from app.services.llm_service import summarize_text, explain_for_audience
from app.config import SUPPORTED_LANGUAGES
from app.utils.chunking import chunk_text

# Provider-safe limits (stay under API caps)
TRANSLATE_MAX_CHARS = 900   # translation APIs
LLM_MAX_CHARS = 900          # mayura / LLM (e.g. 1000 limit)

app = FastAPI(
    title="Multilingual Document Accessibility API",
    description="Backend API for speech, OCR, translation, summarization, and document understanding",
    version="1.0.0"
)

# CORS: allow frontend at http://localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        text = (request.text or "").strip()
        if not text:
            return {"translated_text": ""}

        chunks = chunk_text(text, TRANSLATE_MAX_CHARS)
        if not chunks:
            return {"translated_text": ""}

        parts = []
        for chunk in chunks:
            part = translate_text(
                text=chunk,
                source_language_code=request.source_language_code,
                target_language_code=request.target_language_code
            )
            parts.append(part)

        translated = " ".join(parts)
        return {"translated_text": translated}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------- MULTILINGUAL PIPELINE --------

@app.post("/translate-pipeline", response_model=TranslateResponse)
def translate_pipeline_endpoint(request: TranslatePipelineRequest):
    try:
        text = (request.text or "").strip()
        if not text:
            return {"translated_text": ""}

        chunks = chunk_text(text, TRANSLATE_MAX_CHARS)
        if not chunks:
            return {"translated_text": ""}

        parts = []
        for chunk in chunks:
            part = translate_pipeline(
                text=chunk,
                target_lang=request.target_lang,
                source_language_code=request.source_language_code
            )
            parts.append(part)

        translated = " ".join(parts)
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


# -------- OCR (images + PDFs) --------

@app.post("/image-to-text", response_model=OCRResponse)
def image_to_text(file: UploadFile = File(...)):
    """
    Extract text from an uploaded image (jpg, png, webp, tiff) or PDF.
    """
    suffix = os.path.splitext(file.filename or "")[1] or ".jpg"
    if suffix.lower() not in {".pdf", ".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif", ".bmp"}:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Use PDF or image (jpg, png, webp, tiff)."
        )
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_file.write(file.file.read())
            temp_path = temp_file.name

        extracted_text = extract_text_from_document(temp_path, file.filename or "file")

        return {"text": extracted_text}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)


# -------- SUMMARIZE --------

@app.post("/summarize")
def summarize_endpoint(request: TextRequest):
    try:
        text = (request.text or "").strip()
        if not text:
            return {"summary": ""}

        chunks = chunk_text(text, LLM_MAX_CHARS)
        if not chunks:
            return {"summary": ""}

        parts = []
        for chunk in chunks:
            part = summarize_text(chunk)
            parts.append(part)

        summary = "\n\n".join(parts)
        return {"summary": summary}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------- EXPLAIN FOR AUDIENCE --------

@app.post("/explain")
def explain_endpoint(request: TextRequest):
    try:
        text = (request.text or "").strip()
        if not text:
            return {"explanation": ""}

        chunks = chunk_text(text, LLM_MAX_CHARS)
        if not chunks:
            return {"explanation": ""}

        parts = []
        for chunk in chunks:
            part = explain_for_audience(chunk, request.audience)
            parts.append(part)

        explanation = "\n\n".join(parts)
        return {"explanation": explanation}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------- AI DOCUMENT ANALYSIS --------

@app.post("/ai-analyze")
def ai_analyze(request: TextRequest):

    try:

        result = analyze_document_ai(
            request.text,
            request.audience
        )

        return result

    except Exception as e:

        raise HTTPException(status_code=500, detail=str(e))
