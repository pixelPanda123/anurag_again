from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import tempfile
import os

from app.services.sarvam_wrapper import translate_text, speech_to_text
from app.services.ocr_service import extract_text_from_image

app = FastAPI(
    title="Multilingual Document Accessibility API",
    description="Backend API for speech, OCR, and text processing using Sarvam AI",
    version="1.0.0"
)

# -------------------------
# Request Models
# -------------------------

class TranslateRequest(BaseModel):
    text: str
    source_language_code: str = "auto"
    target_language_code: str = "hi-IN"


class TranslateResponse(BaseModel):
    translated_text: str


class SpeechToTextResponse(BaseModel):
    transcript: str


class OCRResponse(BaseModel):
    text: str


# -------------------------
# Routes
# -------------------------

@app.get("/health")
def health_check():
    return {"status": "ok"}


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


@app.post("/speech-to-text", response_model=SpeechToTextResponse)
def speech_to_text_endpoint(file: UploadFile = File(...), language_code: str = "hi-IN"):
    try:
        # Save uploaded audio temporarily
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


# -------------------------
# OCR Route (NEW)
# -------------------------

@app.post("/image-to-text", response_model=OCRResponse)
def image_to_text(file: UploadFile = File(...)):
    try:
        # Save uploaded image temporarily
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
