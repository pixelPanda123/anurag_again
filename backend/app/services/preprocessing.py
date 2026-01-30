import cv2

def preprocess_image(image_path: str):
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError("Image not loaded in preprocessing")

    # Resize slightly to help OCR
    img = cv2.resize(img, None, fx=1.8, fy=1.8, interpolation=cv2.INTER_CUBIC)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Very light blur to remove tiny noise (safe)
    gray = cv2.GaussianBlur(gray, (3, 3), 0)

    return gray
