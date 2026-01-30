# PDF to Text

## Where to check

| What | Location |
|------|----------|
| **API endpoint** | `app/main.py` — `POST /image-to-text` (accepts both images and PDFs) |
| **PDF extraction logic** | `app/services/ocr_service.py` — `extract_text_from_pdf()` and `extract_text_from_document()` |
| **Dependency** | PyMuPDF (`fitz`) — optional; install with `pip install pymupdf` |

## Flow

1. Client uploads a file to **`POST /image-to-text`**.
2. **`main.py`** saves the file with the correct suffix and calls `extract_text_from_document(temp_path, filename)`.
3. **`ocr_service.py`** `extract_text_from_document()` uses the file extension:
   - **`.pdf`** → `extract_text_from_pdf(file_path)` (PyMuPDF)
   - **`.jpg`, `.png`, etc.** → `extract_text_from_image(file_path)` (Tesseract OCR)
4. Response: `{"text": "<extracted text>"}`.

## Supported file types

- **PDF**: `.pdf` (requires `pymupdf`)
- **Images**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.tiff`, `.tif`, `.bmp`

## Testing

- **Swagger UI**: http://localhost:8000/docs → **POST /image-to-text** → Try it out, upload a PDF or image.
- **ReDoc**: http://localhost:8000/redoc → same endpoint.
