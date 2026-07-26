"""
Stage 1 — Computer Vision (meal counting).

Real food-photo datasets aren't available yet, so this ships a **classical CV
baseline** that needs no training data: it segments a kitchen/tray photo into
food regions via adaptive thresholding + contour detection, filters by area,
and returns the region count as the meal-count estimate.

This is intentionally simple and will under/over-count on cluttered or
overlapping plates. It exists so the API pipeline (upload -> count -> score ->
match) works end-to-end today. The documented upgrade path is a fine-tuned
object detector (e.g. YOLOv8 or a Faster-RCNN) on real annotated kitchen
photos once they're collected — swap `estimate_meal_count` for the model's
`predict()` and keep the same signature.

Usage:
    python estimate.py path/to/photo.jpg
"""
import sys

import cv2
import numpy as np

MIN_CONTOUR_AREA_FRACTION = 0.01  # ignore specks smaller than 1% of the image


def estimate_meal_count(image_path: str) -> int:
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"Could not read image at {image_path}")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (7, 7), 0)
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 25, 5
    )
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))

    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    image_area = img.shape[0] * img.shape[1]
    min_area = image_area * MIN_CONTOUR_AREA_FRACTION
    meal_regions = [c for c in contours if cv2.contourArea(c) >= min_area]

    return max(len(meal_regions), 1 if len(contours) > 0 else 0)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python estimate.py path/to/photo.jpg")
        sys.exit(1)
    count = estimate_meal_count(sys.argv[1])
    print(f"Estimated meal count: {count}")
