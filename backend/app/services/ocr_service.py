import pytesseract
import re
from app.services.preprocessing import preprocess_image

if platform.system() == "Windows":
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

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
    except:
        pass
    return "eng"

def extract_text_from_image(image_path: str) -> str:
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

    # -------- FALLBACK --------
    if not text.strip():
        text = pytesseract.image_to_string(
            img,
            lang="eng",
            config=custom_config
        )

    # -------- CLEAN --------
    text = re.sub(r'\n+', '\n', text)
    text = text.strip()

    return text
