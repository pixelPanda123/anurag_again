import cv2
import pytesseract
import numpy as np
import re

def extract_text_from_image(image_path: str) -> str:
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError("Image not loaded")

    # -------------------------
    # PREPROCESSING
    # -------------------------

    img = cv2.resize(img, None, fx=1.8, fy=1.8, interpolation=cv2.INTER_CUBIC)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)
    gray = cv2.medianBlur(gray, 3)

    kernel = np.array([[0, -1, 0],
                       [-1, 5, -1],
                       [0, -1, 0]])
    sharp = cv2.filter2D(gray, -1, kernel)

    # -------------------------
    # OCR CONFIG
    # -------------------------
    custom_config = r'--oem 3 --psm 3'

    # -------------------------
    # PASS 1 – HINDI + ENGLISH
    # -------------------------
    text = pytesseract.image_to_string(
        sharp,
        lang="hin+eng",
        config=custom_config
    )

    # -------------------------
    # PASS 2 – THRESHOLD (HINDI+ENG)
    # -------------------------
    if not text.strip():
        _, thresh = cv2.threshold(sharp, 150, 255, cv2.THRESH_BINARY)
        text = pytesseract.image_to_string(
            thresh,
            lang="hin+eng",
            config=custom_config
        )

    # -------------------------
    # PASS 3 – ENGLISH ONLY
    # -------------------------
    if not text.strip():
        text = pytesseract.image_to_string(
            sharp,
            lang="eng",
            config=custom_config
        )

    # -------------------------
    # PASS 4 – TELUGU FALLBACK
    # -------------------------
    if not text.strip():
        text = pytesseract.image_to_string(
            sharp,
            lang="tel",
            config=custom_config
        )

    # -------------------------
    # CLEAN OUTPUT
    # -------------------------
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = text.strip()

    return text
