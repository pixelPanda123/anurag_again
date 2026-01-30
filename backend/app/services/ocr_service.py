import cv2
import pytesseract
import numpy as np
import os

def extract_text_from_image(image_path: str) -> str:
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError("Image not loaded")

    # Resize
    img = cv2.resize(img, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_CUBIC)

    # Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Noise removal
    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # Threshold
    thresh = cv2.adaptiveThreshold(
        blur, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31, 2
    )

    # OCR
    custom_config = r'--oem 3 --psm 6'

    text = pytesseract.image_to_string(
        thresh,
        lang="eng",
        config=custom_config
    )

    return text
