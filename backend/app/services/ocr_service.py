import pytesseract
import re
import platform
import os

from app.services.preprocessing import preprocess_image


# -------- SET TESSERACT PATH FOR WINDOWS --------
if platform.system() == "Windows":
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# -------- SCRIPT DETECTION --------
def detect_script(img):
    try:
        osd = pytesseract.image_to_osd(img)

        if "Devanagari" in osd:
            return "hin"
        if "Tamil" in osd:
            return "tam"
        if "Telugu" in osd:
            return "tel"
        if "Kannada" in osd:
            return "kan"
        if "Latin" in osd:
            return "eng"

    except Exception:
        pass

    # default fallback
    return "eng"


# -------- MAIN OCR FUNCTION --------
def extract_text_from_image(image_path: str) -> str:
    # preprocess image first
    img = preprocess_image(image_path)

    custom_config = r'--oem 3 --psm 6'

    # -------- SCRIPT DETECTION --------
    lang = detect_script(img)

    # -------- OCR USING DETECTED SCRIPT --------
    text = pytesseract.image_to_string(
        img,
        lang=lang,
        config=custom_config
    )

    # -------- FALLBACK TO ENGLISH --------
    if not text.strip():
        text = pytesseract.image_to_string(
            img,
            lang="eng",
            config=custom_config
        )

    # -------- FINAL CLEANUP --------
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = text.strip()

    return text
