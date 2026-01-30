import pytesseract
import re
import platform
import os

try:
    import fitz  # PyMuPDF
except ModuleNotFoundError:
    fitz = None  # type: ignore[assignment]

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


# -------- PDF TEXT EXTRACTION --------
def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text from a PDF file using PyMuPDF (fitz).
    Handles multi-page PDFs by concatenating page text.
    Requires: pip install pymupdf
    """
    if fitz is None:
        raise RuntimeError(
            "PDF support requires PyMuPDF. Install with: pip install pymupdf"
        )
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    text_parts = []
    doc = fitz.open(pdf_path)
    try:
        for page in doc:
            text_parts.append(page.get_text())
    finally:
        doc.close()

    text = "\n".join(text_parts)
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = text.strip()
    return text


# -------- UNIFIED DOCUMENT EXTRACTION --------
PDF_EXTENSIONS = {".pdf"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif", ".bmp"}


def extract_text_from_document(file_path: str, filename: str) -> str:
    """
    Extract text from a document (image or PDF) based on file type.
    Use this when the upload may be either an image or a PDF.

    Args:
        file_path: Path to the saved file.
        filename: Original filename (used for extension fallback).

    Returns:
        Extracted text.

    Raises:
        ValueError: If file type is not supported.
    """
    ext = os.path.splitext(filename.lower())[1]
    if ext in PDF_EXTENSIONS:
        return extract_text_from_pdf(file_path)
    if ext in IMAGE_EXTENSIONS:
        return extract_text_from_image(file_path)
    raise ValueError(f"Unsupported document type: {filename}. Use PDF or image (jpg, png, webp, tiff).")
