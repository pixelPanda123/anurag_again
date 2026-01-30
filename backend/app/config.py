import os
from dotenv import load_dotenv

load_dotenv()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

if not SARVAM_API_KEY:
    raise RuntimeError("SARVAM_API_KEY not found in environment")

# -------------------------
# Supported Translation Languages
# -------------------------

SUPPORTED_LANGUAGES = {
    "en": {
        "name": "English",
        "sarvam_code": "en-IN"
    },
    "hi": {
        "name": "Hindi",
        "sarvam_code": "hi-IN"
    },
    "te": {
        "name": "Telugu",
        "sarvam_code": "te-IN"
    },
    "ta": {
        "name": "Tamil",
        "sarvam_code": "ta-IN"
    },
    "kn": {
        "name": "Kannada",
        "sarvam_code": "kn-IN"
    },
    "ml": {
        "name": "Malayalam",
        "sarvam_code": "ml-IN"
    },
    "mr": {
        "name": "Marathi",
        "sarvam_code": "mr-IN"
    },
    "bn": {
        "name": "Bengali",
        "sarvam_code": "bn-IN"
    },
    "gu": {
        "name": "Gujarati",
        "sarvam_code": "gu-IN"
    }
}
