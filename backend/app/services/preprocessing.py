import cv2
import numpy as np

def preprocess_image(image_path: str):
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError("Image not loaded in preprocessing")

    # -------------------------
    # BASIC RESIZE (important)
    # -------------------------
    img = cv2.resize(img, None, fx=1.8, fy=1.8, interpolation=cv2.INTER_CUBIC)

    # -------------------------
    # GRAYSCALE
    # -------------------------
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # -------------------------
    # LIGHT DENOISE (not strong)
    # -------------------------
    gray = cv2.GaussianBlur(gray, (3, 3), 0)

    # -------------------------
    # OPTIONAL CONTRAST (SAFE)
    # -------------------------
    # Only mild contrast — avoids letter loss
    gray = cv2.normalize(gray, None, 0, 255, cv2.NORM_MINMAX)

    # -------------------------
    # OPTIONAL SHARPEN (SOFT)
    # -------------------------
    kernel = np.array([[0, -1, 0],
                       [-1, 4, -1],
                       [0, -1, 0]])
    sharp = cv2.filter2D(gray, -1, kernel)

    # -------------------------
    # DEBUG SAVE (uncomment if needed)
    # -------------------------
    # cv2.imwrite("debug_preprocessed.jpg", sharp)

    return sharp
